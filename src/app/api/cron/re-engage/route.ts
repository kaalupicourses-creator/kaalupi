import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

/**
 * Cron daily 09:00 UTC.
 * Cari student yang udah enroll tapi >7 hari ngga ada progress.
 * Trigger webhook ke n8n / make.com / direct email — sesuai REENGAGE_WEBHOOK.
 *
 * Auth: Vercel Cron pakai header CRON_SECRET (set di env).
 */
export async function GET(request: Request) {
  const expectedSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");
  if (expectedSecret && authHeader !== `Bearer ${expectedSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  // Cari enrollment yang belum 100% complete dan progress terakhir > 7 hari
  const { data: stuck, error } = await supabase
    .from("enrollments")
    .select("user_email, course_slug, created_at")
    .eq("status", "active");

  if (error) {
    console.error("[re-engage] error:", error.message);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }

  const candidates: Array<{ email: string; course_slug: string; reason: string }> = [];

  for (const e of stuck ?? []) {
    const { data: lastProgress } = await supabase
      .from("progress")
      .select("updated_at, completed")
      .eq("user_email", e.user_email)
      .eq("course_slug", e.course_slug)
      .order("updated_at", { ascending: false })
      .limit(1);

    const last = lastProgress?.[0];
    if (!last) {
      // belum pernah mulai
      if (e.created_at < sevenDaysAgo) {
        candidates.push({
          email: e.user_email,
          course_slug: e.course_slug,
          reason: "never_started",
        });
      }
      continue;
    }
    if (last.updated_at < sevenDaysAgo && !last.completed) {
      candidates.push({
        email: e.user_email,
        course_slug: e.course_slug,
        reason: "stuck_7d",
      });
    }
  }

  // Forward ke webhook external (n8n, make.com, Zapier)
  const webhookUrl = process.env.REENGAGE_WEBHOOK_URL;
  if (webhookUrl && candidates.length > 0) {
    try {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "re_engage",
          generated_at: new Date().toISOString(),
          candidates,
        }),
      });
    } catch (e) {
      console.error("[re-engage webhook] error:", e);
    }
  }

  return NextResponse.json({
    success: true,
    candidates_count: candidates.length,
    forwarded: !!webhookUrl,
  });
}
