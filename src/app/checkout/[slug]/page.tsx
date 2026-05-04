import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getCourseBySlug } from "@/lib/content";
import { CheckoutButton } from "@/components/checkout-button";
import { CourseThumbnail } from "@/components/course-thumbnail";

const formatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { userId } = await auth();
  if (!userId) {
    redirect(`/login?redirect=/checkout/${(await params).slug}`);
  }

  const { slug } = await params;
  const course = await getCourseBySlug(slug);

  if (!course) {
    redirect("/courses");
  }

  return (
    <div className="bg-[#FEFBF5] min-h-screen">
      <div className="mx-auto max-w-5xl px-6 py-16">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm text-[#444444]">
          <Link href="/courses" className="hover:text-[#F5A62A] transition font-semibold text-[#2D5016]">
            Courses
          </Link>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          <Link href={`/courses/${slug}`} className="hover:text-[#F5A62A] transition font-semibold text-[#2D5016]">
            {course.title}
          </Link>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-[#F5A62A] font-semibold">Checkout</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          {/* Course Info */}
          <section className="rounded-2xl border border-[#F0E8D8] bg-white overflow-hidden">
            <CourseThumbnail title={course.title} category={course.category} />
            <div className="p-8">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-[#F0E8D8] px-3 py-1 text-xs font-semibold text-[#2D5016]">
                  {course.category}
                </span>
                <span className="rounded-full bg-[#FFF3D6] px-3 py-1 text-xs font-semibold text-[#5C4813]">
                  {course.level}
                </span>
              </div>
              <h1 className="mt-5 text-3xl font-extrabold text-[#2D5016]">
                {course.title}
              </h1>
              <p className="mt-4 text-base leading-7 text-[#444444]">{course.summary}</p>

              {/* What's included */}
              <div className="mt-8 rounded-xl border border-[#F0E8D8] bg-[#FEFBF5] p-6">
                <h2 className="text-lg font-bold text-[#2D5016]">Yang Kamu Dapatkan</h2>
                <div className="mt-4 space-y-3">
                  {[
                    `${course.modules.length} modul pembelajaran`,
                    `${course.duration} akses materi`,
                    `Format ${course.format}`,
                    "Lifetime access",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3 text-sm text-[#444444]">
                      <svg className="h-5 w-5 text-[#7AB648] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* Modules preview */}
              <div className="mt-8">
                <h2 className="text-lg font-bold text-[#2D5016]">Modul Course</h2>
                <div className="mt-4 space-y-2">
                  {course.modules.map((module, index) => (
                    <div key={index} className="flex items-center gap-3 rounded-xl border border-[#F0E8D8] bg-[#FEFBF5] px-4 py-3 text-sm text-[#444444]">
                      <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#FFF3D6] text-xs font-bold text-[#F5A62A]">
                        {index + 1}
                      </div>
                      {module}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Pricing Card */}
          <section className="self-start rounded-2xl border border-[#F0E8D8] bg-white p-8 shadow-sm lg:sticky lg:top-8">
            <h2 className="text-xl font-extrabold text-[#2D5016]">Daftar Sekarang</h2>
            <p className="mt-2 text-sm text-[#444444]">Akses materi langsung setelah pembayaran</p>

            <div className="mt-6 rounded-xl bg-[#FFF3D6] p-6 text-center">
              <p className="text-sm font-semibold text-[#5C4813]">Investasi belajar</p>
              <p className="mt-1 text-4xl font-extrabold text-[#2D5016]">
                {formatter.format(course.price)}
              </p>
            </div>

            <div className="mt-6">
              <CheckoutButton slug={course.slug} amount={course.price} />
            </div>

            <div className="mt-6 space-y-3 text-sm text-[#444444]">
              {[
                "Pembayaran aman via Midtrans",
                "Akses instan setelah pembayaran",
                "Lifetime access ke semua materi",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <svg className="h-4 w-4 flex-shrink-0 text-[#7AB648]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {item}
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
