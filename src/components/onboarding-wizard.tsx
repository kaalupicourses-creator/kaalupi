"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { completeOnboarding, skipOnboarding } from "@/app/actions/onboarding";

const goals = [
  {
    id: "career_change",
    icon: "🔄",
    title: "Ganti Karier",
    desc: "Pindah jalur ke dunia IT/AI dari bidang lain",
  },
  {
    id: "skill_upgrade",
    icon: "📈",
    title: "Naik Level Skill",
    desc: "Tambah skill baru untuk naik jabatan atau gaji",
  },
  {
    id: "university",
    icon: "🎓",
    title: "Persiapan Kuliah",
    desc: "Pengenalan sebelum masuk jurusan IT",
  },
  {
    id: "just_exploring",
    icon: "🔍",
    title: "Sekedar Eksplor",
    desc: "Masih cari tau, pengen lihat-lihat dulu",
  },
];

const interests = [
  {
    id: "ai",
    icon: "🤖",
    title: "AI & Machine Learning",
    desc: "Prompt engineering, LLM, AI tools",
    course: "ai-untuk-pemula",
    color: "border-[#F5A62A] bg-[#FFF3D6]",
  },
  {
    id: "programming",
    icon: "💻",
    title: "Programming",
    desc: "Web dev, fullstack, React, Next.js",
    course: "dasar-pemrograman-web",
    color: "border-[#7AB648] bg-[#E8F5E9]",
  },
  {
    id: "network",
    icon: "🌐",
    title: "Network Engineer",
    desc: "Jaringan, routing, switching, infra",
    course: null,
    color: "border-[#2D5016] bg-[#F0E8D8]",
  },
  {
    id: "cyber",
    icon: "🔒",
    title: "Cyber Security",
    desc: "Blue team, security analyst, hardening",
    course: null,
    color: "border-[#5C4813] bg-[#FFF3D6]",
  },
  {
    id: "data",
    icon: "📊",
    title: "Data Science",
    desc: "Analisis data, Python, visualisasi",
    course: null,
    color: "border-[#1565C0] bg-[#E3F2FD]",
  },
];

const steps = [
  { id: "welcome", label: "Selamat Datang" },
  { id: "goal", label: "Tujuan" },
  { id: "interest", label: "Minat" },
  { id: "start", label: "Mulai Belajar" },
];

