import { CourseCard } from "@/components/course-card";
import { getCourses } from "@/lib/content";
import { audienceTracks } from "@/lib/data";

export default async function CoursesPage() {
  const allCourses = await getCourses();

  return (
    <div>
      {/* Header */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-300">
            Course Catalog
          </p>
          <h1 className="mt-4 text-4xl font-semibold text-white md:text-5xl">
            Paket pembelajaran untuk jalur IT{" "}
            <span className="bg-gradient-to-r from-orange-400 to-yellow-300 bg-clip-text text-transparent">
              yang paling dicari
            </span>
          </h1>
          <p className="mt-6 text-base leading-8 text-slate-400">
            Dari programming sampai cyber security — setiap course dirancang dengan kurikulum terstruktur
            dan project-based learning.
          </p>
        </div>
      </section>

      {/* Tracks filter */}
      <section className="border-t border-white/5">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="flex flex-wrap justify-center gap-3">
            <span className="rounded-full bg-gradient-to-r from-orange-500 to-yellow-400 px-4 py-2 text-sm font-medium text-slate-950">
              All Courses ({allCourses.length})
            </span>
            {audienceTracks.map((track) => {
              const count = allCourses.filter((c) => c.category.toLowerCase().includes(track.title.split(" ")[0].toLowerCase())).length;
              return count > 0 ? (
                <span
                  key={track.title}
                  className="rounded-full border border-white/12 px-4 py-2 text-sm text-slate-300"
                >
                  {track.title} ({count})
                </span>
              ) : null;
            })}
          </div>
        </div>
      </section>

      {/* Course grid */}
      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {allCourses.map((course) => (
            <CourseCard key={course.slug} course={course} />
          ))}
        </div>
      </section>
    </div>
  );
}
