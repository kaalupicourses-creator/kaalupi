import { supabase, type Database } from "@/lib/supabase";

type CourseRow = Database["public"]["Tables"]["courses"]["Row"];
type EnrollmentRow = Database["public"]["Tables"]["enrollments"]["Row"];
type OrderRow = Database["public"]["Tables"]["orders"]["Row"];
type ProgressRow = Database["public"]["Tables"]["progress"]["Row"];
type MaterialRow = Database["public"]["Tables"]["materials"]["Row"];

export async function getCourses() {
  try {
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) return [];
    return data as CourseRow[];
  } catch {
    return [];
  }
}

export async function getCourseBySlug(slug: string) {
  try {
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error && error.code !== "PGRST116") return null;
    return (data as CourseRow | null);
  } catch {
    return null;
  }
}

export async function createCourse(course: Database["public"]["Tables"]["courses"]["Insert"]) {
  const { data, error } = await supabase
    .from("courses")
    .insert(course)
    .select()
    .single();

  if (error) throw error;
  return data as CourseRow;
}

export async function getEnrollments(userEmail: string) {
  const { data, error } = await supabase
    .from("enrollments")
    .select("*")
    .eq("user_email", userEmail)
    .eq("status", "active");

  if (error) throw error;
  return (data as EnrollmentRow[]).map((e) => e.course_slug);
}

export async function createEnrollment(userEmail: string, courseSlug: string) {
  const { data, error } = await supabase
    .from("enrollments")
    .insert({ user_email: userEmail, course_slug: courseSlug, status: "active" })
    .select()
    .single();

  if (error && error.code !== "23505") throw error;
  return data as EnrollmentRow | null;
}

export async function hasEnrollment(userEmail: string, courseSlug: string) {
  const { data, error } = await supabase
    .from("enrollments")
    .select("id")
    .eq("user_email", userEmail)
    .eq("course_slug", courseSlug)
    .eq("status", "active")
    .single();

  if (error && error.code !== "PGRST116") throw error;
  return !!data;
}

export async function createOrder(order: Database["public"]["Tables"]["orders"]["Insert"]) {
  const { data, error } = await supabase
    .from("orders")
    .insert(order)
    .select()
    .single();

  if (error) throw error;
  return data as OrderRow;
}

export async function getOrderById(orderId: string) {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("order_id", orderId)
    .single();

  if (error && error.code !== "PGRST116") throw error;
  return data as OrderRow | null;
}

export async function updateOrderStatus(orderId: string, status: OrderRow["status"], paymentType?: string, midtransResponse?: Record<string, unknown>) {
  const { data, error } = await supabase
    .from("orders")
    .update({
      status,
      payment_type: paymentType ?? null,
      midtrans_response: midtransResponse ?? null,
    })
    .eq("order_id", orderId)
    .select()
    .single();

  if (error) throw error;
  return data as OrderRow;
}

export async function getProgress(userEmail: string, courseSlug: string) {
  const { data, error } = await supabase
    .from("progress")
    .select("*")
    .eq("user_email", userEmail)
    .eq("course_slug", courseSlug)
    .order("module_index", { ascending: true });

  if (error) throw error;
  return data as ProgressRow[];
}

export async function updateProgress(userEmail: string, courseSlug: string, moduleIndex: number, completed: boolean) {
  const { data, error } = await supabase
    .from("progress")
    .upsert(
      {
        user_email: userEmail,
        course_slug: courseSlug,
        module_index: moduleIndex,
        completed,
        completed_at: completed ? new Date().toISOString() : null,
      },
      { onConflict: "user_email,course_slug,module_index" },
    )
    .select()
    .single();

  if (error) throw error;
  return data as ProgressRow;
}

export async function getCourseMaterials(courseSlug: string) {
  const { data, error } = await supabase
    .from("materials")
    .select("*")
    .eq("course_slug", courseSlug)
    .order("order_index", { ascending: true });

  if (error) throw error;
  return data as MaterialRow[];
}

export async function createMaterial(material: Database["public"]["Tables"]["materials"]["Insert"]) {
  const { data, error } = await supabase
    .from("materials")
    .insert(material)
    .select()
    .single();

  if (error) throw error;
  return data as MaterialRow;
}
