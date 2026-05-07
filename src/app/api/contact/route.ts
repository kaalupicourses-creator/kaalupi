import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

type ContactBody = {
  from?: string;
  email?: string;
  subject?: string;
  body?: string;
};

const contactInbox = "kaalupicourses@gmail.com";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(request: Request) {
  let body: ContactBody;
  try {
    body = (await request.json()) as ContactBody;
  } catch {
    return NextResponse.json({ error: "Request tidak valid." }, { status: 400 });
  }

  const { from, email, subject, body: message } = body;

  if (!from || !email || !subject || !message) {
    return NextResponse.json({ error: "Semua field wajib diisi." }, { status: 400 });
  }

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.json({ error: "Email tidak valid." }, { status: 400 });
  }

  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_APP_PASSWORD;

  if (!user || !pass) {
    console.error("[Contact] Missing EMAIL_USER or EMAIL_APP_PASSWORD.");
    return NextResponse.json({ error: "Email server belum dikonfigurasi." }, { status: 500 });
  }

  try {
    const safeFrom = escapeHtml(from);
    const safeEmail = escapeHtml(email);
    const safeSubject = escapeHtml(subject);
    const safeMessage = escapeHtml(message).replace(/\n/g, "<br/>");

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: { user, pass },
    });

    await transporter.sendMail({
      from: `"Kaalupi Contact Form" <${user}>`,
      to: contactInbox,
      replyTo: { name: from, address: email },
      subject: `Pesan Baru: ${subject}`,
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; border: 1px solid #F0E8D8; border-radius: 16px;">
          <h2 style="color: #2D5016; margin-bottom: 4px;">Pesan Baru dari Website!</h2>
          <p style="color: #444444; font-size: 14px;">Ada pesan masuk dari form kontak Kaalupi.</p>
          <hr style="border: none; border-top: 1px solid #F0E8D8; margin: 16px 0;" />
          <table style="width: 100%; font-size: 14px; color: #444444; border-collapse: collapse;">
            <tr><td style="padding: 6px 0; font-weight: bold; color: #2D5016; width: 100px;">Nama</td><td>${safeFrom}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold; color: #2D5016;">Email</td><td><a href="mailto:${safeEmail}" style="color: #F5A62A;">${safeEmail}</a></td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold; color: #2D5016;">Subjek</td><td>${safeSubject}</td></tr>
          </table>
          <hr style="border: none; border-top: 1px solid #F0E8D8; margin: 16px 0;" />
          <div style="background: #FEFBF5; padding: 16px; border-radius: 12px; font-size: 14px; line-height: 1.6; color: #444444;">
            ${safeMessage}
          </div>
          <hr style="border: none; border-top: 1px solid #F0E8D8; margin: 16px 0;" />
          <a href="mailto:${safeEmail}" style="display: inline-block; background: #2D5016; color: white; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 13px;">
            Balas Email
          </a>
          <p style="margin-top: 16px; font-size: 12px; color: #999;">
            Dikirim otomatis dari Kaalupi Contact Form
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[Contact] Email error:", err);
    return NextResponse.json({ error: "Gagal mengirim pesan. Coba lagi." }, { status: 500 });
  }
}
