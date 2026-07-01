import { NextResponse } from "next/server";
import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { isSuperAdmin } from "@/lib/auth";

export const runtime = "nodejs";

const SUPER_ADMIN_EMAIL = "kamilalfaris@gmail.com";
const VALID_ROLES = ["admin", "instructor", "student"] as const;
type Role = (typeof VALID_ROLES)[number];

function isAdmin(meta: Record<string, unknown> | undefined): boolean {
  return meta?.role === "admin" || meta?.role === "super_admin";
}

async function requireAdmin() {
  const { userId } = await auth();
  if (!userId) return { error: "Unauthorized", status: 401 as const };
  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress ?? "";
  const meta = (user?.publicMetadata ?? {}) as Record<string, unknown>;
  if (!isAdmin(meta) && !isSuperAdmin(email)) {
    return { error: "Forbidden — admin only", status: 403 as const };
  }
  return { ok: true as const, email };
}

async function requireSuperAdmin() {
  const { userId } = await auth();
  if (!userId) return { error: "Unauthorized", status: 401 as const };
  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress ?? "";
  if (!isSuperAdmin(email)) {
    return { error: "Forbidden — super admin only", status: 403 as const };
  }
  return { ok: true as const, email };
}

// GET /api/admin/users — list all users
export async function GET() {
  const guard = await requireAdmin();
  if ("error" in guard) {
    return NextResponse.json({ error: guard.error }, { status: guard.status });
  }

  try {
    const supabase = getSupabaseAdmin();
    const client = await clerkClient();
    const list = await client.users.getUserList({ limit: 200, orderBy: "-created_at" });

    // Fetch founding member badges in parallel
    const { data: badges } = await supabase
      .from("user_badges")
      .select("user_email")
      .eq("badge_id", (await supabase.from("badges").select("id").eq("name", "Founding Member").single()).data?.id ?? "");

    const foundingEmails = new Set((badges ?? []).map((b: { user_email: string }) => b.user_email));

    const users = list.data.map((u) => {
      const meta = (u.publicMetadata ?? {}) as Record<string, unknown>;
      const email = u.primaryEmailAddress?.emailAddress ?? "";
      return {
        id: u.id,
        email,
        name: [u.firstName, u.lastName].filter(Boolean).join(" "),
        username: u.username,
        imageUrl: u.imageUrl,
        role: (meta.role as Role) ?? "student",
        is_super_admin: email.toLowerCase() === SUPER_ADMIN_EMAIL,
        is_founding_member: foundingEmails.has(email),
        onboarding_completed: !!meta.onboarding_completed,
        goal: (meta.onboarding_goal as string) ?? null,
        interest: (meta.onboarding_interest as string) ?? null,
        created_at: u.createdAt,
        last_sign_in_at: u.lastSignInAt,
      };
    });
    return NextResponse.json({ users, total: list.totalCount });
  } catch (err) {
    console.error("[admin/users] list failed:", err);
    return NextResponse.json({ error: "Failed to list users" }, { status: 500 });
  }
}

