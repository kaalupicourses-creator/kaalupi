import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

/**
 * GET /api/founding-slot?slug=ai-untuk-pemula-mastery
 * Returns realtime founding members slot info.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  if (!slug) {
    return NextResponse.json({ error: "slug required" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { count, error } = await supabase
    .from("enrollments")
    .select("id", { count: "exact", head: true })
    .eq("course_slug", slug)
    .eq("status", "active");

  if (error) {
    console.error("[founding-slot] error:", error.message);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }

  const taken = count ?? 0;
  const limit = 100; // Founding Members cap
  const remaining = Math.max(0, limit - taken);
  const isSoldOut = taken >= limit;

  return NextResponse.json({
    course_slug: slug,
    founding_limit: limit,
    taken,
    remaining,
    is_sold_out: isSoldOut,
    current_price: isSoldOut ? 299000 : 149000,
    original_price: 299000,
  });
}
