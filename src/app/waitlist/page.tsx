"use client";

import { useState } from "react";
import Link from "next/link";

type FormState = {
  nama: string;
  email: string;
  whatsapp: string;
  tipe_user: string;
};

const initialForm: FormState = {
  nama: "",
  email: "",
  whatsapp: "",
  tipe_user: "",
};

export default function WaitlistPage() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = (await res.json()) as { success?: boolean; error?: string; message?: string };

      if (!res.ok) {
        setError(data.error ?? "Terjadi kesalahan. Coba lagi.");
        return;
      }

      setSuccess(true);
      setForm(initialForm);
    } catch {
      setError("Koneksi gagal. Cek internet kamu lalu coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#FEFBF5]">
      <div className="mx-auto max-w-lg px-6 py-16">
        {success ? (
          <div className="rounded-3xl border border-[#F0E8D8] bg-white p-10 text-center shadow-sm">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#FFF3D6] text-4xl">
              🎉
            </div>
            <h2 className="text-2xl font-extrabold text-[#2D5016]">Berhasil Terdaftar!</h2>
            <p className="mt-3 text-[#444444]">
              Kami akan menghubungi kamu via <strong>WhatsApp dan Email</strong> saat course dibuka.
            </p>
            <p className="mt-2 text-sm text-[#7AB648] font-semibold">
              Pantau WhatsApp dan email kamu ya! 📱
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <Link
                href="/courses"
                className="block rounded-xl bg-[#F5A62A] px-8 py-3 text-sm font-bold text-[#2D5016] hover:opacity-90 transition text-center"
              >
                Lihat Course Lainnya
              </Link>
              <Link
                href="/"
                className="block rounded-xl border-2 border-[#2D5016] px-8 py-3 text-sm font-semibold text-[#2D5016] hover:bg-[#2D5016] hover:text-white transition text-center"
              >
                Kembali ke Beranda
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-8 text-center">
              <Link href="/" className="inline-flex items-center gap-2 mb-6">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2D5016] font-black text-[#F5A62A]">K</div>
                <span className="font-extrabold text-[#2D5016]">Kaalupi</span>
              </Link>
              <h1 className="text-3xl font-extrabold text-[#2D5016]">
                Notifikasi Course Berikutnya
              </h1>
              <p className="mt-2 text-sm text-[#5C4813] leading-6">
                Dapet notifikasi pertama saat track <strong>App Developer, Data Science, atau AI Specialist</strong> rilis.
              </p>
              <div className="mt-4 rounded-xl bg-[#FFF3D6] px-4 py-3 text-xs text-[#5C4813] leading-5">
                💡 Course pertama udah live:{" "}
                <Link href="/courses/cyber-security-pemula" className="font-bold underline">
                  The Smart Vibe Coder (Web Dev bareng AI)
                </Link>{" "}
                — daftar sebagai Founding Member buat akses semua course.
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="rounded-3xl border border-[#F0E8D8] bg-white p-8 shadow-sm space-y-5"
            >
              <div>
                <label className="block text-sm font-bold text-[#2D5016] mb-1.5">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  name="nama"
                  value={form.nama}
                  onChange={handleChange}
                  required
                  placeholder="Budi Santoso"
                  className="w-full rounded-xl border border-[#F0E8D8] bg-[#FEFBF5] px-4 py-3 text-sm text-[#444444] outline-none focus:border-[#2D5016] focus:ring-2 focus:ring-[#2D5016]/10"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#2D5016] mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="budi@email.com"
                  className="w-full rounded-xl border border-[#F0E8D8] bg-[#FEFBF5] px-4 py-3 text-sm text-[#444444] outline-none focus:border-[#2D5016] focus:ring-2 focus:ring-[#2D5016]/10"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#2D5016] mb-1.5">
                  Nomor WhatsApp
                </label>
                <input
                  type="tel"
                  name="whatsapp"
                  value={form.whatsapp}
                  onChange={handleChange}
                  required
                  placeholder="081930045321"
                  className="w-full rounded-xl border border-[#F0E8D8] bg-[#FEFBF5] px-4 py-3 text-sm text-[#444444] outline-none focus:border-[#2D5016] focus:ring-2 focus:ring-[#2D5016]/10"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#2D5016] mb-1.5">
                  Saya adalah
                </label>
                <select
                  name="tipe_user"
                  value={form.tipe_user}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-[#F0E8D8] bg-[#FEFBF5] px-4 py-3 text-sm text-[#444444] outline-none focus:border-[#2D5016] focus:ring-2 focus:ring-[#2D5016]/10"
                >
                  <option value="" disabled>Pilih kategori...</option>
                  <option value="Mahasiswa">Mahasiswa</option>
                  <option value="Fresh Graduate">Fresh Graduate</option>
                  <option value="Karyawan">Karyawan</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              {error && (
                <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3">
                  <p className="text-sm text-red-600 font-medium">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-[#F5A62A] py-3.5 text-sm font-bold text-[#2D5016] transition hover:opacity-90 disabled:opacity-60"
              >
                {loading ? "Mendaftarkan..." : "Daftar Notifikasi →"}
              </button>

              <p className="text-center text-xs text-[#444444]">
                Tidak ada spam. Kamu bisa unsubscribe kapan saja.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
