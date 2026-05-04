import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Akses ditolak." }, { status: 401 });
  }

  const clerk = await clerkClient();
  const user = await clerk.users.getUser(userId);
  const role = (user.publicMetadata as { role?: string })?.role;
  if (role !== "admin" && role !== "instructor") {
    return NextResponse.json({ error: "Hanya admin dan instructor yang bisa publish course." }, { status: 403 });
  }
  const userEmail = user.primaryEmailAddress?.emailAddress ?? "";

  const body = (await request.json()) as Record<string, string>;

  const title = body.title?.trim();
  const summary = body.summary?.trim();
  const hero = body.hero?.trim();

  if (!title || !summary || !hero) {
    return NextResponse.json({ error: "Field utama wajib diisi." }, { status: 400 });
  }

  const slug = slugify(title);

  const { data, error } = await supabase
    .from("courses")
    .upsert(
      {
        slug,
        title,
        category: body.category?.trim() || "General IT",
        level: body.level?.trim() || "All Levels",
        duration: body.duration?.trim() || "Flexible",
        price: Number(body.price || "0"),
        summary,
        hero,
        modules: (body.modules || "")
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean),
        outcomes: (body.outcomes || "")
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean),
        format:
          body.format === "article" || body.format === "video" || body.format === "blended"
            ? body.format
            : "blended",
        featured: false,
        author_email: userEmail,
      },
      { onConflict: "slug" },
    )
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: "Gagal menyimpan course." }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    message: "Course berhasil dipublish ke katalog.",
    slug: data.slug,
  });
}
