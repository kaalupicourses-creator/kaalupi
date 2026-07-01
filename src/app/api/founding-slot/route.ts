import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const FOUNDING_LIMIT = 100;
const FOUNDING_PRICE = 199_000;
const REGULAR_PRICE = 499_000;

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  if (!slug) {
    return NextResponse.json({ error: "slug required" }, { status: 400 });
  }

  // Count only paid enrollments (orders with status "paid") — not admin-granted ones
  let taken = 0;
  try {
    const supabase = getSupabaseAdmin();
    const { count, error } = await supabase
      .from("orders")
      .select("id", { count: "exact", head: true })
      .eq("course_slug", slug)
      .eq("status", "paid");
    if (error) {
      console.error("[founding-slot] db error:", error.message);
    } else {
      taken = Math.min(FOUNDING_LIMIT, count ?? 0);
    }
  } catch (err) {
    console.error("[founding-slot] supabase admin error:", err);
  }

  const remaining = Math.max(0, FOUNDING_LIMIT - taken);
  const isSoldOut = taken >= FOUNDING_LIMIT;

  const res = NextResponse.json({
    course_slug: slug,
    founding_limit: FOUNDING_LIMIT,
    taken,
    remaining,
    is_sold_out: isSoldOut,
    current_price: isSoldOut ? REGULAR_PRICE : FOUNDING_PRICE,
    original_price: REGULAR_PRICE,
  });

  res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
  return res;
}
