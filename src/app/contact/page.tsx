"use client";

import { useState } from "react";
import { siteConfig } from "@/lib/data";

export default function ContactPage() {
  const [form, setForm] = useState({ nama: "", email: "", subjek: "", pesan: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          from: form.nama,
          email: form.email,
          subject: form.subjek,
          body: form.pesan,
        }),
      });

      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        setError(data.error ?? "Gagal mengirim pesan.");
        return;
      }

      setSuccess(true);
      setForm({ nama: "", email: "", subjek: "", pesan: "" });
    } catch {
      setError("Koneksi gagal. Cek internet kamu.");
    } finally {
      setLoading(false);
    }
  }

  const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${siteConfig.email}&su=Hello%20Kaalupi`;

  return (
    <div className="bg-[#FEFBF5] mx-auto max-w-7xl px-6 py-16">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#7AB648]">
          Kontak
        </p>
        <h1 className="mt-6 text-4xl font-extrabold text-[#2D5016] md:text-5xl">
          Ada pertanyaan atau mau{" "}
          <span className="text-[#F5A62A]">partnership?</span>
        </h1>
        <p className="mt-6 text-base leading-8 text-[#444444]">
          Kami terbuka untuk diskusi soal kebutuhan course, corporate training, atau kolaborasi konten.
          Hubungi kami kapan saja — kami selalu aktif.
        </p>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        {/* Info */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-[#F0E8D8] bg-white p-8">
            <h2 className="text-xl font-bold text-[#2D5016]">Info Kontak</h2>
            <div className="mt-6 space-y-5">
              {[
                {
                  icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
                  label: "Email",
                  value: siteConfig.email,
                  href: `https://mail.google.com/mail/?view=cm&fs=1&to=${siteConfig.email}`,
                },
                {
                  icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z",
                  label: "WhatsApp",
                  value: siteConfig.phone,
                  href: `https://wa.me/${siteConfig.phone.replace(/\D/g, "")}`,
                },
                {
                  icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z",
                  label: "Lokasi",
                  value: siteConfig.address,
                  href: null,
                },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#FFF3D6]">
                    <svg className="h-5 w-5 text-[#F5A62A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#2D5016]">{item.label}</p>
                    {item.href ? (
                      <a href={item.href} className="text-sm text-[#444444] hover:text-[#F5A62A] transition" target="_blank" rel="noreferrer">
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-sm text-[#444444]">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div className="rounded-2xl border border-[#F0E8D8] bg-[#E8F5E9] p-6">
            <h3 className="text-base font-bold text-[#2D5016]">Cara paling cepat:</h3>
            <div className="mt-4 space-y-3">
              <a
                href={`https://wa.me/${siteConfig.phone.replace(/\D/g, "")}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-xl border border-[#7AB648]/30 bg-white px-4 py-3 text-sm font-semibold text-[#2D5016] transition hover:border-[#7AB648] hover:shadow-sm"
              >
                <span className="text-lg">💬</span>
                Chat via WhatsApp
              </a>
              <a
                href={gmailLink}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-xl border border-[#F0E8D8] bg-white px-4 py-3 text-sm font-semibold text-[#2D5016] transition hover:border-[#F5A62A] hover:shadow-sm"
              >
                <span className="text-lg">📧</span>
                Kirim Email (Gmail)
              </a>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="rounded-2xl border border-[#F0E8D8] bg-white p-8">
          {success ? (
            <div className="text-center py-8">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#E8F5E9] text-3xl">
                ✅
              </div>
              <h2 className="text-xl font-bold text-[#2D5016]">Pesan Terkirim!</h2>
              <p className="mt-2 text-sm text-[#444444]">
                Kami akan balas via email dalam 1×24 jam.
              </p>
              <button
                onClick={() => setSuccess(false)}
                className="mt-6 rounded-xl border-2 border-[#2D5016] px-6 py-2.5 text-sm font-semibold text-[#2D5016] transition hover:bg-[#2D5016] hover:text-white"
              >
                Kirim Pesan Lain
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-bold text-[#2D5016]">Kirim Pesan</h2>
              <p className="mt-1 text-sm text-[#444444]">Kami akan balas via email dalam 1×24 jam.</p>
              <form
                onSubmit={handleSubmit}
                className="mt-6 grid gap-5"
              >
                <div>
                  <label className="mb-1.5 block text-sm font-bold text-[#2D5016]">Nama Lengkap</label>
                  <input
                    name="nama"
                    value={form.nama}
                    onChange={handleChange}
                    placeholder="Budi Santoso"
                    type="text"
                    required
                    className="w-full rounded-xl border border-[#F0E8D8] bg-[#FEFBF5] px-4 py-3 text-sm text-[#444444] outline-none transition focus:border-[#2D5016] focus:ring-2 focus:ring-[#2D5016]/10"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-bold text-[#2D5016]">Email</label>
                  <input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="budi@example.com"
                    type="email"
                    required
                    className="w-full rounded-xl border border-[#F0E8D8] bg-[#FEFBF5] px-4 py-3 text-sm text-[#444444] outline-none transition focus:border-[#2D5016] focus:ring-2 focus:ring-[#2D5016]/10"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-bold text-[#2D5016]">Subjek</label>
                  <input
                    name="subjek"
                    value={form.subjek}
                    onChange={handleChange}
                    placeholder="Partnership inquiry"
                    type="text"
                    required
                    className="w-full rounded-xl border border-[#F0E8D8] bg-[#FEFBF5] px-4 py-3 text-sm text-[#444444] outline-none transition focus:border-[#2D5016] focus:ring-2 focus:ring-[#2D5016]/10"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-bold text-[#2D5016]">Pesan</label>
                  <textarea
                    name="pesan"
                    value={form.pesan}
                    onChange={handleChange}
                    rows={5}
                    required
                    placeholder="Tulis kebutuhanmu di sini..."
                    className="w-full rounded-xl border border-[#F0E8D8] bg-[#FEFBF5] px-4 py-3 text-sm text-[#444444] outline-none transition focus:border-[#2D5016] focus:ring-2 focus:ring-[#2D5016]/10"
                  />
                </div>

                {error && (
                  <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3">
                    <p className="text-sm text-red-600 font-medium">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-[#F5A62A] px-5 py-3.5 text-sm font-bold text-[#2D5016] transition hover:opacity-90 disabled:opacity-60"
                >
                  {loading ? "Mengirim..." : "Kirim Pesan →"}
                </button>
              </form>
            </>
          )}
          <p className="mt-4 text-center text-xs text-[#444444]">
            Atau langsung WA ke <a href={`https://wa.me/${siteConfig.phone.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" className="font-semibold text-[#2D5016] hover:text-[#F5A62A]">{siteConfig.phone}</a>
          </p>
        </div>
      </div>
    </div>
  );
}
