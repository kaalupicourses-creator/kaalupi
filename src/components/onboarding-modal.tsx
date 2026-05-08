"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { siteConfig } from "@/lib/data";

type Intent = "learn_free" | "join_mastery" | "explore" | null;

const intents: Array<{
  id: Intent;
  emoji: string;
  title: string;
  description: string;
  highlight?: string;
  href: string;
  cta: string;
  accent: string;
  bg: string;
}> = [
  {
    id: "learn_free",
    emoji: "🆓",
    title: "Saya pemula, mau coba dulu",
    description: "Belajar AI dari nol gratis — 2 modul, 3 jam, langsung akses tanpa kartu kredit.",
    highlight: "Paling Populer",
    href: "/register?intent=learn_free",
    cta: "Daftar Gratis & Mulai →",
    accent: "border-[#7AB648] text-[#2D5016]",
    bg: "bg-[#E8F5E9]",
  },
  {
    id: "join_mastery",
    emoji: "💎",
    title: "Saya mau lebih serius — Mastery",
    description: "Slot Founding Members 149K (normal 299K). Sertifikat, AI Tutor 24/7, Discord eksklusif.",
    highlight: "Slot Terbatas",
    href: "/register?intent=join_mastery",
    cta: "Daftar Founding Members →",
    accent: "border-[#F5A62A] text-[#2D5016]",
    bg: "bg-[#FFF3D6]",
  },
  {
    id: "explore",
    emoji: "🔍",
    title: "Lihat-lihat dulu",
    description: "Eksplor katalog, baca blog, gabung komunitas Discord/WhatsApp dulu sebelum daftar.",
    href: "/courses",
    cta: "Lihat Katalog Kursus →",
    accent: "border-[#F0E8D8] text-[#444]",
    bg: "bg-white",
  },
];

export function OnboardingModal() {
  const { isSignedIn, isLoaded } = useAuth();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;
    const dismissed = localStorage.getItem("kaalupi_intent_picked");
    if (!isSignedIn && !dismissed) {
      const timer = setTimeout(() => setShow(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [isLoaded, isSignedIn]);

  const handleClose = () => {
    setShow(false);
    localStorage.setItem("kaalupi_intent_picked", "true");
  };

  const handlePick = () => {
    localStorage.setItem("kaalupi_intent_picked", "true");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A2E0A]/60 backdrop-blur-sm animate-fade-in-up">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        <button
          onClick={handleClose}
          aria-label="Tutup"
          className="absolute right-4 top-4 z-10 rounded-full p-2 text-[#444] transition hover:bg-[#F0E8D8] hover:text-[#2D5016]"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="bg-gradient-to-br from-[#FFF3D6] to-white px-6 pt-8 pb-6 text-center sm:px-10 sm:pt-10">
          <div className="mx-auto mb-3 inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-bold text-[#5C4813]">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#F5A62A] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#F5A62A]" />
            </span>
            Selamat Datang di Kaalupi
          </div>
          <h2 className="text-2xl font-extrabold text-[#2D5016] sm:text-3xl">
            Apa tujuan kamu hari ini?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#5C4813] sm:text-base">
            Pilih satu — kami arahin ke jalur paling tepat. Cuma 5 detik.
          </p>
        </div>

        <div className="space-y-3 px-6 py-6 sm:px-10">
          {intents.map((intent) => (
            <Link
              key={intent.id}
              href={intent.href}
              onClick={handlePick}
              className={`group flex items-center gap-4 rounded-2xl border-2 ${intent.accent} ${intent.bg} p-4 transition hover:shadow-md sm:p-5`}
            >
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm sm:h-14 sm:w-14">
                {intent.emoji}
              </div>
              <div className="flex-1 text-left">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-extrabold text-[#2D5016] sm:text-base">{intent.title}</p>
                  {intent.highlight && (
                    <span className="rounded-full bg-[#F5A62A] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#2D5016]">
                      {intent.highlight}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs leading-5 text-[#5C4813] sm:text-sm">{intent.description}</p>
              </div>
              <span className="hidden text-xs font-bold text-[#F5A62A] transition group-hover:translate-x-1 sm:block">→</span>
            </Link>
          ))}
        </div>

        <div className="flex flex-col gap-3 border-t border-[#F0E8D8] bg-[#FEFBF5] px-6 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-10">
          <p className="text-xs text-[#5C4813]">
            Sudah punya akun?{" "}
            <Link href="/login" onClick={handleClose} className="font-bold text-[#F5A62A] hover:underline">
              Masuk di sini
            </Link>
          </p>
          <div className="flex items-center gap-3 text-xs font-semibold text-[#2D5016]">
            <span className="text-[#5C4813]">Komunitas:</span>
            <a href={siteConfig.community.discord} target="_blank" rel="noopener noreferrer" className="hover:text-[#F5A62A]">
              Discord
            </a>
            <span className="text-[#F0E8D8]">·</span>
            <a href={siteConfig.community.whatsapp} target="_blank" rel="noopener noreferrer" className="hover:text-[#F5A62A]">
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
