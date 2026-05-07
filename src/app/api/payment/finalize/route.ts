import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { isPaymentSuccessful, getMidtransTransactionStatus } from "@/lib/midtrans";

export async function POST(request: Request) {
  const supabaseAdmin = getSupabaseAdmin();
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Silakan login terlebih dahulu." }, { status: 401 });
  }

  const clerk = await clerkClient();
  const user = await clerk.users.getUser(userId);
  const userEmail = user.primaryEmailAddress?.emailAddress ?? "";

  const body = (await request.json()) as { orderId?: string };
  if (!body.orderId) {
    return NextResponse.json({ error: "Order ID wajib diisi." }, { status: 400 });
  }

  const { data: order, error } = await supabaseAdmin
    .from("orders")
    .select("*")
    .eq("order_id", body.orderId)
    .eq("user_email", userEmail)
    .eq("status", "pending")
    .single();

  if (error || !order) {
    return NextResponse.json({ error: "Order pending tidak ditemukan." }, { status: 404 });
  }

  const status = await getMidtransTransactionStatus(body.orderId);
  const success = isPaymentSuccessful(status);

  if (!success) {
    return NextResponse.json({ message: "Pembayaran belum berstatus sukses." }, { status: 400 });
  }

  await supabaseAdmin
    .from("orders")
    .update({ status: "paid" })
    .eq("order_id", body.orderId);

  await supabaseAdmin
    .from("enrollments")
    .upsert(
      { user_email: userEmail, course_slug: order.course_slug, status: "active" },
      { onConflict: "user_email,course_slug" },
    );

  return NextResponse.json({
    success: true,
    message: "Pembayaran tervalidasi. Akses course sudah aktif.",
  });
}
