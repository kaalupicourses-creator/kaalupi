import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";
import { createMidtransTransaction } from "@/lib/midtrans";

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Silakan login terlebih dahulu." }, { status: 401 });
  }

  const body = (await request.json()) as { slug?: string; amount?: number };
  if (!body.slug) {
    return NextResponse.json({ error: "Slug course wajib diisi." }, { status: 400 });
  }

  const { data: course, error: courseError } = await supabase
    .from("courses")
    .select("*")
    .eq("slug", body.slug)
    .single();

  if (courseError || !course) {
    return NextResponse.json({ error: "Course tidak ditemukan." }, { status: 404 });
  }

  const clerk = await clerkClient();
  const user = await clerk.users.getUser(userId);
  const userEmail = user.primaryEmailAddress?.emailAddress ?? "";
  const userName = user.firstName ?? user.primaryEmailAddress?.emailAddress ?? "Customer";

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

  const orderId = `kaalupi-${body.slug}-${Date.now()}`;
  const amount = body.amount ?? course.price;

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      order_id: orderId,
      user_email: userEmail,
      course_slug: body.slug,
      amount,
      status: "pending",
    })
    .select()
    .single();

  if (orderError) {
    return NextResponse.json({ error: "Gagal membuat order." }, { status: 500 });
  }

  try {
    const snap = await createMidtransTransaction({
      orderId,
      amount,
      courseTitle: course.title,
      customer: { firstName: userName, email: userEmail },
    });

    return NextResponse.json({
      snapToken: snap.token,
    });
  } catch (snapError) {
    console.error("Midtrans Snap error:", snapError);
    return NextResponse.json({ error: "Gagal membuat transaksi pembayaran." }, { status: 500 });
  }
}
