import { getCourses as getCoursesFromDb, getCourseBySlug as getCourseBySlugFromDb, getEnrollments as getEnrollmentsFromDb } from "@/lib/db";
import type { Course } from "@/lib/data";

export async function getCourses(): Promise<Course[]> {
  const dbCourses = await getCoursesFromDb();
  const allCourses = dbCourses as Course[];
  // Only show published courses
  return allCourses.filter((c) => c.is_published !== false);
}

export async function getCourseBySlug(slug: string): Promise<Course | null> {
  // First check published courses from data.ts
  const { courses } from "@/lib/data";
  const localCourse = courses.find((c) => c.slug === slug && c.is_published);
  if (localCourse) return localCourse as Course;
  
  // Fallback to DB
  const course = await getCourseBySlugFromDb(slug);
  return course as Course | null;
}

export async function getEnrollments(userEmail: string) {
  return await getEnrollmentsFromDb(userEmail);
}
