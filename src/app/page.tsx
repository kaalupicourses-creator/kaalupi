import Link from "next/link";
import { CourseThumbnail } from "@/components/course-thumbnail";
import { audienceTracks, blogPosts, stats, testimonials, valueProps } from "@/lib/data";
import { getCourses } from "@/lib/content";

const howItWorks = [
  {
    step: "01",
    title: "Pilih Course",
    description: "Jelajahi katalog dan pilih course yang sesuai dengan jalur kariermu.",
    icon: "M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z",
  },
  {
    step: "02",
    title: "Checkout & Bayar",
    description: "Proses pembayaran aman via Midtrans dengan berbagai metode bayar.",
    icon: "M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z",
  },
  {
    step: "03",
    title: "Akses Materi",
    description: "Setelah pembayaran dikonfirmasi, materi langsung bisa diakses.",
    icon: "M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z",
  },
  {
    step: "04",
    title: "Belajar & Naik Level",
    description: "Ikuti modul step by step, track progress, dan bangun portofolio.",
    icon: "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z",
  },
];

export default async function HomePage() {
  const allCourses = await getCourses();
  // Spotlight: tampilkan hanya AI untuk Pemula
  const spotlightCourse =
    allCourses.find((c) => c.slug === "ai-untuk-pemula") ??
    allCourses.find((c) => c.featured) ??
    allCourses[0];
  const featuredCourses = allCourses.filter((c) => c.featured).slice(0, 3);

  return (
    <div className="bg-[#FEFBF5]">
      {/* ─── HERO ─── */}
      <section className="mx-auto w-full max-w-7xl px-6 pb-16 pt-16 lg:pb-24 lg:pt-24">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#F0E8D8] bg-[#FFF3D6] px-4 py-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#F5A62A] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#F5A62A]" />
            </span>
            <p className="text-xs font-bold tracking-[0.2em] text-[#5C4813]">
              Platform Kursus IT Indonesia
            </p>
          </div>

          <h1 className="text-5xl font-extrabold leading-tight text-[#2D5016] md:text-6xl">
            Kuasai Skill IT yang{" "}
            <span className="text-[#F5A62A]">Dicari Industri</span>
          </h1>

          <p className="mt-6 max-w-2xl mx-auto text-lg leading-8 text-[#444444]">
            Kursus AI, Cyber Security, dan Networking dalam bahasa Indonesia —
            langsung praktik, langsung kepake.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/courses"
              className="rounded-xl bg-[#F5A62A] px-8 py-3.5 text-sm font-bold text-[#2D5016] shadow-md transition hover:opacity-90"
            >
              Lihat Course
            </Link>
            <Link
              href="/about"
              className="rounded-xl border-2 border-[#2D5016] px-8 py-3.5 text-sm font-bold text-[#2D5016] transition hover:bg-[#2D5016] hover:text-[#FEFBF5]"
            >
              Pelajari Lebih Lanjut
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-14 flex flex-wrap justify-center gap-x-12 gap-y-6">
            {stats.map((item) => (
              <div key={item.label} className="text-center">
                <p className="text-2xl font-extrabold text-[#2D5016]">{item.value}</p>
                <p className="mt-0.5 text-xs text-[#444444]">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="border-t border-[#F0E8D8] bg-[#FEFBF5]">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#7AB648]">
              Cara Belajar
            </p>
            <h2 className="mt-3 text-3xl font-extrabold text-[#2D5016]">
              4 langkah mulai belajar
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {howItWorks.map((step, index) => (
              <div key={step.step} className="relative">
                {index < howItWorks.length - 1 && (
                  <div className="absolute right-0 top-12 hidden h-px w-6 -translate-y-1/2 bg-[#F0E8D8] lg:block" />
                )}
                <div className="rounded-2xl border border-[#F0E8D8] bg-white p-6 transition hover:border-[#F5A62A] hover:shadow-sm">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#FFF3D6]">
                    <svg className="h-6 w-6 text-[#F5A62A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={step.icon} />
                    </svg>
                  </div>
                  <div className="mb-2 text-xs font-bold text-[#7AB648]">Step {step.step}</div>
                  <h3 className="text-lg font-bold text-[#2D5016]">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#444444]">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── VALUE PROPS ─── */}
      <section className="border-t border-[#F0E8D8] bg-[#FEFBF5]">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#7AB648]">
              Kenapa Kaalupi
            </p>
            <h2 className="mt-3 text-3xl font-extrabold text-[#2D5016]">
              Bukan cuma nonton video
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {valueProps.map((item, index) => (
              <div
                key={item}
                className="flex items-start gap-4 rounded-2xl border border-[#F0E8D8] bg-white p-6 transition hover:border-[#F5A62A] hover:shadow-sm"
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#FFF3D6] font-bold text-[#F5A62A]">
                  {index + 1}
                </div>
                <p className="pt-1 text-sm leading-7 text-[#444444]">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── COURSE AI UNTUK PEMULA ─── */}
      {spotlightCourse && (
        <section className="border-t border-[#F0E8D8] bg-[#FEFBF5]">
          <div className="mx-auto max-w-7xl px-6 py-16">
            <div className="mx-auto mb-8 max-w-2xl text-center">
              <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#7AB648]">
                Course Pertama Kami
              </p>
              <h2 className="mt-3 text-3xl font-extrabold text-[#2D5016] md:text-4xl">
                Segera Hadir
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[#444444]">
                Course pertama Kaalupi sedang dalam tahap persiapan. Daftar waitlist untuk dapat harga early bird eksklusif.
              </p>
            </div>

            <div className="grid overflow-hidden rounded-3xl border border-[#F0E8D8] bg-white lg:grid-cols-2">
              {/* Thumbnail */}
              <div className="relative">
                <CourseThumbnail
                  title={spotlightCourse.title}
                  category={spotlightCourse.category}
                  className="h-full min-h-[300px]"
                />
              </div>

              {/* Content */}
              <div className="p-8 md:p-12">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="rounded-full bg-[#F5A62A] px-3 py-1 text-xs font-bold text-[#2D5016]">
                    Segera Hadir
                  </span>
                  <span className="rounded-full bg-[#FFF3D6] px-3 py-1 text-xs font-semibold text-[#5C4813]">
                    {spotlightCourse.category}
                  </span>
                  <span className="rounded-full bg-[#FFF3D6] px-3 py-1 text-xs font-semibold text-[#5C4813]">
                    {spotlightCourse.level}
                  </span>
                </div>

                <h2 className="mt-4 text-3xl font-extrabold text-[#2D5016] md:text-4xl">
                  {spotlightCourse.title}
                </h2>

                <p className="mt-4 text-base leading-7 text-[#444444]">
                  {spotlightCourse.hero}
                </p>

                <div className="mt-6 space-y-3">
                  {spotlightCourse.outcomes.slice(0, 3).map((outcome, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#7AB648]/20 mt-0.5">
                        <svg className="h-3 w-3 text-[#7AB648]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="text-sm text-[#444444]">{outcome}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <div className="flex flex-col">
                    <span className="text-xl font-extrabold text-[#2D5016]">
                      Rp {spotlightCourse.price.toLocaleString("id-ID")}
                    </span>
                    <span className="text-xs text-[#444444] line-through">Rp 299.000</span>
                    <span className="text-xs text-[#7AB648] font-semibold">{spotlightCourse.duration}</span>
                  </div>
                </div>

                <Link
                  href="/waitlist"
                  className="mt-6 inline-block rounded-xl bg-[#F5A62A] px-8 py-3 text-sm font-bold text-[#2D5016] transition hover:opacity-90"
                >
                  Daftar Waitlist Early Bird →
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ─── AUDIENCE TRACKS ─── */}
      <section className="border-t border-[#F0E8D8] bg-[#FEFBF5]">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#7AB648]">
              Jalur Karir
            </p>
            <h2 className="mt-3 text-3xl font-extrabold text-[#2D5016]">
              Pilih jalur karirmu
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {audienceTracks.map((track, index) => (
              <article
                key={track.title}
                className="rounded-2xl border border-[#F0E8D8] bg-white p-6 transition hover:border-[#F5A62A] hover:shadow-sm"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#FFF3D6] text-[#F5A62A]">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    {index === 0 && <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />}
                    {index === 1 && <path strokeLinecap="round" strokeLinejoin="round" d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M13 12a1 1 0 11-2 0 1 1 0 012 0z" />}
                    {index === 2 && <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />}
                    {index === 3 && <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />}
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-[#2D5016]">{track.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#444444]">{track.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ─── AUDIENCE TRACKS ─── */}
      <section className="border-t border-[#F0E8D8] bg-[#FEFBF5]">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#7AB648]">
                Artikel Terbaru
              </p>
              <h2 className="mt-3 text-3xl font-extrabold text-[#2D5016]">
                Insight seputar belajar IT
              </h2>
            </div>
            <Link
              href="/blog"
              className="hidden items-center gap-2 rounded-full border-2 border-[#2D5016] px-5 py-2.5 text-sm font-semibold text-[#2D5016] transition hover:bg-[#2D5016] hover:text-[#FEFBF5] md:flex"
            >
              Ke Blog
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {blogPosts.slice(0, 3).map((post) => (
              <article
                key={post.slug}
                className="group rounded-2xl border border-[#F0E8D8] bg-white p-6 transition hover:border-[#F5A62A] hover:shadow-sm"
              >
                <div className="flex items-center gap-3 text-xs text-[#444444]">
                  <span className="rounded-full bg-[#FFF3D6] px-2.5 py-1 font-semibold text-[#5C4813]">
                    {post.category}
                  </span>
                  <span>{new Date(post.date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</span>
                </div>
                <h3 className="mt-4 text-xl font-bold text-[#2D5016] group-hover:text-[#F5A62A] transition">
                  {post.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[#444444]">{post.excerpt}</p>
                <Link
                  href={`/blog/${post.slug}`}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#2D5016] transition hover:text-[#F5A62A]"
                >
                  Baca artikel
                  <svg className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="border-t border-[#F0E8D8] bg-[#FEFBF5]">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="relative overflow-hidden rounded-3xl border border-[#F0E8D8] bg-[#2D5016] p-8 md:p-12 text-center">
            <h2 className="text-3xl font-extrabold text-white md:text-4xl">
              Siap naik level?
            </h2>
            <p className="mt-4 max-w-xl mx-auto text-base leading-8 text-white/80">
              Mulai dari course yang paling relevan dengan karirmu sekarang. Akses materi
              terstruktur, instructor berpengalaman, dan komunitas yang supportif.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/courses"
                className="rounded-xl bg-[#F5A62A] px-8 py-3.5 text-sm font-bold text-[#2D5016] transition hover:opacity-90"
              >
                Mulai Sekarang
              </Link>
              <Link
                href="/about"
                className="rounded-xl border-2 border-white/40 px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Pelajari Lebih Lanjut
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
