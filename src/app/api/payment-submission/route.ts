import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { getCourseBySlug } from "@/lib/content";
import { siteConfig } from "@/lib/data";

export const runtime = "nodejs";

type Body = {
  course_slug?: string;
  payment_method?: "dana" | "bca" | "bsi";
  sender_account?: string;
};

const VALID_METHODS = new Set(["dana", "bca", "bsi"]);

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Login dulu" }, { status: 401 });
  }

  const user = await currentUser();
  const userEmail = user?.primaryEmailAddress?.emailAddress ?? "";
  const userName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    user?.username ||
    userEmail;
  const userPhone = user?.primaryPhoneNumber?.phoneNumber ?? "";

  let body: Body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { course_slug, payment_method, sender_account } = body;
  if (!course_slug || !payment_method) {
    return NextResponse.json(
      { error: "course_slug dan payment_method wajib" },
      { status: 400 },
    );
  }
  if (!VALID_METHODS.has(payment_method)) {
    return NextResponse.json({ error: "Payment method ngga valid" }, { status: 400 });
  }

  const course = await getCourseBySlug(course_slug);
  if (!course) {
    return NextResponse.json({ error: "Course ngga ditemukan" }, { status: 404 });
  }

  const supabase = getSupabaseAdmin();

  // Cek apakah user sudah enrolled (kalau iya, redirect ke access)
  const { data: existingEnrollment } = await supabase
    .from("enrollments")
    .select("id")
    .eq("user_email", userEmail)
    .eq("course_slug", course_slug)
    .eq("status", "active")
    .maybeSingle();

  if (existingEnrollment) {
    return NextResponse.json(
      {
        error: "Lu udah enrolled di course ini",
        already_enrolled: true,
      },
      { status: 409 },
    );
  }

  // Cek pending submission existing
  const { data: existingPending } = await supabase
    .from("payment_submissions")
    .select("id, status")
    .eq("user_email", userEmail)
    .eq("course_slug", course_slug)
    .eq("status", "pending")
    .maybeSingle();

  if (existingPending) {
    return NextResponse.json(
      {
        error: "Pembayaran lu yg lama masih nunggu konfirmasi admin. Tunggu dicek dulu.",
        already_pending: true,
        submission_id: existingPending.id,
      },
      { status: 409 },
    );
  }

  // Insert submission
  const { data: submission, error } = await supabase
    .from("payment_submissions")
    .insert({
      user_email: userEmail,
      user_name: userName,
      user_phone: userPhone || null,
      user_id_clerk: userId,
      course_slug,
      course_title: course.title,
      amount: course.price,
      payment_method,
      sender_account: sender_account || null,
      status: "pending",
    })
    .select()
    .single();

  if (error || !submission) {
    console.error("[payment-submission] insert failed:", error);
    return NextResponse.json({ error: "Gagal simpan submission" }, { status: 500 });
  }

  // Build WhatsApp deep link with pre-filled message
  const methodLabel = {
    dana: "DANA",
    bca: "BCA",
    bsi: "BSI",
  }[payment_method];

  const message = [
    `Halo Admin Kaalupi, saya udah bayar:`,
    ``,
    `Course: ${course.title}`,
    `Jumlah: Rp ${course.price.toLocaleString("id-ID")}`,
    `Metode: ${methodLabel}`,
    `Email akun Kaalupi: ${userEmail}`,
    `Nama: ${userName}`,
    sender_account ? `Nama/no pengirim: ${sender_account}` : null,
    ``,
    `ID submission: ${submission.id}`,
    ``,
    `Mohon konfirmasi & aktifin akses course-nya. Makasih!`,
  ]
    .filter(Boolean)
    .join("\n");

  const adminWa = siteConfig.payment.adminWhatsapp;
  const waUrl = `https://wa.me/${adminWa}?text=${encodeURIComponent(message)}`;

  // Mark whatsapp_sent setelah ini di-fetch (frontend yg actual redirect)
  await supabase
    .from("payment_submissions")
    .update({ whatsapp_sent: true })
    .eq("id", submission.id);

  return NextResponse.json({
    success: true,
    submission_id: submission.id,
    whatsapp_url: waUrl,
    message_preview: message,
  });
}
