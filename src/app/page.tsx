import Link from "next/link";
import Script from "next/script";
import { CourseThumbnail } from "@/components/course-thumbnail";
import { audienceTracks, blogPosts, stats, testimonials, valueProps, siteConfig } from "@/lib/data";
import { getCourses } from "@/lib/content";

// Vercel deploy trigger - updated 2026-05-04

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

// UTM builder helper
function withUTM(path: string, content: string) {
  const params = new URLSearchParams({
    utm_source: "kaalupi",
    utm_medium: "website",
    utm_campaign: "landing_page",
    utm_content: content,
  });
  return `${path}?${params.toString()}`;
}

export default async function HomePage() {
  const allCourses = await getCourses();
  const spotlightCourse =
    allCourses.find((c) => c.slug === "ai-untuk-pemula") ??
    allCourses.find((c) => c.featured) ??
    allCourses[0];

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "Kaalupi",
    description: siteConfig.description,
    url: "https://kaalupi.vercel.app",
    logo: "https://kaalupi.vercel.app/logo_kaalupi.png",
    sameAs: [
      "https://instagram.com/kaalupi",
      "https://tiktok.com/@kaalupi",
      "https://youtube.com/@kaalupi",
    ],
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "IDR",
      description: "Free AI untuk Pemula course",
    },
    hasCourse: [
      {
        "@type": "Course",
        name: "AI untuk Pemula — Dari Nol ke Produktif",
        description: "Pelajari cara kerja AI, prompt engineering, dan cara pakai AI untuk produktivitas",
        provider: { "@type": "Organization", name: "Kaalupi" },
        courseMode: "online",
        isAccessibleForFree: true,
      },
      {
        "@type": "Course",
        name: "Fullstack Web Engineer",
        description: "Belajar React, Next.js, API, database, auth, testing, dan deployment",
        provider: { "@type": "Organization", name: "Kaalupi" },
        courseMode: "online",
        isAccessibleForFree: false,
        price: "2490000",
        priceCurrency: "IDR",
      },
    ],
  };

  return (
    <div className="bg-[#FEFBF5]">
      {/* JSON-LD Structured Data */}
      <Script
        id="json-ld"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ─── HERO ─── */}
      <section className="mx-auto w-full max-w-7xl px-6 pb-16 pt-12 lg:pb-24 lg:pt-20">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#F0E8D8] bg-[#FFF3D6] px-4 py-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#F5A62A] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#F5A62A]" />
            </span>
            <p className="text-xs font-bold tracking-[0.2em] text-[#5C4813]">
              AI-FIRST CAREER PLATFORM
            </p>
          </div>

          {/* H1: Transformation Hook */}
          <h1 className="text-4xl font-extrabold leading-tight text-[#2D5016] md:text-5xl lg:text-6xl">
            Dari Nol Jadi{" "}
            <span className="text-[#F5A62A]">AI Specialist</span> dalam 3 Bulan
          </h1>

          {/* Subheadline */}
          <p className="mt-6 max-w-2xl mx-auto text-lg leading-8 text-[#444444]">
            Course IT pertama di Indonesia yang mengintegrasikan{" "}
            <strong className="text-[#2D5016]">AI tools ke setiap project</strong>.
            Bahasa Indonesia, langsung praktik, portofolio nyata.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href={withUTM("/waitlist", "hero_waitlist_earlybird")}
              className="rounded-xl bg-[#F5A62A] px-8 py-3.5 text-sm font-bold text-[#2D5016] shadow-md transition hover:opacity-90"
            >
              Daftar Waitlist Early Bird →
            </Link>
            <Link
              href={withUTM("/courses/ai-untuk-pemula", "hero_try_free")}
              className="rounded-xl border-2 border-[#2D5016] px-8 py-3.5 text-sm font-bold text-[#2D5016] transition hover:bg-[#2D5016] hover:text-[#FEFBF5]"
            >
              Coba Gratis Dulu
            </Link>
          </div>

          {/* Trust Signals */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-[#444444]">
            <span className="flex items-center gap-1">
              <svg className="h-4 w-4 text-[#7AB648]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Gratis untuk pemula
            </span>
            <span className="flex items-center gap-1">
              <svg className="h-4 w-4 text-[#7AB648]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Sertifikat resmi
            </span>
            <span className="flex items-center gap-1">
              <svg className="h-4 w-4 text-[#7AB648]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Garansi uang kembali 14 hari
            </span>
          </div>

          {/* Stats */}
          <div className="mt-14 grid grid-cols-2 gap-6 md:flex md:flex-wrap md:justify-center md:gap-x-12 md:gap-y-6">
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

      {/* ─── VALUE PROPS (Outcome-Based) ─── */}
      <section className="border-t border-[#F0E8D8] bg-[#FEFBF5]">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#7AB648]">
              Kenapa Kaalupi
            </p>
            <h2 className="mt-3 text-3xl font-extrabold text-[#2D5016]">
              Bukan cuma nonton, langsung kepake di kerjaan
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75z",
                title: "AI Terintegrasi",
                desc: "Setiap course wajib pakai AI tools. Portofolio kamu bakal showcase skill AI yang emang dicari industri sekarang.",
              },
              {
                icon: "M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z",
                title: "Project Nyata, Bukan Demo",
                desc: "Tiap modul ada output yang bisa masuk portofolio. Ngga cuma belajar teori, tapi bikin produk yang bisa ditunjukin ke recruiter.",
              },
              {
                icon: "M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714a2.25 2.25 0 00.659 1.591L19 14.5M14.25 3.104c.251.023.501.05.75.082M19 14.5l-1.209 4.836A2.25 2.25 0 0115.594 21H8.406a2.25 2.25 0 01-2.197-1.664L4.75 14.5m0 0l-1.5-6L10.5 7.5m2.25-4.5l7.25 3.5-7.25 3.5M12 12.75v3.75m-3-3.75h6",
                title: "Mentor Berpengalaman",
                desc: "Dibimbing sama practitioner yang emang lagi kerja di industri. Bukan akademisi yang teori doang, tapi orang lapangan.",
              },
              {
                icon: "M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42",
                title: "Lifetime Access + Update",
                desc: "Sekali beli, akses selamanya. Plus dapet update gratis seumur hidup kalau ada teknologi baru yang perlu dipelajari.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="rounded-2xl border border-[#F0E8D8] bg-white p-6 transition hover:border-[#F5A62A] hover:shadow-sm"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#FFF3D6]">
                  <svg className="h-6 w-6 text-[#F5A62A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-[#2D5016]">{item.title}</h3>
                <p className="mt-2 text-sm leading-7 text-[#444444]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SOCIAL PROOF / TESTIMONIALS ─── */}
      <section className="border-t border-[#F0E8D8] bg-[#FEFBF5]">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#7AB648]">
              Testimoni
            </p>
            <h2 className="mt-3 text-3xl font-extrabold text-[#2D5016]">
              Produk mereka berubah setelah belajar di sini
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((item) => (
              <div
                key={item.name}
                className="rounded-2xl border border-[#F0E8D8] bg-white p-6 transition hover:border-[#F5A62A] hover:shadow-sm"
              >
                <svg className="h-8 w-8 text-[#F5A62A]/40" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="mt-4 text-sm leading-7 text-[#444444] italic">"{item.quote}"</p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FFF3D6] font-bold text-[#F5A62A]">
                    {item.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#2D5016]">{item.name}</p>
                    <p className="text-xs text-[#444444]">{item.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SPOTLIGHT: AI UNTUK PEMULA (FREE) ─── */}
      {spotlightCourse && (
        <section className="border-t border-[#F0E8D8] bg-[#FEFBF5]">
          <div className="mx-auto max-w-7xl px-6 py-16">
            <div className="mx-auto mb-8 max-w-2xl text-center">
              <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#7AB648]">
                Free Anchor Course
              </p>
              <h2 className="mt-3 text-3xl font-extrabold text-[#2D5016] md:text-4xl">
                Mulai Gratis, Upgrade Kapan Aja
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[#444444]">
                Coba dulu gratis. Pas udah yakin, lanjut ke course premium dengan AI tutor penuh + sertifikat resmi.
              </p>
            </div>

            <div className="overflow-hidden rounded-3xl border border-[#F0E8D8] bg-white lg:grid lg:grid-cols-2">
              {/* Thumbnail */}
              <div className="relative w-full min-h-[250px] md:min-h-[300px]">
                <CourseThumbnail
                  title={spotlightCourse.title}
                  category={spotlightCourse.category}
                  className="h-full w-full object-cover"
                  large={true}
                />
              </div>

              {/* Content */}
              <div className="flex flex-col justify-center p-8 md:p-12">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="rounded-full bg-[#7AB648] px-3 py-1 text-xs font-bold text-white">
                    GRATIS
                  </span>
                  <span className="rounded-full bg-[#FFF3D6] px-3 py-1 text-xs font-semibold text-[#5C4813]">
                    {spotlightCourse.category}
                  </span>
                  <span className="rounded-full bg-[#FFF3D6] px-3 py-1 text-xs font-semibold text-[#5C4813]">
                    {spotlightCourse.level}
                  </span>
                  <span className="rounded-full bg-[#FFF3D6] px-3 py-1 text-xs font-semibold text-[#5C4813]">
                    {spotlightCourse.duration}
                  </span>
                </div>

                <h2 className="mt-4 text-2xl font-extrabold text-[#2D5016] md:text-3xl">
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
                  <Link
                    href={withUTM(`/courses/${spotlightCourse.slug}`, "spotlight_start_free")}
                    className="rounded-xl bg-[#F5A62A] px-8 py-3 text-sm font-bold text-[#2D5016] transition hover:opacity-90"
                  >
                    Mulai Belajar Gratis →
                  </Link>
                  <Link
                    href={withUTM("/waitlist", "spotlight_waitlist_paid")}
                    className="rounded-xl border-2 border-[#2D5016] px-8 py-3 text-sm font-bold text-[#2D5016] transition hover:bg-[#2D5016] hover:text-[#FEFBF5]"
                  >
                    Waitlist Paid Course
                  </Link>
                </div>
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
              Pilih jalur yang sesuai sama target kamu
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {audienceTracks.map((track, index) => (
              <article
                key={track.title}
                className="group rounded-2xl border border-[#F0E8D8] bg-white p-6 transition hover:border-[#F5A62A] hover:shadow-sm"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#FFF3D6] text-[#F5A62A]">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    {index === 0 && <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />}
                    {index === 1 && <path strokeLinecap="round" strokeLinejoin="round" d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M13 12a1 1 0 11-2 0 1 1 0 012 0z" />}
                    {index === 2 && <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />}
                    {index === 3 && <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />}
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-[#2D5016] group-hover:text-[#F5A62A] transition">{track.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#444444]">{track.description}</p>
                <Link
                  href={withUTM("/courses", `track_${track.title.toLowerCase().replace(/\s+/g, '_')}`)}
                  className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#2D5016] transition hover:text-[#F5A62A]"
                >
                  Lihat course
                  <svg className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ─── BLOG / INSIGHTS ─── */}
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
                  href={withUTM(`/blog/${post.slug}`, `blog_${post.slug}`)}
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

      {/* ─── FINAL CTA ─── */}
      <section className="border-t border-[#F0E8D8] bg-[#FEFBF5]">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="relative overflow-hidden rounded-3xl border border-[#F0E8D8] bg-[#2D5016] p-8 md:p-12 text-center">
            {/* Decorative circles */}
            <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#F5A62A]/10" />
            <div className="absolute -left-16 -bottom-16 h-48 w-48 rounded-full bg-[#7AB648]/10" />

            <h2 className="relative text-3xl font-extrabold text-white md:text-4xl">
              Masih Ragu? Coba Gratis Dulu
            </h2>
            <p className="relative mt-4 max-w-xl mx-auto text-base leading-8 text-white/80">
              Ngapain beli kalau belum yakin? Coba course <strong>AI untuk Pemula</strong> gratis.
              Pas udah ngerasa cocok, lanjut ke track lainnya. Garansi uang kembali 14 hari.
            </p>
            <div className="relative mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href={withUTM("/courses/ai-untuk-pemula", "cta_start_free")}
                className="rounded-xl bg-[#F5A62A] px-8 py-3.5 text-sm font-bold text-[#2D5016] transition hover:opacity-90"
              >
                Mulai Gratis Sekarang →
              </Link>
              <Link
                href={withUTM("/waitlist", "cta_waitlist_paid")}
                className="rounded-xl border-2 border-white/40 px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Daftar Waitlist Paid
              </Link>
            </div>
            <p className="relative mt-6 text-xs text-white/50">
              Tanpa kartu kredit • Langsung akses • Garansi 14 hari
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
