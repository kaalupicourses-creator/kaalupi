import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import nodemailer from "nodemailer";

type WaitlistBody = {
  nama?: string;
  email?: string;
  whatsapp?: string;
  tipe_user?: string;
};

const waitlistInbox = "kaalupicourses@gmail.com";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function sendNotificationEmail(data: Required<WaitlistBody>) {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_APP_PASSWORD;

  // Skip email if not configured (doesn't break registration)
  if (!user || !pass) {
    console.error("[Waitlist] Missing EMAIL_USER or EMAIL_APP_PASSWORD.");
    return;
  }

  const safeNama = escapeHtml(data.nama);
  const safeEmail = escapeHtml(data.email);
  const safeWhatsapp = escapeHtml(data.whatsapp);
  const safeTipeUser = escapeHtml(data.tipe_user);
  const whatsappNumber = data.whatsapp.replace(/\D/g, "");

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user, pass },
  });

  await transporter.sendMail({
    from: `"Kaalupi Waitlist" <${user}>`,
    to: waitlistInbox,
    subject: `Waitlist baru: ${data.nama} - AI untuk Pemula`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; border: 1px solid #F0E8D8; border-radius: 16px;">
        <h2 style="color: #2D5016; margin-bottom: 4px;">Pendaftar Waitlist Baru!</h2>
        <p style="color: #444444; font-size: 14px;">Course: <strong>AI untuk Pemula</strong></p>
        <hr style="border: none; border-top: 1px solid #F0E8D8; margin: 16px 0;" />
        <table style="width: 100%; font-size: 14px; color: #444444; border-collapse: collapse;">
          <tr><td style="padding: 6px 0; font-weight: bold; color: #2D5016; width: 100px;">Nama</td><td>${safeNama}</td></tr>
          <tr><td style="padding: 6px 0; font-weight: bold; color: #2D5016;">Email</td><td><a href="mailto:${safeEmail}" style="color: #F5A62A;">${safeEmail}</a></td></tr>
          <tr><td style="padding: 6px 0; font-weight: bold; color: #2D5016;">WhatsApp</td><td><a href="https://wa.me/${whatsappNumber}" style="color: #F5A62A;">${safeWhatsapp}</a></td></tr>
          <tr><td style="padding: 6px 0; font-weight: bold; color: #2D5016;">Kategori</td><td>${safeTipeUser}</td></tr>
        </table>
        <hr style="border: none; border-top: 1px solid #F0E8D8; margin: 16px 0;" />
        <a href="https://wa.me/${whatsappNumber}" style="display: inline-block; background: #25D366; color: white; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 13px;">
          Chat via WhatsApp
        </a>
        <p style="margin-top: 16px; font-size: 12px; color: #999;">
          Dikirim otomatis dari Kaalupi Waitlist System
        </p>
      </div>
    `,
  });
}

export async function POST(request: Request) {
  let body: WaitlistBody;
  try {
    body = (await request.json()) as WaitlistBody;
  } catch {
    return NextResponse.json({ error: "Request tidak valid." }, { status: 400 });
  }

  const { nama, email, whatsapp, tipe_user } = body;

  if (!nama || !email || !whatsapp || !tipe_user) {
    return NextResponse.json({ error: "Semua field wajib diisi." }, { status: 400 });
  }

  // Simpan ke Supabase
  const { error: dbError } = await supabase.from("waitlist").insert([
    { nama, email, whatsapp, tipe_user },
  ]);

  if (dbError) {
    console.error("[Waitlist] DB error:", dbError.message, dbError.code);
    // Jika duplicate email, tetap anggap sukses
    if (dbError.code === "23505") {
      return NextResponse.json({ success: true, message: "already_registered" });
    }
    return NextResponse.json({ error: "Gagal menyimpan data." }, { status: 500 });
  }

  // Await supaya notifikasi tetap sempat terkirim di serverless Vercel.
  await sendNotificationEmail({ nama, email, whatsapp, tipe_user }).catch((err) => {
    console.error("[Waitlist] Email notification error:", err);
  });

  return NextResponse.json({ success: true });
}
