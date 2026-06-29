import Link from "next/link";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { CourseThumbnail } from "@/components/course-thumbnail";
import { FoundingSlotCounter } from "@/components/founding-slot-counter";
import { comingSoonTracks } from "@/lib/data";
import { getCourseBySlug, getEnrollments } from "@/lib/content";

export default async function CoursesPage() {
  const course = await getCourseBySlug("cyber-security-pemula");
  if (!course) return null;

  const { userId } = await auth();
  let isEnrolled = false;
  if (userId) {
    try {
      const clerk = await clerkClient();
      const user = await clerk.users.getUser(userId);
      const email = user.primaryEmailAddress?.emailAddress ?? "";
      const enrollments = await getEnrollments(email);
      isEnrolled = enrollments.includes(course.slug);
    } catch (err) {
      console.error("[/courses] enrollment check failed:", err);
    }
  }

  return (
    <div className="bg-[#FEFBF5]">
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#7AB648]">
            Course Catalog
          </p>
          <h1 className="mt-4 text-4xl font-extrabold text-[#2D5016] md:text-5xl">
            Kuasai Cyber Security{" "}
            <span className="text-[#F5A62A]">dari Nol ke Pro</span>
          </h1>
          <p className="mt-6 text-base leading-8 text-[#444444]">
            Satu course lengkap — dari fondasi sampai exploitasi. Daftar sekarang sebagai{" "}
            <strong className="text-[#2D5016]">Founding Member</strong> dan dapatkan lifetime access
            ke <strong className="text-[#2D5016]">SEMUA course</strong> Kaalupi (sekarang & yang akan rilis).
          </p>
        </div>
      </section>

      {/* Course Card */}
      <section className="border-t border-[#F0E8D8]">
        <div className="mx-auto max-w-4xl px-6 py-12">
          <article className="relative overflow-hidden rounded-3xl border-2 border-[#F5A62A] bg-gradient-to-br from-[#FFF3D6] to-white shadow-xl">
            {/* Most Recommended badge */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 rounded-full bg-[#2D5016] px-5 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-[#F5A62A] shadow-md">
              🔥 Founding Member — 100 Slot Pertama
            </div>

            <div className="relative overflow-hidden">
              <CourseThumbnail title={course.title} category={course.category} large />
            </div>

            <div className="p-8 lg:p-10">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded-full bg-[#FFF3D6] px-3 py-1 font-semibold text-[#5C4813]">
                  {course.level}
                </span>
                <span className="rounded-full bg-[#FFF3D6] px-3 py-1 font-semibold text-[#5C4813]">
                  {course.modules.length} modul
                </span>
                <span className="rounded-full bg-[#2D5016]/10 px-3 py-1 font-semibold text-[#2D5016]">
                  Cyber Security
                </span>
              </div>

              <h2 className="mt-4 text-2xl font-extrabold text-[#2D5016] lg:text-3xl">
                {course.title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-[#444444]">{course.summary}</p>

              {/* Two columns: outcomes + modules */}
              <div className="mt-8 grid gap-8 lg:grid-cols-2">
                {/* Outcomes */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#2D5016] mb-3">
                    Yang akan kamu kuasai
                  </p>
                  <ul className="space-y-2">
                    {course.outcomes.map((o, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <svg className="h-4 w-4 flex-shrink-0 text-[#7AB648] mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-[#444]">{o}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Modules */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#2D5016] mb-3">
                    8 Modul Lengkap
                  </p>
                  <ul className="space-y-1.5">
                    {course.modules.map((mod, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm">
                        <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#F5A62A] text-[10px] font-bold text-[#2D5016]">
                          {i + 1}
                        </span>
                        <span className="text-[#444]">{mod}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Pricing + CTA */}
              <div className="mt-10 rounded-2xl border border-[#F5A62A]/40 bg-white p-6">
                <div className="flex flex-wrap items-end justify-between gap-6">
                  <div>
                    <p className="text-xs text-[#444] line-through">
                      Harga normal: Rp {(course.original_price ?? 499000).toLocaleString("id-ID")}
                    </p>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-4xl font-black text-[#F5A62A]">
                        Rp {course.price.toLocaleString("id-ID")}
                      </span>
                      <span className="text-sm font-bold text-[#7AB648]">Founding Price</span>
                    </div>
                    <p className="mt-1 text-xs text-[#444]">
                      Lifetime access · Semua course Kaalupi · Komunitas Discord eksklusif
                    </p>
                  </div>
                  <div className="w-full lg:w-auto">
                    <FoundingSlotCounter slug={course.slug} variant="inline" />
                  </div>
                </div>

                <div className="mt-6">
                  {isEnrolled ? (
                    <div className="space-y-2">
                      <Link
                        href={`/access/${course.slug}`}
                        className="block w-full rounded-xl bg-[#F5A62A] px-6 py-3.5 text-center text-sm font-extrabold text-[#2D5016] hover:opacity-90 shadow-md transition"
                      >
                        Lanjutkan Belajar →
                      </Link>
                      <p className="text-center text-xs font-bold text-[#7AB648]">
                        ✓ Kamu sudah jadi Founding Member
                      </p>
                    </div>
                  ) : (
                    <Link
                      href={`/courses/${course.slug}`}
                      className="block w-full rounded-xl bg-[#F5A62A] px-6 py-3.5 text-center text-sm font-extrabold text-[#2D5016] hover:opacity-90 shadow-md transition"
                    >
                      Daftar Founding Members — Rp {course.price.toLocaleString("id-ID")} →
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* Coming Soon Tracks */}
      <section className="border-t border-[#F0E8D8] bg-white">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="mx-auto mb-8 max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#7AB648]">
              Coming Soon
            </p>
            <h2 className="mt-3 text-2xl font-extrabold text-[#2D5016]">
              Track Berikutnya — Founding Member Dapat Semua
            </h2>
            <p className="mt-3 text-sm text-[#444444]">
              Daftar sekarang — Founding Member otomatis dapat akses ke semua track yang rilis.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {comingSoonTracks.map((track) => (
              <div
                key={track.title}
                className="rounded-2xl border border-[#F0E8D8] bg-[#FEFBF5] p-5"
              >
                <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-[#F0E8D8] px-2.5 py-0.5">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#F5A62A] opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-[#F5A62A]" />
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#444]">
                    Coming Soon
                  </span>
                </div>
                <p className="font-bold text-[#2D5016]">{track.title}</p>
                <p className="mt-1 text-xs text-[#444]">{track.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/waitlist"
              className="inline-block rounded-xl border-2 border-[#2D5016] px-8 py-3 text-sm font-bold text-[#2D5016] transition hover:bg-[#2D5016] hover:text-[#FEFBF5]"
            >
              Notifikasi Saat Track Baru Rilis →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
