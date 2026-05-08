"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";

export function OnboardingModal() {
  const { isSignedIn } = useAuth();
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Show after 3 seconds if not signed in and haven't seen it this session
    const hasSeen = sessionStorage.getItem("kaalupi_onboarding_seen");
    if (!isSignedIn && !hasSeen) {
      const timer = setTimeout(() => {
        setShow(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isSignedIn]);

  const handleClose = () => {
    setShow(false);
    sessionStorage.setItem("kaalupi_onboarding_seen", "true");
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2D5016]/40 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white p-8 shadow-2xl animate-scale-up">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 text-[#444] hover:text-[#2D5016]"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FFF3D6]">
            <span className="text-4xl">👋</span>
          </div>
          
          <h2 className="text-2xl font-extrabold text-[#2D5016]">
            Bingung Mau Mulai Dari Mana?
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[#444]">
            Jangan pusing! 90% member baru kami mulai dari course <strong className="text-[#F5A62A]">AI untuk Pemula (Gratis)</strong>.
          </p>

          <div className="mt-8 flex flex-col gap-3">
            <Link
              href="/courses/ai-untuk-pemula"
              onClick={handleClose}
              className="rounded-xl bg-[#F5A62A] py-4 text-sm font-bold text-[#2D5016] shadow-lg transition hover:opacity-90"
            >
              Mulai Course Gratis Sekarang →
            </Link>
            <Link
              href="/courses"
              onClick={handleClose}
              className="rounded-xl border-2 border-[#F0E8D8] py-3.5 text-sm font-bold text-[#444] transition hover:bg-[#F9F9F9]"
            >
              Lihat Katalog Lainnya
            </Link>
          </div>

          <p className="mt-6 text-xs text-[#999]">
            Belajar 100% online • Akses selamanya • Bahasa Indonesia
          </p>
        </div>
      </div>
    </div>
  );
}
