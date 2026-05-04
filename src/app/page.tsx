import Link from "next/link";
import { CourseCard } from "@/components/course-card";
import { CourseThumbnail } from "@/components/course-thumbnail";
import { PartnerLogos } from "@/components/partner-logos";
import { HeroLearning } from "@/components/illustrations/hero-learning";
import { CTACommunity } from "@/components/illustrations/cta-community";
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
  const featuredCourses = allCourses.filter((course) => course.featured).slice(0, 3);
  const spotlightCourse = featuredCourses[0];

  return (
    <div>
      {/* HERO - Split Layout with Illustration */}
      <section className="mx-auto w-full max-w-7xl px-6 pb-16 pt-16 lg:pb-24 lg:pt-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left: Text */}
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/5 px-4 py-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-300 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-300" />
              </span>
              <p className="text-xs font-semibold tracking-[0.2em] text-amber-300">
                Future-ready IT learning
              </p>
            </div>

            <h1 className="text-5xl font-semibold leading-tight text-white md:text-6xl lg:text-7xl">
              Course IT yang rapi,{" "}
              <span className="bg-gradient-to-r from-orange-400 to-yellow-300 bg-clip-text text-transparent">
                built for industry
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
              Kaalupi menggabungkan learning path, instructor dashboard, payment
              ready checkout, dan akses materi berbasis role.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/courses"
                className="rounded-full bg-gradient-to-r from-orange-500 to-yellow-400 px-8 py-3.5 text-sm font-semibold text-slate-950 shadow-[0_0_24px_rgba(249,115,22,0.3)] transition hover:shadow-[0_0_32px_rgba(249,115,22,0.4)]"
              >
                Explore Courses
              </Link>
              <Link
                href="/login"
                className="rounded-full border border-white/12 px-8 py-3.5 text-sm text-white transition hover:border-white/25 hover:bg-white/5"
              >
                Login Dashboard
              </Link>
            </div>

            {/* Mini stats under CTA */}
            <div className="mt-10 flex items-center gap-8">
              {stats.slice(0, 3).map((item) => (
                <div key={item.label}>
                  <p className="text-2xl font-semibold text-white">{item.value}</p>
                  <p className="text-xs text-slate-500">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Illustration */}
          <div className="relative hidden lg:block">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-yellow-400/10 rounded-3xl blur-3xl" />
            <HeroLearning />
          </div>
        </div>
      </section>

      {/* Partner Logos */}
      <PartnerLogos />

      {/* How It Works */}
      <section className="border-t border-white/5">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-300">
              How It Works
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-white">
              4 langkah mulai belajar
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {howItWorks.map((step, index) => (
              <div key={step.step} className="relative">
                {/* Connector line */}
                {index < howItWorks.length - 1 && (
                  <div className="absolute right-0 top-12 hidden h-px w-6 -translate-y-1/2 bg-gradient-to-r from-transparent to-white/10 lg:block" />
                )}
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-white/15 hover:bg-white/[0.08]">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500/20 to-yellow-400/20">
                    <svg className="h-6 w-6 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={step.icon} />
                    </svg>
                  </div>
                  <div className="mb-2 text-xs font-bold text-amber-300/60">Step {step.step}</div>
                  <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="border-t border-white/5">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-300">
              Why Kaalupi
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-white">
              Bukan cuma nonton video
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {valueProps.map((item, index) => (
              <div
                key={item}
                className="group flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-white/15 hover:bg-white/[0.08]"
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500/20 to-yellow-400/20 text-amber-300">
                  {index + 1}
                </div>
                <p className="pt-1 text-sm leading-7 text-slate-300">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="border-t border-white/5">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-300">
                Featured Courses
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-white md:text-4xl">
                Paket belajar unggulan
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
                Jalur karier IT yang paling dicari dengan kurikulum terstruktur.
              </p>
            </div>
            <Link
              href="/courses"
              className="hidden items-center gap-2 rounded-full border border-white/12 px-5 py-2.5 text-sm text-white transition hover:border-white/25 hover:bg-white/5 md:flex"
            >
              View all
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {featuredCourses.map((course) => (
              <CourseCard key={course.slug} course={course} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Course Spotlight */}
      {spotlightCourse && (
        <section className="border-t border-white/5">
          <div className="mx-auto max-w-7xl px-6 py-16">
            <div className="grid overflow-hidden rounded-3xl border border-white/10 bg-white/5 lg:grid-cols-2">
              {/* Left: Thumbnail */}
              <div className="relative">
                <CourseThumbnail
                  title={spotlightCourse.title}
                  category={spotlightCourse.category}
                  className="h-full min-h-[300px]"
                />
              </div>

              {/* Right: Content */}
              <div className="p-8 md:p-12">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-gradient-to-r from-orange-500 to-yellow-400 px-3 py-1 text-xs font-bold text-slate-950">
                    Featured
                  </span>
                  <span className="rounded-full bg-white/8 px-3 py-1 text-xs text-slate-300">
                    {spotlightCourse.category}
                  </span>
                </div>

                <h2 className="mt-4 text-3xl font-semibold text-white md:text-4xl">
                  {spotlightCourse.title}
                </h2>

                <p className="mt-4 text-base leading-7 text-slate-300">
                  {spotlightCourse.hero}
                </p>

                <div className="mt-6 space-y-3">
                  {spotlightCourse.outcomes.slice(0, 3).map((outcome, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500/20 mt-0.5">
                        <svg className="h-3 w-3 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="text-sm text-slate-300">{outcome}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Link
                    href={`/courses/${spotlightCourse.slug}`}
                    className="rounded-full bg-gradient-to-r from-orange-500 to-yellow-400 px-6 py-3 text-sm font-semibold text-slate-950 shadow-[0_0_24px_rgba(249,115,22,0.3)]"
                  >
                    Lihat Detail Course
                  </Link>
                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    <span>{spotlightCourse.duration}</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-lg font-semibold text-amber-300">
                      Rp {spotlightCourse.price.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Audience Tracks */}
      <section className="border-t border-white/5">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-300">
              Career Tracks
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-white">
              Pilih jalur karirmu
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {audienceTracks.map((track, index) => (
              <article
                key={track.title}
                className="group rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-white/15 hover:bg-white/[0.08]"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500/20 to-yellow-400/20 text-amber-300">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    {index === 0 && <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />}
                    {index === 1 && <path strokeLinecap="round" strokeLinejoin="round" d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M13 12a1 1 0 11-2 0 1 1 0 012 0z" />}
                    {index === 2 && <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />}
                    {index === 3 && <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />}
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white">{track.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-400">{track.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-t border-white/5">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-300">
              Social Proof
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-white">
              Apa kata mereka
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((item) => (
              <article
                key={item.name}
                className="rounded-2xl border border-white/10 bg-white/5 p-6"
              >
                <div className="mb-4 flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} className="h-4 w-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm leading-7 text-slate-300">&ldquo;{item.quote}&rdquo;</p>
                <div className="mt-6 flex items-center gap-3 border-t border-white/10 pt-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-yellow-400 text-xs font-bold text-slate-950">
                    {item.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{item.name}</p>
                    <p className="text-xs text-slate-400">{item.role}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Blog */}
      <section className="border-t border-white/5">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-300">
                Latest Articles
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-white">
                Insight seputar belajar IT
              </h2>
            </div>
            <Link
              href="/blog"
              className="hidden items-center gap-2 rounded-full border border-white/12 px-5 py-2.5 text-sm text-white transition hover:border-white/25 hover:bg-white/5 md:flex"
            >
              Go to blog
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {blogPosts.slice(0, 3).map((post) => (
              <article
                key={post.slug}
                className="group rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-white/15 hover:bg-white/[0.08]"
              >
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span className="rounded-full bg-white/5 px-2.5 py-1 text-amber-300">
                    {post.category}
                  </span>
                  <span>{new Date(post.date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</span>
                </div>
                <h3 className="mt-4 text-xl font-semibold text-white group-hover:text-amber-200 transition">
                  {post.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-400">{post.excerpt}</p>
                <Link
                  href={`/blog/${post.slug}`}
                  className="mt-6 inline-flex items-center gap-2 text-sm text-white transition hover:text-amber-300"
                >
                  Read article
                  <svg className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section with Illustration */}
      <section className="border-t border-white/5">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-orange-500/10 via-yellow-400/5 to-transparent">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(249,115,22,0.15),_transparent_50%)]" />

            <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto]">
              {/* Text */}
              <div className="p-8 md:p-12">
                <h2 className="text-3xl font-semibold text-white md:text-4xl">
                  Siap naik level?
                </h2>
                <p className="mt-4 max-w-xl text-base leading-8 text-slate-300">
                  Mulai dari course yang paling relevan dengan karirmu sekarang. Akses materi terstruktur,
                  instructor berpengalaman, dan komunitas yang supportif.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link
                    href="/courses"
                    className="rounded-full bg-gradient-to-r from-orange-500 to-yellow-400 px-8 py-3.5 text-sm font-semibold text-slate-950 shadow-[0_0_24px_rgba(249,115,22,0.3)] transition hover:shadow-[0_0_32px_rgba(249,115,22,0.4)]"
                  >
                    Mulai Sekarang
                  </Link>
                  <Link
                    href="/about"
                    className="rounded-full border border-white/12 px-8 py-3.5 text-sm text-white transition hover:border-white/25 hover:bg-white/5"
                  >
                    Pelajari Lebih Lanjut
                  </Link>
                </div>
              </div>

              {/* Illustration */}
              <div className="hidden w-80 lg:block">
                <CTACommunity />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
