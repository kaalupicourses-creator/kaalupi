import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { getEnrollments, getProgress, updateProgress, getCourseMaterials } from "@/lib/db";
import { getCourseBySlug } from "@/lib/content";
import { ProgressTracker } from "@/components/progress-tracker";
import { CourseThumbnail } from "@/components/course-thumbnail";
import { VideoPlayer } from "@/components/video-player";
import { CertificateButton } from "@/components/certificate-button";
import { AiTutorChat } from "@/components/ai-tutor-chat";

const formatter = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });

export default async function CourseAccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ module?: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/login?redirect=/access");

  const clerkUser = await currentUser();
  const userEmail = clerkUser?.primaryEmailAddress?.emailAddress ?? "";

  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) redirect("/access");

  let enrollments: string[] = [];
  try {
    enrollments = await getEnrollments(userEmail);
  } catch (err) {
    console.error("[access] getEnrollments failed:", err);
  }

  const freeCount = course.free_modules_count ?? 0;
  const hasPaidAccess = enrollments.includes(course.slug);

  // If course has no free modules and user has no access → go checkout
  if (freeCount === 0 && !hasPaidAccess) {
    redirect(`/checkout/${course.slug}`);
  }

  const { module: moduleParam } = await searchParams;
  const currentModuleIndex = moduleParam ? parseInt(moduleParam, 10) : 0;
  const validModuleIndex = Math.max(
    0,
    Math.min(Number.isFinite(currentModuleIndex) ? currentModuleIndex : 0, course.modules.length - 1),
  );

  const isModuleFree = validModuleIndex < freeCount;
  const canAccessModule = isModuleFree || hasPaidAccess;

  let materials: Awaited<ReturnType<typeof getCourseMaterials>> = [];
  try {
    materials = await getCourseMaterials(course.slug);
  } catch (err) {
    console.error("[access] getCourseMaterials failed:", err);
  }
  const moduleMaterials = materials
    .filter((m) => m.module_index === validModuleIndex)
    .sort((a, b) => a.order_index - b.order_index);

  let progress: Awaited<ReturnType<typeof getProgress>> = [];
  try {
    progress = await getProgress(userEmail, course.slug);
  } catch (err) {
    console.error("[access] getProgress failed:", err);
  }
  const completedModules = progress.filter((p) => p.completed).map((p) => p.module_index);

  const courseSlug = course.slug;
  const totalModules = course.modules.length;

  async function markModuleComplete(moduleIndex: number) {
    "use server";
    try {
      await updateProgress(userEmail, courseSlug, moduleIndex, true);
      revalidatePath(`/access/${courseSlug}`);
      revalidatePath("/dashboard");
    } catch (err) {
      console.error("[access] updateProgress failed:", err);
    }
  }

  const completedCount = completedModules.length;
  // Progress only counts free modules until paid, full 8 after
  const progressPercent = totalModules > 0 ? Math.round((completedCount / totalModules) * 100) : 0;
  const courseFinished = hasPaidAccess && completedCount === totalModules && totalModules > 0;

  return (
    <div className="bg-[#FEFBF5] min-h-screen">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8 flex flex-wrap items-center gap-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 rounded-xl border-2 border-[#2D5016] px-4 py-2 text-sm font-semibold text-[#2D5016] transition hover:bg-[#2D5016] hover:text-white"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Dashboard
          </Link>
          <div className="h-6 w-px bg-[#F0E8D8]" />
          <div>
            <span className="rounded-full bg-[#F0E8D8] px-2 py-0.5 text-xs font-semibold text-[#2D5016]">{course.category}</span>
            <h1 className="mt-1 text-2xl font-extrabold text-[#2D5016]">{course.title}</h1>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
          <div className="space-y-6">
            {canAccessModule ? (
              moduleMaterials.length > 0 ? (
                moduleMaterials.map((mat) => (
                  <div
                    key={mat.id}
                    className="overflow-hidden rounded-2xl border border-[#F0E8D8] bg-white shadow-sm"
                  >
                    {mat.video_url ? <VideoPlayer src={mat.video_url} title={mat.title} /> : null}
                    {mat.content ? (
                      <div className="p-6">
                        {!mat.video_url && <h2 className="text-xl font-bold text-[#2D5016]">{mat.title}</h2>}
                        <div
                          className={`${mat.video_url ? "" : "mt-4"} course-content`}
                          dangerouslySetInnerHTML={{ __html: mat.content }}
                        />
                      </div>
                    ) : !mat.video_url ? (
                      <div className="p-10 text-center">
                        <p className="text-sm text-[#444444]">Konten sedang dipersiapkan</p>
                      </div>
                    ) : null}
                  </div>
                ))
              ) : (
                <div className="overflow-hidden rounded-2xl border border-[#F0E8D8] bg-white">
                  <CourseThumbnail title={course.title} category={course.category} large />
                  <div className="p-6 text-center">
                    <p className="text-sm font-semibold text-[#2D5016]">Materi modul ini belum tersedia</p>
                    <p className="mt-2 text-xs text-[#5C4813]">
                      Tim Kaalupi sedang siapin video & materi. Pantau dashboard untuk update.
                    </p>
                  </div>
                </div>
              )
            ) : (
              /* Paywall card for locked modules */
              <div className="overflow-hidden rounded-2xl border-2 border-[#F5A62A] bg-white shadow-md">
                <div className="bg-[#FFF3D6] px-6 py-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F5A62A]/20">
                    <svg className="h-5 w-5 text-[#F5A62A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-extrabold text-[#2D5016]">Modul {validModuleIndex + 1} — Konten Berbayar</p>
                    <p className="text-xs text-[#5C4813]">Selesaikan 3 modul gratis dulu, lalu lanjut ke sini</p>
                  </div>
                </div>
                <div className="p-8 text-center">
                  <p className="text-2xl font-extrabold text-[#2D5016]">Jadi Founding Member</p>
                  <p className="mt-2 text-sm text-[#444]">
                    Akses modul 4–8 + lifetime access ke SEMUA course Kaalupi yang akan rilis.
                    <br />100 slot pertama — harga naik ke Rp 299K setelahnya.
                  </p>
                  <div className="mt-4 flex items-baseline justify-center gap-2">
                    <span className="text-3xl font-extrabold text-[#F5A62A]">
                      {formatter.format(course.founding_price ?? course.price)}
                    </span>
                    <span className="text-sm text-[#999] line-through">
                      {formatter.format(course.regular_price ?? course.original_price ?? 0)}
                    </span>
                  </div>
                  <Link
                    href={`/checkout/${course.slug}`}
                    className="mt-6 inline-block rounded-xl bg-[#F5A62A] px-8 py-3.5 text-sm font-bold text-[#2D5016] shadow-md transition hover:opacity-90"
                  >
                    Lanjut ke Pembayaran →
                  </Link>
                  {course.perks && (
                    <div className="mt-6 space-y-2 text-left">
                      {course.perks.map((perk) => (
                        <div key={perk} className="flex items-start gap-2 text-sm text-[#444]">
                          <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#7AB648]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          {perk}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="rounded-2xl border border-[#F0E8D8] bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-extrabold text-[#2D5016]">Modul Course</h2>
                <span className="text-sm text-[#444444]">
                  {completedCount}/{totalModules} selesai
                </span>
              </div>
              <div className="mt-4 space-y-2">
                {course.modules.map((module, index) => {
                  const isCompleted = completedModules.includes(index);
                  const isActive = index === validModuleIndex;
                  const isFree = index < freeCount;
                  const isLocked = !isFree && !hasPaidAccess;
                  return (
                    <Link
                      key={index}
                      href={`/access/${course.slug}?module=${index}`}
                      className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition ${
                        isActive
                          ? "border-[#F5A62A] bg-[#FFF3D6]"
                          : isCompleted
                          ? "border-[#7AB648]/30 bg-[#E8F5E9]"
                          : isLocked
                          ? "border-[#F0E8D8] bg-[#FAFAFA] opacity-70"
                          : "border-[#F0E8D8] bg-[#FEFBF5] hover:border-[#F5A62A]"
                      }`}
                    >
                      {isLocked ? (
                        <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#F0E8D8]">
                          <svg className="h-3.5 w-3.5 text-[#999]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        </div>
                      ) : isCompleted ? (
                        <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#7AB648]/20">
                          <svg className="h-4 w-4 text-[#7AB648]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      ) : (
                        <div className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${isActive ? "bg-[#F5A62A] text-white" : "bg-[#FFF3D6] text-[#F5A62A]"}`}>
                          {index + 1}
                        </div>
                      )}
                      <span className={`flex-1 text-sm ${isLocked ? "text-[#999]" : isCompleted ? "text-[#2D5016] font-medium" : "text-[#444444]"}`}>
                        {module}
                      </span>
                      {isFree && !hasPaidAccess && (
                        <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-bold text-green-700">Gratis</span>
                      )}
                      {isLocked && (
                        <span className="rounded-full bg-[#FFF3D6] px-2 py-0.5 text-xs font-semibold text-[#5C4813]">Founding</span>
                      )}
                      {isCompleted && <span className="text-xs font-semibold text-[#7AB648]">Selesai</span>}
                      {isActive && !isCompleted && !isLocked && <span className="text-xs font-semibold text-[#F5A62A]">Sedang dibuka</span>}
                    </Link>
                  );
                })}
              </div>

              <div className="mt-4 flex justify-between">
                <Link
                  href={`/access/${course.slug}${validModuleIndex > 0 ? `?module=${validModuleIndex - 1}` : ""}`}
                  className={`rounded-lg border px-4 py-2 text-sm font-semibold transition ${
                    validModuleIndex > 0
                      ? "border-[#2D5016] text-[#2D5016] hover:bg-[#2D5016] hover:text-white"
                      : "border-[#F0E8D8] text-[#CCC] cursor-not-allowed pointer-events-none"
                  }`}
                >
                  ← Sebelumnya
                </Link>
                <Link
                  href={`/access/${course.slug}${validModuleIndex < totalModules - 1 ? `?module=${validModuleIndex + 1}` : ""}`}
                  className={`rounded-lg border px-4 py-2 text-sm font-semibold transition ${
                    validModuleIndex < totalModules - 1
                      ? "border-[#2D5016] text-[#2D5016] hover:bg-[#2D5016] hover:text-white"
                      : "border-[#F0E8D8] text-[#CCC] cursor-not-allowed pointer-events-none"
                  }`}
                >
                  Selanjutnya →
                </Link>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-[#F0E8D8] bg-white p-6 shadow-sm">
              <h3 className="text-lg font-extrabold text-[#2D5016]">Progress Kamu</h3>
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#444444]">Penyelesaian</span>
                  <span className="font-bold text-[#2D5016]">{progressPercent}%</span>
                </div>
                <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-[#F0E8D8]">
                  <div className="h-full rounded-full bg-[#F5A62A] transition-all" style={{ width: `${progressPercent}%` }} />
                </div>
              </div>
              <ProgressTracker
                totalModules={course.modules.length}
                completedModules={completedModules}
                onModuleComplete={markModuleComplete}
              />
              {courseFinished && (
                <div className="mt-6 rounded-xl bg-[#FFF3D6] p-4">
                  <p className="text-sm font-bold text-[#5C4813]">Selamat — course selesai!</p>
                  <p className="mt-1 text-xs text-[#444444]">Klaim sertifikat & share ke LinkedIn</p>
                  <CertificateButton courseSlug={course.slug} />
                </div>
              )}
            </div>

            {!hasPaidAccess && (
              <div className="rounded-2xl border-2 border-[#F5A62A] bg-[#FFF3D6] p-5 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-wider text-[#7AB648]">Founding Members</p>
                <p className="mt-1 text-lg font-extrabold text-[#2D5016]">Lanjut ke 5 Modul Advanced</p>
                <p className="mt-1 text-xs text-[#5C4813]">
                  Web security, pentest, SOC, & final lab. Lifetime access ke semua course Kaalupi.
                </p>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold text-[#F5A62A]">{formatter.format(course.founding_price ?? course.price)}</span>
                  <span className="text-sm text-[#999] line-through">{formatter.format(course.regular_price ?? 299000)}</span>
                </div>
                <Link
                  href={`/checkout/${course.slug}`}
                  className="mt-3 block rounded-xl bg-[#2D5016] py-3 text-center text-sm font-bold text-white transition hover:opacity-90"
                >
                  Akses Semua 8 Modul →
                </Link>
              </div>
            )}

            <div className="rounded-2xl border border-[#F0E8D8] bg-white p-6 shadow-sm">
              <h3 className="text-lg font-extrabold text-[#2D5016]">Info Course</h3>
              <div className="mt-4 space-y-3 text-sm">
                {[
                  { label: "Level", value: course.level },
                  { label: "Format", value: course.format, capitalize: true },
                  { label: "Modul Gratis", value: `${freeCount} modul` },
                  { label: "Total Modul", value: course.modules.length },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <span className="text-[#444444]">{item.label}</span>
                    <span className={`font-semibold text-[#2D5016] ${item.capitalize ? "capitalize" : ""}`}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {canAccessModule && (
        <AiTutorChat courseSlug={course.slug} courseTitle={course.title} moduleIndex={validModuleIndex} />
      )}
    </div>
  );
}
