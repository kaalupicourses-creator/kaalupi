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
    <div className="mx-auto max-w-5xl px-6 py-16">
      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-2 text-sm text-slate-400">
        <Link href="/courses" className="hover:text-amber-300 transition">
          Courses
        </Link>
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        <Link href={`/courses/${slug}`} className="hover:text-amber-300 transition">
          {course.title}
        </Link>
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-amber-300">Checkout</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        {/* Course Info */}
        <section className="rounded-[2rem] border border-white/10 bg-white/5 overflow-hidden">
          <CourseThumbnail title={course.title} category={course.category} />
          <div className="p-8">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-white/8 px-3 py-1 text-xs text-slate-300">
                {course.category}
              </span>
              <span className="rounded-full bg-amber-300/10 px-3 py-1 text-xs text-amber-300">
                {course.level}
              </span>
            </div>
            <h1 className="mt-5 text-3xl font-semibold text-white">
              {course.title}
            </h1>
            <p className="mt-4 text-base leading-7 text-slate-300">{course.summary}</p>

            {/* What's included */}
            <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-lg font-semibold text-white">What&apos;s included</h2>
              <div className="mt-4 space-y-3">
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <svg className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {course.modules.length} modules
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <svg className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {course.duration} access
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <svg className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {course.format} format
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <svg className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Lifetime access
                </div>
              </div>
            </div>

            {/* Modules preview */}
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-white">Course modules</h2>
              <div className="mt-4 space-y-2">
                {course.modules.map((module, index) => (
                  <div key={index} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-300/10 text-xs font-medium text-amber-300">
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
        <section className="self-start rounded-[2rem] border border-white/10 bg-white/5 p-8 lg:sticky lg:top-8">
          <h2 className="text-xl font-semibold text-white">Enroll today</h2>
          <p className="mt-2 text-sm text-slate-400">Start learning immediately after payment</p>

          <div className="mt-6 rounded-2xl bg-gradient-to-br from-orange-500/10 to-yellow-400/10 p-6 text-center">
            <p className="text-sm text-slate-400">Total price</p>
            <p className="mt-1 text-4xl font-semibold bg-gradient-to-r from-orange-400 to-yellow-300 bg-clip-text text-transparent">
              {formatter.format(course.price)}
            </p>
          </div>

          <div className="mt-6">
            <CheckoutButton slug={course.slug} amount={course.price} />
          </div>

          <div className="mt-6 space-y-3 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Secure payment via Midtrans
            </div>
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Instant access after payment
            </div>
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Lifetime access to materials
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
