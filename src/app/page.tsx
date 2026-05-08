import Link from "next/link";
import Script from "next/script";
import { auth } from "@clerk/nextjs/server";
import { CourseThumbnail } from "@/components/course-thumbnail";
import { FoundingSlotCounter } from "@/components/founding-slot-counter";
import { FounderIllustration } from "@/components/founder-illustration";
import { audienceTracks, blogPosts, stats, siteConfig, founders } from "@/lib/data";
import { getCourses } from "@/lib/content";

import { OnboardingModal } from "@/components/onboarding-modal";

// Vercel deploy trigger - updated 2026-05-04

const howItWorks = [
  {
    step: "01",
    title: "Pilih Course",
    description: "Jelajahi katalog dan pilih course yang sesuai dengan jalur kariermu.",
  },
  {
    step: "02",
    title: "Checkout & Bayar",
    description: "Proses pembayaran aman via Midtrans dengan berbagai metode bayar.",
  },
  {
    step: "03",
    title: "Akses Materi",
    description: "Setelah pembayaran dikonfirmasi, materi langsung bisa diakses.",
  },
  {
    step: "04",
    title: "Belajar & Naik Level",
    description: "Ikuti modul step by step, track progress, dan bangun portofolio.",
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
  const { userId } = await auth();
  const isSignedIn = !!userId;

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "Kaalupi",
    description: siteConfig.description,
    url: "https://kaalupi.vercel.app",
    logo: "https://kaalupi.vercel.app/logo_kaalupi.png",
    sameAs: [
      siteConfig.community.instagram,
      siteConfig.community.youtube,
      siteConfig.community.discord,
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
    ],
  };

  return (
    <div className="bg-[#FEFBF5]">
      {/* Onboarding Modal for guests */}
      <OnboardingModal />

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
              AI-FIRST CAREER PLATFORM · INDONESIA
            </p>
          </div>

          <h1 className="text-4xl font-extrabold leading-tight text-[#2D5016] md:text-5xl lg:text-6xl">
            Manfaatin <span className="text-[#F5A62A]">AI</span> buat capai target hidup lu
          </h1>

          <p className="mt-6 max-w-2xl mx-auto text-lg leading-8 text-[#444444]">
            Belajar pakai AI buat hemat waktu kerja, bantu bisnis, naikin skill —
            atau apapun yang lagi lu kejar. Bahasa Indonesia, langsung praktik, pace lu sendiri.
          </p>

          {/* SINGLE PRIMARY CTA — clear direction */}
          <div className="mt-10 flex flex-col items-center gap-3">
            <Link
              href={withUTM(isSignedIn ? "/dashboard" : "/register", "hero_primary")}
              className="group inline-flex items-center gap-2 rounded-2xl bg-[#F5A62A] px-8 py-4 text-base font-extrabold text-[#2D5016] shadow-lg transition hover:opacity-90 hover:shadow-xl"
            >
              {isSignedIn ? "Buka Dashboard" : "Daftar Gratis & Mulai Belajar"}
              <span className="transition group-hover:translate-x-1">→</span>
            </Link>
            {!isSignedIn && (
              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-[#5C4813]">
                <Link
                  href={withUTM("/courses/ai-untuk-pemula", "hero_secondary_free")}
                  className="font-semibold underline-offset-4 transition hover:text-[#F5A62A] hover:underline"
                >
                  Lihat course gratis →
                </Link>
                <span className="text-[#F0E8D8]">·</span>
                <Link
                  href="/login"
                  className="font-semibold underline-offset-4 transition hover:text-[#F5A62A] hover:underline"
                >
                  Sudah punya akun? Masuk
                </Link>
              </div>
            )}
          </div>

          {/* Founding slot counter — social proof */}
          <div className="mt-6 max-w-md mx-auto">
            <FoundingSlotCounter slug="ai-untuk-pemula-mastery" variant="inline" />
          </div>

          {/* Trust Signals — honest & spesifik */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-[#444444]">
            {[
              "Daftar gratis, ngga butuh data bayar",
              "Belajar pace lu sendiri",
              "Sertifikat PDF setelah selesai",
              "Akses lifetime untuk Founding Members",
            ].map((item) => (
              <span key={item} className="flex items-center gap-1">
                <svg className="h-4 w-4 text-[#7AB648]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {item}
              </span>
            ))}
          </div>

          {/* Stats */}
          <div className="mt-14 grid grid-cols-2 gap-6 md:flex md:flex-wrap md:justify-center md:gap-x-12 md:gap-y-6">
            {stats.map((item) => (
              <div key={item.label} className="text-center">
                <p className="text-2xl font-extrabold text-[#2D5016]">
                  {item.value}
                  {item.suffix && <span className="ml-1 text-sm font-bold text-[#5C4813]">{item.suffix}</span>}
                </p>
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

          {/* Horizontal timeline */}
          <div className="relative">
            {/* Connecting line */}
            <div className="absolute left-0 top-8 hidden h-0.5 w-full bg-[#F0E8D8] md:block" />
            <div className="absolute left-0 top-8 hidden h-0.5 w-full bg-[#F5A62A] md:block" />

            <div className="grid gap-8 md:grid-cols-4 md:gap-6 stagger-children">
              {howItWorks.map((step) => (
                <div key={step.step} className="relative flex flex-col items-center text-center group cursor-pointer hover-lift">
                  {/* Step number circle - consistent amber color */}
                  <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full border-4 border-[#F5A62A] bg-[#F5A62A] text-white text-lg font-extrabold transition-all group-hover:scale-110 group-hover:shadow-lg">
                    {step.step}
                  </div>

                  <h3 className="mt-4 text-base font-bold text-[#2D5016] group-hover:text-[#F5A62A] transition-colors">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#444444] max-w-[200px]">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── VALUE PROPS (Outcome-Based) ─── */}
      <section className="border-t border-[#F0E8D8] bg-white relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute -right-20 top-20 h-72 w-72 rounded-full bg-[#F5A62A]/5" />
        <div className="absolute -left-20 bottom-20 h-96 w-96 rounded-full bg-[#7AB648]/5" />

        <div className="mx-auto max-w-7xl px-6 py-16 relative">
          <div className="mx-auto mb-12 max-w-2xl text-center animate-fade-in-up">
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#7AB648]">
              Kenapa Kaalupi
            </p>
            <h2 className="mt-3 text-3xl font-extrabold text-[#2D5016]">
              Bukan cuma nonton, langsung kepake di kerjaan
            </h2>
          </div>

          {/* Featured: AI Terintegrasi */}
          <div className="mb-6 rounded-2xl border-2 border-[#F5A62A] bg-[#FFF3D6] p-8 hover-lift cursor-pointer group">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl bg-[#F5A62A] group-hover:scale-110 transition-transform">
                <svg className="h-8 w-8 text-[#2D5016]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75z" />
                </svg>
              </div>
              <div>
                <span className="inline-block rounded-full bg-[#F5A62A] px-3 py-1 text-xs font-bold text-[#2D5016] mb-2">
                  FLAGSHIP
                </span>
                <h3 className="text-xl font-extrabold text-[#2D5016]">AI Terintegrasi di Setiap Project</h3>
                <p className="mt-2 text-base leading-7 text-[#5C4813]">
                  Setiap course wajib pakai AI tools. Portofolio kamu bakal showcase skill AI yang emang dicari industri sekarang.
                </p>
              </div>
            </div>
          </div>

          {/* Other three value props - consistent styling */}
          <div className="grid gap-6 md:grid-cols-3 stagger-children">
            <div className="group rounded-2xl border border-[#F0E8D8] bg-white p-6 hover-lift cursor-pointer">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#FFF3D6] group-hover:bg-[#F5A62A] transition-colors">
                <svg className="h-6 w-6 text-[#5C4813] group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-[#2D5016] group-hover:text-[#F5A62A] transition-colors">Project Nyata, Bukan Demo</h3>
              <p className="mt-2 text-sm leading-7 text-[#444444]">
                Tiap modul ada output yang bisa masuk portofolio. Ngga cuma belajar teori, tapi bikin produk yang bisa ditunjukin ke recruiter.
              </p>
            </div>

            <div className="group rounded-2xl border border-[#F0E8D8] bg-white p-6 hover-lift cursor-pointer">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#FFF3D6] group-hover:bg-[#F5A62A] transition-colors">
                <svg className="h-6 w-6 text-[#5C4813] group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714a2.25 2.25 0 00.659 1.591L19 14.5M14.25 3.104c.251.023.501.05.75.082M19 14.5l-1.209 4.836A2.25 2.25 0 0115.594 21H8.406a2.25 2.25 0 01-2.197-1.664L4.75 14.5m0 0l-1.5-6L10.5 7.5m2.25-4.5l7.25 3.5-7.25 3.5M12 12.75v3.75m-3-3.75h6" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-[#2D5016] group-hover:text-[#F5A62A] transition-colors">Mentor Berpengalaman</h3>
              <p className="mt-2 text-sm leading-7 text-[#444444]">
                Dibimbing sama practitioner yang emang lagi kerja di industri. Bukan akademisi yang teori doang, tapi orang lapangan.
              </p>
            </div>

            <div className="group rounded-2xl border border-[#F0E8D8] bg-white p-6 hover-lift cursor-pointer">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#FFF3D6] group-hover:bg-[#F5A62A] transition-colors">
                <svg className="h-6 w-6 text-[#5C4813] group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-[#2D5016] group-hover:text-[#F5A62A] transition-colors">Lifetime Access + Update</h3>
              <p className="mt-2 text-sm leading-7 text-[#444444]">
                Sekali beli, akses selamanya. Plus dapet update gratis seumur hidup kalau ada teknologi baru yang perlu dipelajari.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOUNDER TEAM (TRUST SIGNAL) ─── */}
      <section className="border-t border-[#F0E8D8] bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#7AB648]">
              Tim Founding
            </p>
            <h2 className="mt-3 text-3xl font-extrabold text-[#2D5016] md:text-4xl">
              Dibangun langsung sama praktisi
            </h2>
            <p className="mt-4 text-base leading-7 text-[#444444]">
              4 orang yang lagi kerja di lapangan — bukan akademisi yang teori doang. Tiap track dipegang sama orang yang emang jago di bidangnya.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {founders.map((founder) => (
              <article
                key={founder.name}
                className="group relative overflow-hidden rounded-2xl border-2 border-[#F0E8D8] bg-white p-6 transition hover:border-[#F5A62A] hover:shadow-lg"
              >
                <FounderIllustration
                  bg={founder.illustration.bg}
                  accent={founder.illustration.accent}
                  shape={founder.illustration.shape}
                />
                <h3 className="mt-5 text-lg font-extrabold text-[#2D5016] group-hover:text-[#F5A62A] transition">
                  {founder.name}
                </h3>
                <p className="mt-1 text-xs font-bold uppercase tracking-wider text-[#7AB648]">
                  {founder.role}
                </p>
                <p className="mt-3 text-sm leading-6 text-[#444]">{founder.bio}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {founder.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-[#FFF3D6] px-2.5 py-0.5 text-[10px] font-bold text-[#5C4813]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ─── KOMUNITAS (Discord + WA + Notion) ─── */}
      <section className="border-t border-[#F0E8D8] bg-[#1A2E0A] relative overflow-hidden">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#F5A62A]/10" />
        <div className="absolute -left-32 -bottom-32 h-80 w-80 rounded-full bg-[#7AB648]/10" />

        <div className="mx-auto max-w-7xl px-6 py-16 relative">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#F5A62A]">
              Komunitas
            </p>
            <h2 className="mt-3 text-3xl font-extrabold text-white md:text-4xl">
              Belajar Bareng,{" "}
              <span className="text-[#F5A62A]">Ga Sendirian</span>
            </h2>
            <p className="mt-4 text-base leading-7 text-white/80">
              Gabung komunitas Founding Members. Tanya jawab, sharing project, dapet feedback langsung dari tim Kaalupi.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <a
              href={siteConfig.community.discord}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col rounded-2xl border-2 border-white/10 bg-white/5 p-7 transition hover:border-[#F5A62A] hover:bg-white/10"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#5865F2]/20 text-[#5865F2]">
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09c-.01-.02-.04-.03-.07-.03c-1.5.26-2.93.71-4.27 1.33c-.01 0-.02.01-.03.02c-2.72 4.07-3.47 8.03-3.1 11.95c0 .02.01.04.03.05c1.8 1.32 3.53 2.12 5.24 2.65c.03.01.06 0 .07-.02c.4-.55.76-1.13 1.07-1.74c.02-.04 0-.08-.04-.09c-.57-.22-1.11-.48-1.64-.78c-.04-.02-.04-.08-.01-.11c.11-.08.22-.17.33-.25c.02-.02.05-.02.07-.01c3.44 1.57 7.15 1.57 10.55 0c.02-.01.05-.01.07.01c.11.09.22.17.33.26c.04.03.04.09-.01.11c-.52.31-1.07.56-1.64.78c-.04.01-.05.06-.04.09c.32.61.68 1.19 1.07 1.74c.03.01.06.02.09.01c1.72-.53 3.45-1.33 5.25-2.65c.02-.01.03-.03.03-.05c.44-4.53-.73-8.46-3.1-11.95c-.01-.01-.02-.02-.04-.02zM8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.84 2.12-1.89 2.12zm6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.83 2.12-1.89 2.12z" />
                </svg>
              </div>
              <h3 className="mt-4 text-xl font-extrabold text-white">Discord Server</h3>
              <p className="mt-2 flex-1 text-sm leading-6 text-white/70">
                Channel diskusi per topik, voice room mingguan, AMA dengan founder, sharing project.
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-[#F5A62A] transition group-hover:gap-2">
                Gabung Discord →
              </span>
            </a>

            <a
              href={siteConfig.community.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col rounded-2xl border-2 border-white/10 bg-white/5 p-7 transition hover:border-[#F5A62A] hover:bg-white/10"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#25D366]/20 text-[#25D366]">
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M17.6 6.32A7.85 7.85 0 0 0 12.05 4c-4.34 0-7.87 3.53-7.87 7.87c0 1.39.36 2.74 1.05 3.94L4.11 20l4.3-1.13a7.93 7.93 0 0 0 3.64.93h.01c4.34 0 7.87-3.53 7.87-7.87c0-2.1-.82-4.08-2.31-5.61zM12.05 18.45h-.01a6.5 6.5 0 0 1-3.31-.91l-.24-.14l-2.45.65l.65-2.39l-.16-.25a6.5 6.5 0 0 1-1-3.49c0-3.6 2.93-6.53 6.54-6.53c1.74 0 3.38.68 4.62 1.91s1.91 2.88 1.91 4.62c-.01 3.61-2.94 6.53-6.55 6.53zm3.59-4.89c-.2-.1-1.16-.57-1.34-.64c-.18-.07-.31-.1-.45.1c-.13.2-.51.64-.62.77c-.11.13-.23.15-.43.05c-.2-.1-.83-.31-1.59-.98c-.59-.52-.99-1.17-1.1-1.37c-.11-.2-.01-.31.09-.41c.09-.09.2-.23.3-.34c.1-.11.13-.2.2-.33c.07-.13.03-.25-.02-.35c-.05-.1-.45-1.09-.62-1.49c-.16-.39-.33-.34-.45-.34h-.39c-.13 0-.35.05-.53.25s-.7.68-.7 1.66s.71 1.93.81 2.06c.1.13 1.4 2.13 3.39 2.99c.47.2.85.32 1.14.41c.48.15.91.13 1.26.08c.38-.06 1.16-.47 1.33-.93c.16-.46.16-.85.12-.93c-.05-.08-.18-.13-.39-.23z" />
                </svg>
              </div>
              <h3 className="mt-4 text-xl font-extrabold text-white">WhatsApp Group</h3>
              <p className="mt-2 flex-1 text-sm leading-6 text-white/70">
                Update materi cepat, mini quiz harian, fast response untuk pertanyaan urgent dari mentor.
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-[#F5A62A] transition group-hover:gap-2">
                Gabung WhatsApp →
              </span>
            </a>
          </div>

          <div className="mt-10 text-center">
            <p className="text-sm text-white/60">
              Lihat aturan komunitas dulu?{" "}
              <Link href="/komunitas" className="font-bold text-[#F5A62A] hover:underline">
                Detail komunitas →
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* ─── 2-TIER COURSE COMPARISON ─── */}
      <section className="border-t border-[#F0E8D8] bg-[#FEFBF5]">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#7AB648]">
              Pilih Path Lu
            </p>
            <h2 className="mt-3 text-3xl font-extrabold text-[#2D5016] md:text-4xl">
              Mulai Gratis. <span className="text-[#F5A62A]">Naik Level Saat Lu Siap.</span>
            </h2>
            <p className="mt-4 text-base leading-7 text-[#444444]">
              Cobain Foundation gratis dulu. Pas siap, jadi Founding Member — 100 orang pertama
              dapet lifetime access ke <strong className="text-[#2D5016]">SEMUA course</strong> Kaalupi.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2 max-w-5xl mx-auto">
            {/* Foundation - Free */}
            <div className="rounded-3xl border-2 border-[#7AB648]/30 bg-white p-8 flex flex-col">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-[#7AB648] px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-white">
                  Foundation
                </span>
                <div className="text-right">
                  <p className="text-3xl font-black text-[#7AB648]">Gratis</p>
                </div>
              </div>
              <h3 className="mt-4 text-xl font-extrabold text-[#2D5016]">
                AI untuk Pemula — Foundation
              </h3>
              <p className="mt-2 text-sm text-[#444444]">
                Pahami AI dari nol — cara kerjanya, cara nge-prompt yang bener. Cocok buat warming up.
              </p>
              <ul className="mt-5 space-y-2.5 text-sm text-[#444] flex-1">
                {[
                  "2 modul singkat — pace lu sendiri",
                  "Akses langsung tanpa daftar tunggu",
                  "Materi video + artikel",
                  "Komunitas Discord terbuka",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <svg className="h-4 w-4 flex-shrink-0 text-[#7AB648] mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={withUTM("/courses/ai-untuk-pemula", "comparison_free")}
                className="mt-6 block rounded-xl border-2 border-[#7AB648] bg-white px-6 py-3 text-center text-sm font-bold text-[#7AB648] hover:bg-[#7AB648] hover:text-white transition"
              >
                Mulai Gratis →
              </Link>
            </div>

            {/* Mastery - Paid */}
            <div className="relative rounded-3xl border-2 border-[#F5A62A] bg-gradient-to-br from-[#FFF3D6] to-white p-8 flex flex-col shadow-xl mt-3">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 rounded-full bg-[#2D5016] px-4 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-[#F5A62A] shadow-md">
                Most Recommended
              </div>
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-[#F5A62A] px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-[#2D5016]">
                  Mastery
                </span>
                <div className="text-right">
                  <p className="text-xs text-[#444] line-through">Rp 299.000</p>
                  <p className="text-3xl font-black text-[#F5A62A]">Rp 149K</p>
                  <p className="text-[10px] font-bold text-[#7AB648]">Founding Members</p>
                </div>
              </div>
              <h3 className="mt-4 text-xl font-extrabold text-[#2D5016]">
                AI untuk Pemula — Mastery
              </h3>
              <p className="mt-2 text-sm text-[#444444]">
                Founding Members 100 orang pertama dapet lifetime access ke <strong>SEMUA course Kaalupi</strong> — sekarang & yang akan rilis.
              </p>
              <ul className="mt-5 space-y-2.5 text-sm text-[#444] flex-1">
                {[
                  "Lifetime access ke SEMUA course Kaalupi",
                  "5 modul lengkap — pace lu sendiri",
                  "AI Tutor 24/7 (tanya bebas per modul)",
                  "Discord eksklusif Founding Members",
                  "Sertifikat resmi + LinkedIn share",
                  "Badge Founding Member permanen",
                  "Update materi gratis selamanya",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <svg className="h-4 w-4 flex-shrink-0 text-[#F5A62A] mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <FoundingSlotCounter slug="ai-untuk-pemula-mastery" variant="inline" />
              <Link
                href={withUTM("/courses/ai-untuk-pemula-mastery", "comparison_paid")}
                className="mt-4 block rounded-xl bg-[#F5A62A] px-6 py-3 text-center text-sm font-extrabold text-[#2D5016] hover:opacity-90 shadow-md transition"
              >
                Daftar Founding Members →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SPOTLIGHT: AI UNTUK PEMULA (FREE) ─── */}
      {spotlightCourse && (
        <section className="border-t border-[#F0E8D8] bg-[#FEFBF5] relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute -right-20 top-20 h-80 w-80 rounded-full bg-[#F5A62A]/10" />
          <div className="absolute -left-20 bottom-20 h-96 w-96 rounded-full bg-[#7AB648]/10" />

          <div className="mx-auto max-w-7xl px-6 py-16 relative">
             <div className="mx-auto mb-10 max-w-2xl text-center animate-fade-in-up">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#F5A62A] px-4 py-1.5">
                  <span className="text-xs font-black uppercase tracking-[0.2em] text-[#2D5016]">Free Anchor Course</span>
                </div>
                <h2 className="mt-3 text-3xl font-extrabold text-[#2D5016] md:text-4xl lg:text-5xl">
                  Mulai Gratis,<br /><span className="text-[#F5A62A]">Upgrade Kapan Aja</span>
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-7 text-[#444444]">
                  Coba course <strong className="text-[#2D5016]">AI untuk Pemula</strong> gratis dulu — ngga ada catch.
                  Pas udah ngerasa cocok, jadi Founding Member buat akses semua course.
                </p>
              </div>

            <div className="overflow-hidden rounded-3xl border-2 border-[#F5A62A]/20 bg-white shadow-xl lg:grid lg:grid-cols-2 hover-lift">
              {/* Thumbnail */}
               <div className="relative min-h-[300px] md:min-h-[400px]">
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
                  <span className="rounded-full bg-[#7AB648] px-4 py-1.5 text-xs font-bold text-white">
                    GRATIS
                  </span>
                  <span className="rounded-full bg-[#FFF3D6] px-3 py-1 text-xs font-semibold text-[#5C4813]">
                    {spotlightCourse.category}
                  </span>
                  <span className="rounded-full bg-[#FFF3D6] px-3 py-1 text-xs font-semibold text-[#5C4813]">
                    {spotlightCourse.level}
                  </span>
                  <span className="rounded-full bg-[#FFF3D6] px-3 py-1 text-xs font-semibold text-[#5C4813]">
                    {spotlightCourse.modules.length} modul
                  </span>
                </div>

                <h2 className="mt-6 text-2xl font-extrabold text-[#2D5016] md:text-3xl">
                  {spotlightCourse.title}
                </h2>

                <p className="mt-4 text-base leading-7 text-[#444444]">
                  {spotlightCourse.hero}
                </p>

                <div className="mt-6 space-y-4">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#7AB648]">Yang Akan Kamu Pelajari:</p>
                  {spotlightCourse.outcomes.slice(0, 3).map((outcome, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#7AB648] mt-0.5">
                        <svg className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="text-sm text-[#444444] leading-6">{outcome}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Link
                    href={withUTM(`/courses/${spotlightCourse.slug}`, "spotlight_start_free")}
                    className="rounded-xl bg-[#F5A62A] px-8 py-3.5 text-sm font-bold text-[#2D5016] shadow-md transition hover:opacity-90 hover:shadow-lg"
                  >
                    Mulai Belajar Gratis →
                  </Link>
                  <Link
                    href={withUTM("/courses/ai-untuk-pemula-mastery", "spotlight_upgrade_mastery")}
                    className="rounded-xl border-2 border-[#2D5016] px-8 py-3.5 text-sm font-bold text-[#2D5016] transition hover:bg-[#2D5016] hover:text-[#FEFBF5]"
                  >
                    Upgrade ke Mastery
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ─── AUDIENCE TRACKS ─── */}
      <section className="border-t border-[#F0E8D8] bg-[#FEFBF5] relative overflow-hidden">
        {/* Animated background decorations */}
        <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-[#F5A62A]/5 translate-x-1/2 -translate-y-1/2 animate-pulse" />
        <div className="absolute left-0 bottom-0 h-80 w-80 rounded-full bg-[#7AB648]/5 -translate-x-1/2 translate-y-1/2 animate-pulse" />
        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#F5A62A]/3 blur-3xl" />

        <div className="mx-auto max-w-7xl px-6 py-16 relative">
          <div className="mx-auto mb-12 max-w-2xl text-center animate-fade-in-up">
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#7AB648]">
              Jalur Karir
            </p>
            <h2 className="mt-3 text-3xl font-extrabold text-[#2D5016] md:text-4xl">
              Pilih jalur yang sesuai sama target kamu
            </h2>
            <p className="mt-4 text-base text-[#444444]">
              Setiap jalur dirancang khusus untuk kebutuhan karier yang berbeda
            </p>
          </div>

          {/* Interactive horizontal scroll container */}
          <div className="relative">
            {/* Gradient fade edges */}
            <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-12 bg-gradient-to-r from-[#FEFBF5] to-transparent md:hidden" />
            <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-12 bg-gradient-to-l from-[#FEFBF5] to-transparent md:hidden" />

            {/* Scrollable track on mobile, grid on desktop */}
            <div className="flex gap-6 overflow-x-auto pb-6 md:grid md:grid-cols-2 md:gap-6 md:overflow-visible lg:grid-cols-4 stagger-children scrollbar-hide">
              {audienceTracks.map((track, index) => (
                <article
                  key={track.title}
                  className="group relative min-w-[280px] overflow-hidden rounded-2xl border-2 border-[#F0E8D8] bg-white transition-all duration-300 hover:border-[#F5A62A] hover:shadow-xl cursor-pointer hover-lift md:min-w-0"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Colored top accent bar */}
                  <div className={`h-2 ${index % 4 === 0 ? 'bg-[#F5A62A]' : index % 4 === 1 ? 'bg-[#7AB648]' : index % 4 === 2 ? 'bg-[#2D5016]' : 'bg-[#5C4813]'}`} />

                  <div className="p-6">
                    {/* Icon with animated background */}
                    <div className="relative mb-4">
                      <div className={`absolute -left-2 -top-2 h-20 w-20 rounded-full blur-xl ${index % 4 === 0 ? 'bg-[#F5A62A]/20' : index % 4 === 1 ? 'bg-[#7AB648]/20' : index % 4 === 2 ? 'bg-[#2D5016]/20' : 'bg-[#5C4813]/20'} group-hover:scale-150 transition-transform duration-500`} />
                      <div className={`relative flex h-14 w-14 items-center justify-center rounded-xl ${index % 4 === 0 ? 'bg-[#F5A62A]/10' : index % 4 === 1 ? 'bg-[#7AB648]/10' : index % 4 === 2 ? 'bg-[#2D5016]/10' : 'bg-[#5C4813]/10'} group-hover:scale-110 transition-transform`}>
                        <svg className={`h-7 w-7 ${index % 4 === 0 ? 'text-[#F5A62A]' : index % 4 === 1 ? 'text-[#7AB648]' : index % 4 === 2 ? 'text-[#2D5016]' : 'text-[#5C4813]'} group-hover:text-[#F5A62A] transition-colors`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714a2.25 2.25 0 00.659 1.591L19 14.5" />
                        </svg>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <h3 className="text-lg font-extrabold text-[#2D5016] group-hover:text-[#F5A62A] transition-colors">{track.title}</h3>
                    </div>

                    {/* Animated Coming Soon badge */}
                    <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-[#F0E8D8] px-3 py-1">
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#F5A62A] opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-[#F5A62A]" />
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#444444]">
                        Coming Soon
                      </span>
                    </div>

                    <p className="text-sm leading-7 text-[#444444]">{track.description}</p>

                    <Link
                      href={withUTM("/notify", `track_${track.title.toLowerCase().replace(/\s+/g, '_')}`)}
                      className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#2D5016] transition hover:text-[#F5A62A] group-hover:gap-2"
                    >
                      Notifikasi Saat Rilis
                      <svg className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="mt-10 text-center">
            <p className="text-sm text-[#444444] mb-4">Gak yakin jalur mana yang cocok?</p>
            <Link
              href={withUTM("/contact", "track_consultation")}
              className="inline-flex items-center gap-2 rounded-xl border-2 border-[#2D5016] px-6 py-3 text-sm font-bold text-[#2D5016] transition hover:bg-[#2D5016] hover:text-[#FEFBF5]"
            >
              Konsultasi Gratis
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── BLOG / INSIGHTS ─── */}
      <section className="border-t border-[#F0E8D8] bg-[#FEFBF5] relative overflow-hidden">
        <div className="absolute right-10 top-10 h-64 w-64 rounded-full bg-[#7AB648]/5" />
        <div className="absolute left-10 bottom-10 h-48 w-48 rounded-full bg-[#F5A62A]/5" />

        <div className="mx-auto max-w-7xl px-6 py-16 relative">
          <div className="flex items-end justify-between gap-6 mb-10">
            <div className="animate-fade-in-up">
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

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {blogPosts.slice(0, 3).map((post) => (
              <article
                key={post.slug}
                className="group relative overflow-hidden rounded-2xl border-2 border-[#F0E8D8] bg-white transition hover:border-[#F5A62A] hover:shadow-lg"
              >
                <div className="relative p-6">
                  <div className="flex items-center gap-3 text-xs">
                    <span className="rounded-full bg-[#FFF3D6] px-2.5 py-1 font-semibold text-[#5C4813]">
                      {post.category}
                    </span>
                    <span className="text-[#444444]">
                      {new Date(post.date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                    </span>
                  </div>

                  <h3 className="mt-4 text-xl font-extrabold text-[#2D5016] transition group-hover:text-[#F5A62A]">
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
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="border-t border-[#F0E8D8] bg-[#FEFBF5]">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="relative overflow-hidden rounded-3xl border border-[#1A2E0A] bg-[#1A2E0A] p-8 md:p-12 text-center">
            {/* Decorative circles */}
            <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#F5A62A]/10" />
            <div className="absolute -left-16 -bottom-16 h-48 w-48 rounded-full bg-[#7AB648]/10" />

            <h2 className="relative text-3xl font-extrabold md:text-4xl" style={{ color: "#F5A62A" }}>
               Masih Ragu? Coba Gratis Dulu
             </h2>
            <p className="relative mt-4 max-w-xl mx-auto text-base leading-8" style={{color: 'white'}}>
              Ngga ada catch. Coba course <strong>AI untuk Pemula</strong> gratis dulu, lihat materinya, baru naik ke Founding Members.
            </p>
            <div className="relative mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href={withUTM("/courses/ai-untuk-pemula", "cta_start_free")}
                className="rounded-xl bg-[#F5A62A] px-8 py-3.5 text-sm font-bold text-[#2D5016] transition hover:opacity-90"
              >
                Mulai Gratis Sekarang →
              </Link>
              <Link
                href={withUTM("/courses/ai-untuk-pemula-mastery", "cta_upgrade_mastery")}
                className="rounded-xl border-2 border-white/40 px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Lihat Mastery
              </Link>
            </div>
            <p className="relative mt-6 text-xs text-white/70">
              Tanpa kartu kredit • Langsung akses • Garansi 14 hari
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
