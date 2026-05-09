import { NextResponse } from "next/server";
import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";

async function requireAdmin() {
  const { userId } = await auth();
  if (!userId) return { error: "Unauthorized", status: 401 as const };
  const user = await currentUser();
  const role = (user?.publicMetadata as { role?: string })?.role;
  if (role !== "admin") return { error: "Forbidden — admin only", status: 403 as const };
  return { ok: true as const };
}

export async function GET() {
  const guard = await requireAdmin();
  if ("error" in guard) {
    return NextResponse.json({ error: guard.error }, { status: guard.status });
  }

  const supabase = getSupabaseAdmin();
  const since7d = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const since30d = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  // Parallel queries
  const [
    enrollAll,
    enroll7d,
    enroll30d,
    enrollMastery,
    ordersPaid,
    progressActive,
    waitlist,
    blogCount,
    materialsCount,
  ] = await Promise.all([
    supabase.from("enrollments").select("id", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("enrollments").select("id", { count: "exact", head: true }).eq("status", "active").gte("created_at", since7d),
    supabase.from("enrollments").select("id", { count: "exact", head: true }).eq("status", "active").gte("created_at", since30d),
    supabase.from("enrollments").select("id", { count: "exact", head: true }).eq("status", "active").eq("course_slug", "ai-untuk-pemula-mastery"),
    supabase.from("orders").select("amount").eq("status", "paid"),
    supabase.from("progress").select("user_email").eq("completed", true).gte("completed_at", since30d),
    supabase.from("waitlist").select("id", { count: "exact", head: true }),
    supabase.from("blog_posts").select("id", { count: "exact", head: true }),
    supabase.from("materials").select("id", { count: "exact", head: true }),
  ]);

  let userCount = 0;
  try {
    const client = await clerkClient();
    const list = await client.users.getUserList({ limit: 1 });
    userCount = list.totalCount;
  } catch (err) {
    console.error("[admin/analytics] clerk count failed:", err);
  }

  const totalRevenue = (ordersPaid.data ?? []).reduce(
    (s, o: { amount?: number | null }) => s + (o.amount ?? 0),
    0,
  );
  const activeLearners = new Set((progressActive.data ?? []).map((p: { user_email: string }) => p.user_email)).size;

  // Enrollment per course
  const { data: perCourseRaw } = await supabase
    .from("enrollments")
    .select("course_slug, status")
    .eq("status", "active");
  const perCourse: Record<string, number> = {};
  for (const row of (perCourseRaw ?? []) as Array<{ course_slug: string }>) {
    perCourse[row.course_slug] = (perCourse[row.course_slug] ?? 0) + 1;
  }

  return NextResponse.json({
    users: {
      total: userCount,
    },
    enrollments: {
      total: enrollAll.count ?? 0,
      last_7d: enroll7d.count ?? 0,
      last_30d: enroll30d.count ?? 0,
      mastery: enrollMastery.count ?? 0,
      per_course: perCourse,
    },
    revenue: {
      total_idr: totalRevenue,
      paid_orders: ordersPaid.data?.length ?? 0,
    },
    engagement: {
      active_learners_30d: activeLearners,
      modules_completed_30d: progressActive.data?.length ?? 0,
    },
    content: {
      materials: materialsCount.count ?? 0,
      blog_posts: blogCount.count ?? 0,
      waitlist: waitlist.count ?? 0,
    },
  });
}
