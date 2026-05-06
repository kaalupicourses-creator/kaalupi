import Link from "next/link";
import { CourseThumbnail } from "@/components/course-thumbnail";
import { courses, comingSoonTracks } from "@/lib/data";

export default function CoursesPage() {
  const publishedCourses = courses.filter((c) => c.is_published);

  return (
    <div className="bg-[#FEFBF5]">
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#7AB648]">
            Our First Launch
          </p>
          <h1 className="mt-4 text-4xl font-extrabold text-[#2D5016] md:text-5xl">
            AI untuk Pemula — <span className="text-[#F5A62A]">Gratis</span>
          </h1>
          <p className="mt-6 text-base leading-8 text-[#444444]">
            Course perdana Kaalupi. Pelajari AI dari nol tanpa background teknis. 
            Langsung praktik dengan tools AI populer.
          </p>
        </div>
      </section>

      {/* Published Course - AI untuk Pemula */}
      {publishedCourses.map((course) => (
        <section key={course.slug} className="border-t border-[#F0E8D8]">
          <div className="mx-auto max-w-7xl px-6 py-12">
            <div className="mx-auto max-w-5xl">
              <div className="overflow-hidden rounded-3xl border border-[#F0E8D8] bg-white lg:grid lg:grid-cols-2">
                {/* Thumbnail */}
                <div className="relative w-full min-h-[250px] md:min-h-[300px]">
                  <CourseThumbnail
                    title={course.title}
                    category={course.category}
                    className="h-full w-full object-cover"
                    large={true}
                  />
                </div>

                {/* Content */}
                <div className="flex flex-col justify-center p-8 md:p-12">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="rounded-full bg-[#F5A62A] px-3 py-1 text-xs font-bold text-[#2D5016]">
                      FREE
                    </span>
                    <span className="rounded-full bg-[#FFF3D6] px-3 py-1 text-xs font-semibold text-[#5C4813]">
                      {course.category}
                    </span>
                    <span className="rounded-full bg-[#FFF3D6] px-3 py-1 text-xs font-semibold text-[#5C4813]">
                      {course.level}
                    </span>
                    <span className="rounded-full bg-[#FFF3D6] px-3 py-1 text-xs font-semibold text-[#5C4813]">
                      {course.duration}
                    </span>
                  </div>

                  <h2 className="mt-4 text-2xl font-extrabold text-[#2D5016] md:text-3xl">
                    {course.title}
                  </h2>

                  <p className="mt-4 text-base leading-7 text-[#444444]">
                    {course.hero}
                  </p>

                  <div className="mt-6 space-y-3">
                    {course.outcomes.slice(0, 3).map((outcome, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#7AB648]/20 mt-0.5">
                          <svg className="h-3 w-3 text-[#7AB648]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <p className="text-sm text-[#444444]">{outcome}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 flex flex-wrap items-center gap-4">
                    <Link
                      href={`/courses/${course.slug}`}
                      className="rounded-xl bg-[#F5A62A] px-8 py-3 text-sm font-bold text-[#2D5016] transition hover:opacity-90"
                    >
                      Mulai Belajar Gratis →
                    </Link>
                    <Link
                      href="/waitlist"
                      className="rounded-xl border-2 border-[#2D5016] px-8 py-3 text-sm font-bold text-[#2D5016] transition hover:bg-[#2D5016] hover:text-[#FEFBF5]"
                    >
                      Waitlist Paid Course
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Coming Soon Tracks */}
      <section className="border-t border-[#F0E8D8] bg-white">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="mx-auto mb-8 max-w-2xl text-center">
            <span className="rounded-full bg-[#FFF3D6] px-4 py-1.5 text-sm font-bold text-[#5C4813]">
              Coming Soon
            </span>
            <h2 className="mt-4 text-2xl font-extrabold text-[#2D5016]">
              Track Lainnya Segera Hadir
            </h2>
            <p className="mt-3 text-sm text-[#444444]">
              Dalam pengembangan. Daftar waitlist untuk mendapatkan notifikasi saat rilis.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-5">
            {comingSoonTracks.map((track) => (
              <div
                key={track.title}
                className="rounded-2xl border border-[#F0E8D8] bg-[#FEFBF5] p-5 text-center transition hover:border-[#F5A62A]"
              >
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#FFF3D6] mx-auto">
                  <svg className="h-6 w-6 text-[#F5A62A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-sm font-bold text-[#2D5016]">{track.title}</h3>
                <p className="mt-2 text-xs text-[#444444] line-clamp-3">{track.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/waitlist"
              className="inline-block rounded-xl border-2 border-[#2D5016] px-8 py-3 text-sm font-bold text-[#2D5016] transition hover:bg-[#2D5016] hover:text-[#FEFBF5]"
            >
              Daftar Waitlist untuk Semua Track →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
