import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";
import { getCourseBySlug } from "@/lib/content";
import { createMidtransTransaction } from "@/lib/midtrans";

export async function POST(request: Request) {
  // Step 1 — Auth check
  const { userId } = await auth();
  if (!userId) {
    console.log("[API/checkout] ❌ Unauthenticated request");
    return NextResponse.json({ error: "Silakan login terlebih dahulu." }, { status: 401 });
  }

  // Step 2 — Parse body
  let body: { slug?: string; amount?: number };
  try {
    body = (await request.json()) as { slug?: string; amount?: number };
  } catch {
    return NextResponse.json({ error: "Request body tidak valid." }, { status: 400 });
  }

  if (!body.slug) {
    return NextResponse.json({ error: "Slug course wajib diisi." }, { status: 400 });
  }

  console.log("[API/checkout] Step 2 — slug:", body.slug);

  // Step 3 — Get course from content (MDX seed data, falls back to Supabase)
  const course = await getCourseBySlug(body.slug);
  if (!course) {
    console.log("[API/checkout] ❌ Course not found:", body.slug);
    return NextResponse.json({ error: "Course tidak ditemukan." }, { status: 404 });
  }

  console.log("[API/checkout] Step 3 — course found:", course.title);

  // Step 4 — Get user info from Clerk
  let userEmail: string;
  let userName: string;
  try {
    const clerk = await clerkClient();
    const user = await clerk.users.getUser(userId);
    userEmail = user.primaryEmailAddress?.emailAddress ?? "";
    userName = user.firstName ?? userEmail ?? "Customer";
  } catch (err) {
    console.error("[API/checkout] ❌ Clerk getUser error:", err);
    return NextResponse.json({ error: "Gagal mengambil data pengguna." }, { status: 500 });
  }

  console.log("[API/checkout] Step 4 — userEmail:", userEmail);

  // Step 5 — Check existing enrollment (non-blocking if Supabase unavailable)
  try {
    const { data: existing } = await supabase
      .from("enrollments")
      .select("id")
      .eq("user_email", userEmail)
      .eq("course_slug", body.slug)
      .eq("status", "active")
      .single();

    if (existing) {
      console.log("[API/checkout] User already enrolled:", userEmail, body.slug);
      return NextResponse.json({ error: "Anda sudah memiliki akses ke course ini." }, { status: 400 });
    }
  } catch (err) {
    // Non-fatal: if enrollments table missing, proceed
    console.warn("[API/checkout] ⚠️ Enrollment check skipped (table may not exist):", err);
  }

  // Step 6 — Create order in Supabase
  const orderId = `kaalupi-${body.slug}-${Date.now()}`;
  const amount = body.amount ?? course.price;

  try {
    const { error: orderError } = await supabase
      .from("orders")
      .insert({
        order_id: orderId,
        user_email: userEmail,
        course_slug: body.slug,
        amount,
        status: "pending",
      });

    if (orderError) {
      console.error("[API/checkout] ❌ Order insert error:", orderError.message, orderError.code);
      // Non-fatal in dev: continue to Midtrans even if order table missing
      if (orderError.code !== "42P01") {
        // 42P01 = table does not exist → allow in dev
        return NextResponse.json({ error: `Gagal membuat order: ${orderError.message}` }, { status: 500 });
      }
      console.warn("[API/checkout] ⚠️ Orders table missing — skipping DB order (dev mode)");
    } else {
      console.log("[API/checkout] Step 6 — order created:", orderId);
    }
  } catch (err) {
    console.warn("[API/checkout] ⚠️ Order creation exception (continuing):", err);
  }

  // Step 7 — Create Midtrans Snap token
  try {
    console.log("[API/checkout] Step 7 — creating Midtrans transaction...");
    const snap = await createMidtransTransaction({
      orderId,
      amount,
      courseTitle: course.title,
      customer: { firstName: userName, email: userEmail },
    });

    console.log("[API/checkout] ✅ Snap token received");
    return NextResponse.json({ snapToken: snap.token });
  } catch (snapError) {
    const msg = snapError instanceof Error ? snapError.message : String(snapError);
    console.error("[API/checkout] ❌ Midtrans error:", msg);
    return NextResponse.json({ error: `Gagal membuat transaksi: ${msg}` }, { status: 500 });
  }
}
