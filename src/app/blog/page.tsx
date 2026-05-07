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

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const dbPosts = await getDbPosts();

  // If there are DB posts, show them; otherwise fall back to seed data
  const allPosts =
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

  // Get unique categories
  const categories = ["All", ...Array.from(new Set(allPosts.map((p) => p.category)))];

  // Filter posts by category
  const posts = category && category !== "All"
    ? allPosts.filter((p) => p.category.toLowerCase() === category.toLowerCase())
    : allPosts;

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      {/* Header */}
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

      {/* Category Filter */}
      <div className="mb-10 flex flex-wrap justify-center gap-2">
        {categories.map((cat) => {
          const isActive = !category || category === cat || (cat === "All" && !category);
          return (
            <Link
              key={cat}
              href={cat === "All" ? "/blog" : `/blog?category=${encodeURIComponent(cat)}`}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                isActive
                  ? "bg-[#2D5016] text-white"
                  : "bg-white border border-[#F0E8D8] text-[#444444] hover:border-[#F5A62A]"
              }`}
            >
              {cat}
            </Link>
          );
        })}
      </div>

      {/* Posts Grid */}
      {posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-[#444444]">Belum ada artikel dalam kategori ini.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
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
      )}

      {/* CTA Section */}
      <div className="relative mt-16 overflow-hidden rounded-[2rem] border border-[#1A2E0A] bg-[#1A2E0A] p-6 shadow-xl shadow-[#1A2E0A]/10 md:p-10">
        <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#F5A62A]/20 blur-3xl" />
        <div className="absolute -bottom-28 -left-16 h-72 w-72 rounded-full bg-[#7AB648]/20 blur-3xl" />
        <div className="relative grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <span className="inline-flex rounded-full border border-[#F5A62A]/30 bg-[#F5A62A]/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-[#F5A62A]">
              Early access
            </span>
            <h3 className="mt-4 text-3xl font-extrabold leading-tight text-[#F5A62A] md:text-4xl">
              Masuk waitlist, dapat update course sebelum publik.
            </h3>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#FEFBF5]/85 md:text-base">
              Jadi orang pertama yang tahu saat cohort baru dibuka, dapat harga early bird,
              dan ikut voting materi yang paling kamu butuhin.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-xs font-semibold text-[#FEFBF5]">
              {[
                "Update rilis course",
                "Harga early bird",
                "Prioritas beta tester",
              ].map((item) => (
                <span key={item} className="rounded-full border border-white/15 bg-white/10 px-3 py-2">
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/15 bg-[#FEFBF5] p-5 shadow-2xl shadow-black/20">
            <div className="rounded-2xl bg-[#FFF3D6] p-4">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#5C4813]">
                Waitlist snapshot
              </p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-white p-4">
                  <p className="text-2xl font-extrabold text-[#2D5016]">AI</p>
                  <p className="mt-1 text-xs text-[#444444]">Course pertama</p>
                </div>
                <div className="rounded-2xl bg-white p-4">
                  <p className="text-2xl font-extrabold text-[#F5A62A]">50</p>
                  <p className="mt-1 text-xs text-[#444444]">Seat beta awal</p>
                </div>
              </div>
              <div className="mt-4 rounded-2xl bg-white p-4">
                <p className="text-sm font-bold text-[#2D5016]">Yang kamu dapat</p>
                <p className="mt-1 text-xs leading-6 text-[#444444]">
                  Reminder email, info diskon, dan kesempatan bantu nentuin modul lanjutan.
                </p>
              </div>
            </div>
            <Link
              href="/waitlist"
              className="mt-5 flex w-full items-center justify-center rounded-xl bg-[#F5A62A] px-8 py-3.5 text-sm font-bold text-[#2D5016] transition hover:opacity-90"
            >
              Daftar Waitlist Sekarang →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
