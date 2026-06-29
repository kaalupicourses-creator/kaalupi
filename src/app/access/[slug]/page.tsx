import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { getEnrollments, getProgress, updateProgress, getCourseMaterials } from "@/lib/db";
import { getCourseBySlug } from "@/lib/content";
import { ProgressTracker } from "@/components/progress-tracker";
import { VideoPlayer } from "@/components/video-player";
import { CertificateButton } from "@/components/certificate-button";
import { AiTutorChat } from "@/components/ai-tutor-chat";

export default async function CourseAccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ module?: string; mat?: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/login?redirect=/access");

  const clerkUser = await currentUser();
  const userEmail = clerkUser?.primaryEmailAddress?.emailAddress ?? "";

  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) redirect("/access");

  let enrollments: string[] = [];
  try { enrollments = await getEnrollments(userEmail); } catch {}
  const hasPaidAccess = enrollments.includes(course.slug);
  const freeCount = course.free_modules_count ?? 0;

  if (freeCount === 0 && !hasPaidAccess) redirect(`/checkout/${course.slug}`);

  let allMaterials: Awaited<ReturnType<typeof getCourseMaterials>> = [];
  try { allMaterials = await getCourseMaterials(course.slug); } catch {}
  allMaterials.sort((a, b) => a.module_index - b.module_index || a.order_index - b.order_index);

  let progress: Awaited<ReturnType<typeof getProgress>> = [];
  try { progress = await getProgress(userEmail, course.slug); } catch {}
  const completedModules = progress.filter((p) => p.completed).map((p) => p.module_index);

  // Resolve active material from ?mat=ID or ?module=X, fallback to first material
  const sp = await searchParams;
  let activeMat = allMaterials.find((m) => m.id === sp.mat) ?? null;
  if (!activeMat && sp.module !== undefined) {
    const modIdx = parseInt(sp.module, 10);
    activeMat = allMaterials.find((m) => m.module_index === modIdx) ?? null;
  }
  if (!activeMat) activeMat = allMaterials[0] ?? null;

  const activeModuleIndex = activeMat?.module_index ?? 0;
  const isModuleFree = activeModuleIndex < freeCount;
  const canAccess = isModuleFree || hasPaidAccess;

  // Prev / Next material in full list
  const activeIdx = activeMat ? allMaterials.findIndex((m) => m.id === activeMat!.id) : -1;
  const prevMat = activeIdx > 0 ? allMaterials[activeIdx - 1] : null;
  const nextMat = activeIdx >= 0 && activeIdx < allMaterials.length - 1 ? allMaterials[activeIdx + 1] : null;

  const totalModules = course.modules.length;
  const completedCount = completedModules.length;
  const progressPercent = totalModules > 0 ? Math.round((completedCount / totalModules) * 100) : 0;
  const courseFinished = hasPaidAccess && completedCount === totalModules && totalModules > 0;

  const courseSlug = course.slug;
  async function markModuleComplete(moduleIndex: number) {
    "use server";
    try {
      await updateProgress(userEmail, courseSlug, moduleIndex, true);
      revalidatePath(`/access/${courseSlug}`);
      revalidatePath("/dashboard");
    } catch {}
  }

  // Group materials by module for sidebar
  const byModule = course.modules.map((modName, idx) => ({
    name: modName,
    idx,
    materials: allMaterials.filter((m) => m.module_index === idx),
    isLocked: idx >= freeCount && !hasPaidAccess,
    isCompleted: completedModules.includes(idx),
  }));

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#111]">
      {/* Top bar */}
      <header className="flex h-12 flex-shrink-0 items-center justify-between border-b border-white/10 bg-[#1A1A1A] px-4">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/dashboard"
            className="flex-shrink-0 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-white/60 hover:bg-white/10 hover:text-white transition"
          >
            ← Dashboard
          </Link>
          <span className="text-white/20">|</span>
          <span className="truncate text-sm font-semibold text-white/80">{course.title}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2">
            <div className="h-1.5 w-24 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-[#F5A62A] transition-all" style={{ width: `${progressPercent}%` }} />
            </div>
            <span className="text-xs text-white/50">{progressPercent}%</span>
          </div>
          <span className="rounded-full bg-[#2D5016] px-2.5 py-1 text-[10px] font-bold text-[#7AB648]">
            Kaalupi
          </span>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* ── SIDEBAR ── */}
        <aside className="w-72 flex-shrink-0 overflow-y-auto border-r border-white/10 bg-[#1A1A1A]">
          <div className="p-3">
            <p className="px-2 pb-2 text-[10px] font-bold uppercase tracking-widest text-white/30">
              Kurikulum · {allMaterials.length} materi
            </p>

            {byModule.map((mod) => (
              <div key={mod.idx} className="mb-1">
                {/* Section header */}
                <div className={`flex items-center gap-2 rounded-lg px-2 py-2 ${activeModuleIndex === mod.idx ? "bg-white/5" : ""}`}>
                  <span className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded text-[9px] font-bold ${
                    mod.isCompleted ? "bg-[#7AB648] text-white" : mod.isLocked ? "bg-white/10 text-white/30" : "bg-[#2D5016] text-[#7AB648]"
                  }`}>
                    {mod.isCompleted ? "✓" : mod.isLocked ? "🔒" : mod.idx + 1}
                  </span>
                  <span className={`text-xs font-semibold leading-tight ${mod.isLocked ? "text-white/30" : "text-white/70"}`}>
                    {mod.name}
                  </span>
                </div>

                {/* Materials list */}
                {mod.materials.length > 0 ? (
                  <div className="ml-2 border-l border-white/5 pl-2">
                    {mod.materials.map((mat) => {
                      const isActive = activeMat?.id === mat.id;
                      return (
                        <Link
                          key={mat.id}
                          href={mod.isLocked ? `/checkout/${course.slug}` : `/access/${course.slug}?mat=${mat.id}`}
                          className={`flex items-center gap-2 rounded-lg px-2 py-2 text-xs transition ${
                            isActive
                              ? "bg-[#F5A62A]/15 text-[#F5A62A] font-semibold"
                              : mod.isLocked
                              ? "text-white/20 cursor-pointer hover:bg-white/5"
                              : "text-white/50 hover:bg-white/5 hover:text-white/80"
                          }`}
                        >
                          {isActive ? (
                            <span className="flex-shrink-0 text-[#F5A62A]">▶</span>
                          ) : mod.isLocked ? (
                            <span className="flex-shrink-0 text-white/20">🔒</span>
                          ) : (
                            <span className="flex-shrink-0 h-1.5 w-1.5 rounded-full bg-white/20" />
                          )}
                          <span className="leading-tight">{mat.title}</span>
                          {mat.video_url && !mod.isLocked && (
                            <span className="ml-auto flex-shrink-0 text-[9px] text-white/20">▶</span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                ) : (
                  <div className="ml-6 py-1 text-[10px] text-white/20 italic">
                    {mod.isLocked ? "" : "Belum ada materi"}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Sidebar footer: progress tracker */}
          <div className="sticky bottom-0 border-t border-white/10 bg-[#1A1A1A] p-3">
            {courseFinished ? (
              <div className="rounded-xl bg-[#2D5016]/40 p-3 text-center">
                <p className="text-xs font-bold text-[#7AB648]">🎉 Course selesai!</p>
                <CertificateButton courseSlug={course.slug} />
              </div>
            ) : (
              <ProgressTracker
                totalModules={course.modules.length}
                completedModules={completedModules}
                onModuleComplete={markModuleComplete}
              />
            )}
            {!hasPaidAccess && (
              <Link
                href={`/checkout/${course.slug}`}
                className="mt-2 block rounded-xl bg-[#F5A62A] py-2 text-center text-xs font-bold text-[#2D5016] hover:opacity-90 transition"
              >
                🔓 Buka Semua Modul →
              </Link>
            )}
          </div>
        </aside>

        {/* ── MAIN CONTENT ── */}
        <main className="flex flex-1 flex-col overflow-y-auto bg-[#0F0F0F]">
          {canAccess && activeMat ? (
            <>
              {/* Video */}
              {activeMat.video_url && (
                <div className="w-full bg-black">
                  <VideoPlayer src={activeMat.video_url} title={activeMat.title} />
                </div>
              )}

              {/* Material title + nav */}
              <div className="border-b border-white/10 bg-[#141414] px-6 py-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">
                      Modul {activeModuleIndex + 1} — {course.modules[activeModuleIndex]}
                    </p>
                    <h1 className="mt-1 text-lg font-extrabold text-white">{activeMat.title}</h1>
                  </div>
                  <div className="flex flex-shrink-0 items-center gap-2">
                    {prevMat && (
                      <Link
                        href={`/access/${course.slug}?mat=${prevMat.id}`}
                        className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-white/60 hover:border-white/30 hover:text-white transition"
                      >
                        ← Sebelumnya
                      </Link>
                    )}
                    {nextMat && (
                      <Link
                        href={`/access/${course.slug}?mat=${nextMat.id}`}
                        className="rounded-lg bg-[#F5A62A] px-3 py-1.5 text-xs font-extrabold text-[#2D5016] hover:opacity-90 transition"
                      >
                        Selanjutnya →
                      </Link>
                    )}
                  </div>
                </div>
              </div>

              {/* Article content */}
              {activeMat.content && (
                <div className="flex-1 px-6 py-8 md:px-10">
                  <div className="mx-auto max-w-3xl">
                    <div
                      className="course-content prose prose-invert prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: activeMat.content }}
                    />
                  </div>
                </div>
              )}

              {!activeMat.video_url && !activeMat.content && (
                <div className="flex flex-1 items-center justify-center">
                  <div className="text-center">
                    <p className="text-2xl">🎬</p>
                    <p className="mt-2 text-sm font-semibold text-white/50">Konten sedang dipersiapkan</p>
                    <p className="mt-1 text-xs text-white/30">Tim Kaalupi lagi upload materi ini.</p>
                  </div>
                </div>
              )}
            </>
          ) : activeMat ? (
            /* Paywall */
            <div className="flex flex-1 items-center justify-center p-8">
              <div className="max-w-md rounded-2xl border border-[#F5A62A]/30 bg-[#1A1A1A] p-8 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#F5A62A]/10 text-2xl">
                  🔒
                </div>
                <h2 className="text-xl font-extrabold text-white">Modul Berbayar</h2>
                <p className="mt-2 text-sm text-white/50">
                  Jadi Founding Member untuk akses semua {totalModules} modul + lifetime access ke SEMUA course Kaalupi.
                </p>
                <div className="mt-4 flex items-baseline justify-center gap-2">
                  <span className="text-3xl font-extrabold text-[#F5A62A]">
                    Rp {(course.founding_price ?? course.price).toLocaleString("id-ID")}
                  </span>
                  <span className="text-sm text-white/30 line-through">
                    Rp {(course.regular_price ?? course.original_price ?? 0).toLocaleString("id-ID")}
                  </span>
                </div>
                <Link
                  href={`/checkout/${course.slug}`}
                  className="mt-5 block rounded-xl bg-[#F5A62A] px-8 py-3 text-sm font-extrabold text-[#2D5016] hover:opacity-90 transition"
                >
                  Daftar Founding Member →
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex flex-1 items-center justify-center">
              <p className="text-sm text-white/30">Pilih materi di sidebar kiri untuk mulai belajar.</p>
            </div>
          )}
        </main>
      </div>

      {canAccess && activeMat && (
        <AiTutorChat courseSlug={course.slug} courseTitle={course.title} moduleIndex={activeModuleIndex} />
      )}
    </div>
  );
}
