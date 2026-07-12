import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getCourseBySlug } from "@/lib/content";
import { getEnrollments } from "@/lib/db";
import { CourseThumbnail } from "@/components/course-thumbnail";
import { ManualCheckout } from "@/components/manual-checkout";
import { siteConfig } from "@/lib/data";
import { priceForUser } from "@/lib/pricing";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const FOUNDING_LIMIT = 100;

async function countFoundingMembers(): Promise<number> {
  try {
    const supabase = getSupabaseAdmin();
    const { data: badge } = await supabase
      .from("badges").select("id").eq("name", "Founding Member").single();
    if (!badge) return 0;
    const { count } = await supabase
      .from("user_badges").select("id", { count: "exact", head: true }).eq("badge_id", badge.id);
    return count ?? 0;
  } catch {
    return 0;
  }
}

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

  // Founding member: diskon buat course premium (yang bukan founding_free)
  const isFoundingMember = user?.publicMetadata?.is_founding_member === true;
  const amount = priceForUser(course, isFoundingMember);
  const foundingDiscount = isFoundingMember && !course.founding_free && amount < course.price;

  // Course founding_free + udah founding member = gratis, langsung ke akses
  if (isFoundingMember && course.founding_free) {
    redirect(`/access/${slug}`);
  }

  // Tier Founding Member (cuma di course flagship, kalau slot masih ada & belum founding)
  let foundingBundlePrice: number | null = null;
  if (course.founding_bundle_price && !isFoundingMember) {
    const foundingCount = await countFoundingMembers();
    if (foundingCount < FOUNDING_LIMIT) {
      foundingBundlePrice = course.founding_bundle_price;
    }
  }

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
            amount={amount}
            userEmail={userEmail}
            userName={userName}
            isMastery={isMastery}
            paymentMethods={siteConfig.payment.methods}
            referralCode={refCode}
            foundingBundlePrice={foundingBundlePrice}
          />

          {/* SIDEBAR — order summary */}
          <aside className="self-start rounded-2xl border border-[#F0E8D8] bg-white shadow-sm overflow-hidden lg:sticky lg:top-8">
            <CourseThumbnail title={course.title} category={course.category} />
            <div className="p-6">
              <p className="text-xs font-bold uppercase tracking-wider text-[#7AB648]">Pesanan</p>
              <h2 className="mt-2 text-lg font-extrabold text-[#2D5016]">{course.title}</h2>
              <p className="mt-2 text-sm text-[#444]">{course.summary}</p>

              {foundingBundlePrice ? (
                <div className="mt-5 space-y-2 border-t border-[#F0E8D8] pt-5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#5C4813]">Course Aja</span>
                    <span className="font-semibold text-[#2D5016]">{formatter.format(amount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#5C4813]">Course + Founding Member</span>
                    <span className="font-semibold text-[#2D5016]">{formatter.format(foundingBundlePrice)}</span>
                  </div>
                  <div className="flex justify-between border-t border-[#F0E8D8] pt-3 text-sm">
                    <span className="font-bold text-[#2D5016]">Total Bayar</span>
                    <span className="text-xs font-bold text-[#F5A62A]">Pilih paket di kiri →</span>
                  </div>
                </div>
              ) : (
                <div className="mt-5 space-y-2 border-t border-[#F0E8D8] pt-5 text-sm">
                  {foundingDiscount && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-[#5C4813]">Harga normal</span>
                        <span className="font-semibold text-[#2D5016]">{formatter.format(course.price)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#7AB648]">Diskon Founding Member (25%)</span>
                        <span className="font-semibold text-[#7AB648]">
                          -{formatter.format(course.price - amount)}
                        </span>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between border-t border-[#F0E8D8] pt-3 text-base">
                    <span className="font-bold text-[#2D5016]">Total Bayar</span>
                    <span className="font-extrabold text-[#F5A62A]">{formatter.format(amount)}</span>
                  </div>
                </div>
              )}

              {foundingDiscount && (
                <div className="mt-4 rounded-xl bg-[#E8F5E9] px-4 py-3 text-xs font-semibold text-[#2D5016]">
                  🎉 Sebagai Founding Member, lu dapet diskon 25% buat course premium ini.
                </div>
              )}

              {isMastery && (
                <div className="mt-5 rounded-xl bg-[#FFF3D6] p-4 text-xs leading-6 text-[#5C4813]">
                  <strong className="block text-[#2D5016] mb-1">Founding Member Privilege</strong>
                  <strong>Gratis</strong> course pemula &amp; akademik, <strong>diskon 25%</strong> buat semua
                  course premium, badge eksklusif, Discord khusus, +100 bonus poin.
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
