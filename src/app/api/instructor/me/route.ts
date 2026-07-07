import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { courses } from "@/lib/data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET — data instructor yang lagi login: course-nya, progress, profit, deadline, status
export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Login dulu" }, { status: 401 });

  const user = await currentUser();
  const email = (user?.primaryEmailAddress?.emailAddress ?? "").toLowerCase();
  const meta = (user?.publicMetadata ?? {}) as { role?: string; instructor_banned?: boolean };
  const role = meta.role;
  if (role !== "instructor" && role !== "admin") {
    return NextResponse.json({ error: "Khusus instructor" }, { status: 403 });
  }

  const supabase = getSupabaseAdmin();
  const { data: assignments } = await supabase
    .from("instructor_assignments")
    .select("*")
    .eq("instructor_email", email)
    .order("created_at", { ascending: false });

  const { data: materials } = await supabase.from("materials").select("course_slug");
  const { data: subs } = await supabase
    .from("payment_submissions")
    .select("course_slug, amount, status")
    .eq("status", "approved");

  const titleOf = (slug: string) => courses.find((c) => c.slug === slug)?.title ?? slug;
  const matCount = (slug: string) => (materials ?? []).filter((m) => m.course_slug === slug).length;
  const salesSum = (slug: string) =>
    (subs ?? []).filter((s) => s.course_slug === slug).reduce((n, s) => n + (s.amount ?? 0), 0);

  let totalCommission = 0;
  const rows = (assignments ?? []).map((a) => {
    const uploaded = matCount(a.course_slug);
    const revenue = salesSum(a.course_slug);
    const commission = Math.round((revenue * a.commission_pct) / 100);
    totalCommission += commission;
    const pct = a.target_materials > 0 ? Math.min(100, Math.round((uploaded / a.target_materials) * 100)) : 0;
    // Hari tersisa ke deadline
    let daysLeft: number | null = null;
    if (a.deadline) {
      const d = new Date(a.deadline).getTime();
      daysLeft = Math.ceil((d - Date.now()) / (1000 * 60 * 60 * 24));
    }
    return {
      course_slug: a.course_slug,
      course_title: titleOf(a.course_slug),
      commission_pct: a.commission_pct,
      target_materials: a.target_materials,
      uploaded,
      progress_pct: pct,
      revenue,
      commission,
      deadline: a.deadline,
      days_left: daysLeft,
    };
  });

  return NextResponse.json({
    email,
    banned: meta.instructor_banned === true,
    total_commission: totalCommission,
    courses: rows,
  });
}
