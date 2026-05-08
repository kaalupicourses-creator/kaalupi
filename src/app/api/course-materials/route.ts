import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { getEnrollments } from "@/lib/content";

async function requireStaff() {
  const { userId } = await auth();
  if (!userId) return { ok: false as const, status: 401, error: "Akses ditolak." };
  const clerk = await clerkClient();
  const user = await clerk.users.getUser(userId);
  const role = (user.publicMetadata as { role?: string })?.role;
  if (role !== "admin" && role !== "instructor") {
    return { ok: false as const, status: 403, error: "Hanya admin/instructor." };
  }
  return { ok: true as const, role, userId };
}

/**
 * POST /api/course-materials
 * Body single: { course_slug, title, video_url?, content?, module_index, order_index }
 * Body bulk:   { items: [...] }   // bulk insert/upsert
 */
export async function POST(request: Request) {
  const a = await requireStaff();
  if (!a.ok) return NextResponse.json({ error: a.error }, { status: a.status });

  const body = (await request.json()) as Record<string, unknown>;
  const supabase = getSupabaseAdmin();

  // Bulk import path
  if (Array.isArray(body.items)) {
    const items = (body.items as Array<Record<string, unknown>>).map((item) => ({
      course_slug: String(item.course_slug ?? "").trim(),
      title: String(item.title ?? "").trim(),
      video_url: item.video_url ? String(item.video_url).trim() : null,
      content: item.content ? String(item.content) : null,
      module_index: Number(item.module_index ?? 0),
      order_index: Number(item.order_index ?? 0),
    }));

    const invalid = items.find((i) => !i.course_slug || !i.title);
    if (invalid) {
      return NextResponse.json(
        { error: "Semua item harus punya course_slug dan title." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("materials")
      .upsert(items, { onConflict: "course_slug,module_index,order_index" })
      .select();

    if (error) {
      console.error("[Materials bulk] error:", error.message);
      return NextResponse.json({ error: "Gagal bulk import." }, { status: 500 });
    }
    return NextResponse.json({ success: true, count: data?.length ?? 0, materials: data });
  }

  // Single insert (with upsert to prevent duplicates)
  const courseSlug = String(body.course_slug ?? "").trim();
  const title = String(body.title ?? "").trim();
  const videoUrl = body.video_url ? String(body.video_url).trim() : null;
  const content = body.content ? String(body.content) : null;
  const moduleIndex = Number(body.module_index ?? 0);
  const orderIndex = Number(body.order_index ?? 0);

  if (!courseSlug || !title) {
    return NextResponse.json(
      { error: "course_slug dan title wajib diisi." },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("materials")
    .upsert(
      {
        course_slug: courseSlug,
        title,
        video_url: videoUrl,
        content,
        module_index: moduleIndex,
        order_index: orderIndex,
      },
      { onConflict: "course_slug,module_index,order_index" }
    )
    .select()
    .single();

  if (error) {
    console.error("[Materials POST] error:", error.message);
    return NextResponse.json({ error: "Gagal simpan materi." }, { status: 500 });
  }
  return NextResponse.json({ success: true, material: data });
}

/**
 * GET /api/course-materials?course_slug=...&staff=1
 * staff=1 → bypass enrollment check (untuk Studio editor)
 */
export async function GET(request: Request) {
  const supabase = getSupabaseAdmin();
  const { searchParams } = new URL(request.url);
  const courseSlug = searchParams.get("course_slug");
  const isStaffMode = searchParams.get("staff") === "1";

  if (!courseSlug) {
    return NextResponse.json({ error: "course_slug diperlukan." }, { status: 400 });
  }

  const { userId } = await auth();
  if (userId) {
    const clerk = await clerkClient();
    const user = await clerk.users.getUser(userId);
    const userEmail = user.primaryEmailAddress?.emailAddress ?? "";
    const role = (user.publicMetadata as { role?: string })?.role;
    const isStaff = role === "admin" || role === "instructor";

    if (isStaffMode && !isStaff) {
      return NextResponse.json({ error: "Akses staff dibutuhkan." }, { status: 403 });
    }
    if (!isStaff && !isStaffMode) {
      const enrollments = await getEnrollments(userEmail);
      if (!enrollments.includes(courseSlug)) {
        return NextResponse.json(
          { error: "Anda belum memiliki akses ke course ini." },
          { status: 403 }
        );
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
    console.error("[Materials GET] error:", error.message);
    return NextResponse.json({ error: "Gagal memuat materi." }, { status: 500 });
  }
  return NextResponse.json({ materials: data });
}
