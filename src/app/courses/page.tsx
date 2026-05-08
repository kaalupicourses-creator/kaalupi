import Link from "next/link";
import { CourseThumbnail } from "@/components/course-thumbnail";
import { FoundingSlotCounter } from "@/components/founding-slot-counter";
import { courses, comingSoonTracks } from "@/lib/data";

export default function CoursesPage() {
  const foundation = courses.find((c) => c.slug === "ai-untuk-pemula");
  const mastery = courses.find((c) => c.slug === "ai-untuk-pemula-mastery");

  return (
    <div className="bg-[#FEFBF5]">
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#7AB648]">
            Course Catalog
          </p>
          <h1 className="mt-4 text-4xl font-extrabold text-[#2D5016] md:text-5xl">
            Mulai Gratis,{" "}
            <span className="text-[#F5A62A]">Naik Level Saat Siap</span>
          </h1>
          <p className="mt-6 text-base leading-8 text-[#444444]">
            Cobain Foundation gratis dulu. Kalau cocok, lanjut ke Mastery — slot Founding Members terbatas 100 spot pertama.
          </p>
        </div>
      </section>

      {/* 2 Course Cards */}
      <section className="border-t border-[#F0E8D8]">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Foundation - Free */}
            {foundation && (
              <article className="overflow-hidden rounded-3xl border-2 border-[#7AB648]/30 bg-white flex flex-col">
                <div className="relative">
                  <CourseThumbnail title={foundation.title} category={foundation.category} large />
                  <div className="absolute top-4 left-4 rounded-full bg-[#7AB648] px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-white">
                    🆓 Foundation
                  </div>
                </div>
                <div className="p-8 flex flex-col flex-1">
                  <div className="flex items-center gap-2 flex-wrap text-xs">
                    <span className="rounded-full bg-[#FFF3D6] px-3 py-1 font-semibold text-[#5C4813]">
                      {foundation.level}
                    </span>
                    <span className="rounded-full bg-[#FFF3D6] px-3 py-1 font-semibold text-[#5C4813]">
                      {foundation.duration}
                    </span>
                    <span className="rounded-full bg-[#FFF3D6] px-3 py-1 font-semibold text-[#5C4813]">
                      {foundation.modules.length} modul
                    </span>
                  </div>
                  <h2 className="mt-4 text-2xl font-extrabold text-[#2D5016]">
                    {foundation.title}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-[#444444]">{foundation.summary}</p>

                  <ul className="mt-5 space-y-2 text-sm flex-1">
                    {foundation.outcomes.map((o, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <svg
                          className="h-4 w-4 flex-shrink-0 text-[#7AB648] mt-0.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={3}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-[#444]">{o}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 flex items-center justify-between">
                    <span className="text-3xl font-black text-[#7AB648]">Gratis</span>
                  </div>
                  <Link
                    href={`/courses/${foundation.slug}`}
                    className="mt-4 block w-full rounded-xl border-2 border-[#7AB648] bg-white px-6 py-3 text-center text-sm font-bold text-[#7AB648] hover:bg-[#7AB648] hover:text-white transition"
                  >
                    Mulai Belajar Gratis →
                  </Link>
                </div>
              </article>
            )}

            {/* Mastery - Paid Founding Members */}
            {mastery && (
              <article className="overflow-hidden rounded-3xl border-2 border-[#F5A62A] bg-gradient-to-br from-[#FFF3D6] to-white flex flex-col relative shadow-xl">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 rounded-full bg-[#2D5016] px-4 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#F5A62A]">
                  ⭐ Most Recommended
                </div>
                <div className="relative">
                  <CourseThumbnail title={mastery.title} category={mastery.category} large />
                  <div className="absolute top-4 left-4 rounded-full bg-[#F5A62A] px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-[#2D5016]">
                    💎 Mastery
                  </div>
                </div>
                <div className="p-8 flex flex-col flex-1">
                  <div className="flex items-center gap-2 flex-wrap text-xs">
                    <span className="rounded-full bg-[#FFF3D6] px-3 py-1 font-semibold text-[#5C4813]">
                      {mastery.level}
                    </span>
                    <span className="rounded-full bg-[#FFF3D6] px-3 py-1 font-semibold text-[#5C4813]">
                      {mastery.duration}
                    </span>
                    <span className="rounded-full bg-[#FFF3D6] px-3 py-1 font-semibold text-[#5C4813]">
                      {mastery.modules.length} modul
                    </span>
                  </div>
                  <h2 className="mt-4 text-2xl font-extrabold text-[#2D5016]">{mastery.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-[#444444]">{mastery.summary}</p>

                  <ul className="mt-5 space-y-2 text-sm flex-1">
                    {(mastery.perks ?? []).map((p, i) => (
                      <li key={i} className="text-[#444]">
                        {p}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 flex items-end justify-between">
                    <div>
                      <p className="text-xs text-[#444] line-through">
                        Rp {(mastery.original_price ?? 299000).toLocaleString("id-ID")}
                      </p>
                      <span className="text-3xl font-black text-[#F5A62A]">
                        Rp {mastery.price.toLocaleString("id-ID")}
                      </span>
                      <p className="text-[10px] font-bold text-[#7AB648]">
                        Founding Members Price
                      </p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <FoundingSlotCounter slug={mastery.slug} variant="inline" />
                  </div>

                  <Link
                    href={`/courses/${mastery.slug}`}
                    className="mt-4 block w-full rounded-xl bg-[#F5A62A] px-6 py-3 text-center text-sm font-extrabold text-[#2D5016] hover:opacity-90 shadow-md transition"
                  >
                    Daftar Founding Members →
                  </Link>
                </div>
              </article>
            )}
          </div>
        </div>
      </section>

      {/* Coming Soon Tracks */}
      <section className="border-t border-[#F0E8D8] bg-white">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="mx-auto mb-8 max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#7AB648]">
              Coming Soon
            </p>
            <h2 className="mt-3 text-2xl font-extrabold text-[#2D5016]">
              Track Berikutnya — Notifikasi Saat Rilis
            </h2>
            <p className="mt-3 text-sm text-[#444444]">
              Daftar email kami buat dapet notifikasi saat track baru rilis.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {comingSoonTracks.map((track) => (
              <div
                key={track.title}
                className="rounded-2xl border border-[#F0E8D8] bg-[#FEFBF5] p-5"
              >
                <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-[#F0E8D8] px-2.5 py-0.5">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#F5A62A] opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-[#F5A62A]" />
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#444]">
                    Coming Soon
                  </span>
                </div>
                <p className="font-bold text-[#2D5016]">{track.title}</p>
                <p className="mt-1 text-xs text-[#444]">{track.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/waitlist"
              className="inline-block rounded-xl border-2 border-[#2D5016] px-8 py-3 text-sm font-bold text-[#2D5016] transition hover:bg-[#2D5016] hover:text-[#FEFBF5]"
            >
              Notifikasi Saat Track Baru Rilis →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
