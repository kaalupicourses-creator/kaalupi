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
  return (
    <article className="group relative flex flex-col rounded-2xl border border-white/10 bg-white/5 overflow-hidden transition hover:border-amber-300/30 hover:shadow-[0_0_32px_rgba(249,115,22,0.08)]">
      {/* Thumbnail */}
      <CourseThumbnail title={course.title} category={course.category} />
      {/* Top accent line */}
      <div className="h-1 w-full bg-gradient-to-r from-orange-500 to-yellow-400 opacity-0 transition-opacity group-hover:opacity-100" />

      <div className="flex flex-1 flex-col p-6">
        {/* Badges */}
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-white/8 px-3 py-1 text-xs text-slate-300">
            {course.category}
          </span>
          <span className="rounded-full bg-amber-300/10 px-3 py-1 text-xs text-amber-300">
            {course.level}
          </span>
        </div>

        {/* Title */}
        <h3 className="mt-5 text-xl font-semibold text-white group-hover:text-amber-200 transition">
          {course.title}
        </h3>

        {/* Summary */}
        <p className="mt-3 text-sm leading-7 text-slate-400 line-clamp-2">
          {course.summary}
        </p>

        {/* Modules preview */}
        <div className="mt-4 space-y-2">
          {course.modules.slice(0, 3).map((module, index) => (
            <div key={index} className="flex items-center gap-2 text-xs text-slate-400">
              <svg className="h-3.5 w-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              {module}
            </div>
          ))}
          {course.modules.length > 3 && (
            <p className="text-xs text-slate-500">+{course.modules.length - 3} more</p>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 flex items-end justify-between gap-4 border-t border-white/10 pt-5">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {course.duration}
              <svg className="h-3.5 w-3.5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d={formatIcons[course.format] ?? formatIcons.video} />
              </svg>
              <span className="capitalize">{course.format}</span>
            </div>
            <p className="mt-1 text-lg font-semibold bg-gradient-to-r from-orange-400 to-yellow-300 bg-clip-text text-transparent">
              {formatter.format(course.price)}
            </p>
          </div>
          <Link
            href={`/courses/${course.slug}`}
            className="flex items-center gap-1 rounded-full border border-white/12 px-4 py-2 text-sm text-white transition hover:border-amber-300/50 hover:bg-amber-300/5"
          >
            Detail
            <svg className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
}
