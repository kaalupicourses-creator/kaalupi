import Link from "next/link";
import Script from "next/script";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { FreeEnrollButton } from "@/components/free-enroll-button";
import { FoundingSlotCounter } from "@/components/founding-slot-counter";
import { CourseEnrollPrompt } from "@/components/course-enroll-prompt";
import { getCourseBySlug } from "@/lib/content";
import { getEnrollments } from "@/lib/db";
import { CourseThumbnail } from "@/components/course-thumbnail";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) {
    return { title: "Course tidak ditemukan" };
  }
  return {
    title: course.title,
    description: course.summary,
    openGraph: {
      title: course.title,
      description: course.summary,
      type: "website",
      url: `https://kaalupi.vercel.app/courses/${course.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: course.title,
      description: course.summary,
    },
  };
}

const formatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

export default async function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) notFound();

  const { userId } = await auth();

  let hasAccess = false;
  if (userId) {
    try {
      const clerk = await clerkClient();
      const user = await clerk.users.getUser(userId);
      const userEmail = user.primaryEmailAddress?.emailAddress ?? "";
      const enrollments = await getEnrollments(userEmail);
      hasAccess = enrollments.includes(course.slug);
    } catch (err) {
      console.error("[course-detail] enrollment check failed:", err);
    }
  }

  const courseJsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    description: course.summary,
    url: `https://kaalupi.vercel.app/courses/${course.slug}`,
    provider: {
      "@type": "Organization",
      name: "Kaalupi",
      url: "https://kaalupi.vercel.app",
    },
    educationalLevel: course.level,
    inLanguage: "id",
    isAccessibleForFree: course.is_free ?? false,
    offers: {
      "@type": "Offer",
      price: course.price.toString(),
      priceCurrency: "IDR",
      category: course.is_free ? "free" : "paid",
      availability: "https://schema.org/InStock",
    },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "online",
      courseWorkload: "PT5H",
    },
  };

  return (
    <div className="bg-[#FEFBF5]">
      <Script
        id={`course-jsonld-${course.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd) }}
      />
      <section className="mx-auto max-w-7xl px-6 py-12">
        <nav className="mb-8 flex items-center gap-2 text-sm text-[#444444]">
          <Link href="/courses" className="hover:text-[#F5A62A] transition font-semibold text-[#2D5016]">
            Courses
          </Link>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-[#444444]">{course.title}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-2">
          <div className="flex flex-col justify-center">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-[#F0E8D8] px-3 py-1 text-xs font-semibold text-[#2D5016]">
                {course.category}
              </span>
              <span className="rounded-full bg-[#FFF3D6] px-3 py-1 text-xs font-semibold text-[#5C4813]">
                {course.level}
              </span>
              {course.is_free && (
                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-800">
                  Gratis
                </span>
              )}
              {course.is_lifetime_access && (
                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-800">
                  Lifetime Access
                </span>
              )}
            </div>
            <h1 className="mt-6 text-4xl font-extrabold text-[#2D5016] md:text-5xl">{course.title}</h1>
            <p className="mt-6 text-lg leading-8 text-[#444444]">{course.hero}</p>
            <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-[#444444]">
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-[#F5A62A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="capitalize">{course.format}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-[#F5A62A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <span>{course.modules.length} modul</span>
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-full overflow-hidden rounded-2xl border border-[#F0E8D8]">
              <CourseThumbnail title={course.title} category={course.category} large />
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-[#F0E8D8]">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr]">
            <div className="space-y-10">
              <div>
                <h2 className="text-2xl font-extrabold text-[#2D5016]">Yang Akan Kamu Pelajari</h2>
                <div className="mt-6 space-y-4">
                  {course.outcomes.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 rounded-xl border border-[#F0E8D8] bg-white p-4"
                    >
                      <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#7AB648]/20">
                        <svg className="h-3.5 w-3.5 text-[#7AB648]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="text-sm leading-7 text-[#444444]">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-[#2D5016]">Modul Course</h2>
                <div className="mt-6 space-y-3">
                  {course.modules.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 rounded-xl border border-[#F0E8D8] bg-white px-5 py-4 transition hover:border-[#F5A62A]"
                    >
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[#FFF3D6] text-xs font-bold text-[#F5A62A]">
                        {index + 1}
                      </div>
                      <p className="text-sm text-[#444444]">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <aside>
              <div className="sticky top-24 rounded-2xl border border-[#F0E8D8] bg-white p-8 shadow-sm">
                {course.founding_members_limit && course.original_price ? (
                  <>
                    <p className="text-xs font-bold uppercase tracking-wider text-[#7AB648]">
                      Founding Members Price
                    </p>
                    <div className="mt-1 flex items-baseline gap-2">
                      <p className="text-4xl font-extrabold text-[#F5A62A]">
                        {formatter.format(course.price)}
                      </p>
                      <p className="text-sm text-[#444] line-through">
                        {formatter.format(course.original_price)}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-semibold text-[#444444]">Investasi belajar</p>
                    <p className="mt-2 text-4xl font-extrabold text-[#2D5016]">
                      {course.price === 0 ? "Gratis" : formatter.format(course.price)}
                    </p>
                  </>
                )}
                <p className="mt-4 text-sm leading-7 text-[#444444]">{course.summary}</p>

                {course.founding_members_limit && (
                  <div className="mt-5">
                    <FoundingSlotCounter slug={course.slug} variant="inline" />
                  </div>
                )}

                <div className="mt-6">
                  {hasAccess ? (
                    <Link
                      href={`/access/${course.slug}`}
                      className="block rounded-xl bg-[#F5A62A] px-5 py-3.5 text-center text-sm font-bold text-[#2D5016] hover:opacity-90 transition"
                    >
                      Mulai Belajar
                    </Link>
                  ) : !userId ? (
                    <CourseEnrollPrompt slug={course.slug} isFree={course.is_free} />
                  ) : course.is_free ? (
                    <FreeEnrollButton slug={course.slug} />
                  ) : (
                    <Link
                      href={`/checkout/${course.slug}`}
                      className="block rounded-xl bg-[#F5A62A] px-5 py-3.5 text-center text-sm font-bold text-[#2D5016] hover:opacity-90 transition shadow-md"
                    >
                      Lanjut ke Pembayaran →
                    </Link>
                  )}
                </div>

                {course.perks && course.perks.length > 0 ? (
                  <div className="mt-6 space-y-2 text-sm text-[#444444]">
                    <p className="text-xs font-bold uppercase tracking-wider text-[#2D5016]">Yang Lu Dapat:</p>
                    {course.perks.map((perk) => (
                      <div key={perk} className="flex items-start gap-2">
                        <svg
                          className="mt-1 h-3.5 w-3.5 flex-shrink-0 text-[#7AB648]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={3}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{perk}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-6 space-y-3 text-sm text-[#444444]">
                    {[
                      "Akses materi setelah pembayaran",
                      "Progress tracking per modul",
                      course.is_lifetime_access ? "Akses lifetime" : "Akses sesuai paket",
                    ].map((item) => (
                      <div key={item} className="flex items-center gap-2">
                        <svg
                          className="h-4 w-4 flex-shrink-0 text-[#7AB648]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
