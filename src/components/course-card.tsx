import Link from "next/link";
import { CourseThumbnail } from "@/components/course-thumbnail";
import type { Course } from "@/lib/data";

const formatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

const formatIcons: Record<string, string> = {
  video: "M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  article: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
  blended: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26 3.66.64 4.054-1.09l.371-1.629A2 2 0 0020.293 12H8V4z",
};

export function CourseCard({ course }: { course: Course }) {
  const isComingSoon = course.comingSoon === true;

  return (
    <article className={`group relative flex flex-col rounded-2xl border bg-white overflow-hidden transition ${isComingSoon ? "border-[#F0E8D8] opacity-90" : "border-[#F0E8D8] hover:border-[#F5A62A] hover:shadow-sm"}`}>
      {/* Thumbnail */}
      <div className="relative">
        <CourseThumbnail title={course.title} category={course.category} />
        {isComingSoon && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#2D5016]/70 backdrop-blur-[2px]">
            <div className="rounded-full bg-[#F5A62A] px-5 py-2 text-sm font-extrabold text-[#2D5016] shadow-lg">
              🔜 Segera Hadir
            </div>
          </div>
        )}
      </div>
      {!isComingSoon && (
        <div className="h-1 w-full bg-[#F5A62A] opacity-0 transition-opacity group-hover:opacity-100" />
      )}

      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-[#F0E8D8] px-3 py-1 text-xs font-semibold text-[#2D5016]">
            {course.category}
          </span>
          <span className="rounded-full bg-[#FFF3D6] px-3 py-1 text-xs font-semibold text-[#5C4813]">
            {course.level}
          </span>
          {!isComingSoon && (
            <span className="rounded-full bg-[#2D5016] px-3 py-1 text-xs font-bold text-[#F5A62A]">
              Tersedia
            </span>
          )}
        </div>

        <h3 className={`mt-5 text-xl font-bold text-[#2D5016] transition ${isComingSoon ? "" : "group-hover:text-[#F5A62A]"}`}>
          {course.title}
        </h3>

        <p className="mt-3 text-sm leading-7 text-[#444444] line-clamp-2">
          {course.summary}
        </p>

        {!isComingSoon && (
          <div className="mt-4 space-y-2">
            {course.modules.slice(0, 3).map((module, index) => (
              <div key={index} className="flex items-center gap-2 text-xs text-[#444444]">
                <svg className="h-3.5 w-3.5 text-[#7AB648]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {module}
              </div>
            ))}
            {course.modules.length > 3 && (
              <p className="text-xs text-[#444444]">+{course.modules.length - 3} modul lainnya</p>
            )}
          </div>
        )}

        {isComingSoon && (
          <div className="mt-4 rounded-xl border border-[#F0E8D8] bg-[#FEFBF5] px-4 py-3 text-xs text-[#444444]">
            🗓️ Estimasi rilis: Q3 2025 — Daftarkan diri ke <span className="font-semibold text-[#2D5016]">waitlist</span> untuk notifikasi lebih awal.
          </div>
        )}

        <div className="mt-6 flex items-end justify-between gap-4 border-t border-[#F0E8D8] pt-5">
          <div>
            {!isComingSoon ? (
              <>
                <div className="flex items-center gap-2 text-xs text-[#444444]">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {course.duration}
                  <svg className="h-3.5 w-3.5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={formatIcons[course.format] ?? formatIcons.video} />
                  </svg>
                  <span className="capitalize">{course.format}</span>
                </div>
                <p className="mt-1 text-lg font-extrabold text-[#2D5016]">
                  {formatter.format(course.price)}
                </p>
              </>
            ) : (
              <p className="text-sm font-semibold text-[#444444]">Harga belum ditentukan</p>
            )}
          </div>
          {isComingSoon ? (
            <Link
              href="/waitlist"
              className="flex items-center gap-1 rounded-xl bg-[#FFF3D6] px-4 py-2 text-sm font-semibold text-[#5C4813] transition hover:bg-[#F5A62A] hover:text-[#2D5016]"
            >
              Waitlist
            </Link>
          ) : (
            <Link
              href={`/courses/${course.slug}`}
              className="flex items-center gap-1 rounded-xl border-2 border-[#2D5016] px-4 py-2 text-sm font-semibold text-[#2D5016] transition hover:bg-[#2D5016] hover:text-white"
            >
              Detail
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
