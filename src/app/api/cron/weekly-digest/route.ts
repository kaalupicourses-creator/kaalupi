import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

/**
 * Cron mingguan Senin 08:00 UTC.
 * Hitung KPI minggu lalu, push ke webhook untuk dikirim ke email founder.
 */
export async function GET(request: Request) {
  const expectedSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");
  if (expectedSecret && authHeader !== `Bearer ${expectedSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const [waitlist, enrollments, orders, progress] = await Promise.all([
    supabase.from("waitlist").select("id", { count: "exact", head: true }).gte("created_at", sevenDaysAgo),
    supabase.from("enrollments").select("id", { count: "exact", head: true }).gte("created_at", sevenDaysAgo),
    supabase.from("orders").select("amount, status").gte("created_at", sevenDaysAgo).eq("status", "paid"),
    supabase.from("progress").select("id", { count: "exact", head: true }).gte("updated_at", sevenDaysAgo).eq("completed", true),
  ]);

  const revenue = (orders.data ?? []).reduce((sum, o) => sum + (o.amount as number), 0);

  const summary = {
    period: "last_7_days",
    new_waitlist: waitlist.count ?? 0,
    new_enrollments: enrollments.count ?? 0,
    paid_orders: orders.data?.length ?? 0,
    revenue_idr: revenue,
    modules_completed: progress.count ?? 0,
    generated_at: new Date().toISOString(),
  };

  const webhookUrl = process.env.WEEKLY_DIGEST_WEBHOOK_URL;
  if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "weekly_digest", summary }),
      });
    } catch (e) {
      console.error("[weekly-digest webhook] error:", e);
    }
  }

  return NextResponse.json({ success: true, summary, forwarded: !!webhookUrl });
}
