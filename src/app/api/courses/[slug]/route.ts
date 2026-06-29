import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { courses } from "@/lib/data";

/**
 * PATCH /api/courses/[slug]
 * Admin: can update price
 * Instructor+: can update module names
 * Body: { price?: number, modules?: string[] }
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Login diperlukan." }, { status: 401 });

  const clerk = await clerkClient();
  const user = await clerk.users.getUser(userId);
  const role = (user.publicMetadata as { role?: string })?.role;
  const isAdmin = role === "admin" || role === "super_admin";
  const isInstructor = isAdmin || role === "instructor";

  if (!isInstructor) {
    return NextResponse.json({ error: "Akses ditolak." }, { status: 403 });
  }

  const { slug } = await params;
  const localCourse = courses.find((c) => c.slug === slug);
  if (!localCourse) {
    return NextResponse.json({ error: "Course tidak ditemukan." }, { status: 404 });
  }

  const body = (await request.json()) as { price?: number; modules?: string[] };
  const update: Record<string, unknown> = {};

  if (body.price !== undefined) {
    if (!isAdmin) return NextResponse.json({ error: "Hanya admin yang bisa ubah harga." }, { status: 403 });
    const price = Number(body.price);
    if (!Number.isFinite(price) || price < 0) {
      return NextResponse.json({ error: "Harga tidak valid." }, { status: 400 });
    }
    update.price = price;
  }

  if (body.modules !== undefined) {
    if (!Array.isArray(body.modules) || body.modules.some((m) => typeof m !== "string" || !m.trim())) {
      return NextResponse.json({ error: "Nama modul tidak valid." }, { status: 400 });
    }
    if (body.modules.length !== localCourse.modules.length) {
      return NextResponse.json({ error: `Jumlah modul harus ${localCourse.modules.length}.` }, { status: 400 });
    }
    update.modules = body.modules.map((m) => m.trim());
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "Tidak ada yang diubah." }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from("courses")
    .upsert({ slug, ...update }, { onConflict: "slug" });

  if (error) {
    console.error("[PATCH /api/courses]", error.message);
    return NextResponse.json({ error: "Gagal simpan perubahan." }, { status: 500 });
  }

  return NextResponse.json({ success: true, slug, updated: update });
}
