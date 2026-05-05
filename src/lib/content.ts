import { getCourses as getCoursesFromDb, getCourseBySlug as getCourseBySlugFromDb, getEnrollments as getEnrollmentsFromDb } from "@/lib/db";
import type { Course } from "@/lib/data";

export async function getCourses(): Promise<Course[]> {
  const dbCourses = await getCoursesFromDb();
  const allCourses = dbCourses as Course[];
  return allCourses.filter((c) => c.is_published !== false);
}

export async function getCourseBySlug(slug: string): Promise<Course | null> {
  const course = await getCourseBySlugFromDb(slug);
  return course as Course | null;
}

export async function getEnrollments(userEmail: string) {
  return await getEnrollmentsFromDb(userEmail);
}
