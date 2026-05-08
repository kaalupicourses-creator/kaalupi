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

  // Auto-assign Founding Member badge for first 100 buyers of mastery
  let foundingBadgeAwarded = false;
  if (order.course_slug === "ai-untuk-pemula-mastery") {
    const { count: enrolledCount } = await supabaseAdmin
      .from("enrollments")
      .select("id", { count: "exact", head: true })
      .eq("course_slug", "ai-untuk-pemula-mastery")
      .eq("status", "active");

    if ((enrolledCount ?? 0) <= 100) {
      // Find or create Founding Member badge
      let { data: badge } = await supabaseAdmin
        .from("badges")
        .select("id")
        .eq("name", "Founding Member")
        .maybeSingle();

      if (!badge) {
        const { data: newBadge } = await supabaseAdmin
          .from("badges")
          .insert({
            name: "Founding Member",
            description: "100 student pertama AI Mastery — supporter awal Kaalupi",
            icon: "👑",
            required_points: 0,
          })
          .select()
          .single();
        badge = newBadge;
      }

      if (badge?.id) {
        await supabaseAdmin
          .from("user_badges")
          .upsert(
            { user_email: userEmail, badge_id: badge.id },
            { onConflict: "user_email,badge_id" },
          );
        foundingBadgeAwarded = true;
      }

      // Award founding bonus points
      const { data: existingPoints } = await supabaseAdmin
        .from("user_points")
        .select("points")
        .eq("user_email", userEmail)
        .maybeSingle();
      const newPoints = ((existingPoints?.points as number | undefined) ?? 0) + 100;
      await supabaseAdmin
        .from("user_points")
        .upsert(
          { user_email: userEmail, points: newPoints },
          { onConflict: "user_email" },
        );
    }
  }

  return NextResponse.json({
    success: true,
    message: foundingBadgeAwarded
      ? "🎉 Selamat! Lu jadi Founding Member. Badge & 100 bonus poin udah masuk akun lu."
      : "Pembayaran tervalidasi. Akses course sudah aktif.",
    founding_badge: foundingBadgeAwarded,
  });
}
