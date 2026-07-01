import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getEnrollments, getProgress, updateProgress, getCourseMaterials } from "@/lib/db";
import { getCourseBySlug } from "@/lib/content";
import { AccessPageClient } from "@/components/access-page-client";

export default async function CourseAccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ module?: string; mat?: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/login?redirect=/access");

  const clerkUser = await currentUser();
  const userEmail = clerkUser?.primaryEmailAddress?.emailAddress ?? "";

  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) redirect("/access");

  // Founding members get lifetime access to ALL courses
  const isFoundingMember = clerkUser?.publicMetadata?.is_founding_member === true;

  let enrollments: string[] = [];
  try { enrollments = await getEnrollments(userEmail); } catch {}
  const hasPaidAccess = isFoundingMember || enrollments.includes(course.slug);
  const freeCount = course.free_modules_count ?? 0;

  if (freeCount === 0 && !hasPaidAccess) redirect(`/checkout/${course.slug}`);

  let allMaterials: Awaited<ReturnType<typeof getCourseMaterials>> = [];
  try { allMaterials = await getCourseMaterials(course.slug); } catch {}
  allMaterials.sort((a, b) => a.module_index - b.module_index || a.order_index - b.order_index);

  let progress: Awaited<ReturnType<typeof getProgress>> = [];
  try { progress = await getProgress(userEmail, course.slug); } catch {}
  const completedModules = progress.filter((p) => p.completed).map((p) => p.module_index);

  const sp = await searchParams;
  let activeMat = allMaterials.find((m) => m.id === sp.mat) ?? null;
  if (!activeMat && sp.module !== undefined) {
    const modIdx = parseInt(sp.module, 10);
    activeMat = allMaterials.find((m) => m.module_index === modIdx) ?? null;
  }
  if (!activeMat) activeMat = allMaterials[0] ?? null;

  const activeModuleIndex = activeMat?.module_index ?? 0;
  const isModuleFree = activeModuleIndex < freeCount;
  const canAccess = isModuleFree || hasPaidAccess;

  const totalModules = course.modules.length;
  const completedCount = completedModules.length;
  const courseFinished = hasPaidAccess && completedCount === totalModules && totalModules > 0;

  const courseSlug = course.slug;
  async function markModuleComplete(moduleIndex: number) {
    "use server";
    try {
      await updateProgress(userEmail, courseSlug, moduleIndex, true);
      revalidatePath(`/access/${courseSlug}`);
      revalidatePath("/dashboard");
    } catch {}
  }

  const byModule = course.modules.map((modName, idx) => ({
    name: modName,
    idx,
    materials: allMaterials.filter((m) => m.module_index === idx),
    isLocked: idx >= freeCount && !hasPaidAccess,
    isCompleted: completedModules.includes(idx),
  }));

  return (
    <AccessPageClient
      courseSlug={course.slug}
      courseTitle={course.title}
      courseModules={course.modules}
      foundingPrice={course.founding_price ?? course.price}
      regularPrice={course.regular_price ?? course.original_price ?? 0}
      allMaterials={allMaterials}
      activeMat={activeMat}
      completedModules={completedModules}
      hasPaidAccess={hasPaidAccess}
      freeCount={freeCount}
      courseFinished={courseFinished}
      byModule={byModule}
      canAccess={canAccess}
      markModuleComplete={markModuleComplete}
    />
  );
}
