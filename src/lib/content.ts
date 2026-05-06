import { getCourses as getCoursesFromDb, getCourseBySlug as getCourseBySlugFromDb, getEnrollments as getEnrollmentsFromDb } from "@/lib/db";
import type { Course } from "@/lib/data";
import { courses } from "@/lib/data";

export async function getCourses(): Promise<Course[]> {
  // ONLY return local courses from data.ts - ignore DB for now since we're in first launch
  return courses.filter((c) => c.is_published !== false);
}

export async function getCourseBySlug(slug: string): Promise<Course | null> {
  // First check published courses from data.ts
  const localCourse = courses.find((c) => c.slug === slug && c.is_published);
  if (localCourse) return localCourse as Course;
  
  // Fallback to DB
  const course = await getCourseBySlugFromDb(slug);
  return course as Course | null;
}

export async function getEnrollments(userEmail: string) {
  return await getEnrollmentsFromDb(userEmail);
}
