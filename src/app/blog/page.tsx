import Link from "next/link";
import { blogPosts } from "@/lib/data";

const categoryColors: Record<string, string> = {
  tutorial: "bg-blue-500/10 text-blue-300",
  career: "bg-emerald-500/10 text-emerald-300",
  tips: "bg-amber-500/10 text-amber-300",
  default: "bg-purple-500/10 text-purple-300",
};

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      {/* Header */}
      <div className="mb-12 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500/20 to-yellow-400/20">
          <svg className="h-6 w-6 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
          </svg>
        </div>
        <h1 className="mt-6 text-4xl font-semibold text-white md:text-5xl">
          Insight untuk{" "}
          <span className="bg-gradient-to-r from-orange-400 to-yellow-300 bg-clip-text text-transparent">
            belajar strategis
          </span>
        </h1>
        <p className="mt-4 text-base text-slate-400">
          Artikel seputar pengembangan skill IT, strategi belajar, dan tips karier.
        </p>
      </div>

      {/* Blog Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {blogPosts.map((post) => {
          const badgeColor = categoryColors[post.category.toLowerCase()] ?? categoryColors.default;

          return (
            <article
              key={post.slug}
              className="group flex flex-col rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-amber-300/30 hover:shadow-[0_0_32px_rgba(249,115,22,0.08)]"
            >
              {/* Category + Date */}
              <div className="flex items-center gap-3 text-xs">
                <span className={`rounded-full px-2.5 py-1 ${badgeColor}`}>
                  {post.category}
                </span>
                <span className="text-slate-500">
                  {new Date(post.date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                </span>
              </div>

              {/* Title */}
              <h2 className="mt-4 text-xl font-semibold text-white group-hover:text-amber-200 transition line-clamp-2">
                {post.title}
              </h2>

              {/* Excerpt */}
              <p className="mt-3 text-sm leading-7 text-slate-400 line-clamp-3">{post.excerpt}</p>

              {/* Read More */}
              <Link
                href={`/blog/${post.slug}`}
                className="mt-auto inline-flex items-center gap-2 pt-5 text-sm text-white transition hover:text-amber-300"
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
