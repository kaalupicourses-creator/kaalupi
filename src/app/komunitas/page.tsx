import Link from "next/link";
import type { Metadata } from "next";
import { siteConfig } from "@/lib/data";

export const metadata: Metadata = {
  title: "Komunitas Kaalupi — Belajar Bareng, Ga Sendirian",
  description:
    "Gabung komunitas Kaalupi: Discord untuk diskusi mendalam, WhatsApp untuk update cepat, Notion untuk knowledge base. Belajar AI & IT bareng founding members.",
};

const channels = [
  {
    name: "Discord Server",
    tagline: "Tempat diskusi utama",
    description:
      "Channel terorganisir per topik (AI, programming, network, cyber, design). Voice room mingguan, AMA dengan founder, sharing project tiap hari.",
    perks: [
      "Channel per track + per modul",
      "Voice room AMA mingguan",
      "Bot untuk track progress",
      "Role badge sesuai pencapaian",
    ],
    cta: "Gabung Discord",
    href: siteConfig.community.discord,
    color: "#5865F2",
    emoji: "💬",
    available: true,
  },
  {
    name: "WhatsApp Group",
    tagline: "Update cepat & kuis harian",
    description:
      "Untuk Founding Members. Update materi baru, mini quiz harian, fast response untuk pertanyaan urgent dari mentor.",
    perks: [
      "Mini quiz harian (5 menit)",
      "Update materi/event real-time",
      "Direct chat ke mentor",
      "Eksklusif Founding Members",
    ],
    cta: "Gabung WhatsApp",
    href: siteConfig.community.whatsapp,
    color: "#25D366",
    emoji: "📱",
    available: true,
  },
  {
    name: "Notion Knowledge Base",
    tagline: "Wiki belajar mandiri",
    description:
      "Cheat sheet, prompt template, FAQ, study guide. Diupdate terus oleh tim Kaalupi. Akses publik untuk preview, full akses untuk member.",
    perks: [
      "Prompt template ratusan kategori",
      "Cheat sheet AI tools",
      "Study guide per career path",
      "FAQ sering ditanya",
    ],
    cta: "Buka Notion",
    href: siteConfig.community.notion,
    color: "#F5A62A",
    emoji: "📚",
    available: true,
  },
  {
    name: "Google Drive Project",
    tagline: "Resource & template",
    description:
      "Project starter, dataset latihan, file referensi. Khusus untuk member yang udah enroll course.",
    perks: [
      "Project starter file",
      "Dataset latihan",
      "Template figma/canva",
      "Reading list per topik",
    ],
    cta: "Buka Drive",
    href: siteConfig.community.drive,
    color: "#1A73E8",
    emoji: "📂",
    available: true,
  },
];

const rules = [
  "Saling hormat — ngga ada flaming, racism, atau judgemental.",
  "No spam, no jualan kompetitor — fokus belajar bareng.",
  "Pakai bahasa Indonesia atau Inggris yang jelas, hindari singkatan ekstrem.",
  "Bantu yang nanya kalau lu tau jawabannya — paying it forward.",
  "Sharing progress, win, dan struggle — komunitas bantu naik bareng.",
];

export default function KomunitasPage() {
  return (
    <div className="bg-[#FEFBF5] min-h-screen">
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 py-16 text-center">
        <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-[#F0E8D8] bg-[#FFF3D6] px-4 py-2">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#5C4813]">
            Komunitas Kaalupi
          </span>
        </div>
        <h1 className="text-4xl font-extrabold text-[#2D5016] md:text-5xl">
          Belajar Bareng, <span className="text-[#F5A62A]">Ga Sendirian</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#444]">
          80% orang dropout dari course online karena belajar sendirian. Komunitas
          Kaalupi dibuat biar lu punya teman seperjuangan, mentor langsung, dan tempat
          tanya kapanpun.
        </p>
      </section>

      {/* Channels grid */}
      <section className="border-t border-[#F0E8D8]">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="grid gap-6 md:grid-cols-2">
            {channels.map((channel) => (
              <article
                key={channel.name}
                className="flex flex-col rounded-3xl border-2 border-[#F0E8D8] bg-white p-8 transition hover:border-[#F5A62A] hover:shadow-lg"
              >
                <div className="flex items-center gap-4">
                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-2xl text-3xl"
                    style={{ backgroundColor: `${channel.color}20` }}
                  >
                    {channel.emoji}
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold text-[#2D5016]">{channel.name}</h2>
                    <p className="text-xs font-bold uppercase tracking-wider text-[#7AB648]">
                      {channel.tagline}
                    </p>
                  </div>
                </div>

                <p className="mt-5 text-sm leading-7 text-[#444]">{channel.description}</p>

                <ul className="mt-5 space-y-2 text-sm">
                  {channel.perks.map((perk) => (
                    <li key={perk} className="flex items-start gap-2">
                      <svg
                        className="mt-1 h-4 w-4 flex-shrink-0 text-[#7AB648]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-[#444]">{perk}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href={channel.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-extrabold text-white shadow-md transition hover:opacity-90"
                  style={{ backgroundColor: channel.color }}
                >
                  {channel.cta} →
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Rules */}
      <section className="border-t border-[#F0E8D8] bg-white">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <h2 className="text-3xl font-extrabold text-[#2D5016]">Aturan main</h2>
          <p className="mt-3 text-sm text-[#444]">
            Komunitas yang sehat butuh aturan sederhana. Lima poin ini mempertahankan kualitas diskusi.
          </p>
          <ol className="mt-8 space-y-4">
            {rules.map((rule, i) => (
              <li
                key={rule}
                className="flex items-start gap-4 rounded-2xl border border-[#F0E8D8] bg-[#FEFBF5] p-5"
              >
                <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#F5A62A] text-sm font-extrabold text-[#2D5016]">
                  {i + 1}
                </span>
                <p className="pt-1 text-sm leading-6 text-[#444]">{rule}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-[#F0E8D8] bg-[#FEFBF5]">
        <div className="mx-auto max-w-4xl px-6 py-16 text-center">
          <h2 className="text-3xl font-extrabold text-[#2D5016] md:text-4xl">
            Belum daftar Kaalupi?
          </h2>
          <p className="mt-3 text-base text-[#444]">
            Daftar dulu (gratis) untuk akses penuh ke semua channel komunitas dan course Foundation.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/register"
              className="rounded-xl bg-[#F5A62A] px-8 py-3.5 text-sm font-bold text-[#2D5016] shadow-md transition hover:opacity-90"
            >
              Daftar Gratis →
            </Link>
            <Link
              href="/courses"
              className="rounded-xl border-2 border-[#2D5016] px-8 py-3.5 text-sm font-bold text-[#2D5016] transition hover:bg-[#2D5016] hover:text-white"
            >
              Lihat Catalog
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
