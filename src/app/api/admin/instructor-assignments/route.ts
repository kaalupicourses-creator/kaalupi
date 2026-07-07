import { NextResponse } from "next/server";
import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { isSuperAdmin } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function requireSuperAdmin() {
  const { userId } = await auth();
  if (!userId) return { error: "Unauthorized", status: 401 as const };
  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress ?? "";
  if (!isSuperAdmin(email)) return { error: "Forbidden — super admin only", status: 403 as const };
  return { ok: true as const };
}

type Assignment = {
  id: string;
  instructor_email: string;
  course_slug: string;
  commission_pct: number;
  target_materials: number;
  deadline: string | null;
  created_at: string;
};

// GET — semua assignment + progress + profit + status ban
export async function GET() {
  const guard = await requireSuperAdmin();
  if ("error" in guard) return NextResponse.json({ error: guard.error }, { status: guard.status });

  const supabase = getSupabaseAdmin();
  const { data: assignments } = await supabase
    .from("instructor_assignments")
    .select("*")
    .order("created_at", { ascending: false });

  // Materi per course (progress asli) & penjualan approved (profit)
  const { data: materials } = await supabase.from("materials").select("course_slug");
  const { data: subs } = await supabase
    .from("payment_submissions")
    .select("course_slug, amount, status")
    .eq("status", "approved");

  const matCount = (slug: string) => (materials ?? []).filter((m) => m.course_slug === slug).length;
  const salesSum = (slug: string) =>
    (subs ?? []).filter((s) => s.course_slug === slug).reduce((n, s) => n + (s.amount ?? 0), 0);

  // Status ban tiap instructor dari Clerk
  const clerk = await clerkClient();
  const list = await clerk.users.getUserList({ limit: 200 });
  const banByEmail = new Map<string, boolean>();
  list.data.forEach((u) => {
    const em = u.primaryEmailAddress?.emailAddress ?? "";
    const meta = (u.publicMetadata ?? {}) as { instructor_banned?: boolean };
    if (em) banByEmail.set(em.toLowerCase(), meta.instructor_banned === true);
  });

  const rows = (assignments ?? []).map((a: Assignment) => {
    const uploaded = matCount(a.course_slug);
    const revenue = salesSum(a.course_slug);
    const commission = Math.round((revenue * a.commission_pct) / 100);
    const pct = a.target_materials > 0 ? Math.min(100, Math.round((uploaded / a.target_materials) * 100)) : 0;
    return {
      ...a,
      uploaded,
      progress_pct: pct,
      revenue,
      commission,
      banned: banByEmail.get(a.instructor_email.toLowerCase()) === true,
    };
  });

  return NextResponse.json({ assignments: rows });
}

// POST — bikin/update assignment
export async function POST(request: Request) {
  const guard = await requireSuperAdmin();
  if ("error" in guard) return NextResponse.json({ error: guard.error }, { status: guard.status });

  let body: {
    instructor_email?: string;
    course_slug?: string;
    commission_pct?: number;
    target_materials?: number;
    deadline?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const email = body.instructor_email?.trim().toLowerCase();
  const slug = body.course_slug?.trim();
  if (!email || !slug) return NextResponse.json({ error: "Email & course wajib" }, { status: 400 });

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("instructor_assignments")
    .upsert(
      {
        instructor_email: email,
        course_slug: slug,
        commission_pct: Number(body.commission_pct) || 30,
        target_materials: Number(body.target_materials) || 0,
        deadline: body.deadline || null,
      },
      { onConflict: "instructor_email,course_slug" },
    )
    .select()
    .single();

  if (error) {
    console.error("[instructor-assignments] upsert:", error.message);
    return NextResponse.json({ error: "Gagal simpan assignment" }, { status: 500 });
  }
  return NextResponse.json({ success: true, assignment: data });
}

// DELETE — hapus assignment
export async function DELETE(request: Request) {
  const guard = await requireSuperAdmin();
  if ("error" in guard) return NextResponse.json({ error: guard.error }, { status: guard.status });
  let body: { id?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (!body.id) return NextResponse.json({ error: "id wajib" }, { status: 400 });
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("instructor_assignments").delete().eq("id", body.id);
  if (error) return NextResponse.json({ error: "Gagal hapus" }, { status: 500 });
  return NextResponse.json({ success: true });
}

// PATCH — ban / unban instructor
export async function PATCH(request: Request) {
  const guard = await requireSuperAdmin();
  if ("error" in guard) return NextResponse.json({ error: guard.error }, { status: guard.status });

  let body: { email?: string; action?: "ban" | "unban" };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const email = body.email?.trim();
  if (!email || (body.action !== "ban" && body.action !== "unban")) {
    return NextResponse.json({ error: "email & action (ban/unban) wajib" }, { status: 400 });
  }

  const clerk = await clerkClient();
  const userList = await clerk.users.getUserList({ emailAddress: [email], limit: 1 });
  const target = userList.data[0];
  if (!target) return NextResponse.json({ error: "User ga ketemu" }, { status: 404 });

  await clerk.users.updateUserMetadata(target.id, {
    publicMetadata: {
      ...(target.publicMetadata ?? {}),
      instructor_banned: body.action === "ban",
    },
  });

  return NextResponse.json({ success: true, email, banned: body.action === "ban" });
}
