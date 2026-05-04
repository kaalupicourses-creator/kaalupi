import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getEnrollments } from "@/lib/db";
import { getCourses } from "@/lib/content";
import { CourseThumbnail } from "@/components/course-thumbnail";

export default async function AccessPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/login?redirect=/access");
  }

  const clerkUser = await currentUser();
  const userEmail = clerkUser?.primaryEmailAddress?.emailAddress ?? "";

  const enrollments = await getEnrollments(userEmail);
  const allCourses = await getCourses();
  const owned = allCourses.filter((course) => enrollments.includes(course.slug));

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      {/* Header */}
      <section className="mb-10 rounded-[2rem] border border-white/10 bg-white/5 p-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20">
            <svg className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-300">
              My Access
            </p>
            <h1 className="mt-1 text-3xl font-semibold text-white">
              Materi yang sudah bisa diakses
            </h1>
          </div>
        </div>
        <p className="mt-4 text-sm text-slate-400">{userEmail}</p>
        <div className="mt-4 flex items-center gap-2 text-sm">
          <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
            {owned.length} course{owned.length !== 1 ? "s" : ""} active
          </span>
        </div>
      </section>

      {/* Course Grid */}
      {owned.length ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {owned.map((course) => (
            <article key={course.slug} className="group rounded-[2rem] border border-white/10 bg-white/5 overflow-hidden transition hover:border-amber-300/30">
              <CourseThumbnail title={course.title} category={course.category} />
              <div className="p-6">
                <p className="text-sm text-amber-300">{course.category}</p>
                <h2 className="mt-2 text-xl font-semibold text-white group-hover:text-amber-200 transition">
                  {course.title}
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-300 line-clamp-2">{course.summary}</p>

                <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {course.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    {course.level}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    {course.format}
                  </span>
                </div>

                <div className="mt-5 flex gap-3">
                  <Link
                    href={`/access/${course.slug}`}
                    className="flex-1 rounded-full bg-[linear-gradient(135deg,#f97316,#facc15)] px-4 py-2.5 text-center text-sm font-semibold text-slate-950 transition hover:opacity-90"
                  >
                    Mulai Belajar
                  </Link>
                  <Link
                    href={`/courses/${course.slug}`}
                    className="rounded-full border border-white/12 px-4 py-2.5 text-sm text-white transition hover:border-white/20"
                  >
                    Detail
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-12 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/5">
            <svg className="h-8 w-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <p className="mt-4 text-base font-medium text-white">Belum ada akses course aktif</p>
          <p className="mt-2 text-sm text-slate-400">
            Lihat katalog dan lakukan checkout untuk mulai belajar.
          </p>
          <Link
            href="/courses"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#f97316,#facc15)] px-5 py-3 text-sm font-semibold text-slate-950"
          >
            Buka katalog
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      )}
    </div>
  );
}
