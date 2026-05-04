import Link from "next/link";
import { notFound } from "next/navigation";
import { blogPosts } from "@/lib/data";

const categoryColors: Record<string, string> = {
  career: "bg-[#FFF3D6] text-[#5C4813]",
  programming: "bg-[#E8F5E9] text-[#2D5016]",
  "network engineer": "bg-[#E3F2FD] text-[#1565C0]",
  default: "bg-[#FFF3D6] text-[#5C4813]",
};

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = blogPosts.find((item) => item.slug === slug);
  if (!post) notFound();

  const badgeColor = categoryColors[post.category.toLowerCase()] ?? categoryColors.default;
  const formattedDate = new Date(post.date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  const readTime = Math.max(1, Math.ceil(post.content.join(" ").split(" ").length / 200));

  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      <Link href="/blog" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-[#2D5016] transition hover:text-[#F5A62A]">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Kembali ke Blog
      </Link>

      <div className="flex flex-wrap items-center gap-3 text-xs">
        <span className={`rounded-full px-3 py-1 font-semibold ${badgeColor}`}>{post.category}</span>
        <span className="text-[#444444]">{formattedDate}</span>
        <span className="text-[#444444]">•</span>
        <span className="text-[#444444]">{readTime} min baca</span>
      </div>

      <h1 className="mt-6 text-4xl font-extrabold text-[#2D5016] md:text-5xl">{post.title}</h1>

      <div className="mt-10 space-y-6 text-base leading-8 text-[#444444]">
        {post.content.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>

      <div className="mt-12 border-t border-[#F0E8D8] pt-8">
        <h3 className="text-lg font-bold text-[#2D5016]">Suka artikel ini?</h3>
        <p className="mt-2 text-sm text-[#444444]">Cek artikel lainnya atau jelajahi course kami.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/blog" className="inline-flex items-center gap-2 rounded-xl border-2 border-[#2D5016] px-5 py-2.5 text-sm font-semibold text-[#2D5016] transition hover:bg-[#2D5016] hover:text-white">
            Baca artikel lain
          </Link>
          <Link href="/courses" className="inline-flex items-center gap-2 rounded-xl bg-[#F5A62A] px-5 py-2.5 text-sm font-bold text-[#2D5016] transition hover:opacity-90">
            Lihat Courses
          </Link>
        </div>
      </div>
    </article>
  );
}
