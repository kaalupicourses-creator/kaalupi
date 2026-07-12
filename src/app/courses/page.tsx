import Link from "next/link";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { CourseThumbnail } from "@/components/course-thumbnail";
import { FoundingSlotCounter } from "@/components/founding-slot-counter";
import { comingSoonTracks } from "@/lib/data";
import { getCourses, getEnrollments } from "@/lib/content";

export default async function CoursesPage() {
  const allCourses = await getCourses();
  const flagship =
    allCourses.find((c) => c.featured && !c.comingSoon) ??
    allCourses.find((c) => !c.comingSoon) ??
    allCourses[0];
  if (!flagship) return null;

  const otherCourses = allCourses.filter((c) => c.slug !== flagship.slug);

  const { userId } = await auth();
  let enrollments: string[] = [];
  if (userId) {
    try {
      const clerk = await clerkClient();
      const user = await clerk.users.getUser(userId);
      const email = user.primaryEmailAddress?.emailAddress ?? "";
      enrollments = await getEnrollments(email);
    } catch (err) {
      console.error("[/courses] enrollment check failed:", err);
    }
  }
  const isEnrolled = enrollments.includes(flagship.slug);

  return (
    <div className="bg-[#FEFBF5]">
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#7AB648]">
            Course Catalog
          </p>
          <h1 className="mt-4 text-4xl font-extrabold text-[#2D5016] md:text-5xl">
            Belajar Skill Digital{" "}
            <span className="text-[#F5A62A]">dari Nol ke Pro</span>
          </h1>
          <p className="mt-6 text-base leading-8 text-[#444444]">
            Bahasa Indonesia, langsung praktik. Jadi{" "}
            <strong className="text-[#2D5016]">Founding Member</strong> (100 orang pertama) buat dapet{" "}
            <strong className="text-[#2D5016]">course pemula & akademik gratis</strong> + diskon 25% semua course premium.
          </p>
        </div>
      </section>

      {/* Flagship Course Card */}
      <section className="border-t border-[#F0E8D8]">
        <div className="mx-auto max-w-4xl px-6 py-12">
          <article className="relative overflow-hidden rounded-3xl border-2 border-[#F5A62A] bg-gradient-to-br from-[#FFF3D6] to-white shadow-xl">
            {/* Most Recommended badge */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 rounded-full bg-[#2D5016] px-5 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-[#F5A62A] shadow-md">
              🔥 Founding Member — 100 Slot Pertama
            </div>

            <div className="relative overflow-hidden">
              <CourseThumbnail title={flagship.title} category={flagship.category} large />
            </div>

            <div className="p-8 lg:p-10">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded-full bg-[#FFF3D6] px-3 py-1 font-semibold text-[#5C4813]">
                  {flagship.level}
                </span>
                <span className="rounded-full bg-[#FFF3D6] px-3 py-1 font-semibold text-[#5C4813]">
                  {flagship.modules.length} modul
                </span>
                <span className="rounded-full bg-[#2D5016]/10 px-3 py-1 font-semibold text-[#2D5016]">
                  {flagship.category}
                </span>
              </div>

              <h2 className="mt-4 text-2xl font-extrabold text-[#2D5016] lg:text-3xl">
                {flagship.title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-[#444444]">{flagship.summary}</p>

              {/* Two columns: outcomes + modules */}
              <div className="mt-8 grid gap-8 lg:grid-cols-2">
                {/* Outcomes */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#2D5016] mb-3">
                    Yang akan kamu kuasai
                  </p>
                  <ul className="space-y-2">
                    {flagship.outcomes.map((o, i) => (
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
                    {flagship.modules.length} Modul Lengkap
                  </p>
                  <ul className="space-y-1.5">
                    {flagship.modules.map((mod, i) => (
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
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-black text-[#2D5016]">
                        Rp {flagship.price.toLocaleString("id-ID")}
                      </span>
                      <span className="text-sm font-bold text-[#7AB648]">course aja</span>
                    </div>
                    <p className="mt-1 text-sm text-[#5C4813]">
                      atau <strong className="text-[#F5A62A]">Rp {(flagship.founding_bundle_price ?? 150000).toLocaleString("id-ID")}</strong> sekalian jadi Founding Member —
                      dapet course pemula & akademik gratis + diskon 25% semua course premium.
                    </p>
                  </div>
                  <div className="w-full lg:w-auto">
                    <FoundingSlotCounter slug={flagship.slug} variant="inline" />
                  </div>
                </div>

                <div className="mt-6">
                  {isEnrolled ? (
                    <div className="space-y-2">
                      <Link
                        href={`/access/${flagship.slug}`}
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
                      href={`/checkout/${flagship.slug}`}
                      className="block w-full rounded-xl bg-[#F5A62A] px-6 py-3.5 text-center text-sm font-extrabold text-[#2D5016] hover:opacity-90 shadow-md transition"
                    >
                      Mulai — dari Rp {flagship.price.toLocaleString("id-ID")} →
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* Other Courses — coming soon, termasuk di Founding Member */}
      {otherCourses.length > 0 && (
        <section className="border-t border-[#F0E8D8] bg-white">
          <div className="mx-auto max-w-7xl px-6 py-14">
            <div className="mx-auto mb-8 max-w-2xl text-center">
              <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#7AB648]">
                Course Lainnya
              </p>
              <h2 className="mt-3 text-2xl font-extrabold text-[#2D5016] md:text-3xl">
                Segera Rilis — Founding Member Untung Duluan
              </h2>
              <p className="mt-3 text-sm text-[#444444]">
                Materi lagi disiapin instructor. Founding Member dapet yang akademik gratis + diskon 25% buat course premium pas rilis.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {otherCourses.map((c) => (
                <article
                  key={c.slug}
                  className="group overflow-hidden rounded-2xl border-2 border-[#F0E8D8] bg-white transition hover:border-[#F5A62A] hover:shadow-lg"
                >
                  <div className="relative">
                    <CourseThumbnail title={c.title} category={c.category} />
                    {c.comingSoon && (
                      <div className="absolute right-3 top-3 rounded-full bg-[#2D5016] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#F5A62A] shadow">
                        Coming Soon
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <span className="rounded-full bg-[#FFF3D6] px-2.5 py-0.5 text-[10px] font-bold text-[#5C4813]">
                      {c.category}
                    </span>
                    <h3 className="mt-3 text-base font-extrabold text-[#2D5016] group-hover:text-[#F5A62A] transition">
                      {c.title}
                    </h3>
                    <p className="mt-2 text-xs leading-6 text-[#444]">{c.summary}</p>
                    <p className="mt-3 text-[11px] font-bold text-[#7AB648]">
                      {c.founding_free
                        ? "✓ Gratis buat Founding Member"
                        : "✓ Diskon 25% buat Founding Member"}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Coming Soon Tracks — future roadmap */}
      <section className="border-t border-[#F0E8D8] bg-[#FEFBF5]">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="mx-auto mb-8 max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#7AB648]">
              Roadmap
            </p>
            <h2 className="mt-3 text-2xl font-extrabold text-[#2D5016]">
              Track Berikutnya di Kaalupi
            </h2>
            <p className="mt-3 text-sm text-[#444444]">
              Ini yang bakal kita bangun selanjutnya. Founding Member dapet harga spesial pas rilis.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {comingSoonTracks.map((track) => (
              <div
                key={track.title}
                className="rounded-2xl border border-[#F0E8D8] bg-white p-5"
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