export function OnboardingWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState<string | null>(null);
  const [interest, setInterest] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleSkip = async () => {
    setSaving(true);
    await skipOnboarding();
    setSaving(false);
    router.push("/dashboard");
  };

  const handleComplete = async () => {
    setSaving(true);
    const formData = new FormData();
    if (goal) formData.set("goal", goal);
    if (interest) formData.set("interest", interest);
    await completeOnboarding(formData);
    setSaving(false);
    router.push("/dashboard");
  };

  return (
    <div className="bg-[#FEFBF5] min-h-screen flex flex-col">
      {/* Top bar */}
      <div className="border-b border-[#F0E8D8] bg-white">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-xl font-black text-[#2D5016] tracking-tight">
            Kaalupi
          </Link>
          <button
            onClick={handleSkip}
            disabled={saving}
            className="text-sm font-semibold text-[#444444] hover:text-[#F5A62A] transition disabled:opacity-50"
          >
            Skip {saving ? "..." : "→"}
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mx-auto w-full max-w-2xl px-6 pt-8">
        <div className="flex items-center gap-2">
          {steps.map((s, i) => (
            <div key={s.id} className="flex items-center gap-2 flex-1">
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all ${
                  i <= step
                    ? "bg-[#F5A62A] text-[#2D5016]"
                    : "bg-[#F0E8D8] text-[#999]"
                }`}
              >
                {i < step ? "✓" : i + 1}
              </div>
              <span
                className={`hidden text-xs font-semibold sm:block ${
                  i <= step ? "text-[#2D5016]" : "text-[#999]"
                }`}
              >
                {s.label}
              </span>
              {i < steps.length - 1 && (
                <div
                  className={`hidden h-0.5 flex-1 sm:block ${
                    i < step ? "bg-[#F5A62A]" : "bg-[#F0E8D8]"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto flex w-full max-w-2xl flex-1 px-6 py-12">
        {/* Step 0: Welcome */}
        {step === 0 && (
          <div className="flex w-full flex-col items-center justify-center text-center animate-fade-in">
            <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-[#FFF3D6]">
              <span className="text-5xl">🚀</span>
            </div>
            <h1 className="text-4xl font-extrabold text-[#2D5016]">
              Selamat Datang di Kaalupi!
            </h1>
            <p className="mt-4 max-w-lg text-base leading-7 text-[#444444]">
              Platform belajar IT pertama di Indonesia yang integrasi AI tools ke setiap project. 
              Kami akan bantu kamu mulai perjalanan belajar dengan langkah yang tepat.
            </p>
            <div className="mt-10 grid gap-4 sm:grid-cols-3 w-full max-w-lg">
              {[
                { icon: "🎯", text: "Pilih tujuan belajarmu" },
                { icon: "📚", text: "Dapatkan rekomendasi course" },
                { icon: "⚡", text: "Mulai belajar dalam 2 menit" },
              ].map((item) => (
                <div
                  key={item.text}
                  className="rounded-xl border border-[#F0E8D8] bg-white p-4 text-center"
                >
                  <p className="text-2xl">{item.icon}</p>
                  <p className="mt-2 text-xs font-semibold text-[#2D5016]">{item.text}</p>
                </div>
              ))}
            </div>
            <button
              onClick={handleNext}
              className="mt-10 rounded-xl bg-[#F5A62A] px-8 py-4 text-base font-bold text-[#2D5016] shadow-lg transition hover:opacity-90"
            >
              Mulai Sekarang →
            </button>
          </div>
        )}

        {/* Step 1: Goal */}
        {step === 1 && (
          <div className="w-full animate-fade-in">
            <div className="mb-8 text-center">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#7AB648]">
                Langkah 1 dari 3
              </p>
              <h2 className="mt-3 text-3xl font-extrabold text-[#2D5016]">
                Apa tujuan utama kamu?
              </h2>
              <p className="mt-2 text-sm text-[#444444]">
                Pilih yang paling mendekati — ini membantu kami merekomendasikan materi yang tepat.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {goals.map((g) => (
                <button
                  key={g.id}
                  onClick={() => {
                    setGoal(g.id);
                    handleNext();
                  }}
                  className={`group rounded-2xl border-2 p-6 text-left transition-all hover:shadow-md ${
                    goal === g.id
                      ? "border-[#F5A62A] bg-[#FFF3D6]"
                      : "border-[#F0E8D8] bg-white hover:border-[#F5A62A]"
                  }`}
                >
                  <span className="text-3xl">{g.icon}</span>
                  <p className="mt-3 text-lg font-bold text-[#2D5016] group-hover:text-[#F5A62A] transition-colors">
                    {g.title}
                  </p>
                  <p className="mt-1 text-sm text-[#444444]">{g.desc}</p>
                </button>
              ))}
            </div>
            <div className="mt-6 text-center">
              <button
                onClick={handleBack}
                className="text-sm font-semibold text-[#444] hover:text-[#F5A62A] transition"
              >
                ← Kembali
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Interest */}
        {step === 2 && (
          <div className="w-full animate-fade-in">
            <div className="mb-8 text-center">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#7AB648]">
                Langkah 2 dari 3
              </p>
              <h2 className="mt-3 text-3xl font-extrabold text-[#2D5016]">
                Bidang apa yang paling menarik?
              </h2>
              <p className="mt-2 text-sm text-[#444444]">
                Pilih bidang yang paling sesuai dengan minat kamu.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {interests.map((int) => (
                <button
                  key={int.id}
                  onClick={() => {
                    setInterest(int.id);
                    handleNext();
                  }}
                  className={`group rounded-2xl border-2 p-6 text-left transition-all hover:shadow-md ${
                    interest === int.id
                      ? "border-[#F5A62A] bg-[#FFF3D6]"
                      : "border-[#F0E8D8] bg-white hover:border-[#F5A62A]"
                  }`}
                >
                  <span className="text-3xl">{int.icon}</span>
                  <p className="mt-3 text-lg font-bold text-[#2D5016] group-hover:text-[#F5A62A] transition-colors">
                    {int.title}
                  </p>
                  <p className="mt-1 text-sm text-[#444444]">{int.desc}</p>
                </button>
              ))}
            </div>
            <div className="mt-6 text-center">
              <button
                onClick={handleBack}
                className="text-sm font-semibold text-[#444] hover:text-[#F5A62A] transition"
              >
                ← Kembali
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Start Learning */}
        {step === 3 && (
          <div className="flex w-full flex-col items-center text-center animate-fade-in">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#E8F5E9]">
              <span className="text-4xl">🎉</span>
            </div>
            <h2 className="text-3xl font-extrabold text-[#2D5016]">
              Kamu Siap Belajar!
            </h2>
            <p className="mt-3 max-w-md text-base leading-7 text-[#444444]">
              Berdasarkan pilihan kamu, kami rekomendasikan untuk memulai dari course gratis ini:
            </p>

            <div className="mt-8 w-full max-w-md rounded-2xl border-2 border-[#F5A62A] bg-white p-6 shadow-md">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F5A62A]">
                  <span className="text-xl">🤖</span>
                </div>
                <div className="text-left">
                  <span className="rounded-full bg-[#7AB648] px-2 py-0.5 text-[10px] font-bold text-white">
                    GRATIS
                  </span>
                  <p className="mt-1 text-base font-bold text-[#2D5016]">
                    AI untuk Pemula — Foundation
                  </p>
                  <p className="text-xs text-[#444444]">2 modul · 3 jam · langsung akses</p>
                </div>
              </div>
              <Link
                href="/courses/ai-untuk-pemula"
                className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-[#F5A62A] px-5 py-3 text-sm font-bold text-[#2D5016] transition hover:opacity-90"
              >
                Mulai Course Gratis →
              </Link>
            </div>

            <p className="mt-4 text-xs text-[#999]">
              Atau langsung lanjut ke dashboard untuk lihat semua course
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={handleComplete}
                disabled={saving}
                className="rounded-xl bg-[#2D5016] px-8 py-4 text-base font-bold text-white shadow-lg transition hover:opacity-90 disabled:opacity-50"
              >
                {saving ? "Menyimpan..." : "Lanjut ke Dashboard →"}
              </button>
              <button
                onClick={handleBack}
                className="text-sm font-semibold text-[#444] hover:text-[#F5A62A] transition"
              >
                ← Kembali
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-[#F0E8D8] bg-white py-4">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-6">
          <p className="text-xs text-[#999]">
            Butuh bantuan?{" "}
            <Link href="/contact" className="text-[#F5A62A] hover:underline">
              Hubungi kami
            </Link>
          </p>
          <button
            onClick={handleSkip}
            disabled={saving}
            className="text-xs font-semibold text-[#444] hover:text-[#F5A62A] transition disabled:opacity-50"
          >
            Lewati onboarding
          </button>
        </div>
      </div>
    </div>
  );
}
