import Link from "next/link";
import { CourseThumbnail } from "@/components/course-thumbnail";
import { courses } from "@/lib/data";

export default function CoursesPage() {
  const publishedCourses = courses.filter((c) => c.is_published);
  const comingSoonCourses = courses.filter((c) => !c.is_published);

  return (
    <div className="bg-[#FEFBF5]">
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#7AB648]">
            Course Catalog
          </p>
          <h1 className="mt-4 text-4xl font-extrabold text-[#2D5016] md:text-5xl">
            Satu Course,{" "}
            <span className="text-[#F5A62A]">Langsung Praktik</span>
          </h1>
          <p className="mt-6 text-base leading-8 text-[#444444]">
            Pilih course yang sesuai dengan jalur karier kamu. Semua course dirancang praktis dan langsung aplikatif.
          </p>
        </div>
      </section>

      {/* Published Courses */}
      {publishedCourses.length > 0 && (
        <section className="border-t border-[#F0E8D8]">
          <div className="mx-auto max-w-7xl px-6 py-12">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-extrabold text-[#2D5016]">Course Aktif</h2>
              <p className="mt-2 text-sm text-[#444444]">Course yang sudah bisa diakses</p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {publishedCourses.map((course) => (
                <Link
                  key={course.slug}
                  href={`/courses/${course.slug}`}
                  className="group overflow-hidden rounded-2xl border border-[#F0E8D8] bg-white transition hover:border-[#F5A62A] hover:shadow-sm"
                >
                  <CourseThumbnail title={course.title} category={course.category} />
                  <div className="p-6">
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full bg-[#FFF3D6] px-3 py-1 text-xs font-semibold text-[#5C4813]">
                        {course.category}
                      </span>
                      <span className="rounded-full bg-[#FFF3D6] px-3 py-1 text-xs font-semibold text-[#5C4813]">
                        {course.level}
                      </span>
                      {course.is_free && (
                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-800">
                          🆓 Gratis
                        </span>
                      )}
                    </div>
                    <h3 className="mt-4 text-xl font-bold text-[#2D5016] group-hover:text-[#F5A62A] transition">
                      {course.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-[#444444] line-clamp-3">
                      {course.summary}
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-lg font-extrabold text-[#2D5016]">
                        {course.is_free ? "Gratis" : `Rp ${course.price.toLocaleString("id-ID")}`}
                      </span>
                      <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#2D5016] group-hover:text-[#F5A62A] transition">
                        Lihat detail
                        <svg className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Coming Soon Tracks */}
      {comingSoonCourses.length > 0 && (
        <section className="border-t border-[#F0E8D8] bg-white">
          <div className="mx-auto max-w-7xl px-6 py-12">
            <div className="mx-auto mb-8 max-w-2xl text-center">
              <span className="rounded-full bg-[#FFF3D6] px-4 py-1.5 text-sm font-bold text-[#5C4813]">
                Segera Hadir
              </span>
              <p className="mt-3 text-sm text-[#444444]">
                Course berikutnya sedang dalam tahap persiapan. Daftar waitlist untuk notifikasi.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {comingSoonCourses.map((course) => (
                <div
                  key={course.slug}
                  className="rounded-2xl border border-[#F0E8D8] bg-[#FEFBF5] p-5 text-center"
                >
                  <p className="text-sm font-bold text-[#2D5016]">{course.title}</p>
                  <p className="mt-1 text-xs text-[#444444]">Segera hadir</p>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Link
                href="/waitlist"
                className="inline-block rounded-xl border-2 border-[#2D5016] px-8 py-3 text-sm font-bold text-[#2D5016] transition hover:bg-[#2D5016] hover:text-[#FEFBF5]"
              >
                Daftar Waitlist untuk Semua Course →
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
