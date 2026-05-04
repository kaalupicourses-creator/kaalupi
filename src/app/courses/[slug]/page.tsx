import Link from "next/link";
import { notFound } from "next/navigation";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { CheckoutButton } from "@/components/checkout-button";
import { getCourseBySlug } from "@/lib/content";
import { getEnrollments } from "@/lib/db";
import { CourseThumbnail } from "@/components/course-thumbnail";

const formatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  const { userId } = await auth();

  let hasAccess = false;
  if (userId) {
    const clerk = await clerkClient();
    const user = await clerk.users.getUser(userId);
    const userEmail = user.primaryEmailAddress?.emailAddress ?? "";
    const enrollments = await getEnrollments(userEmail);
    hasAccess = enrollments.includes(course?.slug ?? "");
  }

  if (!course) {
    notFound();
  }

  return (
    <div>
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm text-slate-400">
          <Link href="/courses" className="hover:text-amber-300 transition">
            Courses
          </Link>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-white">{course.title}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-2">
          {/* Left: Info */}
          <div className="flex flex-col justify-center">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-white/8 px-3 py-1 text-xs font-medium text-slate-300">
                {course.category}
              </span>
              <span className="rounded-full bg-amber-300/10 px-3 py-1 text-xs text-amber-300">
                {course.level}
              </span>
            </div>

            <h1 className="mt-6 text-4xl font-semibold text-white md:text-5xl">
              {course.title}
            </h1>

            <p className="mt-6 text-lg leading-8 text-slate-300">
              {course.hero}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {course.duration}
              </div>
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="capitalize">{course.format}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                {course.modules.length} modul
              </div>
            </div>
          </div>

          {/* Right: Thumbnail */}
          <div className="flex items-center">
            <div className="w-full overflow-hidden rounded-2xl border border-white/10">
              <CourseThumbnail title={course.title} category={course.category} large />
            </div>
          </div>
        </div>
      </section>

      {/* Content grid */}
      <section className="border-t border-white/5">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr]">
            {/* Left: Outcomes + Modules */}
            <div className="space-y-10">
              {/* Outcomes */}
              <div>
                <h2 className="text-2xl font-semibold text-white">Learning Outcomes</h2>
                <div className="mt-6 space-y-4">
                  {course.outcomes.map((item, index) => (
                    <div key={index} className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-4">
                      <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500/20">
                        <svg className="h-3.5 w-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="text-sm leading-7 text-slate-300">{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modules */}
              <div>
                <h2 className="text-2xl font-semibold text-white">Course Modules</h2>
                <div className="mt-6 space-y-3">
                  {course.modules.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 px-5 py-4 transition hover:border-white/15"
                    >
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500/20 to-yellow-400/20 text-xs font-bold text-amber-300">
                        {index + 1}
                      </div>
                      <p className="text-sm text-slate-300">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Pricing card */}
            <aside>
              <div className="sticky top-24 rounded-2xl border border-white/10 bg-white/5 p-8">
                <p className="text-sm text-slate-400">Investasi belajar</p>
                <p className="mt-2 text-4xl font-semibold bg-gradient-to-r from-orange-400 to-yellow-300 bg-clip-text text-transparent">
                  {formatter.format(course.price)}
                </p>
                <p className="mt-4 text-sm leading-7 text-slate-400">{course.summary}</p>

                <div className="mt-8">
                  {hasAccess ? (
                    <Link
                      href={`/access/${course.slug}`}
                      className="block rounded-full bg-gradient-to-r from-orange-500 to-yellow-400 px-5 py-3.5 text-center text-sm font-semibold text-slate-950 shadow-[0_0_24px_rgba(249,115,22,0.3)]"
                    >
                      Mulai Belajar
                    </Link>
                  ) : (
                    <CheckoutButton slug={course.slug} amount={course.price} />
                  )}
                </div>

                <div className="mt-6 space-y-3 text-sm text-slate-400">
                  <div className="flex items-center gap-2">
                    <svg className="h-4 w-4 flex-shrink-0 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span>Pembayaran aman via Midtrans</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="h-4 w-4 flex-shrink-0 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span>Akses materi setelah pembayaran</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="h-4 w-4 flex-shrink-0 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span>Progress tracking per modul</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="h-4 w-4 flex-shrink-0 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span>Lifetime access</span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
