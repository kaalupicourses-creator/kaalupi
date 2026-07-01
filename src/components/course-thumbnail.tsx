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

const categoryConfig: Record<string, { bg: string; accent: string; label: string }> = {
  "cyber security": {
    bg: "from-[#1a0a2e] via-[#2d1155] to-[#1a0a2e]",
    accent: "#a855f7",
    label: "Cyber Security",
  },
  programming: {
    bg: "from-[#0a1628] via-[#0f2d55] to-[#0a1628]",
    accent: "#3b82f6",
    label: "Programming",
  },
  "network engineer": {
    bg: "from-[#0a1a2e] via-[#0f3355] to-[#0a1a2e]",
    accent: "#6366f1",
    label: "Networking",
  },
  designer: {
    bg: "from-[#2e0a1a] via-[#551133] to-[#2e0a1a]",
    accent: "#ec4899",
    label: "Design",
  },
  "artificial intelligence": {
    bg: "from-[#0a2e1a] via-[#0f4d2d] to-[#0a2e1a]",
    accent: "#22c55e",
    label: "AI",
  },
  default: {
    bg: "from-[#1a2e0a] via-[#2d4a15] to-[#1a2e0a]",
    accent: "#7AB648",
    label: "Course",
  },
};

export function CourseThumbnail({ title, category, className = "", large = false }: { title: string; category: string; className?: string; large?: boolean }) {
  const lowerCategory = category.toLowerCase();
  const configKey = Object.keys(categoryConfig).find((key) => lowerCategory.includes(key)) ?? "default";
  const config = categoryConfig[configKey];

  const words = title.split(" ").filter(Boolean);
  const line1 = words.slice(0, Math.ceil(words.length / 2)).join(" ");
  const line2 = words.slice(Math.ceil(words.length / 2)).join(" ");

  return (
    <div className={`relative overflow-hidden bg-gradient-to-br ${config.bg} ${large ? "aspect-[16/9]" : "aspect-[4/3]"} ${className}`}>
      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.07]"
        style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "32px 32px" }}
      />

      {/* Glow orb */}
      <div className="absolute -top-8 -right-8 h-32 w-32 rounded-full opacity-20 blur-2xl"
        style={{ backgroundColor: config.accent }}
      />
      <div className="absolute -bottom-8 -left-8 h-24 w-24 rounded-full opacity-10 blur-2xl"
        style={{ backgroundColor: config.accent }}
      />

      {/* Category badge */}
      <div className="absolute top-3 left-3">
        <span className="rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest"
          style={{ backgroundColor: `${config.accent}22`, color: config.accent, border: `1px solid ${config.accent}44` }}>
          {config.label}
        </span>
      </div>

      {/* Kaalupi logo */}
      <div className="absolute top-3 right-3 text-[9px] font-bold tracking-widest text-white/30 uppercase">
        Kaalupi
      </div>

      {/* Title */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
        <p className="text-base font-extrabold leading-tight text-white drop-shadow-lg" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}>
          {line1}
        </p>
        {line2 && (
          <p className="text-base font-extrabold leading-tight text-white drop-shadow-lg" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.5)", color: config.accent }}>
            {line2}
          </p>
        )}
      </div>

      {/* Bottom bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 opacity-60"
        style={{ background: `linear-gradient(90deg, transparent, ${config.accent}, transparent)` }}
      />
    </div>
  );
}
