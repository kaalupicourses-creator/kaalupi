import Link from "next/link";
import { CourseThumbnail } from "@/components/course-thumbnail";
import { courses } from "@/lib/data";

export default function CoursesPage() {
  const aiCourse = courses.find((c) => c.slug === "ai-untuk-pemula");

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
            Kaalupi hadir dengan satu course pertama yang dirancang khusus untuk pemula — tanpa background teknis.
          </p>
        </div>
      </section>

      {/* AI Course Card */}
      {aiCourse && (
        <section className="border-t border-[#F0E8D8]">
          <div className="mx-auto max-w-7xl px-6 py-12">
            <div className="mx-auto max-w-4xl">
              <div className="grid overflow-hidden rounded-3xl border border-[#F0E8D8] bg-white lg:grid-cols-2">
                {/* Thumbnail */}
                <div className="relative">
                  <CourseThumbnail
                    title={aiCourse.title}
                    category={aiCourse.category}
                    className="h-full min-h-[300px]"
                  />
                </div>

                {/* Content */}
                <div className="p-8 md:p-10 flex flex-col justify-center">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="rounded-full bg-[#F5A62A] px-3 py-1 text-xs font-bold text-[#2D5016]">
                      Segera Hadir
                    </span>
                    <span className="rounded-full bg-[#FFF3D6] px-3 py-1 text-xs font-semibold text-[#5C4813]">
                      {aiCourse.category}
                    </span>
                    <span className="rounded-full bg-[#FFF3D6] px-3 py-1 text-xs font-semibold text-[#5C4813]">
                      {aiCourse.level}
                    </span>
                  </div>

                  <h2 className="mt-4 text-2xl font-extrabold text-[#2D5016]">
                    {aiCourse.title}
                  </h2>

                  <p className="mt-3 text-sm leading-7 text-[#444444]">
                    {aiCourse.summary}
                  </p>

                  <div className="mt-5 space-y-3">
                    {aiCourse.outcomes.map((outcome, index) => (
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

                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <span className="text-2xl font-extrabold text-[#2D5016]">
                      Rp {aiCourse.price.toLocaleString("id-ID")}
                    </span>
                    <span className="text-sm text-[#444444] line-through">Rp 299.000</span>
                  </div>

                  <div className="mt-2 text-xs text-[#7AB648] font-semibold">
                    {aiCourse.duration} • Early bird Rp 149.000
                  </div>

                  <Link
                    href="/waitlist"
                    className="mt-6 inline-block w-full text-center rounded-xl bg-[#F5A62A] px-8 py-3.5 text-sm font-bold text-[#2D5016] transition hover:opacity-90"
                  >
                    Daftar Waitlist →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Coming Soon Tracks */}
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
            {["Fullstack Web Engineer", "Network Engineer Pro", "Cyber Security Analyst"].map((title) => (
              <div
                key={title}
                className="rounded-2xl border border-[#F0E8D8] bg-[#FEFBF5] p-5 text-center"
              >
                <p className="text-sm font-bold text-[#2D5016]">{title}</p>
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
    </div>
  );
}
