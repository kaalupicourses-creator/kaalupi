import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getEnrollments, getProgress, updateProgress } from "@/lib/db";
import { getCourseBySlug } from "@/lib/content";
import { ProgressTracker } from "@/components/progress-tracker";
import { CourseThumbnail } from "@/components/course-thumbnail";

export default async function CourseAccessPage({
  params,
}: {
  params: Promise<{ slug: string }>;
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

  // After redirect, course is not null
  const safeCourse = course;

  const enrollments = await getEnrollments(userEmail);
  const hasAccess = enrollments.includes(safeCourse.slug);

  if (!hasAccess) {
    redirect(`/checkout/${safeCourse.slug}`);
  }

  const progress = await getProgress(userEmail, safeCourse.slug);
  const completedModules = progress.filter((p) => p.completed).map((p) => p.module_index);
  const courseSlug = safeCourse.slug;

  async function handleModuleComplete(moduleIndex: number) {
    "use server";
    await updateProgress(userEmail, courseSlug, moduleIndex, true);
    
    // Check if all modules completed - trigger certificate generation
    const updatedProgress = await getProgress(userEmail, courseSlug);
    const completedCount = updatedProgress.filter((p) => p.completed).length;
    
    if (completedCount === totalModules) {
      // Generate certificate
      try {
        await fetch("/api/certificates", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ courseSlug: safeCourse.slug }),
        });
      } catch (err) {
        console.error("Certificate generation failed:", err);
      }
    }
  }

  const completedCount = completedModules.length;
  const totalModules = safeCourse.modules.length;
  const progressPercent = totalModules > 0 ? Math.round((completedCount / totalModules) * 100) : 0;

  return (
    <div className="bg-[#FEFBF5] min-h-screen">
      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* Header */}
        <div className="mb-8 flex flex-wrap items-center gap-4">
          <Link
            href="/access"
            className="flex items-center gap-2 rounded-xl border-2 border-[#2D5016] px-4 py-2 text-sm font-semibold text-[#2D5016] transition hover:bg-[#2D5016] hover:text-white"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Kembali
          </Link>
          <div className="h-6 w-px bg-[#F0E8D8]" />
          <div>
            <span className="rounded-full bg-[#F0E8D8] px-2 py-0.5 text-xs font-semibold text-[#2D5016]">{safeCourse.category}</span>
            <h1 className="mt-1 text-2xl font-extrabold text-[#2D5016]">{safeCourse.title}</h1>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
          <div className="space-y-6">
            {/* Course Thumbnail */}
            <div className="overflow-hidden rounded-2xl border border-[#F0E8D8]">
              <CourseThumbnail title={safeCourse.title} category={safeCourse.category} large />
            </div>

            {/* Module List */}
            <div className="rounded-2xl border border-[#F0E8D8] bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-extrabold text-[#2D5016]">Konten Course</h2>
                <span className="text-sm text-[#444444]">{completedCount}/{totalModules} selesai</span>
              </div>
              <div className="mt-4 space-y-2">
                {safeCourse.modules.map((module, index) => {
                  const isCompleted = completedModules.includes(index);
                  return (
                    <div
                      key={index}
                      className={`group flex items-center gap-3 rounded-xl border px-4 py-3 transition ${
                        isCompleted
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
                        <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#FFF3D6] text-xs font-bold text-[#F5A62A]">
                          {index + 1}
                        </div>
                      )}
                      <span className={`flex-1 text-sm ${isCompleted ? "text-[#2D5016] font-medium" : "text-[#444444]"}`}>
                        {module}
                      </span>
                      {isCompleted && (
                        <span className="text-xs font-semibold text-[#7AB648]">Selesai</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="space-y-6">
             {/* Progress Card */}
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
                totalModules={safeCourse.modules.length}
                completedModules={completedModules}
                onModuleComplete={handleModuleComplete}
              />
              {completedCount === totalModules && (
                <div className="mt-6 rounded-xl bg-[#FFF3D6] p-4">
                  <p className="text-sm font-bold text-[#5C4813]">🎉 Selamat! Course telah selesai</p>
                  <p className="mt-1 text-xs text-[#444444]">Sertifikat akan segera dibuatkan</p>
                  <button
                    onClick={async () => {
                      const response = await fetch("/api/certificates", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ courseSlug: safeCourse.slug }),
                      });
                      const data = await response.json();
                      if (data.url) {
                        window.open(data.url, "_blank");
                      }
                    }}
                    className="mt-3 rounded-lg bg-[#2D5016] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1A3A0F] transition"
                  >
                    📜 Lihat Sertifikat & Share ke LinkedIn
                  </button>
                </div>
              )}
            </div>

            {/* Course Info */}
            <div className="rounded-2xl border border-[#F0E8D8] bg-white p-6 shadow-sm">
              <h3 className="text-lg font-extrabold text-[#2D5016]">Info Course</h3>
              <div className="mt-4 space-y-3 text-sm">
                {[
                  { icon: "M13 10V3L4 14h7v7l9-11h-7z", label: "Level", value: safeCourse.level },
                  { icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", label: "Durasi", value: safeCourse.duration },
                  { icon: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z", label: "Format", value: safeCourse.format, capitalize: true },
                  { icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z", label: "Modul", value: safeCourse.modules.length },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[#444444]">
                      <svg className="h-4 w-4 text-[#F5A62A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                      </svg>
                      {item.label}
                    </div>
                    <span className={`font-semibold text-[#2D5016] ${item.capitalize ? "capitalize" : ""}`}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
