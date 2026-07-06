import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { RoleBadge } from "@/components/role-badge";
import { getEnrollments, getProgress, getUserPoints, getUserBadges, getBadges } from "@/lib/db";
import { getCourses } from "@/lib/content";
import { CourseThumbnail } from "@/components/course-thumbnail";
import { DashboardOnboarding } from "@/components/dashboard-onboarding";
import { siteConfig } from "@/lib/data";
import { isSuperAdmin } from "@/lib/auth";

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/login?redirect=/dashboard");
  }

  const user = await currentUser();
  const role = (user?.publicMetadata as { role?: string })?.role ?? "student";

  const metadata = user?.publicMetadata as Record<string, unknown> | undefined;
  const onboardingCompleted = metadata?.onboarding_completed === true;
  const onboardingSkipped = metadata?.onboarding_skipped === true;

  const nameParts = [user?.firstName, user?.lastName].filter(Boolean).join(" ");
  const userName = nameParts || user?.primaryEmailAddress?.emailAddress?.split("@")[0] || "Student";
  const userEmail = user?.primaryEmailAddress?.emailAddress ?? "";

  const allCourses = await getCourses();

  let enrollments: string[] = [];
  try {
    enrollments = await getEnrollments(userEmail);
  } catch (error) {
    console.error("Failed to fetch enrollments:", error);
  }

  const ownedCourses = allCourses.filter((course) => enrollments.includes(course.slug));

  const coursesWithProgress = await Promise.all(
    ownedCourses.map(async (course) => {
      let progress: Array<{ completed: boolean; module_index: number }> = [];
      try {
        progress = await getProgress(userEmail, course.slug);
      } catch {}
      const completedCount = progress.filter((p) => p.completed).length;
      const totalModules = course.modules.length;
      const percentage = totalModules > 0 ? Math.round((completedCount / totalModules) * 100) : 0;
      const lastModule = progress
        .filter((p) => !p.completed)
        .sort((a, b) => a.module_index - b.module_index)[0];
      return {
        ...course,
        progress: percentage,
        lastModuleIndex: lastModule?.module_index ?? -1,
      };
    }),
  );

  let userPoints = 0;
  try {
    const userPointsData = await getUserPoints(userEmail);
    userPoints = userPointsData?.points ?? 0;
  } catch {}

  let allBadges: Array<{
    id: string;
    name: string;
    description: string | null;
    icon: string | null;
    required_points: number;
  }> = [];
  let earnedBadgeIds = new Set<string>();
  try {
    allBadges = await getBadges();
    const userBadgesData = await getUserBadges(userEmail);
    earnedBadgeIds = new Set(userBadgesData?.map((ub: { badge_id: string }) => ub.badge_id) ?? []);
  } catch {}

  const isFoundingMember = enrollments.includes("cyber-security-pemula");
  const inProgressCount = coursesWithProgress.filter((c) => c.progress > 0 && c.progress < 100).length;
  const completedCount = coursesWithProgress.filter((c) => c.progress === 100).length;
  const totalModulesEnrolled = coursesWithProgress.reduce((s, c) => s + c.modules.length, 0);
  const totalModulesDone = coursesWithProgress.reduce(
    (s, c) => s + Math.round((c.progress / 100) * c.modules.length),
    0,
  );

  return (
    <div className="bg-[#FEFBF5] min-h-screen">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          {/* Sidebar */}
          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-[#F0E8D8] bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF3D6] text-lg font-extrabold text-[#2D5016]">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-[#2D5016]">{userName}</p>
                  <p className="truncate text-xs text-[#5C4813]">{userEmail}</p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <RoleBadge role={role as "admin" | "instructor" | "student"} />
                {isFoundingMember && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[#F5A62A] to-[#E89020] px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-[#2D5016] shadow-sm">
                    <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l2.39 7.36H22l-6.18 4.49L18.21 21 12 16.51 5.79 21l2.39-7.15L2 9.36h7.61z" />
                    </svg>
                    Founding Member
                  </span>
                )}
              </div>
              <Link
                href="/profile"
                className="mt-5 block rounded-xl border-2 border-[#2D5016] px-4 py-2 text-center text-sm font-bold text-[#2D5016] transition hover:bg-[#2D5016] hover:text-white"
              >
                Atur Profil
              </Link>
            </div>

            <nav className="rounded-2xl border border-[#F0E8D8] bg-white p-3 shadow-sm">
              <p className="px-3 pb-2 pt-1 text-[10px] font-bold uppercase tracking-wider text-[#7AB648]">
                Menu
              </p>
              {[
                { href: "/dashboard", label: "Dashboard", icon: "M3 12l9-9 9 9M5 10v10h14V10" },
                { href: "/courses", label: "Katalog Course", icon: "M12 6.253v13M3 6.253V19a2 2 0 002 2h14a2 2 0 002-2V6.253" },
                { href: "/dashboard/code-review", label: "AI Code Review", icon: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" },
                { href: "/komunitas", label: "Komunitas", icon: "M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 014-4h.5M16 3a4 4 0 110 8 4 4 0 010-8zM8 7a4 4 0 110 8 4 4 0 010-8z" },
                { href: "/blog", label: "Blog", icon: "M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l4 4v10a2 2 0 01-2 2z" },
                { href: "/profile", label: "Profil & Akun", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-[#2D5016] transition hover:bg-[#FFF3D6]"
                >
                  <svg className="h-4 w-4 text-[#F5A62A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                  </svg>
                  {item.label}
                </Link>
              ))}
              {(role === "admin" || role === "instructor") && (
                <>
                  <p className="mt-3 px-3 pb-2 pt-1 text-[10px] font-bold uppercase tracking-wider text-[#7AB648]">
                    Instructor
                  </p>
                  <Link
                    href="/dashboard/studio"
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-[#2D5016] transition hover:bg-[#FFF3D6]"
                  >
                    <svg className="h-4 w-4 text-[#F5A62A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Course Studio
                  </Link>
                  <Link
                    href="/dashboard/blog/new"
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-[#2D5016] transition hover:bg-[#FFF3D6]"
                  >
                    <svg className="h-4 w-4 text-[#F5A62A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Tulis Artikel
                  </Link>
                </>
              )}
              {role === "admin" && (
                <>
                  <p className="mt-3 px-3 pb-2 pt-1 text-[10px] font-bold uppercase tracking-wider text-[#F5A62A]">
                    Admin Only
                  </p>
                  <Link
                    href="/dashboard/payments"
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-[#2D5016] transition hover:bg-[#FFF3D6]"
                  >
                    <svg className="h-4 w-4 text-[#F5A62A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    Pembayaran (Approve)
                  </Link>
                  <Link
                    href="/dashboard/users"
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-[#2D5016] transition hover:bg-[#FFF3D6]"
                  >
                    <svg className="h-4 w-4 text-[#F5A62A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 014-4h.5M16 3a4 4 0 110 8 4 4 0 010-8zM8 7a4 4 0 110 8 4 4 0 010-8z" />
                    </svg>
                    Kelola User & Role
                  </Link>
                  <Link
                    href="/dashboard/analytics"
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-[#2D5016] transition hover:bg-[#FFF3D6]"
                  >
                    <svg className="h-4 w-4 text-[#F5A62A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Analytics Platform
                  </Link>
                </>
              )}
              {isSuperAdmin(userEmail) && (
                <Link
                  href="/dashboard/affiliates"
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-[#2D5016] transition hover:bg-[#FFF3D6]"
                >
                  <svg className="h-4 w-4 text-[#F5A62A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  Sistem Afiliasi
                </Link>
              )}
            </nav>

            <div className="rounded-2xl border border-[#F0E8D8] bg-[#1A2E0A] p-5 text-white shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-[#F5A62A]">Komunitas</p>
              <p className="mt-2 text-sm font-bold">Belajar bareng, ngga sendirian</p>
              <p className="mt-1 text-xs text-white/70 leading-5">
                Tanya, sharing, atau cuma nimbrung di Discord & WhatsApp Group.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <a
                  href={siteConfig.community.discord}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-[#5865F2] px-3 py-1.5 text-xs font-bold text-white hover:opacity-90"
                >
                  Discord
                </a>
                <a
                  href={siteConfig.community.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-[#25D366] px-3 py-1.5 text-xs font-bold text-white hover:opacity-90"
                >
                  WhatsApp
                </a>
              </div>
            </div>
          </aside>

          {/* Main */}
          <main className="space-y-8">
            {/* Welcome banner */}
            <section className="rounded-2xl border border-[#F0E8D8] bg-white p-8 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-[#7AB648]">Dashboard</p>
              <h1 className="mt-2 text-3xl font-extrabold text-[#2D5016] md:text-4xl">
                Halo, {userName}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#444]">
                {ownedCourses.length === 0
                  ? "Belum ada course aktif. Daftar Founding Member di bawah buat akses semua course."
                  : `Lu lagi pegang ${ownedCourses.length} course aktif. Modul ${totalModulesDone}/${totalModulesEnrolled} selesai.`}
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-[#F0E8D8] bg-[#FEFBF5] p-4">
                  <p className="text-xs text-[#5C4813]">Course aktif</p>
                  <p className="mt-1 text-2xl font-extrabold text-[#2D5016]">
                    {ownedCourses.length}
                  </p>
                </div>
                <div className="rounded-xl border border-[#F0E8D8] bg-[#FEFBF5] p-4">
                  <p className="text-xs text-[#5C4813]">Sedang dikerjain</p>
                  <p className="mt-1 text-2xl font-extrabold text-[#2D5016]">{inProgressCount}</p>
                </div>
                <div className="rounded-xl border border-[#F0E8D8] bg-[#FEFBF5] p-4">
                  <p className="text-xs text-[#5C4813]">Selesai</p>
                  <p className="mt-1 text-2xl font-extrabold text-[#2D5016]">{completedCount}</p>
                </div>
              </div>
            </section>

            {!onboardingCompleted && (
              <section className="overflow-hidden rounded-2xl border-2 border-[#F5A62A] bg-gradient-to-r from-[#FFF3D6] to-[#FEFBF5] shadow-md animate-fade-in-up">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#F5A62A] text-xl">
                      🚀
                    </div>
                    <div>
                      <p className="text-base font-extrabold text-[#2D5016]">
                        {onboardingSkipped ? "Lanjutin setup profil" : "Setup perjalanan belajarmu"}
                      </p>
                      <p className="text-sm text-[#5C4813]">
                        Tujuan + minat + komunitas — selesai dalam 1 menit.
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/onboarding"
                    className="shrink-0 rounded-xl bg-[#F5A62A] px-6 py-3 text-sm font-bold text-[#2D5016] shadow transition hover:opacity-90"
                  >
                    {onboardingSkipped ? "Lanjutkan" : "Mulai →"}
                  </Link>
                </div>
              </section>
            )}

            <DashboardOnboarding userName={userName} enrollmentsCount={ownedCourses.length} />

            {/* Continue Learning */}
            {coursesWithProgress.filter((c) => c.progress > 0 && c.progress < 100).length > 0 && (
              <section className="rounded-2xl border border-[#F5A62A] bg-[#FFF3D6] p-6 shadow-sm">
                <h2 className="text-xl font-extrabold text-[#2D5016]">Lanjutin belajar</h2>
                <p className="mt-1 text-sm text-[#5C4813]">Klik untuk lanjutin modul terakhir.</p>
                <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {coursesWithProgress
                    .filter((c) => c.progress > 0 && c.progress < 100)
                    .sort((a, b) => b.progress - a.progress)
                    .slice(0, 3)
                    .map((course) => (
                      <Link
                        key={course.slug}
                        href={`/access/${course.slug}${course.lastModuleIndex >= 0 ? `?module=${course.lastModuleIndex}` : ""}`}
                        className="flex items-center gap-3 rounded-xl border border-[#F5A62A]/30 bg-white p-4 transition hover:border-[#F5A62A] hover:shadow-sm"
                      >
                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-[#2D5016] text-white text-xs font-bold">
                          {course.progress}%
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-bold text-[#2D5016]">{course.title}</p>
                          <p className="text-xs text-[#5C4813]">Lanjut modul</p>
                        </div>
                        <span className="text-sm text-[#F5A62A]">→</span>
                      </Link>
                    ))}
                </div>
              </section>
            )}

            {/* My Courses */}
            <section className="rounded-2xl border border-[#F0E8D8] bg-white p-6 shadow-sm">
              <div className="flex items-end justify-between gap-6">
                <div>
                  <h2 className="text-2xl font-extrabold text-[#2D5016]">Course Saya</h2>
                  <p className="mt-1 text-sm text-[#444]">Semua course yang aktif di akun lu.</p>
                </div>
                <span className="rounded-full bg-[#FFF3D6] px-3 py-1 text-xs font-semibold text-[#5C4813]">
                  {ownedCourses.length} aktif
                </span>
              </div>

              {coursesWithProgress.length ? (
                <div className="mt-6 grid gap-5 lg:grid-cols-3">
                  {coursesWithProgress.map((course) => (
                    <article
                      key={course.slug}
                      className="group flex flex-col overflow-hidden rounded-2xl border border-[#F0E8D8] bg-[#FEFBF5] transition hover:border-[#F5A62A] hover:shadow-sm"
                    >
                      <CourseThumbnail title={course.title} category={course.category} />
                      <div className="flex flex-1 flex-col p-5">
                        <span className="self-start rounded-full bg-[#F0E8D8] px-2 py-0.5 text-xs font-semibold text-[#2D5016]">
                          {course.category}
                        </span>
                        <h3 className="mt-3 text-base font-extrabold text-[#2D5016] group-hover:text-[#F5A62A] transition">
                          {course.title}
                        </h3>

                        <div className="mt-3">
                          <div className="flex items-center justify-between text-xs text-[#444]">
                            <span>Progress</span>
                            <span className="font-bold text-[#2D5016]">{course.progress}%</span>
                          </div>
                          <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-[#F0E8D8]">
                            <div
                              className="h-full rounded-full bg-[#7AB648]"
                              style={{ width: `${course.progress}%` }}
                            />
                          </div>
                        </div>

                        <Link
                          href={`/access/${course.slug}${course.lastModuleIndex >= 0 ? `?module=${course.lastModuleIndex}` : ""}`}
                          className="mt-auto pt-4 inline-flex items-center gap-1 text-sm font-bold text-[#F5A62A] hover:text-[#2D5016] transition"
                        >
                          {course.progress === 100 ? "Lihat sertifikat" : "Lanjut belajar"} →
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="mt-6 rounded-2xl border-2 border-dashed border-[#F0E8D8] bg-[#FEFBF5] p-10 text-center">
                  <p className="text-base font-bold text-[#2D5016]">Belum ada course aktif</p>
                  <p className="mt-2 text-sm text-[#444]">
                    Daftar Founding Member biar dashboard ngga kosong.
                  </p>
                  <Link
                    href="/courses"
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#F5A62A] px-5 py-3 text-sm font-bold text-[#2D5016] transition hover:opacity-90"
                  >
                    Lihat Katalog →
                  </Link>
                </div>
              )}
            </section>

            {/* Badges + Points */}
            {allBadges.length > 0 && (
              <section className="rounded-2xl border border-[#F0E8D8] bg-white p-6 shadow-sm">
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-extrabold text-[#2D5016]">Pencapaian</h2>
                    <p className="mt-1 text-sm text-[#444]">
                      Kumpulin poin dan unlock badge buat track progress lu.
                    </p>
                  </div>
                  <div className="rounded-xl border border-[#F0E8D8] bg-[#FFF3D6] px-4 py-2 text-center">
                    <p className="text-[10px] font-bold text-[#5C4813]">Total Poin</p>
                    <p className="text-xl font-extrabold text-[#2D5016]">{userPoints}</p>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {allBadges.slice(0, 6).map((badge) => {
                    const earned = earnedBadgeIds.has(badge.id);
                    return (
                      <div
                        key={badge.id}
                        className={`rounded-xl border p-4 transition ${
                          earned
                            ? "border-[#F5A62A] bg-[#FFF3D6]"
                            : "border-[#F0E8D8] bg-[#FEFBF5] opacity-70"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-xl text-xl ${
                              earned ? "bg-white" : "bg-[#F0E8D8]"
                            }`}
                          >
                            {badge.icon ?? "•"}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-bold text-[#2D5016]">{badge.name}</p>
                            <p className="truncate text-xs text-[#5C4813]">
                              {earned ? "Tercapai" : badge.description ?? ""}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
