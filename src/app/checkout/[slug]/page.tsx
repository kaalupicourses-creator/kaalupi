import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getCourseBySlug } from "@/lib/content";
import { getEnrollments } from "@/lib/db";
import { CourseThumbnail } from "@/components/course-thumbnail";
import { ManualCheckout } from "@/components/manual-checkout";
import { siteConfig } from "@/lib/data";

const formatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

export default async function CheckoutPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ ref?: string }>;
}) {
  const { slug } = await params;
  const { ref } = await searchParams;
  const refCode = ref?.trim() || null;
  const { userId } = await auth();
  if (!userId) {
    // Preserve referral code through the login redirect
    const dest = refCode ? `/checkout/${slug}?ref=${encodeURIComponent(refCode)}` : `/checkout/${slug}`;
    redirect(`/login?redirect=${encodeURIComponent(dest)}`);
  }

  const user = await currentUser();
  const userEmail = user?.primaryEmailAddress?.emailAddress ?? "";
  const userName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    user?.username ||
    userEmail;

  const course = await getCourseBySlug(slug);
  if (!course) {
    redirect("/courses");
  }

  // Free course — direct enroll (no payment)
  if (course.is_free || course.price === 0) {
    redirect(`/courses/${slug}`);
  }

  // Already enrolled — go straight to access
  let alreadyEnrolled = false;
  try {
    const enrollments = await getEnrollments(userEmail);
    alreadyEnrolled = enrollments.includes(slug);
  } catch (err) {
    console.error("[checkout] enrollment check failed:", err);
  }
  if (alreadyEnrolled) {
    redirect(`/access/${slug}`);
  }

  const isMastery = !!course.founding_members_limit;

  return (
    <div className="bg-[#FEFBF5] min-h-screen">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <nav className="mb-6 flex items-center gap-2 text-sm text-[#444]">
          <Link href="/courses" className="font-semibold text-[#2D5016] hover:text-[#F5A62A]">
            Courses
          </Link>
          <span className="text-[#F0E8D8]">/</span>
          <Link href={`/courses/${slug}`} className="font-semibold text-[#2D5016] hover:text-[#F5A62A]">
            {course.title}
          </Link>
          <span className="text-[#F0E8D8]">/</span>
          <span className="text-[#F5A62A] font-semibold">Bayar</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
          {/* MAIN — payment UI */}
          <ManualCheckout
            courseSlug={course.slug}
            courseTitle={course.title}
            amount={course.price}
            userEmail={userEmail}
            userName={userName}
            isMastery={isMastery}
            paymentMethods={siteConfig.payment.methods}
            referralCode={refCode}
          />

          {/* SIDEBAR — order summary */}
          <aside className="self-start rounded-2xl border border-[#F0E8D8] bg-white shadow-sm overflow-hidden lg:sticky lg:top-8">
            <CourseThumbnail title={course.title} category={course.category} />
            <div className="p-6">
              <p className="text-xs font-bold uppercase tracking-wider text-[#7AB648]">Pesanan</p>
              <h2 className="mt-2 text-lg font-extrabold text-[#2D5016]">{course.title}</h2>
              <p className="mt-2 text-sm text-[#444]">{course.summary}</p>

              <div className="mt-5 space-y-2 border-t border-[#F0E8D8] pt-5 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#5C4813]">Harga course</span>
                  <span className="font-semibold text-[#2D5016]">
                    {formatter.format(course.original_price ?? course.price)}
                  </span>
                </div>
                {course.original_price && course.original_price !== course.price && (
                  <div className="flex justify-between">
                    <span className="text-[#7AB648]">Diskon Founding Members</span>
                    <span className="font-semibold text-[#7AB648]">
                      -{formatter.format((course.original_price ?? 0) - course.price)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between border-t border-[#F0E8D8] pt-3 text-base">
                  <span className="font-bold text-[#2D5016]">Total Bayar</span>
                  <span className="font-extrabold text-[#F5A62A]">{formatter.format(course.price)}</span>
                </div>
              </div>

              {isMastery && (
                <div className="mt-5 rounded-xl bg-[#FFF3D6] p-4 text-xs leading-6 text-[#5C4813]">
                  <strong className="block text-[#2D5016] mb-1">Founding Member Privilege</strong>
                  Lifetime access ke <strong>SEMUA course</strong> Kaalupi sekarang &amp; yang akan rilis,
                  badge eksklusif, +100 bonus poin.
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
