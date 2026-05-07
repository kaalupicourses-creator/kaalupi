import Link from "next/link";
import Script from "next/script";
import { CourseThumbnail } from "@/components/course-thumbnail";
import { audienceTracks, blogPosts, stats, siteConfig } from "@/lib/data";
import { getCourses } from "@/lib/content";

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
            Dari Nol Jadi <span className="text-[#F5A62A]">AI Specialist</span> dalam 3 Bulan
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
              className="rounded-xl bg-[#F5A62A] px-8 py-3.5 text-sm font-bold text-[#2D5016] shadow-md transition hover:opacity-90 pulse-amber"
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

      {/* ─── BE THE FIRST TESTER ─── */}
      <section className="border-t border-[#F0E8D8] bg-[#FEFBF5]">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="mx-auto max-w-2xl text-center animate-fade-in-up">
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#7AB648]">
              First Launch
            </p>
            <h2 className="mt-3 text-3xl font-extrabold text-[#2D5016] md:text-4xl">
              Jadilah Tester Pertama Kaalupi
            </h2>
            <p className="mt-4 text-base leading-7 text-[#444444]">
              Kami baru meluncurkan course pertama kami. Daftar waitlist sekarang dan jadilah salah satu tester awal yang memberikan feedback untuk perkembangan platform kami.
            </p>
            <div className="mt-8">
              <Link
                href={withUTM("/waitlist", "be_first_tester")}
                className="rounded-xl bg-[#F5A62A] px-8 py-3.5 text-sm font-bold text-[#2D5016] shadow-md transition hover:opacity-90 hover:shadow-lg pulse-amber"
              >
                Daftar Waitlist & Jadi Tester Pertama →
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
                  Coba course <strong className="text-[#2D5016]">AI untuk Pemula</strong> gratis. Pas udah ngerasa cocok, lanjut ke track lainnya.
                  Garansi uang kembali 14 hari kalau nggak cocok.
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
                  <span className="rounded-full bg-[#FFF3D6] px-3 py-1 text-xs font-semibeld text-[#5C4813]">
                    {spotlightCourse.duration}
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
                    href={withUTM("/waitlist", "spotlight_waitlist_paid")}
                    className="rounded-xl border-2 border-[#2D5016] px-8 py-3.5 text-sm font-bold text-[#2D5016] transition hover:bg-[#2D5016] hover:text-[#FEFBF5]"
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
                      href={withUTM("/waitlist", `track_${track.title.toLowerCase().replace(/\s+/g, '_')}`)}
                      className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#2D5016] transition hover:text-[#F5A62A] group-hover:gap-2"
                    >
                      Daftar Waitlist
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
              href={withUTM("/waitlist", "track_consultation")}
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
            <p className="relative mt-6 text-xs text-white/70">
              Tanpa kartu kredit • Langsung akses • Garansi 14 hari
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
