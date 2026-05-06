import { getCourses as getCoursesFromDb, getCourseBySlug as getCourseBySlugFromDb, getEnrollments as getEnrollmentsFromDb } from "@/lib/db";
import type { Course } from "@/lib/data";
import { courses } from "@/lib/data";

export async function getCourses(): Promise<Course[]> {
  const dbCourses = await getCoursesFromDb();
  const dbCoursesTyped = dbCourses as Course[];

  // Start with local courses from data.ts (these are the priority)
  const allCourses = [...courses];

  // Add DB courses that are not in local courses AND not unwanted courses
  const unwantedSlugs = ['fullstack-web-engineer', 'network-engineer-pro', 'cyber-security-analyst', 'product-ui-designer', 'data-science-fundamental'];
  
  for (const dbCourse of dbCoursesTyped) {
    if (!allCourses.some(c => c.slug === dbCourse.slug) && !unwantedSlugs.includes(dbCourse.slug)) {
      allCourses.push(dbCourse);
    }
  }

  // Only show published courses
  return allCourses.filter((c) => c.is_published !== false);
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
