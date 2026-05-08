import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { RoleBadge } from "@/components/role-badge";
import { getEnrollments, getProgress, getUserPoints, getUserBadges, getBadges } from "@/lib/db";
import { getCourses } from "@/lib/content";
import { CourseThumbnail } from "@/components/course-thumbnail";
import { DashboardOnboarding } from "@/components/dashboard-onboarding";

const roleDescriptions = {
  admin:
    "Akses penuh untuk mengelola course, governance, dan memantau payment flow.",
  instructor:
    "Dapat menambahkan materi baru, mengatur course, dan menjaga kualitas konten.",
  student:
    "Dapat mengakses course yang sudah dibeli dan melanjutkan pembelajaran.",
};

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/login?redirect=/dashboard");
  }

  const user = await currentUser();
  const role = (user?.publicMetadata as { role?: string })?.role ?? "student";

  const nameParts = [user?.firstName, user?.lastName].filter(Boolean).join(" ");
  const userName = nameParts || user?.primaryEmailAddress?.emailAddress || "";
  const userEmail = user?.primaryEmailAddress?.emailAddress ?? "";

  const allCourses = await getCourses();
  
  let enrollments: string[] = [];
  try {
    enrollments = await getEnrollments(userEmail);
  } catch (error) {
    console.error("Failed to fetch enrollments:", error);
  }
  
  const ownedCourses = allCourses.filter((course) => enrollments.includes(course.slug));

  // Fetch progress for each course
  const coursesWithProgress = await Promise.all(
    ownedCourses.map(async (course) => {
      let progress: Array<{ completed: boolean; module_index: number }> = [];
      try {
        progress = await getProgress(userEmail, course.slug);
      } catch (error) {
        console.error(`Failed to fetch progress for ${course.slug}:`, error);
      }
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
    })
  );

  // Fetch user points
  let userPoints = 0;
  try {
    const userPointsData = await getUserPoints(userEmail);
    userPoints = userPointsData?.points ?? 0;
  } catch (error) {
    console.error("Failed to fetch user points:", error);
  }

  // Fetch badges
  let allBadges: Array<{ id: string; name: string; description: string | null; icon: string | null; required_points: number }> = [];
  let earnedBadgeIds = new Set<string>();
  try {
    allBadges = await getBadges();
    const userBadgesData = await getUserBadges(userEmail);
    earnedBadgeIds = new Set(userBadgesData?.map((ub: { badge_id: string }) => ub.badge_id) ?? []);
  } catch (error) {
    console.error("Failed to fetch badges:", error);
  }

  return (
    <div className="bg-[#FEFBF5] min-h-screen">
      <div className="mx-auto max-w-7xl px-6 py-16">
        {/* Welcome Section */}
        <section className="mb-8 rounded-2xl border border-[#F0E8D8] bg-white p-8 shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            <RoleBadge role={role as "admin" | "instructor" | "student"} />
            <p className="text-sm text-[#444444]">{userEmail}</p>
          </div>
          <h1 className="mt-4 text-4xl font-extrabold text-[#2D5016]">
            Halo, {userName} 👋
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-[#444444]">
            {roleDescriptions[role as keyof typeof roleDescriptions] ?? roleDescriptions.student}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            {(role === "admin" || role === "instructor") ? (
              <>
                <Link
                  href="/dashboard/studio"
                  className="rounded-xl bg-[#F5A62A] px-5 py-3 text-sm font-bold text-[#2D5016] transition hover:opacity-90"
                >
                  🎬 Course Studio
                </Link>
                <Link
                  href="/dashboard/blog/new"
                  className="rounded-xl bg-[#FFF3D6] px-5 py-3 text-sm font-bold text-[#5C4813] transition hover:bg-[#F5A62A] hover:text-[#2D5016] border border-[#F5A62A]"
                >
                  + Tulis Artikel
                </Link>
              </>
            ) : null}
            <Link
              href="/dashboard/code-review"
              className="rounded-xl bg-[#E3F2FD] px-5 py-3 text-sm font-bold text-[#1565C0] transition hover:bg-[#1565C0] hover:text-white border border-[#1565C0]"
            >
              AI Code Review
            </Link>
            <Link
              href="/courses"
              className="rounded-xl border-2 border-[#2D5016] px-5 py-3 text-sm font-semibold text-[#2D5016] transition hover:bg-[#2D5016] hover:text-white"
            >
              Lihat Katalog
            </Link>
          </div>
        </section>

        {/* Onboarding for new students */}
        <DashboardOnboarding userName={userName} enrollmentsCount={ownedCourses.length} />

        {/* Stats Overview */}
        <section className="mb-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: "My Courses",
              value: ownedCourses.length,
              icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
              bg: "bg-[#E3F2FD]",
              color: "text-[#1565C0]",
            },
            {
              label: "Total Katalog",
              value: allCourses.length,
              icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
              bg: "bg-[#E8F5E9]",
              color: "text-[#2D5016]",
            },
            {
              label: "Role",
              value: role,
              isText: true,
              icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
              bg: "bg-[#FFF3D6]",
              color: "text-[#5C4813]",
            },
            {
              label: "Poin",
              value: userPoints,
              icon: "M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z",
              bg: "bg-[#F0E8D8]",
              color: "text-[#2D5016]",
            },
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-[#F0E8D8] bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg}`}>
                  <svg className={`h-5 w-5 ${stat.color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={stat.icon} />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-[#444444]">{stat.label}</p>
                  <p className={`font-extrabold text-[#2D5016] ${stat.isText ? "text-lg capitalize" : "text-2xl"}`}>{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Badges Section */}
        {(() => {
          // Compute progress stats
          const completedCourses = coursesWithProgress.filter((c) => c.progress === 100).length;
          const totalEnrolled = ownedCourses.length;
          const totalModulesCompleted = coursesWithProgress.reduce(
            (sum, c) => sum + Math.round((c.progress / 100) * c.modules.length),
            0
          );

          const badgeList = [
            {
              icon: "🎓",
              name: "Pemula",
              desc: "Selesain course pertama lu",
              target: 1,
              current: completedCourses,
              unit: "course selesai",
              points: 50,
            },
            {
              icon: "📚",
              name: "Rajin Belajar",
              desc: "Kumpulin 100 poin",
              target: 100,
              current: userPoints,
              unit: "poin",
              points: 100,
            },
            {
              icon: "🏆",
              name: "Master",
              desc: "Selesain 3 course",
              target: 3,
              current: completedCourses,
              unit: "course selesai",
              points: 500,
            },
            {
              icon: "🔗",
              name: "Kontributor",
              desc: "Share sertifikat ke LinkedIn",
              target: 1,
              current: 0, // TODO: track LinkedIn shares
              unit: "share",
              points: 50,
            },
            {
              icon: "🚀",
              name: "Konsisten",
              desc: "Selesain 5 modul",
              target: 5,
              current: totalModulesCompleted,
              unit: "modul",
              points: 75,
            },
            {
              icon: "🎯",
              name: "Fokus",
              desc: "Enroll minimal 1 course",
              target: 1,
              current: totalEnrolled,
              unit: "course",
              points: 25,
            },
          ];

          return (
            <section className="mb-8 rounded-2xl border border-[#F0E8D8] bg-white p-8 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-extrabold text-[#2D5016]">Badges Saya</h2>
                  <p className="mt-2 text-sm text-[#444444]">
                    Kumpulin poin & buka badge buat tunjukin progress lu.
                  </p>
                </div>
                <div className="rounded-xl border border-[#F0E8D8] bg-[#FFF3D6] px-4 py-2 text-center">
                  <p className="text-xs text-[#5C4813] font-semibold">Total Poin Lu</p>
                  <p className="text-2xl font-extrabold text-[#2D5016]">{userPoints}</p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {badgeList.map((badge) => {
                  const unlocked = badge.current >= badge.target;
                  const percent = Math.min(100, Math.round((badge.current / badge.target) * 100));
                  return (
                    <div
                      key={badge.name}
                      className={`rounded-xl border p-5 transition ${
                        unlocked
                          ? "border-[#F5A62A] bg-gradient-to-br from-[#FFF3D6] to-[#FEFBF5] shadow-sm"
                          : "border-[#F0E8D8] bg-[#F9F9F9]"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className={`text-4xl ${unlocked ? "" : "grayscale opacity-40"}`}>
                          {unlocked ? badge.icon : "🔒"}
                        </div>
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                            unlocked
                              ? "bg-[#F5A62A] text-[#2D5016]"
                              : "bg-white text-[#999] border border-[#F0E8D8]"
                          }`}
                        >
                          +{badge.points} pts
                        </span>
                      </div>
                      <p
                        className={`mt-3 text-base font-bold ${
                          unlocked ? "text-[#2D5016]" : "text-[#666]"
                        }`}
                      >
                        {badge.name}
                      </p>
                      <p className="mt-1 text-xs text-[#444444]">{badge.desc}</p>

                      {!unlocked && (
                        <div className="mt-3">
                          <div className="flex items-center justify-between text-xs text-[#444444]">
                            <span>
                              {badge.current}/{badge.target} {badge.unit}
                            </span>
                            <span className="font-bold text-[#2D5016]">{percent}%</span>
                          </div>
                          <div className="mt-1.5 h-1.5 rounded-full bg-[#F0E8D8] overflow-hidden">
                            <div
                              className="h-full rounded-full bg-[#F5A62A] transition-all"
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {unlocked && (
                        <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-[#7AB648]">
                          <svg
                            className="h-3.5 w-3.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={3}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          Tercapai!
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 rounded-xl border border-[#F0E8D8] bg-[#FEFBF5] p-5">
                <div className="flex items-start gap-4">
                  <div className="text-2xl">💡</div>
                  <div className="flex-1">
                    <p className="font-bold text-[#2D5016] text-sm">Cara Cepet Dapet Badge</p>
                    <ul className="mt-2 space-y-1 text-xs text-[#444444] leading-6">
                      <li>
                        ✅ <strong>Selesain modul</strong> → +10 poin per modul
                      </li>
                      <li>
                        ✅ <strong>Selesain course 100%</strong> → +50 poin + sertifikat
                      </li>
                      <li>
                        ✅ <strong>Share sertifikat ke LinkedIn</strong> → +50 poin + badge Kontributor
                      </li>
                      <li>
                        ✅ <strong>Enroll course baru</strong> → +25 poin
                      </li>
                    </ul>
                    <Link
                      href="/courses"
                      className="mt-3 inline-flex items-center gap-1 rounded-lg bg-[#F5A62A] px-3 py-1.5 text-xs font-bold text-[#2D5016] hover:opacity-90"
                    >
                      Mulai dari sini →
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          );
        })()}

        {/* Continue Learning Section (if has progress) */}
        {coursesWithProgress.filter((c) => c.progress > 0 && c.progress < 100).length > 0 && (
          <section className="mb-8 rounded-2xl border border-[#F5A62A] bg-[#FFF3D6] p-8 shadow-sm">
            <h2 className="text-2xl font-extrabold text-[#2D5016]">Lanjutkan Belajar 🚀</h2>
            <p className="mt-2 text-sm text-[#444444]">Klik untuk lanjutin modul terakhir kamu</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {coursesWithProgress
                .filter((c) => c.progress > 0 && c.progress < 100)
                .sort((a, b) => b.progress - a.progress)
                .slice(0, 3)
                .map((course) => (
                  <Link
                    key={course.slug}
                    href={`/access/${course.slug}${course.lastModuleIndex >= 0 ? `?module=${course.lastModuleIndex}` : ""}`}
                    className="flex items-center gap-4 rounded-xl border border-[#F0E8D8] bg-white p-4 transition hover:border-[#F5A62A] hover:shadow-sm"
                  >
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-[#2D5016] text-white font-bold text-sm">
                      {course.progress}%
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-[#2D5016]">{course.title}</p>
                      <p className="text-xs text-[#444444]">{course.progress}% selesai</p>
                    </div>
                    <svg className="h-4 w-4 flex-shrink-0 text-[#F5A62A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ))}
            </div>
          </section>
        )}

        {/* My Courses */}
        <section className="rounded-2xl border border-[#F0E8D8] bg-white p-8 shadow-sm">
          <div className="flex items-end justify-between gap-6">
            <div>
              <h2 className="text-3xl font-extrabold text-[#2D5016]">My Courses</h2>
              <p className="mt-3 text-sm leading-7 text-[#444444]">
                Daftar course yang saat ini aktif untuk akun login.
              </p>
            </div>
            <span className="rounded-full bg-[#FFF3D6] px-3 py-1 text-sm font-semibold text-[#5C4813]">{ownedCourses.length} aktif</span>
          </div>

          {coursesWithProgress.length ? (
            <div className="mt-8 grid gap-5 lg:grid-cols-3">
              {coursesWithProgress.map((course) => (
                <article key={course.slug} className="group rounded-2xl border border-[#F0E8D8] bg-[#FEFBF5] overflow-hidden transition hover:border-[#F5A62A] hover:shadow-sm">
                  <CourseThumbnail title={course.title} category={course.category} />
                  <div className="p-5">
                    <span className="rounded-full bg-[#F0E8D8] px-2 py-0.5 text-xs font-semibold text-[#2D5016]">{course.category}</span>
                    <h3 className="mt-3 text-xl font-bold text-[#2D5016] group-hover:text-[#F5A62A] transition">{course.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-[#444444] line-clamp-2">{course.summary}</p>

                    {/* Progress Bar */}
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-xs text-[#444444]">
                        <span>Progress</span>
                        <span className="font-semibold text-[#2D5016]">{course.progress}%</span>
                      </div>
                      <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-[#F0E8D8]">
                        <div
                          className="h-full rounded-full bg-[#7AB648] transition-all duration-500"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                    </div>

                    <Link
                      href={`/access/${course.slug}${course.lastModuleIndex >= 0 ? `?module=${course.lastModuleIndex}` : ""}`}
                      className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#F5A62A] hover:text-[#2D5016] transition"
                    >
                      {course.progress === 100 ? "Lihat Sertifikat" : "Lanjut Belajar"}
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-2xl border border-[#F0E8D8] bg-[#FEFBF5] p-10 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#F0E8D8]">
                <svg className="h-8 w-8 text-[#2D5016]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <p className="mt-4 text-base font-bold text-[#2D5016]">Belum ada course aktif</p>
              <p className="mt-2 text-sm text-[#444444]">
                Buka katalog lalu lakukan checkout untuk mulai belajar.
              </p>
              <Link
                href="/courses"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#F5A62A] px-5 py-3 text-sm font-bold text-[#2D5016] transition hover:opacity-90"
              >
                Lihat Katalog
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
