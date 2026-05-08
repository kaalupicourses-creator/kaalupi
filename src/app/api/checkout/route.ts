import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { getCourseBySlug } from "@/lib/content";
import { createMidtransTransaction } from "@/lib/midtrans";

export async function POST(request: Request) {
  const supabaseAdmin = getSupabaseAdmin();
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Silakan login terlebih dahulu." }, { status: 401 });
  }

  let body: { slug?: string; voucherCode?: string };
  try {
    body = (await request.json()) as { slug?: string; voucherCode?: string };
  } catch {
    return NextResponse.json({ error: "Request body tidak valid." }, { status: 400 });
  }

  if (!body.slug) {
    return NextResponse.json({ error: "Slug course wajib diisi." }, { status: 400 });
  }

  const course = await getCourseBySlug(body.slug);
  if (!course) {
    return NextResponse.json({ error: "Course tidak ditemukan." }, { status: 404 });
  }

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

  // Harga dari SERVER — jangan percaya client
  const isFreeCourse = course.is_free || course.price === 0;
  let serverPrice = isFreeCourse ? 0 : course.price;

  // Dynamic Founding Members pricing: setelah 100 buyer, harga naik ke regular
  if (
    !isFreeCourse &&
    course.founding_members_limit &&
    course.regular_price &&
    course.founding_price
  ) {
    const { count: enrolledCount } = await supabaseAdmin
      .from("enrollments")
      .select("id", { count: "exact", head: true })
      .eq("course_slug", body.slug)
      .eq("status", "active");

    if ((enrolledCount ?? 0) >= course.founding_members_limit) {
      serverPrice = course.regular_price;
    } else {
      serverPrice = course.founding_price;
    }
  }

  try {
    const { data: existing } = await supabaseAdmin
      .from("enrollments")
      .select("id")
      .eq("user_email", userEmail)
      .eq("course_slug", body.slug)
      .eq("status", "active")
      .single();

    if (existing) {
      return NextResponse.json({ error: "Anda sudah memiliki akses ke course ini." }, { status: 400 });
    }
  } catch {
    // proceed
  }

  // Free course — langsung enroll tanpa payment
  if (isFreeCourse) {
    try {
      await supabaseAdmin.from("enrollments").insert({
        user_email: userEmail,
        course_slug: body.slug,
        status: "active",
      });
    } catch {
      // enrollment exception
    }

    return NextResponse.json({ success: true, free: true });
  }

  // Apply voucher if provided
  let finalAmount = serverPrice;

  if (body.voucherCode) {
    try {
      const { data: voucher } = await supabaseAdmin
        .from("vouchers")
        .select("*")
        .eq("code", body.voucherCode)
        .eq("is_active", true)
        .single();

      if (voucher) {
        const now = new Date();
        const validUntil = voucher.valid_until ? new Date(voucher.valid_until) : null;

        if ((!validUntil || validUntil > now) &&
            (!voucher.max_uses || voucher.used_count < voucher.max_uses)) {

          if (voucher.discount_percent) {
            finalAmount = Math.floor(finalAmount * (1 - voucher.discount_percent / 100));
          } else if (voucher.discount_amount) {
            finalAmount = Math.max(0, finalAmount - voucher.discount_amount);
          }

          await supabaseAdmin
            .from("vouchers")
            .update({ used_count: voucher.used_count + 1 })
            .eq("code", body.voucherCode);
        }
      }
    } catch {
      // voucher validation skipped
    }
  }

  const orderId = `kaalupi-${body.slug}-${Date.now()}`;

  try {
    await supabaseAdmin.from("orders").insert({
      order_id: orderId,
      user_email: userEmail,
      course_slug: body.slug,
      amount: finalAmount,
      status: "pending",
    });
  } catch {
    // order creation exception
  }

  try {
    const snap = await createMidtransTransaction({
      orderId,
      amount: finalAmount,
      courseTitle: course.title,
      customer: { firstName: userName, email: userEmail },
      enableInstallments: true,
    });

    return NextResponse.json({ snapToken: snap.token });
  } catch (snapError) {
    const msg = snapError instanceof Error ? snapError.message : String(snapError);
    console.error("[API/checkout] ❌ Midtrans error:", msg);
    return NextResponse.json({ error: `Gagal membuat transaksi: ${msg}` }, { status: 500 });
  }
}
