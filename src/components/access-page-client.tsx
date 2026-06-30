"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { VideoPlayer } from "@/components/video-player";
import { CertificateButton } from "@/components/certificate-button";
import { AiTutorChat } from "@/components/ai-tutor-chat";
import { MarkDoneButton } from "@/components/mark-done-button";

type Material = {
  id: string;
  title: string;
  content: string | null;
  video_url: string | null;
  module_index: number;
  order_index: number;
};

type ModuleGroup = {
  name: string;
  idx: number;
  materials: Material[];
  isLocked: boolean;
  isCompleted: boolean;
};

interface Props {
  courseSlug: string;
  courseTitle: string;
  courseModules: string[];
  foundingPrice: number;
  regularPrice: number;
  allMaterials: Material[];
  activeMat: Material | null;
  completedModules: number[];
  hasPaidAccess: boolean;
  freeCount: number;
  courseFinished: boolean;
  byModule: ModuleGroup[];
  canAccess: boolean;
  markModuleComplete: (idx: number) => Promise<void>;
}

export function AccessPageClient({
  courseSlug,
  courseTitle,
  courseModules,
  foundingPrice,
  regularPrice,
  allMaterials,
  activeMat,
  completedModules,
  hasPaidAccess,
  freeCount,
  courseFinished,
  byModule,
  canAccess,
  markModuleComplete,
}: Props) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [visited, setVisited] = useState<Set<string>>(new Set());
  const [navigating, setNavigating] = useState(false);

  const storageKey = `kaalupi_visited_${courseSlug}`;

  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) setVisited(new Set(JSON.parse(stored)));
    } catch {}
  }, [storageKey]);

  const markVisited = useCallback(
    (matId: string) => {
      setVisited((prev) => {
        const next = new Set(prev);
        next.add(matId);
        try {
          localStorage.setItem(storageKey, JSON.stringify([...next]));
        } catch {}
        return next;
      });
    },
    [storageKey],
  );

  const totalModules = courseModules.length;
  const completedCount = completedModules.length;
  const progressPercent =
    totalModules > 0 ? Math.round((completedCount / totalModules) * 100) : 0;

  const activeIdx = activeMat
    ? allMaterials.findIndex((m) => m.id === activeMat.id)
    : -1;
  const prevMat = activeIdx > 0 ? allMaterials[activeIdx - 1] : null;
  const nextMat =
    activeIdx >= 0 && activeIdx < allMaterials.length - 1
      ? allMaterials[activeIdx + 1]
      : null;

  const activeModuleIndex = activeMat?.module_index ?? 0;

  async function handleNext() {
    if (!activeMat || navigating) return;
    setNavigating(true);
    try {
      markVisited(activeMat.id);

      // Mark module complete when leaving module or finishing course
      const movingToNewModule =
        !nextMat || nextMat.module_index !== activeMat.module_index;
      if (movingToNewModule) {
        await markModuleComplete(activeMat.module_index);
      }

      if (nextMat) {
        const mod = byModule.find((m) => m.idx === nextMat.module_index);
        if (mod?.isLocked) {
          router.push(`/checkout/${courseSlug}`);
        } else {
          router.push(`/access/${courseSlug}?mat=${nextMat.id}`);
        }
      }
    } finally {
      setNavigating(false);
    }
  }

  async function handleFinish() {
    if (!activeMat || navigating) return;
    setNavigating(true);
    try {
      markVisited(activeMat.id);
      await markModuleComplete(activeMat.module_index);
    } finally {
      setNavigating(false);
    }
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#FEFBF5]">
      {/* ── TOP BAR ── */}
      <header className="z-20 flex h-12 flex-shrink-0 items-center justify-between border-b border-[#F0E8D8] bg-white px-4 shadow-sm">
        <div className="flex min-w-0 items-center gap-2">
          <Link
            href="/dashboard"
            className="flex-shrink-0 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-[#2D5016] transition hover:bg-[#F0E8D8]"
          >
            ← Dashboard
          </Link>
          <span className="text-[#D0C8B8]">|</span>
          {/* Sidebar toggle button */}
          <button
            onClick={() => setSidebarOpen((o) => !o)}
            title={sidebarOpen ? "Sembunyikan kurikulum" : "Tampilkan kurikulum"}
            className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-semibold text-[#444] transition hover:bg-[#F0E8D8]"
          >
            <svg
              className="h-4 w-4 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              {sidebarOpen ? (
                <>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 4v16" />
                </>
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
            <span className="hidden sm:inline">
              {sidebarOpen ? "Sembunyikan" : "Kurikulum"}
            </span>
          </button>
          <span className="truncate text-sm font-semibold text-[#2D5016]">
            {courseTitle}
          </span>
        </div>
        <div className="hidden items-center gap-2 sm:flex">
          <div className="h-1.5 w-24 overflow-hidden rounded-full bg-[#F0E8D8]">
            <div
              className="h-full rounded-full bg-[#F5A62A] transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-xs font-semibold text-[#5C4813]">
            {completedCount}/{totalModules}
          </span>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* ── SIDEBAR ── */}
        <aside
          className={`flex-shrink-0 overflow-hidden border-r border-[#F0E8D8] bg-white transition-all duration-300 ${
            sidebarOpen ? "w-72" : "w-0 border-r-0"
          }`}
        >
          <div className="h-full w-72 overflow-y-auto">
            <div className="p-3">
              <p className="px-2 pb-3 pt-1 text-[10px] font-bold uppercase tracking-widest text-[#999]">
                Kurikulum · {allMaterials.length} materi
              </p>

              {byModule.map((mod) => (
                <div key={mod.idx} className="mb-2">
                  {/* Module header */}
                  <div className="flex items-center gap-2 px-2 py-1.5">
                    <MarkDoneButton
                      moduleIndex={mod.idx}
                      isCompleted={mod.isCompleted}
                      onComplete={markModuleComplete}
                    />
                    <span
                      className={`text-xs font-bold leading-tight ${
                        mod.isLocked
                          ? "text-[#CCC]"
                          : mod.isCompleted
                          ? "text-[#7AB648]"
                          : "text-[#2D5016]"
                      }`}
                    >
                      {mod.idx + 1}. {mod.name}
                    </span>
                    {mod.isLocked && (
                      <span className="ml-auto text-[10px] text-[#CCC]">🔒</span>
                    )}
                  </div>

                  {/* Material list */}
                  {mod.materials.length > 0 && (
                    <div className="ml-4 space-y-0.5 border-l-2 border-[#F0E8D8] pl-3">
                      {mod.materials.map((mat) => {
                        const isActive = activeMat?.id === mat.id;
                        const isVisited = visited.has(mat.id);
                        return (
                          <Link
                            key={mat.id}
                            href={
                              mod.isLocked
                                ? `/checkout/${courseSlug}`
                                : `/access/${courseSlug}?mat=${mat.id}`
                            }
                            className={`flex items-center gap-2 rounded-lg px-2 py-2 text-xs transition ${
                              isActive
                                ? "bg-[#FFF3D6] font-semibold text-[#2D5016]"
                                : mod.isLocked
                                ? "text-[#CCC] hover:bg-[#FEFBF5]"
                                : "text-[#444] hover:bg-[#FEFBF5] hover:text-[#2D5016]"
                            }`}
                          >
                            {isActive ? (
                              <span className="flex-shrink-0 text-[10px] text-[#F5A62A]">
                                ▶
                              </span>
                            ) : isVisited ? (
                              <svg
                                className="h-3.5 w-3.5 flex-shrink-0 text-[#7AB648]"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={3}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            ) : (
                              <span
                                className={`h-1.5 w-1.5 flex-shrink-0 rounded-full ${
                                  mod.isLocked ? "bg-[#DDD]" : "bg-[#D0C8B8]"
                                }`}
                              />
                            )}
                            <span className="leading-snug">{mat.title}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}

              {courseFinished && (
                <div className="mx-2 mt-4 rounded-xl bg-[#E8F5E9] p-3 text-center">
                  <p className="text-xs font-bold text-[#2D5016]">
                    🎉 Course selesai!
                  </p>
                  <CertificateButton courseSlug={courseSlug} />
                </div>
              )}

              {!hasPaidAccess && (
                <Link
                  href={`/checkout/${courseSlug}`}
                  className="mx-2 mt-3 block rounded-xl bg-[#F5A62A] py-2.5 text-center text-xs font-extrabold text-[#2D5016] transition hover:opacity-90"
                >
                  🔓 Buka Semua Modul →
                </Link>
              )}
            </div>
          </div>
        </aside>

        {/* ── MAIN CONTENT ── */}
        <main className="flex flex-1 flex-col overflow-y-auto bg-[#FEFBF5]">
          {canAccess && activeMat ? (
            <>
              {/* Video */}
              {activeMat.video_url && (
                <div className="w-full bg-black">
                  <VideoPlayer
                    src={activeMat.video_url}
                    title={activeMat.title}
                  />
                </div>
              )}

              {/* Title bar + nav */}
              <div className="border-b border-[#F0E8D8] bg-white px-6 py-4 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#999]">
                      Modul {activeModuleIndex + 1} —{" "}
                      {courseModules[activeModuleIndex]}
                    </p>
                    <h1 className="mt-1 text-lg font-extrabold text-[#2D5016]">
                      {activeMat.title}
                    </h1>
                  </div>
                  <div className="flex flex-shrink-0 items-center gap-2">
                    {prevMat && (
                      <Link
                        href={`/access/${courseSlug}?mat=${prevMat.id}`}
                        className="rounded-lg border border-[#F0E8D8] px-3 py-1.5 text-xs font-semibold text-[#444] transition hover:border-[#2D5016] hover:text-[#2D5016]"
                      >
                        ← Sebelumnya
                      </Link>
                    )}
                    {nextMat ? (
                      <button
                        onClick={handleNext}
                        disabled={navigating}
                        className="rounded-lg bg-[#F5A62A] px-3 py-1.5 text-xs font-extrabold text-[#2D5016] transition hover:opacity-90 disabled:opacity-60"
                      >
                        {navigating ? "..." : "Selanjutnya →"}
                      </button>
                    ) : (
                      <button
                        onClick={handleFinish}
                        disabled={navigating}
                        className="rounded-lg bg-[#7AB648] px-3 py-1.5 text-xs font-extrabold text-white transition hover:opacity-90 disabled:opacity-60"
                      >
                        {navigating ? "..." : "✓ Selesai"}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Article content */}
              {activeMat.content && (
                <div className="flex-1 px-6 py-8 md:px-10">
                  <div className="mx-auto max-w-3xl">
                    <div
                      className="course-content prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: activeMat.content }}
                    />
                  </div>
                </div>
              )}

              {!activeMat.video_url && !activeMat.content && (
                <div className="flex flex-1 items-center justify-center">
                  <div className="text-center">
                    <p className="text-3xl">🎬</p>
                    <p className="mt-2 text-sm font-semibold text-[#444]">
                      Konten sedang dipersiapkan
                    </p>
                    <p className="mt-1 text-xs text-[#999]">
                      Tim Kaalupi lagi upload materi ini.
                    </p>
                  </div>
                </div>
              )}

              {/* Spacer so floating AI Tutor button doesn't cover content */}
              <div className="h-28 flex-shrink-0" />
            </>
          ) : activeMat ? (
            /* Paywall */
            <div className="flex flex-1 items-center justify-center p-8">
              <div className="max-w-md rounded-2xl border-2 border-[#F5A62A] bg-white p-8 text-center shadow-md">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#FFF3D6] text-2xl">
                  🔒
                </div>
                <h2 className="text-xl font-extrabold text-[#2D5016]">
                  Modul Berbayar
                </h2>
                <p className="mt-2 text-sm text-[#444]">
                  Jadi Founding Member untuk akses semua {totalModules} modul +
                  lifetime access ke SEMUA course Kaalupi.
                </p>
                <div className="mt-4 flex items-baseline justify-center gap-2">
                  <span className="text-3xl font-extrabold text-[#F5A62A]">
                    Rp {foundingPrice.toLocaleString("id-ID")}
                  </span>
                  <span className="text-sm text-[#999] line-through">
                    Rp {regularPrice.toLocaleString("id-ID")}
                  </span>
                </div>
                <Link
                  href={`/checkout/${courseSlug}`}
                  className="mt-5 block rounded-xl bg-[#F5A62A] px-8 py-3 text-sm font-extrabold text-[#2D5016] transition hover:opacity-90"
                >
                  Daftar Founding Member →
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex flex-1 items-center justify-center">
              <p className="text-sm text-[#999]">
                Pilih materi di sidebar kiri untuk mulai belajar.
              </p>
            </div>
          )}
        </main>
      </div>

      {canAccess && activeMat && (
        <AiTutorChat
          courseSlug={courseSlug}
          courseTitle={courseTitle}
          moduleIndex={activeModuleIndex}
        />
      )}
    </div>
  );
}
