"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { siteConfig } from "@/lib/data";

interface DashboardOnboardingProps {
  userName: string;
  enrollmentsCount: number;
}

function readWelcomeFlag(): boolean {
  if (typeof window === "undefined") return false;
  return new URLSearchParams(window.location.search).get("welcome") === "true";
}

export function DashboardOnboarding({ userName, enrollmentsCount }: DashboardOnboardingProps) {
  const [showWelcome, setShowWelcome] = useState(readWelcomeFlag);

  useEffect(() => {
    if (!showWelcome) return;
    const timeout = setTimeout(() => setShowWelcome(false), 8000);
    return () => clearTimeout(timeout);
  }, [showWelcome]);

  if (enrollmentsCount > 0 && !showWelcome) return null;

  return (
    <>
      {/* Welcome toast — only shown right after onboarding finishes */}
      {showWelcome && (
        <div
          role="status"
          className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#7AB648]/40 bg-[#E8F5E9] p-4"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎉</span>
            <div>
              <p className="text-sm font-bold text-[#2D5016]">
                Mantap, {userName}! Lu udah resmi gabung.
              </p>
              <p className="text-xs text-[#5C4813]">
                Yuk mulai dari langkah pertama di bawah — daftar course & gabung komunitas.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowWelcome(false)}
            className="rounded-lg p-1.5 text-[#5C4813] hover:bg-white/60"
            aria-label="Tutup"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Getting Started Guide for users with no enrollments */}
      {enrollmentsCount === 0 && (
        <section className="mb-8 overflow-hidden rounded-2xl border-2 border-[#F5A62A] bg-[#FFF3D6] shadow-md animate-fade-in-up">
          <div className="flex flex-col lg:flex-row lg:items-stretch">
            <div className="flex-1 p-8">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#2D5016] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#F5A62A]">
                🚀 Getting Started
              </div>
              <h2 className="mt-4 text-2xl font-black text-[#2D5016]">
                Halo {userName}! 4 langkah pertama lu.
              </h2>
              <p className="mt-3 text-base leading-7 text-[#5C4813]">
                Akun lu udah siap. Ikutin urutan ini supaya ga keliatan bingung.
              </p>

              <div className="mt-6 space-y-3">
                <Link
                  href="/checkout/cyber-security-pemula"
                  className="flex items-start gap-4 rounded-xl border border-[#F5A62A]/40 bg-white/70 p-4 transition hover:border-[#F5A62A] hover:bg-white"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F5A62A] text-xs font-bold text-[#2D5016]">
                    1
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-[#2D5016]">Daftar Founding Member</p>
                    <p className="mt-0.5 text-sm text-[#5C4813]">
                      &quot;The Smart Vibe Coder&quot; — Web Dev bareng AI. Lifetime access ke SEMUA course Kaalupi.
                    </p>
                  </div>
                  <span className="text-sm font-bold text-[#F5A62A]">→</span>
                </Link>

                <a
                  href={siteConfig.community.discord}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 rounded-xl border border-[#F5A62A]/40 bg-white/70 p-4 transition hover:border-[#F5A62A] hover:bg-white"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F5A62A] text-xs font-bold text-[#2D5016]">
                    2
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-[#2D5016]">Gabung Discord</p>
                    <p className="mt-0.5 text-sm text-[#5C4813]">
                      Tempat tanya-jawab, sharing project, AMA mingguan dengan founder.
                    </p>
                  </div>
                  <span className="text-sm font-bold text-[#F5A62A]">→</span>
                </a>

                <Link
                  href="/courses"
                  className="flex items-start gap-4 rounded-xl border border-[#F5A62A]/40 bg-white/70 p-4 transition hover:border-[#F5A62A] hover:bg-white"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F5A62A] text-xs font-bold text-[#2D5016]">
                    3
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-[#2D5016]">Lihat Semua Course</p>
                    <p className="mt-0.5 text-sm text-[#5C4813]">
                      Cek roadmap course yang bakal rilis — Network, Design, dan lainnya.
                    </p>
                  </div>
                  <span className="text-sm font-bold text-[#F5A62A]">→</span>
                </Link>

                <Link
                  href="/dashboard/code-review"
                  className="flex items-start gap-4 rounded-xl border border-[#F5A62A]/40 bg-white/70 p-4 transition hover:border-[#F5A62A] hover:bg-white"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F5A62A] text-xs font-bold text-[#2D5016]">
                    4
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-[#2D5016]">Coba AI Code Review</p>
                    <p className="mt-0.5 text-sm text-[#5C4813]">
                      Tool gratis: paste kode lu, dapet feedback otomatis. Jadi bonus member.
                    </p>
                  </div>
                  <span className="text-sm font-bold text-[#F5A62A]">→</span>
                </Link>
              </div>
            </div>

            {/* Right visual */}
            <div className="hidden flex-col justify-center gap-3 bg-[#F5A62A] p-8 lg:flex lg:w-72 lg:shrink-0">
              <p className="text-xs font-bold uppercase tracking-wider text-[#2D5016]">
                Tip founder
              </p>
              <p className="text-sm font-bold leading-6 text-[#2D5016]">
                &ldquo;Belajar 30 menit per hari konsisten lebih jago dari 8 jam sekali doang. Pace lu sendiri, tapi konsisten.&rdquo;
              </p>
              <p className="text-xs text-[#2D5016]/70">— Kamil, Founder Kaalupi</p>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
