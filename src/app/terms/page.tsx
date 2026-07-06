import Link from "next/link";
import type { Metadata } from "next";
import { siteConfig } from "@/lib/data";

export const metadata: Metadata = {
  title: "Syarat & Ketentuan",
  description: "Syarat dan ketentuan penggunaan platform Kaalupi.",
};

export default function TermsPage() {
  return (
    <div className="bg-[#FEFBF5] min-h-screen">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm font-semibold text-[#5C4813] hover:text-[#F5A62A] mb-8"
        >
          ← Beranda
        </Link>

        <h1 className="text-4xl font-extrabold text-[#2D5016]">Syarat &amp; Ketentuan</h1>
        <p className="mt-2 text-sm text-[#5C4813]">
          Terakhir diperbarui: 19 Mei 2026
        </p>

        <div className="mt-10 space-y-8 text-sm leading-7 text-[#444]">
          <section>
            <h2 className="text-xl font-extrabold text-[#2D5016] mb-3">1. Penerimaan Syarat</h2>
            <p>
              Dengan mendaftar dan menggunakan platform Kaalupi (kaalupi.vercel.app), kamu setuju
              tunduk pada syarat ini. Kalau kamu nggak setuju, jangan dipakai.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-extrabold text-[#2D5016] mb-3">2. Akun &amp; Akses</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Akun Kaalupi bersifat personal. Dilarang dibagikan, dijual, atau dipinjamkan.</li>
              <li>Kamu bertanggung jawab menjaga kerahasiaan login. Aktivitas dari akun kamu dianggap dilakukan oleh kamu.</li>
              <li>Kalau lupa password, reset via fitur Clerk yang tersedia.</li>
              <li>Akses course bersifat lifetime selama platform Kaalupi aktif. Founding Members
                dapat akses lifetime ke semua course (sekarang &amp; yang akan rilis).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-extrabold text-[#2D5016] mb-3">3. Pembayaran</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Pembayaran dilakukan manual via DANA / BCA / BSI.</li>
              <li>Akses course aktif setelah admin Kaalupi memverifikasi dana masuk.
                Verifikasi biasanya &lt; 1 jam jam kerja.</li>
              <li>Kalau dana belum masuk dalam 24 jam dan kamu yakin udah transfer, hubungi
                WhatsApp Admin: <strong>+62 812-9398-8757</strong>.</li>
              <li>Harga Founding Members (Rp 149.000) berlaku untuk 100 orang pertama yang
                kami konfirmasi. Setelah quota habis, harga balik ke Rp 299.000.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-extrabold text-[#2D5016] mb-3">4. Refund Policy</h2>
            <p>
              Kaalupi adalah course digital. Begitu akses diberikan, materi nggak bisa di-rollback.
              Karena itu kami nggak kasih refund umum untuk &quot;ngga puas&quot;.
            </p>
            <p className="mt-3">
              <strong>Pengecualian — refund 100%:</strong>
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>Masalah teknis dari sisi kami yang bikin kamu nggak bisa akses sama sekali
                selama lebih dari 7 hari.</li>
              <li>Pembayaran ganda (double charge) yang terbukti.</li>
              <li>Course belum di-deliver (videos &amp; materials masih kosong) dalam 30 hari
                setelah pembayaran.</li>
            </ul>
            <p className="mt-3">
              Pengajuan refund via email{" "}
              <a href={`mailto:${siteConfig.email}`} className="text-[#F5A62A] underline">
                {siteConfig.email}
              </a>{" "}
              dengan subjek &quot;Refund Request — [order ID]&quot;. Diproses dalam 7 hari kerja.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-extrabold text-[#2D5016] mb-3">5. Hak Cipta Konten</h2>
            <p>
              Semua materi course (video, artikel, kode, ilustrasi) milik Kaalupi atau pemberi
              lisensi. Kamu boleh akses untuk pembelajaran personal. <strong>Dilarang</strong>:
              re-upload, re-distribusi, screen-record full course untuk dijual ulang, atau
              mengambil ekstrak isi dengan tujuan komersial tanpa izin.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-extrabold text-[#2D5016] mb-3">6. Komunitas (Discord / WhatsApp)</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Hormati anggota lain. No racism, harassment, atau spam.</li>
              <li>Jangan jualan kompetitor / promosi platform lain di komunitas.</li>
              <li>Admin Kaalupi berhak kick / ban tanpa peringatan untuk pelanggaran berat.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-extrabold text-[#2D5016] mb-3">7. Perubahan Layanan</h2>
            <p>
              Kaalupi masih platform muda. Kami bisa update fitur, naikin / turunin harga
              future course, atau ubah copy. Akses course yang udah kamu beli ngga akan
              dicabut. Harga yang udah dibayar ngga akan ditagih ulang.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-extrabold text-[#2D5016] mb-3">8. Limitasi Tanggung Jawab</h2>
            <p>
              Kaalupi menyediakan course pembelajaran. Hasil belajar (skill, karier, bisnis)
              tergantung effort &amp; konsistensi kamu sendiri. Kami nggak janjiin job placement,
              gaji tertentu, atau hasil bisnis spesifik.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-extrabold text-[#2D5016] mb-3">9. Hukum yang Berlaku</h2>
            <p>
              Syarat ini tunduk pada hukum Republik Indonesia. Sengketa diselesaikan musyawarah;
              kalau ngga ketemu solusi, dilanjutkan via mekanisme hukum yang berlaku.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-extrabold text-[#2D5016] mb-3">10. Kontak</h2>
            <p>
              Pertanyaan tentang syarat ini? Email{" "}
              <a href={`mailto:${siteConfig.email}`} className="text-[#F5A62A] underline">
                {siteConfig.email}
              </a>{" "}
              atau WhatsApp <strong>{siteConfig.phone}</strong>.
            </p>
            <p className="mt-2">Alamat: {siteConfig.address}.</p>
          </section>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-[#F0E8D8] pt-6 text-xs text-[#5C4813]">
          <Link href="/privacy" className="font-semibold hover:text-[#F5A62A]">
            Kebijakan Privasi →
          </Link>
          <Link href="/contact" className="font-semibold hover:text-[#F5A62A]">
            Kontak Kami →
          </Link>
        </div>
      </div>
    </div>
  );
}
