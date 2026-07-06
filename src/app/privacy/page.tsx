import Link from "next/link";
import type { Metadata } from "next";
import { siteConfig } from "@/lib/data";

export const metadata: Metadata = {
  title: "Kebijakan Privasi",
  description: "Kebijakan privasi platform Kaalupi — data apa yang kami kumpulkan dan bagaimana kami menggunakannya.",
};

export default function PrivacyPage() {
  return (
    <div className="bg-[#FEFBF5] min-h-screen">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm font-semibold text-[#5C4813] hover:text-[#F5A62A] mb-8"
        >
          ← Beranda
        </Link>

        <h1 className="text-4xl font-extrabold text-[#2D5016]">Kebijakan Privasi</h1>
        <p className="mt-2 text-sm text-[#5C4813]">Terakhir diperbarui: 19 Mei 2026</p>

        <div className="mt-10 space-y-8 text-sm leading-7 text-[#444]">
          <section>
            <h2 className="text-xl font-extrabold text-[#2D5016] mb-3">1. Data yang Kami Kumpulkan</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Akun &amp; identitas</strong> — email, nama, username, foto profil (opsional), nomor HP (kalau diisi). Dikelola oleh Clerk.
              </li>
              <li>
                <strong>Onboarding</strong> — tujuan belajar dan bidang minat (data agregat untuk personalisasi).
              </li>
              <li>
                <strong>Pembelajaran</strong> — progress per modul, sertifikat yang di-generate, poin &amp; badge.
              </li>
              <li>
                <strong>Pembayaran</strong> — nominal, metode (DANA / BCA / BSI), nama pengirim, dan jam transaksi. Kami <strong>nggak menyimpan</strong> nomor rekening / nomor kartu kamu.
              </li>
              <li>
                <strong>Komunikasi</strong> — pesan ke admin via WhatsApp / email (untuk verifikasi pembayaran &amp; support).
              </li>
              <li>
                <strong>Analytics</strong> — Vercel Analytics (page views, agregat) — tidak melacak identitas individual.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-extrabold text-[#2D5016] mb-3">2. Bagaimana Kami Pakai Data</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Memberikan akses course dan tracking progress kamu.</li>
              <li>Memverifikasi pembayaran dan mengaktifkan enrollment.</li>
              <li>Mengirim email konfirmasi, update materi, dan info komunitas.</li>
              <li>Personalisasi rekomendasi course berdasarkan tujuan / minat.</li>
              <li>Improve produk berdasarkan agregat analytics (tidak per-individu).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-extrabold text-[#2D5016] mb-3">3. Data yang Dibagikan ke Pihak Ketiga</h2>
            <p>Kaalupi pakai layanan pihak ketiga berikut, hanya sebatas yang diperlukan:</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li><strong>Clerk</strong> — autentikasi (email, nama, sesi login)</li>
              <li><strong>Supabase</strong> — penyimpanan database (PostgreSQL)</li>
              <li><strong>Vercel</strong> — hosting platform</li>
              <li><strong>Google (Gemini API)</strong> — AI Tutor processing (pertanyaan kamu di-forward ke Gemini, tidak disimpan permanen oleh Kaalupi)</li>
              <li><strong>Gmail SMTP</strong> — pengiriman email transaksional</li>
            </ul>
            <p className="mt-3">
              Kaalupi <strong>tidak menjual data</strong> kamu ke pihak ketiga manapun.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-extrabold text-[#2D5016] mb-3">4. Hak Kamu</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Akses data</strong> — minta export data kamu via email.</li>
              <li><strong>Edit data</strong> — bisa langsung via halaman <Link href="/profile" className="text-[#F5A62A] underline">/profile</Link>.</li>
              <li><strong>Hapus akun</strong> — request via email {siteConfig.email} dengan subjek &quot;Delete Account&quot;. Diproses dalam 14 hari kerja.</li>
              <li><strong>Withdraw consent</strong> — kapanpun, dengan menghapus akun.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-extrabold text-[#2D5016] mb-3">5. Penyimpanan Data</h2>
            <p>
              Data disimpan di server Supabase region <strong>ap-southeast-1 (Singapura)</strong>.
              Kami simpan data selama akun aktif. Setelah akun dihapus, data di-anonymize / dihapus
              dalam 30 hari (kecuali ada kewajiban hukum / pajak yang mensyaratkan retention lebih lama).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-extrabold text-[#2D5016] mb-3">6. Keamanan</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Password di-hash oleh Clerk (industri standard).</li>
              <li>Komunikasi platform dienkripsi via HTTPS / TLS.</li>
              <li>Database memakai Row Level Security (RLS) Supabase.</li>
              <li>API admin di-gate dengan role-based access control.</li>
              <li>Kami nggak menyimpan plaintext password / data kartu kredit.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-extrabold text-[#2D5016] mb-3">7. Cookies</h2>
            <p>
              Kaalupi pakai cookie untuk session login (Clerk) dan analytics (Vercel). Tidak ada
              third-party tracking cookies. Bisa di-clear lewat browser kamu kapanpun.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-extrabold text-[#2D5016] mb-3">8. Anak di Bawah Umur</h2>
            <p>
              Kaalupi ditujukan untuk usia 17+. Untuk pengguna di bawah usia tersebut, perlu
              persetujuan dan supervisi orang tua / wali. Kalau kamu di bawah 13 tahun, jangan
              daftar tanpa orang tua.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-extrabold text-[#2D5016] mb-3">9. Perubahan Kebijakan</h2>
            <p>
              Kami bisa update kebijakan privasi ini. Perubahan major akan diumumkan via email
              atau notif di dashboard. Penggunaan platform yang berlanjut setelah perubahan
              dianggap sebagai persetujuan terhadap kebijakan baru.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-extrabold text-[#2D5016] mb-3">10. Kontak</h2>
            <p>
              Pertanyaan privasi atau ingin akses / hapus data?
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Email: <a href={`mailto:${siteConfig.email}`} className="text-[#F5A62A] underline">{siteConfig.email}</a></li>
              <li>WhatsApp: <strong>{siteConfig.phone}</strong></li>
              <li>Alamat: {siteConfig.address}</li>
            </ul>
          </section>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-[#F0E8D8] pt-6 text-xs text-[#5C4813]">
          <Link href="/terms" className="font-semibold hover:text-[#F5A62A]">
            Syarat &amp; Ketentuan →
          </Link>
          <Link href="/contact" className="font-semibold hover:text-[#F5A62A]">
            Kontak Kami →
          </Link>
        </div>
      </div>
    </div>
  );
}
