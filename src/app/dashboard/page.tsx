import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { RoleBadge } from "@/components/role-badge";
import { getEnrollments } from "@/lib/db";
import { getCourses } from "@/lib/content";
import { CourseThumbnail } from "@/components/course-thumbnail";

const roleDescriptions = {
  admin:
    "Akses penuh untuk mengelola course, governance, dan memantau payment flow.",
  instructor:
    "Dapat menambahkan materi baru, mengatur course, dan menjaga kualitas konten.",
  student:
    "Dapat mengakses course yang sudah dibeli dan melanjutkan pembelajaran.",
};

export default async function DashboardPage() {
  const { userId, sessionClaims } = await auth();
  if (!userId) {
    redirect("/login?redirect=/dashboard");
  }

  const user = await currentUser();
  const role = (sessionClaims?.metadata as { role?: string })?.role ?? "student";

  const nameParts = [user?.firstName, user?.lastName].filter(Boolean).join(" ");
  const userName = nameParts || user?.primaryEmailAddress?.emailAddress || "";
  const userEmail = user?.primaryEmailAddress?.emailAddress ?? "";

  const allCourses = await getCourses();
  const enrollments = await getEnrollments(userEmail);
  const ownedCourses = allCourses.filter((course) => enrollments.includes(course.slug));

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      {/* Welcome Section */}
      <section className="mb-8 rounded-[2rem] border border-white/10 bg-white/5 p-8">
        <div className="flex flex-wrap items-center gap-3">
          <RoleBadge role={role as "admin" | "instructor" | "student"} />
          <p className="text-sm text-slate-400">{userEmail}</p>
        </div>
        <h1 className="mt-4 text-4xl font-semibold text-white">
          Halo, {userName}
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300">
          {roleDescriptions[role as keyof typeof roleDescriptions] ?? roleDescriptions.student}
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          {(role === "admin" || role === "instructor") ? (
            <Link
              href="/dashboard/content/new"
              className="rounded-full bg-[linear-gradient(135deg,#f97316,#facc15)] px-5 py-3 text-sm font-semibold text-slate-950"
            >
              Publish New Course
            </Link>
          ) : null}
          <Link
            href="/courses"
            className="rounded-full border border-white/12 px-5 py-3 text-sm text-white"
          >
            Browse Catalog
          </Link>
        </div>
      </section>

      {/* Stats Overview */}
      <section className="mb-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/20">
              <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-slate-400">My Courses</p>
              <p className="text-2xl font-semibold text-white">{ownedCourses.length}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20">
              <svg className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-slate-400">Total Catalog</p>
              <p className="text-2xl font-semibold text-white">{allCourses.length}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20">
              <svg className="h-5 w-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-slate-400">Role</p>
              <p className="text-lg font-semibold capitalize text-white">{role}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/20">
              <svg className="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-slate-400">Progress</p>
              <p className="text-2xl font-semibold text-white">--%</p>
            </div>
          </div>
        </div>
      </section>

      {/* My Courses */}
      <section className="rounded-[2rem] border border-white/10 bg-white/5 p-8">
        <div className="flex items-end justify-between gap-6">
          <div>
            <h2 className="text-3xl font-semibold text-white">My Courses</h2>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              Daftar course yang saat ini aktif untuk akun login.
            </p>
          </div>
          <p className="text-sm text-amber-300">{ownedCourses.length} active</p>
        </div>

        {ownedCourses.length ? (
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {ownedCourses.map((course) => (
              <article key={course.slug} className="group rounded-[1.75rem] border border-white/10 bg-slate-950/40 overflow-hidden transition hover:border-amber-300/30">
                <CourseThumbnail title={course.title} category={course.category} />
                <div className="p-5">
                  <p className="text-sm text-slate-400">{course.category}</p>
                  <h3 className="mt-2 text-xl font-semibold text-white group-hover:text-amber-200 transition">{course.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-300 line-clamp-2">{course.summary}</p>
                  <Link
                    href={`/access/${course.slug}`}
                    className="mt-4 inline-flex items-center gap-1 text-sm text-amber-300 hover:text-amber-200"
                  >
                    Mulai belajar
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-[1.75rem] bg-slate-950/40 p-10 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/5">
              <svg className="h-8 w-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <p className="mt-4 text-base font-medium text-white">Belum ada course aktif</p>
            <p className="mt-2 text-sm text-slate-400">
              Buka katalog lalu lakukan checkout untuk mulai belajar.
            </p>
            <Link
              href="/courses"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#f97316,#facc15)] px-5 py-3 text-sm font-semibold text-slate-950"
            >
              Browse Catalog
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
