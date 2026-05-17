import nodemailer from "nodemailer";
import { siteConfig } from "@/lib/data";

/**
 * Email helper — Gmail SMTP.
 *
 * Required env vars (Vercel):
 *   EMAIL_USER          — Gmail address (e.g. kaalupicourses@gmail.com)
 *   EMAIL_APP_PASSWORD  — 16-char App Password (myaccount.google.com/apppasswords)
 *
 * Optional overrides:
 *   SMTP_HOST  (default smtp.gmail.com)
 *   SMTP_PORT  (default 465)
 *   EMAIL_FROM (default "Kaalupi <EMAIL_USER>")
 */

let transporterCache: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter | null {
  if (transporterCache) return transporterCache;

  const host = process.env.SMTP_HOST ?? "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT ?? 465);
  const user = process.env.EMAIL_USER ?? process.env.SMTP_USER;
  // Gmail App Password sometimes copied with spaces — strip them defensively
  const passRaw = process.env.EMAIL_APP_PASSWORD ?? process.env.SMTP_PASS;
  const pass = passRaw ? passRaw.replace(/\s+/g, "") : undefined;

  if (!user || !pass) {
    console.warn("[email] EMAIL_USER atau EMAIL_APP_PASSWORD belum di-set — email skipped.");
    return null;
  }

  transporterCache = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
  return transporterCache;
}

type ApprovalArgs = {
  to: string;
  userName: string;
  courseTitle: string;
  isFoundingMember: boolean;
};

export async function sendApprovalEmail(args: ApprovalArgs) {
  const transporter = getTransporter();
  if (!transporter) return;

  const fromEmail = process.env.EMAIL_USER ?? siteConfig.email;
  const from = process.env.EMAIL_FROM ?? process.env.SMTP_FROM ?? `Kaalupi <${fromEmail}>`;
  const dashboard = "https://kaalupi.vercel.app/dashboard";
  const discord = siteConfig.community.discord;

  const subject = args.isFoundingMember
    ? `🏛️ Selamat! Kamu jadi Founding Member Kaalupi`
    : `Akses ${args.courseTitle} sudah aktif`;

  const html = args.isFoundingMember
    ? `
<div style="font-family: Arial, sans-serif; max-width: 560px; margin: auto; padding: 24px; color: #444;">
  <div style="background: #2D5016; color: #F5A62A; padding: 20px; border-radius: 16px 16px 0 0; text-align: center;">
    <h1 style="margin: 0; font-size: 22px;">Selamat, ${args.userName}!</h1>
    <p style="margin: 8px 0 0; font-size: 14px;">Kamu resmi jadi <strong>Founding Member Kaalupi</strong></p>
  </div>
  <div style="background: #FEFBF5; padding: 24px; border: 1px solid #F0E8D8; border-top: 0; border-radius: 0 0 16px 16px;">
    <p>Pembayaran kamu untuk <strong>${args.courseTitle}</strong> udah kami konfirmasi.</p>
    <p style="background: #FFF3D6; padding: 12px 16px; border-radius: 8px; margin: 16px 0; font-size: 14px;">
      <strong>Privilege Founding Member:</strong><br/>
      • Lifetime access ke <strong>SEMUA course</strong> Kaalupi (sekarang & yang akan rilis)<br/>
      • Badge <strong>Founding Member</strong> permanen di profil<br/>
      • +100 bonus poin<br/>
      • Akses Discord eksklusif Founding Members
    </p>
    <p>Yang harus kamu lakuin sekarang:</p>
    <ol style="padding-left: 18px;">
      <li>Buka <a href="${dashboard}" style="color: #F5A62A; font-weight: bold;">dashboard kamu</a> — course udah ke-aktifin.</li>
      <li>Gabung Discord Founding Members supaya ngga ketinggalan info: <a href="${discord}" style="color: #5865F2;">klik di sini</a>.</li>
      <li>Mulai modul pertama. AI Tutor 24/7 udah aktif buat bantu.</li>
    </ol>
    <p style="margin-top: 20px;">Makasih udah percaya sama kami dari hari pertama.</p>
    <p style="margin: 0;">— Tim Kaalupi</p>
  </div>
</div>
    `
    : `
<div style="font-family: Arial, sans-serif; max-width: 560px; margin: auto; padding: 24px; color: #444;">
  <div style="background: #FFF3D6; padding: 20px; border-radius: 16px 16px 0 0;">
    <h1 style="margin: 0; font-size: 22px; color: #2D5016;">Halo, ${args.userName}!</h1>
    <p style="margin: 8px 0 0; font-size: 14px; color: #5C4813;">Pembayaran kamu udah kami konfirmasi.</p>
  </div>
  <div style="background: #FEFBF5; padding: 24px; border: 1px solid #F0E8D8; border-top: 0; border-radius: 0 0 16px 16px;">
    <p>Akses ke <strong>${args.courseTitle}</strong> udah aktif di akun kamu.</p>
    <p>
      <a href="${dashboard}" style="display: inline-block; background: #F5A62A; color: #2D5016; padding: 12px 20px; border-radius: 8px; text-decoration: none; font-weight: bold;">Buka Dashboard →</a>
    </p>
    <p style="margin-top: 20px; font-size: 14px;">Selamat belajar 🚀</p>
    <p style="margin: 0;">— Tim Kaalupi</p>
  </div>
</div>
    `;

  await transporter.sendMail({
    from,
    to: args.to,
    subject,
    html,
  });
}
