import type { ReactNode } from "react";

const gradients: Record<string, string> = {
  programming: "from-blue-600 to-cyan-400",
  "network engineer": "from-indigo-600 to-purple-400",
  "cyber security": "from-red-600 to-rose-400",
  designer: "from-pink-600 to-fuchsia-400",
  "artificial intelligence": "bg-[#1A2E0A]",
  default: "bg-[#1A2E0A]",
};

const icons: Record<string, ReactNode> = {
  programming: (
    <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
    </svg>
  ),
  "network engineer": (
    <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M13 12a1 1 0 11-2 0 1 1 0 012 0z" />
    </svg>
  ),
  "cyber security": (
    <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  ),
  designer: (
    <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
    </svg>
  ),
  "artificial intelligence": (
    <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
    </svg>
  ),
};

export function CourseThumbnail({ title, category, className = "", large = false }: { title: string; category: string; className?: string; large?: boolean }) {
  const lowerCategory = category.toLowerCase();
  const gradientKey = Object.keys(gradients).find((key) => lowerCategory.includes(key)) ?? "default";
  const gradient = gradients[gradientKey];
  const Icon = icons[gradientKey] ?? icons.default;
  const isAI = gradientKey === "artificial intelligence";

  const initials = title
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className={`relative overflow-hidden ${isAI ? '' : (gradient.includes("from-") ? `bg-gradient-to-br ${gradient}` : gradient)} ${large ? "aspect-[16/9]" : "aspect-[4/3]"} ${className}`}>
      {/* Image for AI course */}
      {isAI && (
        <img
          src="/gambar-1.jpg"
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
      )}

      {/* Pattern overlay */}
      {!isAI && (
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 25% 25%, white 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        </div>
      )}

      {/* Icon */}
      {!isAI && (
        <div className="absolute inset-0 flex items-center justify-center text-white/30">
          {Icon}
        </div>
      )}

      {/* Title overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
        <p className="text-sm font-semibold text-white truncate">{title}</p>
      </div>

      {/* Initials watermark */}
      <div className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-xs font-bold text-white/60">
        {initials}
      </div>
    </div>
  );
}
