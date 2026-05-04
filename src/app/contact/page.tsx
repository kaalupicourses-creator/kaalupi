import { siteConfig } from "@/lib/data";

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-300">
          Contact
        </p>
        <h1 className="mt-6 text-4xl font-semibold text-white md:text-5xl">
          Ada pertanyaan atau mau{" "}
          <span className="bg-gradient-to-r from-orange-400 to-yellow-300 bg-clip-text text-transparent">
            partnership?
          </span>
        </h1>
        <p className="mt-6 text-base leading-8 text-slate-400">
          Kami terbuka untuk diskusi soal kebutuhan course, corporate training, atau kolaborasi konten.
        </p>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        {/* Contact info */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
            <h2 className="text-xl font-semibold text-white">Info Kontak</h2>
            <div className="mt-6 space-y-5">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-amber-300/10">
                  <svg className="h-5 w-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Email</p>
                  <p className="text-sm text-slate-400">{siteConfig.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-amber-300/10">
                  <svg className="h-5 w-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Phone</p>
                  <p className="text-sm text-slate-400">{siteConfig.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-amber-300/10">
                  <svg className="h-5 w-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Address</p>
                  <p className="text-sm text-slate-400">{siteConfig.address}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-orange-500/10 to-yellow-400/5 p-8">
            <h3 className="text-lg font-semibold text-white">Jam Operasional</h3>
            <div className="mt-4 space-y-2 text-sm text-slate-400">
              <div className="flex justify-between">
                <span>Senin - Jumat</span>
                <span className="text-white">09:00 - 17:00 WIB</span>
              </div>
              <div className="flex justify-between">
                <span>Sabtu</span>
                <span className="text-white">09:00 - 13:00 WIB</span>
              </div>
              <div className="flex justify-between">
                <span>Minggu</span>
                <span>Libur</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
          <h2 className="text-xl font-semibold text-white">Kirim Pesan</h2>
          <form className="mt-6 grid gap-5">
            <div>
              <label className="mb-2 block text-sm text-slate-400">Nama Lengkap</label>
              <input
                placeholder="John Doe"
                className="w-full rounded-xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none transition focus:border-amber-300"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm text-slate-400">Email</label>
              <input
                placeholder="john@example.com"
                type="email"
                className="w-full rounded-xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none transition focus:border-amber-300"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm text-slate-400">Subjek</label>
              <input
                placeholder="Partnership inquiry"
                className="w-full rounded-xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none transition focus:border-amber-300"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm text-slate-400">Pesan</label>
              <textarea
                rows={5}
                placeholder="Tulis kebutuhanmu di sini..."
                className="w-full rounded-xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none transition focus:border-amber-300"
              />
            </div>
            <button
              type="button"
              className="w-full rounded-full bg-gradient-to-r from-orange-500 to-yellow-400 px-5 py-3.5 text-sm font-semibold text-slate-950 transition hover:opacity-90"
            >
              Send Inquiry
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
