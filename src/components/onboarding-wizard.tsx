"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { completeOnboarding, skipOnboarding } from "@/app/actions/onboarding";
import { siteConfig } from "@/lib/data";

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
  },
  {
    id: "programming",
    icon: "💻",
    title: "Programming",
    desc: "Web dev, fullstack, React, Next.js",
  },
  {
    id: "network",
    icon: "🌐",
    title: "Network Engineer",
    desc: "Jaringan, routing, switching, infra",
  },
  {
    id: "cyber",
    icon: "🔒",
    title: "Cyber Security",
    desc: "Blue team, security analyst, hardening",
  },
  {
    id: "data",
    icon: "📊",
    title: "Data Science",
    desc: "Analisis data, Python, visualisasi",
  },
  {
    id: "design",
    icon: "🎨",
    title: "UI/UX Design",
    desc: "Desain produk, prototyping, sistem",
  },
];

const steps = [
  { id: "welcome", label: "Welcome" },
  { id: "goal", label: "Tujuan" },
  { id: "interest", label: "Minat" },
  { id: "community", label: "Komunitas" },
  { id: "start", label: "Mulai" },
];

export function OnboardingWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState<string | null>(null);
  const [interest, setInterest] = useState<string | null>(null);
  const [joinDiscord, setJoinDiscord] = useState(true);
  const [joinWhatsapp, setJoinWhatsapp] = useState(true);
  const [saving, setSaving] = useState(false);

  const handleNext = () => {
    if (step < steps.length - 1) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleSkip = async () => {
    setSaving(true);
    await skipOnboarding();
    setSaving(false);
    router.push("/dashboard?welcome=skipped");
  };

  const handleComplete = async () => {
    setSaving(true);
    const formData = new FormData();
    if (goal) formData.set("goal", goal);
    if (interest) formData.set("interest", interest);
    if (joinDiscord) formData.set("join_discord", "on");
    if (joinWhatsapp) formData.set("join_whatsapp", "on");
    await completeOnboarding(formData);
    setSaving(false);
    router.push("/dashboard?welcome=true");
  };

  return (
    <div className="bg-[#FEFBF5] min-h-screen flex flex-col">
      {/* Top bar */}
      <div className="border-b border-[#F0E8D8] bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-xl font-black text-[#2D5016] tracking-tight">
            Kaalupi
          </Link>
          <button
            onClick={handleSkip}
            disabled={saving}
            className="text-sm font-semibold text-[#444444] hover:text-[#F5A62A] transition disabled:opacity-50"
          >
            Lewati setup {saving ? "..." : "→"}
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mx-auto w-full max-w-3xl px-6 pt-8">
        <div className="flex items-center gap-2">
          {steps.map((s, i) => (
            <div key={s.id} className="flex items-center gap-2 flex-1">
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all ${
                  i <= step ? "bg-[#F5A62A] text-[#2D5016]" : "bg-[#F0E8D8] text-[#999]"
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
      <div className="mx-auto flex w-full max-w-3xl flex-1 px-6 py-12">
        {/* Step 0: Welcome */}
        {step === 0 && (
          <div className="flex w-full flex-col items-center justify-center text-center animate-fade-in-up">
            <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-[#FFF3D6]">
              <span className="text-5xl">🚀</span>
            </div>
            <h1 className="text-4xl font-extrabold text-[#2D5016]">
              Selamat Datang di Kaalupi!
            </h1>
            <p className="mt-4 max-w-lg text-base leading-7 text-[#444444]">
              Akun lu udah jadi. Setup 3 langkah cepat (1 menit) biar kami bisa
              kasih jalur belajar yang paling cocok.
            </p>
            <div className="mt-10 grid w-full max-w-xl gap-4 sm:grid-cols-3">
              {[
                { icon: "🎯", text: "Pilih tujuan belajar" },
                { icon: "📚", text: "Auto-enroll course gratis" },
                { icon: "💬", text: "Gabung komunitas" },
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
          <div className="w-full animate-fade-in-up">
            <div className="mb-8 text-center">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#7AB648]">
                Langkah 1 dari 3
              </p>
              <h2 className="mt-3 text-3xl font-extrabold text-[#2D5016]">
                Apa tujuan utama kamu?
              </h2>
              <p className="mt-2 text-sm text-[#444444]">
                Pilih yang paling mendekati — kami pakai ini untuk merekomendasikan track yang tepat.
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
          <div className="w-full animate-fade-in-up">
            <div className="mb-8 text-center">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#7AB648]">
                Langkah 2 dari 3
              </p>
              <h2 className="mt-3 text-3xl font-extrabold text-[#2D5016]">
                Bidang apa yang paling menarik?
              </h2>
              <p className="mt-2 text-sm text-[#444444]">
                Pilih satu — kami tampilkan course paling cocok di dashboard.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {interests.map((int) => (
                <button
                  key={int.id}
                  onClick={() => {
                    setInterest(int.id);
                    handleNext();
                  }}
                  className={`group rounded-2xl border-2 p-5 text-left transition-all hover:shadow-md ${
                    interest === int.id
                      ? "border-[#F5A62A] bg-[#FFF3D6]"
                      : "border-[#F0E8D8] bg-white hover:border-[#F5A62A]"
                  }`}
                >
                  <span className="text-2xl">{int.icon}</span>
                  <p className="mt-3 text-base font-bold text-[#2D5016] group-hover:text-[#F5A62A] transition-colors">
                    {int.title}
                  </p>
                  <p className="mt-1 text-xs text-[#444444]">{int.desc}</p>
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

        {/* Step 3: Community */}
        {step === 3 && (
          <div className="w-full animate-fade-in-up">
            <div className="mb-8 text-center">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#7AB648]">
                Langkah 3 dari 3
              </p>
              <h2 className="mt-3 text-3xl font-extrabold text-[#2D5016]">
                Mau gabung komunitas?
              </h2>
              <p className="mt-2 max-w-lg mx-auto text-sm text-[#444444]">
                Belajar bareng punya completion rate 65%, sendirian cuma 10%. Kami akan kirim invite link setelah lu masuk dashboard.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label
                className={`flex cursor-pointer items-start gap-4 rounded-2xl border-2 p-5 transition ${
                  joinDiscord ? "border-[#F5A62A] bg-[#FFF3D6]" : "border-[#F0E8D8] bg-white"
                }`}
              >
                <input
                  type="checkbox"
                  checked={joinDiscord}
                  onChange={(e) => setJoinDiscord(e.target.checked)}
                  className="mt-1 h-5 w-5 accent-[#F5A62A]"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">💬</span>
                    <p className="text-base font-bold text-[#2D5016]">Discord Server</p>
                  </div>
                  <p className="mt-1 text-xs text-[#5C4813]">
                    Diskusi mendalam per topik, voice room mingguan, AMA dengan founder.
                  </p>
                </div>
              </label>

              <label
                className={`flex cursor-pointer items-start gap-4 rounded-2xl border-2 p-5 transition ${
                  joinWhatsapp ? "border-[#F5A62A] bg-[#FFF3D6]" : "border-[#F0E8D8] bg-white"
                }`}
              >
                <input
                  type="checkbox"
                  checked={joinWhatsapp}
                  onChange={(e) => setJoinWhatsapp(e.target.checked)}
                  className="mt-1 h-5 w-5 accent-[#F5A62A]"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">📱</span>
                    <p className="text-base font-bold text-[#2D5016]">WhatsApp Group</p>
                  </div>
                  <p className="mt-1 text-xs text-[#5C4813]">
                    Update materi cepat, mini quiz harian, tanya jawab cepat.
                  </p>
                </div>
              </label>
            </div>

            <div className="mt-6 rounded-xl bg-[#E8F5E9] p-4 text-center">
              <p className="text-xs text-[#2D5016]">
                <strong>♾️ Bonus:</strong> Begitu setup selesai, kami otomatis enroll kamu ke course{" "}
                <strong>Cyber Security untuk Pemula</strong> (gratis · lifetime).
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={handleBack}
                className="text-sm font-semibold text-[#444] hover:text-[#F5A62A] transition"
              >
                ← Kembali
              </button>
              <button
                onClick={handleNext}
                className="rounded-xl bg-[#F5A62A] px-8 py-3.5 text-sm font-bold text-[#2D5016] shadow transition hover:opacity-90"
              >
                Lanjut →
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Start */}
        {step === 4 && (
          <div className="flex w-full flex-col items-center text-center animate-fade-in-up">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#E8F5E9]">
              <span className="text-4xl">🎉</span>
            </div>
            <h2 className="text-3xl font-extrabold text-[#2D5016]">
              Lu siap mulai!
            </h2>
            <p className="mt-3 max-w-md text-base leading-7 text-[#444444]">
              Kami udah enroll lu ke course gratis dan siapin dashboard personal.
            </p>

            <div className="mt-8 grid w-full max-w-2xl gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-[#F0E8D8] bg-white p-5 text-left">
                <span className="text-2xl">📚</span>
                <p className="mt-2 text-sm font-bold text-[#2D5016]">Course Aktif</p>
                <p className="mt-1 text-xs text-[#444]">Cyber Security untuk Pemula auto-enrolled</p>
              </div>
              <div className="rounded-2xl border border-[#F0E8D8] bg-white p-5 text-left">
                <span className="text-2xl">🎯</span>
                <p className="mt-2 text-sm font-bold text-[#2D5016]">Tujuan Tersimpan</p>
                <p className="mt-1 text-xs text-[#444]">Rekomendasi akan personalized</p>
              </div>
              <div className="rounded-2xl border border-[#F0E8D8] bg-white p-5 text-left">
                <span className="text-2xl">💬</span>
                <p className="mt-2 text-sm font-bold text-[#2D5016]">Komunitas</p>
                <p className="mt-1 text-xs text-[#444]">
                  {joinDiscord || joinWhatsapp ? "Invite akan dikirim" : "Bisa join nanti"}
                </p>
              </div>
            </div>

            {(joinDiscord || joinWhatsapp) && (
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                {joinDiscord && (
                  <a
                    href={siteConfig.community.discord}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-xl border-2 border-[#5865F2] bg-white px-5 py-3 text-sm font-bold text-[#5865F2] transition hover:bg-[#5865F2] hover:text-white"
                  >
                    Buka Discord →
                  </a>
                )}
                {joinWhatsapp && (
                  <a
                    href={siteConfig.community.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-xl border-2 border-[#25D366] bg-white px-5 py-3 text-sm font-bold text-[#25D366] transition hover:bg-[#25D366] hover:text-white"
                  >
                    Buka WhatsApp →
                  </a>
                )}
              </div>
            )}

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={handleBack}
                className="text-sm font-semibold text-[#444] hover:text-[#F5A62A] transition"
              >
                ← Kembali
              </button>
              <button
                onClick={handleComplete}
                disabled={saving}
                className="rounded-xl bg-[#2D5016] px-8 py-4 text-base font-bold text-white shadow-lg transition hover:opacity-90 disabled:opacity-50"
              >
                {saving ? "Menyimpan..." : "Masuk ke Dashboard →"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-[#F0E8D8] bg-white py-4">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6">
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
            Lewati setup
          </button>
        </div>
      </div>
    </div>
  );
}
