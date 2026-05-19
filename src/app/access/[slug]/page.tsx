import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getEnrollments, getProgress, updateProgress, getCourseMaterials } from "@/lib/db";
import { getCourseBySlug } from "@/lib/content";
import { ProgressTracker } from "@/components/progress-tracker";
import { CourseThumbnail } from "@/components/course-thumbnail";
import { VideoPlayer } from "@/components/video-player";
import { CertificateButton } from "@/components/certificate-button";
import { AiTutorChat } from "@/components/ai-tutor-chat";

export default async function CourseAccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ module?: string }>;
}) {
  const { userId } = await auth();
  if (!userId) {
    redirect("/login?redirect=/access");
  }

  const clerkUser = await currentUser();
  const userEmail = clerkUser?.primaryEmailAddress?.emailAddress ?? "";

  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) {
    redirect("/access");
  }

  let enrollments: string[] = [];
  try {
    enrollments = await getEnrollments(userEmail);
  } catch (err) {
    console.error("[access] getEnrollments failed:", err);
  }
  const hasAccess = enrollments.includes(course.slug);

  if (!hasAccess) {
    redirect(`/checkout/${course.slug}`);
  }

  const { module: moduleParam } = await searchParams;
  const currentModuleIndex = moduleParam ? parseInt(moduleParam, 10) : 0;
  const validModuleIndex = Math.max(
    0,
    Math.min(Number.isFinite(currentModuleIndex) ? currentModuleIndex : 0, course.modules.length - 1),
  );

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
    } catch (err) {
      console.error("[access] updateProgress failed:", err);
    }
  }

  const completedCount = completedModules.length;
  const progressPercent = totalModules > 0 ? Math.round((completedCount / totalModules) * 100) : 0;
  const courseFinished = completedCount === totalModules && totalModules > 0;

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
            {moduleMaterials.length > 0 ? (
              moduleMaterials.map((mat) => (
                <div
                  key={mat.id}
                  className="overflow-hidden rounded-2xl border border-[#F0E8D8] bg-white shadow-sm"
                >
                  {mat.video_url ? (
                    <VideoPlayer src={mat.video_url} title={mat.title} />
                  ) : null}
                  {mat.content ? (
                    <div className="p-6">
                      {!mat.video_url && (
                        <h2 className="text-xl font-bold text-[#2D5016]">{mat.title}</h2>
                      )}
                      <div
                        className={`${mat.video_url ? "" : "mt-4"} prose prose-sm max-w-none text-[#444444]`}
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
                  return (
                    <Link
                      key={index}
                      href={`/access/${course.slug}?module=${index}`}
                      className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition ${
                        isActive
                          ? "border-[#F5A62A] bg-[#FFF3D6]"
                          : isCompleted
                          ? "border-[#7AB648]/30 bg-[#E8F5E9]"
                          : "border-[#F0E8D8] bg-[#FEFBF5] hover:border-[#F5A62A]"
                      }`}
                    >
                      {isCompleted ? (
                        <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#7AB648]/20">
                          <svg className="h-4 w-4 text-[#7AB648]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      ) : (
                        <div
                          className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                            isActive ? "bg-[#F5A62A] text-white" : "bg-[#FFF3D6] text-[#F5A62A]"
                          }`}
                        >
                          {index + 1}
                        </div>
                      )}
                      <span className={`flex-1 text-sm ${isCompleted ? "text-[#2D5016] font-medium" : "text-[#444444]"}`}>{module}</span>
                      {isCompleted && <span className="text-xs font-semibold text-[#7AB648]">Selesai</span>}
                      {isActive && !isCompleted && <span className="text-xs font-semibold text-[#F5A62A]">Sedang dibuka</span>}
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
                  <div
                    className="h-full rounded-full bg-[#F5A62A] transition-all"
                    style={{ width: `${progressPercent}%` }}
                  />
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

            <div className="rounded-2xl border border-[#F0E8D8] bg-white p-6 shadow-sm">
              <h3 className="text-lg font-extrabold text-[#2D5016]">Info Course</h3>
              <div className="mt-4 space-y-3 text-sm">
                {[
                  { label: "Level", value: course.level },
                  { label: "Format", value: course.format, capitalize: true },
                  { label: "Modul", value: course.modules.length },
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

      <AiTutorChat courseSlug={course.slug} courseTitle={course.title} moduleIndex={validModuleIndex} />
    </div>
  );
}
