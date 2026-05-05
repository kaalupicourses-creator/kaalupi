import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";
import { getCourseBySlug } from "@/lib/content";
import { createMidtransTransaction } from "@/lib/midtrans";

export async function POST(request: Request) {
  // Step 1 — Auth check
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Silakan login terlebih dahulu." }, { status: 401 });
  }

  // Step 2 — Parse body
  let body: { slug?: string; amount?: number; isFree?: boolean; voucherCode?: string };
  try {
    body = (await request.json()) as { slug?: string; amount?: number; isFree?: boolean; voucherCode?: string };
  } catch {
    return NextResponse.json({ error: "Request body tidak valid." }, { status: 400 });
  }

  if (!body.slug) {
    return NextResponse.json({ error: "Slug course wajib diisi." }, { status: 400 });
  }

  // Step 3 — Get course from content (MDX seed data, falls back to Supabase)
  const course = await getCourseBySlug(body.slug);
  if (!course) {
    return NextResponse.json({ error: "Course tidak ditemukan." }, { status: 404 });
  }

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
      return NextResponse.json({ error: "Anda sudah memiliki akses ke course ini." }, { status: 400 });
    }
  } catch (err) {
    // Non-fatal: if enrollments table missing, proceed
  }

  // Step 6 — Handle free course (skip payment)
  const amount = body.amount ?? course.price;
  const isFreeCourse = body.isFree || course.is_free || amount === 0;
  
  if (isFreeCourse) {
    try {
      const { error: enrollError } = await supabase
        .from("enrollments")
        .insert({
          user_email: userEmail,
          course_slug: body.slug,
          status: "active",
        });
       
      if (enrollError) {
        console.error("[API/checkout] Enrollment error:", enrollError);
      }
    } catch (err) {
      // Enrollment exception
    }
     
    return NextResponse.json({ success: true, free: true });
  }

  // Step 7 — Apply voucher if provided
  let finalAmount = body.amount ?? course.price;
  
  if (body.voucherCode) {
    try {
      const { data: voucher } = await supabase
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
          
          // Update voucher usage
          await supabase
            .from("vouchers")
            .update({ used_count: voucher.used_count + 1 })
            .eq("code", body.voucherCode);
         }
       }
     } catch (err) {
       // Voucher validation skipped
     }
   }

  // Step 8 — Create order in Supabase
  const orderId = `kaalupi-${body.slug}-${Date.now()}`;

  try {
    const { error: orderError } = await supabase
      .from("orders")
      .insert({
        order_id: orderId,
        user_email: userEmail,
        course_slug: body.slug,
        amount: finalAmount,
        status: "pending",
      });

    if (orderError) {
      console.error("[API/checkout] ❌ Order insert error:", orderError.message, orderError.code);
      if (orderError.code !== "42P01") {
        return NextResponse.json({ error: `Gagal membuat order: ${orderError.message}` }, { status: 500 });
      }
    }
  } catch (err) {
    // Order creation exception
  }

  // Step 9 — Create Midtrans Snap token with installments enabled
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
