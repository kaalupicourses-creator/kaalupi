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

  const enrollments = await getEnrollments(userEmail);
  const hasAccess = enrollments.includes(course.slug);

  if (!hasAccess) {
    redirect(`/checkout/${course.slug}`);
  }

  const progress = await getProgress(userEmail, course.slug);
  const completedModules = progress.filter((p) => p.completed).map((p) => p.module_index);
  const courseSlug = course.slug;

  async function handleModuleComplete(moduleIndex: number) {
    "use server";
    await updateProgress(userEmail, courseSlug, moduleIndex, true);
  }

  const completedCount = completedModules.length;
  const totalModules = course.modules.length;
  const progressPercent = totalModules > 0 ? Math.round((completedCount / totalModules) * 100) : 0;

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      {/* Header */}
      <div className="mb-8 flex flex-wrap items-center gap-4">
        <Link
          href="/access"
          className="flex items-center gap-2 rounded-full border border-white/12 px-4 py-2 text-sm text-white transition hover:border-amber-300 hover:text-amber-200"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </Link>
        <div className="h-6 w-px bg-white/10" />
        <div>
          <p className="text-sm text-amber-300">{course.category}</p>
          <h1 className="text-2xl font-semibold text-white">{course.title}</h1>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-6">
          {/* Video Player */}
          <div className="overflow-hidden rounded-2xl border border-white/10">
            <CourseThumbnail title={course.title} category={course.category} large />
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Course Content</h2>
              <span className="text-sm text-slate-400">{completedCount}/{totalModules} completed</span>
            </div>
            <div className="mt-4 space-y-2">
              {course.modules.map((module, index) => {
                const isCompleted = completedModules.includes(index);
                return (
                  <div
                    key={index}
                    className={`group flex items-center gap-3 rounded-xl border px-4 py-3 transition ${
                      isCompleted
                        ? "border-emerald-500/30 bg-emerald-500/10"
                        : "border-white/10 bg-white/5 hover:border-amber-300/30"
                    }`}
                  >
                    {isCompleted ? (
                      <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500/20">
                        <svg className="h-4 w-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    ) : (
                      <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border border-slate-500 text-xs text-slate-400">
                        {index + 1}
                      </div>
                    )}
                    <span className={`flex-1 text-sm ${isCompleted ? "text-emerald-200" : "text-slate-300"}`}>
                      {module}
                    </span>
                    {isCompleted && (
                      <span className="text-xs text-emerald-400">Done</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Progress Card */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-lg font-semibold text-white">Your Progress</h3>
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Completion</span>
                <span className="font-medium text-white">{progressPercent}%</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-orange-500 to-yellow-400 transition-all"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
            <ProgressTracker
              totalModules={course.modules.length}
              completedModules={completedModules}
              onModuleComplete={handleModuleComplete}
            />
          </div>

          {/* Course Info */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-lg font-semibold text-white">Course Info</h3>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-400">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Level
                </div>
                <span className="font-medium text-white">{course.level}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-400">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Duration
                </div>
                <span className="font-medium text-white">{course.duration}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-400">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Format
                </div>
                <span className="font-medium capitalize text-white">{course.format}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-400">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Modules
                </div>
                <span className="font-medium text-white">{course.modules.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
