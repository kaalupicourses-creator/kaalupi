import Link from "next/link";
import { CourseCard } from "@/components/course-card";
import { getCourses } from "@/lib/content";
import type { Course } from "@/lib/data";

function ComingSoonBox({ course }: { course: Course }) {
  return (
    <div className="flex flex-col rounded-2xl border border-[#F0E8D8] bg-[#FEFBF5] p-6 select-none">
      <div className="flex items-center justify-between gap-2">
        <span className="rounded-full bg-[#F0E8D8] px-3 py-1 text-xs font-semibold text-[#2D5016]">
          {course.category}
        </span>
        <span className="rounded-full bg-[#FFF3D6] px-3 py-1 text-xs font-bold text-[#5C4813]">
          🔜 Segera Hadir
        </span>
      </div>
      <h3 className="mt-4 text-lg font-bold text-[#2D5016] leading-snug">
        {course.title}
      </h3>
      <p className="mt-2 text-sm leading-6 text-[#444444] line-clamp-2">
        {course.summary}
      </p>
      <div className="mt-auto pt-5 border-t border-[#F0E8D8] mt-5">
        <p className="text-xs text-[#7AB648] font-semibold">
          ✉️ Daftar waitlist untuk notifikasi rilis
        </p>
      </div>
    </div>
  );
}

export default async function CoursesPage() {
  const allCourses = await getCourses();
  const activeCourses = allCourses.filter((c) => !c.comingSoon);
  const comingSoonCourses = allCourses.filter((c) => c.comingSoon);

  return (
    <div className="bg-[#FEFBF5]">
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#7AB648]">
            Course Catalog
          </p>
          <h1 className="mt-4 text-4xl font-extrabold text-[#2D5016] md:text-5xl">
            Paket pembelajaran untuk jalur IT{" "}
            <span className="text-[#F5A62A]">yang paling dicari</span>
          </h1>
          <p className="mt-6 text-base leading-8 text-[#444444]">
            Dari AI sampai cyber security — setiap course dirancang dengan kurikulum terstruktur
            dan project-based learning.
          </p>
        </div>
      </section>

      {/* Active Courses */}
      <section className="border-t border-[#F0E8D8]">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="flex items-center gap-3 mb-8">
            <span className="rounded-full bg-[#2D5016] px-4 py-1.5 text-sm font-bold text-[#F5A62A]">
              ✅ {activeCourses.length} Course Aktif
            </span>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {activeCourses.map((course) => (
              <CourseCard key={course.slug} course={course} />
            ))}
          </div>
        </div>
      </section>

      {/* Coming Soon */}
      {comingSoonCourses.length > 0 && (
        <section className="border-t border-[#F0E8D8] bg-white">
          <div className="mx-auto max-w-7xl px-6 py-12">
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="rounded-full bg-[#FFF3D6] px-4 py-1.5 text-sm font-bold text-[#5C4813]">
                  🔜 Segera Hadir
                </span>
                <p className="mt-3 text-sm text-[#444444]">
                  Daftar waitlist untuk dapat notifikasi lebih awal dan harga early bird.
                </p>
              </div>
              <Link
                href="/waitlist"
                className="rounded-xl bg-[#F5A62A] px-5 py-2.5 text-sm font-bold text-[#2D5016] transition hover:opacity-90"
              >
                Daftar Waitlist →
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              {comingSoonCourses.slice(0, 3).map((course) => (
                <ComingSoonBox key={course.slug} course={course} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
