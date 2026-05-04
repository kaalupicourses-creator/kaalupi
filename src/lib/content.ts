import { getCourses as getCoursesFromDb, getCourseBySlug as getCourseBySlugFromDb } from "@/lib/db";
import { courses as seedCourses } from "@/lib/data";

export async function getCourses() {
  const dbCourses = await getCoursesFromDb();
  if (dbCourses.length === 0) {
    return seedCourses;
  }
  return dbCourses;
}

export async function getCourseBySlug(slug: string) {
  const course = await getCourseBySlugFromDb(slug);
  if (!course) {
    return seedCourses.find((c) => c.slug === slug) ?? null;
  }
  return course;
}
