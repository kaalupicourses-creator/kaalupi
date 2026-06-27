import { auth, currentUser } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";
import { demoUsers, type UserRole } from "@/lib/data";

export type SessionUser = {
  name: string;
  email: string;
  role: UserRole;
  clerkId?: string;
};

export async function getSession(): Promise<SessionUser | null> {
  const { userId } = await auth();

  if (userId) {
    const user = await currentUser();
    if (user) {
      const role = user.publicMetadata?.role as UserRole | undefined;

      const nameParts = [user.firstName, user.lastName].filter(Boolean).join(" ");
      return {
        name: nameParts || user.primaryEmailAddress?.emailAddress || "",
        email: user.primaryEmailAddress?.emailAddress ?? "",
        role: role ?? "student",
        clerkId: user.id,
      };
    }
  }

  return null;
}

export function authenticateUser(email: string, password: string) {
  return (
    demoUsers.find(
      (user) =>
        user.email.toLowerCase() === email.toLowerCase() &&
        user.password === password,
    ) ?? null
  );
}

export async function getEnrollments(email: string) {
  const { data, error } = await supabase
    .from("enrollments")
    .select("course_slug")
    .eq("user_email", email)
    .eq("status", "active");

  if (error) return [];
  return data.map((e) => e.course_slug);
}

export async function getAllCustomCourses() {
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .neq("author_email", null);

  if (error) return [];
  return data;
}

export async function getPendingOrders(email: string) {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("user_email", email)
    .eq("status", "pending");

  if (error) return [];
  return data;
}

export async function upsertEnrollment(email: string, slug: string) {
  const { data, error } = await supabase
    .from("enrollments")
    .upsert(
      { user_email: email, course_slug: slug, status: "active" },
      { onConflict: "user_email,course_slug" },
    )
    .select()
    .single();

  if (error) return null;
  return data;
}

export async function savePendingOrder(order: {
  orderId: string;
  slug: string;
  email: string;
  amount: number;
}) {
  const { data, error } = await supabase
    .from("orders")
    .insert({
      order_id: order.orderId,
      user_email: order.email,
      course_slug: order.slug,
      amount: order.amount,
      status: "pending",
    })
    .select()
    .single();

  if (error) return null;
  return data;
}

export async function removePendingOrder(orderId: string) {
  const { error } = await supabase
    .from("orders")
    .delete()
    .eq("order_id", orderId);

  if (error) return null;
  return { success: true };
}

export async function saveCustomCourse(course: {
  slug: string;
  title: string;
  category: string;
  level: string;
  duration: string;
  price: number;
  summary: string;
  hero: string;
  outcomes: string[];
  modules: string[];
  format: "video" | "article" | "blended";
  featured?: boolean;
  authorEmail: string;
}) {
  const { data, error } = await supabase
    .from("courses")
    .upsert(
      {
        slug: course.slug,
        title: course.title,
        category: course.category,
        level: course.level,
        duration: course.duration,
        price: course.price,
        summary: course.summary,
        hero: course.hero,
        outcomes: course.outcomes,
        modules: course.modules,
        format: course.format,
        featured: course.featured ?? false,
        author_email: course.authorEmail,
      },
      { onConflict: "slug" },
    )
    .select()
    .single();

  if (error) return null;
  return data;
}

export function canManageContent(role?: UserRole | null) {
  return role === "super_admin" || role === "admin" || role === "instructor";
}

// Super admin — owner only, identified by email (not Clerk metadata)
const SUPER_ADMIN_EMAIL = "kamilalfaris@gmail.com";

export function isSuperAdmin(email?: string | null): boolean {
  return !!email && email.toLowerCase() === SUPER_ADMIN_EMAIL;
}
