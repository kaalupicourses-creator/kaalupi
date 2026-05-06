import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

type ContactBody = {
  from?: string;
  subject?: string;
  body?: string;
};

export async function POST(request: Request) {
  let body: ContactBody;
  try {
    body = (await request.json()) as ContactBody;
  } catch {
    return NextResponse.json({ error: "Request tidak valid." }, { status: 400 });
  }

  const { from, subject, body: message } = body;

  if (!from || !subject || !message) {
    return NextResponse.json({ error: "Semua field wajib diisi." }, { status: 400 });
  }

  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_APP_PASSWORD;

  // If email not configured, just return success (doesn't break form)
  if (!user || !pass) {
    console.log("[Contact] Email not configured. Data:", { from, subject, message });
    return NextResponse.json({ success: true, message: "Email not configured, but form submitted." });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: { user, pass },
    });

    await transporter.sendMail({
      from: `"Kaalupi Contact Form" <${user}>`,
      to: user,
      replyTo: from,
      subject: `📬 Pesan Baru: ${subject}`,
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; border: 1px solid #F0E8D8; border-radius: 16px;">
          <h2 style="color: #2D5016; margin-bottom: 4px;">Pesan Baru dari Website!</h2>
          <p style="color: #444444; font-size: 14px;">Ada pesan masuk dari form kontak Kaalupi.</p>
          <hr style="border: none; border-top: 1px solid #F0E8D8; margin: 16px 0;" />
          <table style="width: 100%; font-size: 14px; color: #444444; border-collapse: collapse;">
            <tr><td style="padding: 6px 0; font-weight: bold; color: #2D5016; width: 100px;">Nama</td><td>${from}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold; color: #2D5016;">Subjek</td><td>${subject}</td></tr>
          </table>
          <hr style="border: none; border-top: 1px solid #F0E8D8; margin: 16px 0;" />
          <div style="background: #FEFBF5; padding: 16px; border-radius: 12px; font-size: 14px; line-height: 1.6; color: #444444;">
            ${message.replace(/\n/g, "<br/>")}
          </div>
          <hr style="border: none; border-top: 1px solid #F0E8D8; margin: 16px 0;" />
          <div style="display: flex; gap: 8px;">
            <a href="mailto:${from}" style="display: inline-block; background: #2D5016; color: white; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 13px;">
              📧 Balas Email
            </a>
            <a href="https://wa.me/${from.replace(/\D/g, "")}" style="display: inline-block; background: #25D366; color: white; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 13px;">
              💬 Chat WA
            </a>
          </div>
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
