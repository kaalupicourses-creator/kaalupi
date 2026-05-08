"use client";

import Link from "next/link";

interface DashboardOnboardingProps {
  userName: string;
  enrollmentsCount: number;
}

export function DashboardOnboarding({ userName, enrollmentsCount }: DashboardOnboardingProps) {
  // If they have courses, we don't show the full onboarding, maybe just a smaller version
  if (enrollmentsCount > 0) return null;

  return (
    <section className="mb-8 overflow-hidden rounded-2xl border-2 border-[#F5A62A] bg-[#FFF3D6] shadow-md animate-fade-in-up">
      <div className="flex flex-col lg:flex-row lg:items-center">
        {/* Left Content */}
        <div className="flex-1 p-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#2D5016] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#F5A62A]">
            🚀 Getting Started Guide
          </div>
          <h2 className="mt-4 text-2xl font-black text-[#2D5016]">
            Halo {userName}! Yuk Mulai Langkah Pertama Kamu.
          </h2>
          <p className="mt-3 text-base leading-7 text-[#5C4813]">
            Akun kamu sudah siap. Sekarang saatnya memilih ilmu baru yang akan kamu pelajari. Kami merekomendasikan langkah berikut:
          </p>

          <div className="mt-8 space-y-4">
            <div className="flex items-start gap-4 rounded-xl bg-white/50 p-4 border border-[#F5A62A]/20">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F5A62A] text-xs font-bold text-[#2D5016]">
                1
              </div>
              <div>
                <p className="font-bold text-[#2D5016]">Pilih Course Gratis</p>
                <p className="mt-1 text-sm text-[#5C4813]">
                  Ambil course "AI untuk Pemula" untuk pemanasan. Gratis 100%.
                </p>
                <Link
                  href="/courses/ai-untuk-pemula"
                  className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-[#F5A62A] hover:underline"
                >
                  Ambil Course Gratis →
                </Link>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-xl bg-white/50 p-4 border border-[#F5A62A]/20 opacity-70">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F0E8D8] text-xs font-bold text-[#444]">
                2
              </div>
              <div>
                <p className="font-bold text-[#444]">Pelajari Modul Pertama</p>
                <p className="mt-1 text-sm text-[#444]">
                  Tonton video atau baca artikel di modul 1 untuk mulai progres kamu.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-xl bg-white/50 p-4 border border-[#F5A62A]/20 opacity-70">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F0E8D8] text-xs font-bold text-[#444]">
                3
              </div>
              <div>
                <p className="font-bold text-[#444]">Klaim Badge & Sertifikat</p>
                <p className="mt-1 text-sm text-[#444]">
                  Selesaikan course dan dapatkan badge serta sertifikat resmi.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Visual (optional/decorative) */}
        <div className="hidden lg:flex lg:h-full lg:w-72 lg:shrink-0 lg:items-center lg:justify-center bg-[#F5A62A] p-12 text-6xl">
          🎯
        </div>
      </div>
    </section>
  );
}
