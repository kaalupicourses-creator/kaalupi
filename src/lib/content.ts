import { getCourses as getCoursesFromDb, getCourseBySlug as getCourseBySlugFromDb, getEnrollments as getEnrollmentsFromDb } from "@/lib/db";
import type { Course } from "@/lib/data";
import { courses } from "@/lib/data";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

/** Merge price/modules overrides stored in Supabase courses table into the local course object. */
async function applyDbOverrides(local: Course): Promise<Course> {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("courses")
      .select("price, modules")
      .eq("slug", local.slug)
      .single();
    if (error || !data) return local;
    return {
      ...local,
      price: typeof data.price === "number" ? data.price : local.price,
      modules: Array.isArray(data.modules) && data.modules.length > 0 ? data.modules as string[] : local.modules,
    };
  } catch {
    return local;
  }
}

export async function getCourses(): Promise<Course[]> {
  const published = courses.filter((c) => c.is_published !== false);
  return Promise.all(published.map(applyDbOverrides));
}

export async function getCourseBySlug(slug: string): Promise<Course | null> {
  const local = courses.find((c) => c.slug === slug && c.is_published);
  if (local) return applyDbOverrides(local as Course);

  const course = await getCourseBySlugFromDb(slug);
  return course as Course | null;
}

export async function getEnrollments(userEmail: string) {
  return await getEnrollmentsFromDb(userEmail);
}