// PATCH /api/admin/users — update role OR toggle founding member
export async function PATCH(request: Request) {
  const guard = await requireAdmin();
  if ("error" in guard) {
    return NextResponse.json({ error: guard.error }, { status: guard.status });
  }

  let body: { user_id?: string; role?: string; action?: string; email?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { user_id, role, action, email: targetEmail } = body;

  // ── Founding member grant/revoke (super admin only) ──
  if (action === "grant_founding" || action === "revoke_founding") {
    const superGuard = await requireSuperAdmin();
    if ("error" in superGuard) {
      return NextResponse.json({ error: superGuard.error }, { status: superGuard.status });
    }
    if (!targetEmail) return NextResponse.json({ error: "email required" }, { status: 400 });

    const supabase = getSupabaseAdmin();
    const { data: badge } = await supabase
      .from("badges")
      .select("id")
      .eq("name", "Founding Member")
      .single();

    if (!badge) return NextResponse.json({ error: "Founding Member badge not found" }, { status: 404 });

    if (action === "grant_founding") {
      // Enroll into ALL published courses (founding = lifetime access everywhere)
      const { data: allCourses } = await supabase
        .from("courses")
        .select("slug")
        .eq("is_published", true);

      const enrollUpserts = (allCourses ?? []).map((c: { slug: string }) =>
        supabase.from("enrollments").upsert(
          { user_email: targetEmail, course_slug: c.slug, status: "active" },
          { onConflict: "user_email,course_slug" },
        )
      );
      await Promise.all(enrollUpserts);

      // Grant badge
      await supabase.from("user_badges").upsert(
        { user_email: targetEmail, badge_id: badge.id },
        { onConflict: "user_email,badge_id" },
      );

      // Set Clerk metadata so access checks work without extra DB queries
      const clerk = await clerkClient();
      const userList = await clerk.users.getUserList({ emailAddress: [targetEmail], limit: 1 });
      const targetUser = userList.data[0];
      if (targetUser) {
        await clerk.users.updateUserMetadata(targetUser.id, {
          publicMetadata: {
            ...(targetUser.publicMetadata ?? {}),
            is_founding_member: true,
          },
        });
      }

      return NextResponse.json({ success: true, action: "granted", email: targetEmail });
    } else {
      // Revoke badge
      await supabase.from("user_badges")
        .delete()
        .eq("user_email", targetEmail)
        .eq("badge_id", badge.id);

      // Clear Clerk metadata
      const clerk = await clerkClient();
      const userList = await clerk.users.getUserList({ emailAddress: [targetEmail], limit: 1 });
      const targetUser = userList.data[0];
      if (targetUser) {
        const meta = (targetUser.publicMetadata ?? {}) as Record<string, unknown>;
        delete meta.is_founding_member;
        await clerk.users.updateUserMetadata(targetUser.id, { publicMetadata: meta });
      }

      return NextResponse.json({ success: true, action: "revoked", email: targetEmail });
    }
  }

  // ── Role change ──
  if (!user_id || !role) {
    return NextResponse.json({ error: "user_id and role required" }, { status: 400 });
  }
  if (!VALID_ROLES.includes(role as Role)) {
    return NextResponse.json(
      { error: `Role harus salah satu: ${VALID_ROLES.join(", ")}` },
      { status: 400 },
    );
  }

  // Only super admin can promote to admin
  if (role === "admin") {
    const superGuard = await requireSuperAdmin();
    if ("error" in superGuard) {
      return NextResponse.json(
        { error: "Hanya super admin yang bisa promote ke admin" },
        { status: 403 },
      );
    }
  }

  // Prevent demoting super admin email
  try {
    const client = await clerkClient();
    const target = await client.users.getUser(user_id);
    const targetEmailAddr = target.primaryEmailAddress?.emailAddress ?? "";
    if (targetEmailAddr.toLowerCase() === SUPER_ADMIN_EMAIL) {
      return NextResponse.json({ error: "Super admin tidak bisa diubah rolenya" }, { status: 400 });
    }

    const existingMeta = (target.publicMetadata ?? {}) as Record<string, unknown>;
    await client.users.updateUserMetadata(user_id, {
      publicMetadata: { ...existingMeta, role },
    });
    return NextResponse.json({ success: true, user_id, role });
  } catch (err) {
    console.error("[admin/users] update role failed:", err);
    return NextResponse.json({ error: "Failed to update role" }, { status: 500 });
  }
}

// DELETE /api/admin/users — remove user (super admin only)
export async function DELETE(request: Request) {
  const guard = await requireSuperAdmin();
  if ("error" in guard) {
    return NextResponse.json({ error: guard.error }, { status: guard.status });
  }

  let body: { user_id?: string; email?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { user_id, email } = body;
  if (!user_id || !email) {
    return NextResponse.json({ error: "user_id and email required" }, { status: 400 });
  }

  // Prevent deleting self
  const { userId: currentId } = await auth();
  if (currentId === user_id) {
    return NextResponse.json({ error: "Tidak bisa hapus akun sendiri" }, { status: 400 });
  }

  // Prevent deleting super admin
  if (email.toLowerCase() === SUPER_ADMIN_EMAIL) {
    return NextResponse.json({ error: "Super admin tidak bisa dihapus" }, { status: 400 });
  }

  try {
    // Clean up Supabase data first
    const supabase = getSupabaseAdmin();
    await Promise.all([
      supabase.from("enrollments").delete().eq("user_email", email),
      supabase.from("progress").delete().eq("user_email", email),
      supabase.from("user_badges").delete().eq("user_email", email),
      supabase.from("user_points").delete().eq("user_email", email),
      supabase.from("certificates").delete().eq("user_email", email),
      supabase.from("payment_submissions").delete().eq("user_email", email),
    ]);

    // Delete from Clerk
    const client = await clerkClient();
    await client.users.deleteUser(user_id);

    return NextResponse.json({ success: true, deleted: email });
  } catch (err) {
    console.error("[admin/users] delete failed:", err);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
