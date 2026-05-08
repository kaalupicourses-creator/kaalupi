import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

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

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireStaff();
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { id } = await params;
  const body = (await request.json()) as Record<string, unknown>;
  const supabase = getSupabaseAdmin();

  const updates: Record<string, unknown> = {};
  if (typeof body.title === "string") updates.title = body.title.trim();
  if (typeof body.video_url === "string") updates.video_url = body.video_url.trim() || null;
  if (typeof body.content === "string") updates.content = body.content || null;
  if (typeof body.module_index === "number") updates.module_index = body.module_index;
  if (typeof body.order_index === "number") updates.order_index = body.order_index;

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "Tidak ada perubahan." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("materials")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("[Materials PATCH] error:", error.message);
    return NextResponse.json({ error: "Gagal update materi." }, { status: 500 });
  }
  return NextResponse.json({ success: true, material: data });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireStaff();
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { id } = await params;
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("materials").delete().eq("id", id);

  if (error) {
    console.error("[Materials DELETE] error:", error.message);
    return NextResponse.json({ error: "Gagal hapus materi." }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
