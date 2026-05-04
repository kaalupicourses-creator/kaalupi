import Link from "next/link";
import { notFound } from "next/navigation";
import { blogPosts } from "@/lib/data";

const categoryColors: Record<string, string> = {
  tutorial: "bg-blue-500/10 text-blue-300",
  career: "bg-emerald-500/10 text-emerald-300",
  tips: "bg-amber-500/10 text-amber-300",
  default: "bg-purple-500/10 text-purple-300",
};

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = blogPosts.find((item) => item.slug === slug);

  if (!post) {
    notFound();
  }

  const badgeColor = categoryColors[post.category.toLowerCase()] ?? categoryColors.default;
  const formattedDate = new Date(post.date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  const readTime = Math.max(1, Math.ceil(post.content.join(" ").split(" ").length / 200));

  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      {/* Back Link */}
      <Link
        href="/blog"
        className="mb-8 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Blog
      </Link>

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-3 text-xs">
        <span className={`rounded-full px-3 py-1 ${badgeColor}`}>
          {post.category}
        </span>
        <span className="text-slate-500">{formattedDate}</span>
        <span className="text-slate-500">•</span>
        <span className="text-slate-500">{readTime} min read</span>
      </div>

      {/* Title */}
      <h1 className="mt-6 text-4xl font-semibold text-white md:text-5xl">
        {post.title}
      </h1>

      {/* Content */}
      <div className="mt-10 space-y-6 text-base leading-8 text-slate-300">
        {post.content.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>

      {/* Divider + CTA */}
      <div className="mt-12 border-t border-white/10 pt-8">
        <h3 className="text-lg font-semibold text-white">Enjoyed this article?</h3>
        <p className="mt-2 text-sm text-slate-400">
          Check out more insights or explore our courses to level up your skills.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 rounded-full border border-white/12 px-5 py-2.5 text-sm text-white transition hover:border-amber-300/50 hover:text-amber-300"
          >
            Read more articles
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#f97316,#facc15)] px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:opacity-90"
          >
            Browse Courses
          </Link>
        </div>
      </div>
    </article>
  );
}
