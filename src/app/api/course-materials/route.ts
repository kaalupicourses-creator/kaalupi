import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { getEnrollments } from "@/lib/content";

export async function POST(request: Request) {
  const supabase = getSupabaseAdmin();
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Akses ditolak." }, { status: 401 });
  }

  const clerk = await clerkClient();
  const user = await clerk.users.getUser(userId);
  const role = (user.publicMetadata as { role?: string })?.role;
  if (role !== "admin" && role !== "instructor") {
    return NextResponse.json(
      { error: "Hanya admin dan instructor yang bisa menambah materi." },
      { status: 403 }
    );
  }

  const body = (await request.json()) as Record<string, string>;

  const courseSlug = body.course_slug?.trim();
  const title = body.title?.trim();
  const videoUrl = body.video_url?.trim() || null;
  const content = body.content?.trim() || null;
  const moduleIndex = parseInt(body.module_index ?? "0", 10);
  const orderIndex = parseInt(body.order_index ?? "0", 10);

  if (!courseSlug || !title) {
    return NextResponse.json(
      { error: "course_slug dan title wajib diisi." },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("materials")
    .insert({
      course_slug: courseSlug,
      title,
      video_url: videoUrl,
      content,
      module_index: moduleIndex,
      order_index: orderIndex,
    })
    .select()
    .single();

  if (error) {
    console.error("[Materials] DB error:", error.message);
    return NextResponse.json({ error: "Gagal menyimpan materi." }, { status: 500 });
  }

  return NextResponse.json({ success: true, material: data });
}

export async function GET(request: Request) {
  const supabase = getSupabaseAdmin();
  const { searchParams } = new URL(request.url);
  const courseSlug = searchParams.get("course_slug");

  if (!courseSlug) {
    return NextResponse.json({ error: "course_slug diperlukan." }, { status: 400 });
  }

  // Only check enrollment for non-admin requests
  const { userId } = await auth();
  if (userId) {
    const clerk = await clerkClient();
    const user = await clerk.users.getUser(userId);
    const userEmail = user.primaryEmailAddress?.emailAddress ?? "";
    const role = (user.publicMetadata as { role?: string })?.role;
    const isStaff = role === "admin" || role === "instructor";

    if (!isStaff) {
      const enrollments = await getEnrollments(userEmail);
      if (!enrollments.includes(courseSlug)) {
        return NextResponse.json({ error: "Anda belum memiliki akses ke course ini." }, { status: 403 });
      }
    }
  }

  const { data, error } = await supabase
    .from("materials")
    .select("*")
    .eq("course_slug", courseSlug)
    .order("module_index", { ascending: true })
    .order("order_index", { ascending: true });

  if (error) {
    return NextResponse.json({ error: "Gagal memuat materi." }, { status: 500 });
  }

  return NextResponse.json({ materials: data });
}
