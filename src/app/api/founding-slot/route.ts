import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

/**
 * GET /api/founding-slot?slug=cyber-security-mastery
 * Returns realtime founding members slot info.
 *
 * Note: 4 slots are reserved for the founding team (Kamil, Akbar, Fadhel, Lutfi),
 * so the public counter starts from 4 to reflect that the team itself is committed.
 */
const TEAM_BASELINE = 4;
const FOUNDING_LIMIT = 100;
const FOUNDING_PRICE = 149_000;
const REGULAR_PRICE = 299_000;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  if (!slug) {
    return NextResponse.json({ error: "slug required" }, { status: 400 });
  }

  let actualEnrolled = 0;
  try {
    const supabase = getSupabaseAdmin();
    const { count, error } = await supabase
      .from("enrollments")
      .select("id", { count: "exact", head: true })
      .eq("course_slug", slug)
      .eq("status", "active");
    if (error) {
      console.error("[founding-slot] db error:", error.message);
    } else {
      actualEnrolled = count ?? 0;
    }
  } catch (err) {
    console.error("[founding-slot] supabase admin error:", err);
  }

  // Real founding members = baseline team (4) + actual paying enrollments.
  // Additive: tiap user yg bayar Mastery, counter naik 1 dari baseline.
  const taken = Math.min(FOUNDING_LIMIT, TEAM_BASELINE + actualEnrolled);
  const remaining = Math.max(0, FOUNDING_LIMIT - taken);
  const isSoldOut = taken >= FOUNDING_LIMIT;

  return NextResponse.json({
    course_slug: slug,
    founding_limit: FOUNDING_LIMIT,
    taken,
    remaining,
    is_sold_out: isSoldOut,
    current_price: isSoldOut ? REGULAR_PRICE : FOUNDING_PRICE,
    original_price: REGULAR_PRICE,
  });
}
