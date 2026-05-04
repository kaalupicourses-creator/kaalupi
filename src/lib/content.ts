import { getCourses as getCoursesFromDb, getCourseBySlug as getCourseBySlugFromDb, getEnrollments as getEnrollmentsFromDb } from "@/lib/db";
import type { Course } from "@/lib/data";

export async function getCourses(): Promise<Course[]> {
  const dbCourses = await getCoursesFromDb();
  return dbCourses as Course[];
}

export async function getCourseBySlug(slug: string): Promise<Course | null> {
  const course = await getCourseBySlugFromDb(slug);
  return course as Course | null;
}

export async function getEnrollments(userEmail: string) {
  return await getEnrollmentsFromDb(userEmail);
}
