import Link from "next/link";
import { blogPosts as seedPosts } from "@/lib/data";
import { supabase } from "@/lib/supabase";

const categoryColors: Record<string, string> = {
  career: "bg-[#FFF3D6] text-[#5C4813]",
  programming: "bg-[#E8F5E9] text-[#2D5016]",
  "network engineer": "bg-[#E3F2FD] text-[#1565C0]",
  "cyber security": "bg-[#FCE4EC] text-[#880E4F]",
  ai: "bg-[#F3E5F5] text-[#4A148C]",
  designer: "bg-[#E0F2F1] text-[#004D40]",
  default: "bg-[#FFF3D6] text-[#5C4813]",
};

async function getDbPosts() {
  try {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false });

    if (error || !data) return null;
    return data;
  } catch {
    return null;
  }
}

export default async function BlogPage() {
  const dbPosts = await getDbPosts();

  // If there are DB posts, show them; otherwise fall back to seed data
  const posts =
    dbPosts && dbPosts.length > 0
      ? dbPosts.map((p) => ({
          slug: p.slug,
          title: p.title,
          category: p.category,
          date: p.created_at,
          excerpt: p.excerpt,
        }))
      : seedPosts.map((p) => ({
          slug: p.slug,
          title: p.title,
          category: p.category,
          date: p.date,
          excerpt: p.excerpt,
        }));

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <div className="mb-12 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#FFF3D6]">
          <svg className="h-6 w-6 text-[#F5A62A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
          </svg>
        </div>
        <h1 className="mt-6 text-4xl font-extrabold text-[#2D5016] md:text-5xl">
          Insight untuk{" "}
          <span className="text-[#F5A62A]">belajar strategis</span>
        </h1>
        <p className="mt-4 text-base text-[#444444]">
          Artikel seputar pengembangan skill IT, strategi belajar, dan tips karier.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {posts.map((post) => {
          const badgeColor =
            categoryColors[post.category.toLowerCase()] ?? categoryColors.default;
          return (
            <article
              key={post.slug}
              className="group flex flex-col rounded-2xl border border-[#F0E8D8] bg-white p-6 transition hover:border-[#F5A62A] hover:shadow-sm"
            >
              <div className="flex items-center gap-3 text-xs">
                <span className={`rounded-full px-2.5 py-1 font-semibold ${badgeColor}`}>
                  {post.category}
                </span>
                <span className="text-[#444444]">
                  {new Date(post.date).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
              <h2 className="mt-4 text-xl font-bold text-[#2D5016] group-hover:text-[#F5A62A] transition line-clamp-2">
                {post.title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-[#444444] line-clamp-3">
                {post.excerpt}
              </p>
              <Link
                href={`/blog/${post.slug}`}
                className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-semibold text-[#2D5016] transition hover:text-[#F5A62A]"
              >
                Baca selengkapnya
                <svg className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </article>
          );
        })}
      </div>
    </div>
  );
}
