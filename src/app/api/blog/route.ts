import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function POST(request: Request) {
  const supabaseAdmin = getSupabaseAdmin();
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Akses ditolak." }, { status: 401 });
  }

  const clerk = await clerkClient();
  const user = await clerk.users.getUser(userId);
  const role = (user.publicMetadata as { role?: string })?.role;
  if (role !== "admin" && role !== "instructor") {
    return NextResponse.json(
      { error: "Hanya admin dan instructor yang bisa publish blog." },
      { status: 403 }
    );
  }

  const userEmail = user.primaryEmailAddress?.emailAddress ?? "";
  const body = (await request.json()) as Record<string, string>;

  const title = body.title?.trim();
  const category = body.category?.trim() || "General";
  const excerpt = body.excerpt?.trim();
  const content = body.content?.trim();

  if (!title || !excerpt || !content) {
    return NextResponse.json(
      { error: "Title, excerpt, dan content wajib diisi." },
      { status: 400 }
    );
  }

  const slug = slugify(title) + "-" + Date.now().toString(36);

  const { data, error } = await supabaseAdmin
    .from("blog_posts")
    .insert({
      slug,
      title,
      category,
      excerpt,
      content,
      author_email: userEmail,
      published: body.published === "true",
    })
    .select()
    .single();

  if (error) {
    console.error("[Blog] DB error:", error.message);
    return NextResponse.json({ error: "Gagal menyimpan blog post." }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    message: "Blog post berhasil dipublish.",
    slug: data.slug,
  });
}

export async function GET() {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: "Gagal memuat blog posts." }, { status: 500 });
  }

  return NextResponse.json({ posts: data });
}
