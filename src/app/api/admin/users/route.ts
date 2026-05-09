import { NextResponse } from "next/server";
import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";

export const runtime = "nodejs";

const VALID_ROLES = ["admin", "instructor", "student"] as const;
type Role = (typeof VALID_ROLES)[number];

function isAdmin(meta: Record<string, unknown> | undefined): boolean {
  return meta?.role === "admin";
}

async function requireAdmin() {
  const { userId } = await auth();
  if (!userId) return { error: "Unauthorized", status: 401 as const };
  const user = await currentUser();
  if (!isAdmin(user?.publicMetadata as Record<string, unknown> | undefined)) {
    return { error: "Forbidden — admin only", status: 403 as const };
  }
  return { ok: true as const };
}

// GET /api/admin/users — list all users with role + onboarding status
export async function GET() {
  const guard = await requireAdmin();
  if ("error" in guard) {
    return NextResponse.json({ error: guard.error }, { status: guard.status });
  }

  try {
    const client = await clerkClient();
    const list = await client.users.getUserList({ limit: 100, orderBy: "-created_at" });
    const users = list.data.map((u) => {
      const meta = (u.publicMetadata ?? {}) as Record<string, unknown>;
      return {
        id: u.id,
        email: u.primaryEmailAddress?.emailAddress ?? "",
        name: [u.firstName, u.lastName].filter(Boolean).join(" "),
        username: u.username,
        imageUrl: u.imageUrl,
        role: (meta.role as Role) ?? "student",
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

// PATCH /api/admin/users — update a user's role
export async function PATCH(request: Request) {
  const guard = await requireAdmin();
  if ("error" in guard) {
    return NextResponse.json({ error: guard.error }, { status: guard.status });
  }

  let body: { user_id?: string; role?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { user_id, role } = body;
  if (!user_id || !role) {
    return NextResponse.json({ error: "user_id and role required" }, { status: 400 });
  }
  if (!VALID_ROLES.includes(role as Role)) {
    return NextResponse.json(
      { error: `Role harus salah satu: ${VALID_ROLES.join(", ")}` },
      { status: 400 },
    );
  }

  // Prevent self-demotion (admin removing their own admin role)
  const { userId: currentUserId } = await auth();
  if (currentUserId === user_id && role !== "admin") {
    return NextResponse.json(
      { error: "Ngga bisa demote diri sendiri. Mintain admin lain." },
      { status: 400 },
    );
  }

  try {
    const client = await clerkClient();
    const target = await client.users.getUser(user_id);
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
