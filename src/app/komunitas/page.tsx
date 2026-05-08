import Link from "next/link";
import type { Metadata } from "next";
import { siteConfig } from "@/lib/data";

export const metadata: Metadata = {
  title: "Komunitas Kaalupi — Belajar Bareng, Ga Sendirian",
  description:
    "Gabung komunitas Kaalupi: Discord untuk diskusi mendalam, WhatsApp untuk update cepat. Belajar AI & IT bareng founding members.",
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
    iconPath:
      "M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09c-.01-.02-.04-.03-.07-.03c-1.5.26-2.93.71-4.27 1.33c-.01 0-.02.01-.03.02c-2.72 4.07-3.47 8.03-3.1 11.95c0 .02.01.04.03.05c1.8 1.32 3.53 2.12 5.24 2.65c.03.01.06 0 .07-.02c.4-.55.76-1.13 1.07-1.74c.02-.04 0-.08-.04-.09c-.57-.22-1.11-.48-1.64-.78c-.04-.02-.04-.08-.01-.11c.11-.08.22-.17.33-.25c.02-.02.05-.02.07-.01c3.44 1.57 7.15 1.57 10.55 0c.02-.01.05-.01.07.01c.11.09.22.17.33.26c.04.03.04.09-.01.11c-.52.31-1.07.56-1.64.78c-.04.01-.05.06-.04.09c.32.61.68 1.19 1.07 1.74c.03.01.06.02.09.01c1.72-.53 3.45-1.33 5.25-2.65c.02-.01.03-.03.03-.05c.44-4.53-.73-8.46-3.1-11.95c-.01-.01-.02-.02-.04-.02zM8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.84 2.12-1.89 2.12zm6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.83 2.12-1.89 2.12z",
  },
  {
    name: "WhatsApp Group",
    tagline: "Update cepat & kuis harian",
    description:
      "Update materi baru, mini quiz harian, fast response untuk pertanyaan urgent dari mentor.",
    perks: [
      "Mini quiz harian (5 menit)",
      "Update materi/event real-time",
      "Direct chat ke mentor",
      "Notifikasi launch course baru",
    ],
    cta: "Gabung WhatsApp",
    href: siteConfig.community.whatsapp,
    color: "#25D366",
    iconPath:
      "M17.6 6.32A7.85 7.85 0 0 0 12.05 4c-4.34 0-7.87 3.53-7.87 7.87c0 1.39.36 2.74 1.05 3.94L4.11 20l4.3-1.13a7.93 7.93 0 0 0 3.64.93h.01c4.34 0 7.87-3.53 7.87-7.87c0-2.1-.82-4.08-2.31-5.61zM12.05 18.45h-.01a6.5 6.5 0 0 1-3.31-.91l-.24-.14l-2.45.65l.65-2.39l-.16-.25a6.5 6.5 0 0 1-1-3.49c0-3.6 2.93-6.53 6.54-6.53c1.74 0 3.38.68 4.62 1.91s1.91 2.88 1.91 4.62c-.01 3.61-2.94 6.53-6.55 6.53zm3.59-4.89c-.2-.1-1.16-.57-1.34-.64c-.18-.07-.31-.1-.45.1c-.13.2-.51.64-.62.77c-.11.13-.23.15-.43.05c-.2-.1-.83-.31-1.59-.98c-.59-.52-.99-1.17-1.1-1.37c-.11-.2-.01-.31.09-.41c.09-.09.2-.23.3-.34c.1-.11.13-.2.2-.33c.07-.13.03-.25-.02-.35c-.05-.1-.45-1.09-.62-1.49c-.16-.39-.33-.34-.45-.34h-.39c-.13 0-.35.05-.53.25s-.7.68-.7 1.66s.71 1.93.81 2.06c.1.13 1.4 2.13 3.39 2.99c.47.2.85.32 1.14.41c.48.15.91.13 1.26.08c.38-.06 1.16-.47 1.33-.93c.16-.46.16-.85.12-.93c-.05-.08-.18-.13-.39-.23z",
  },
];

const socials = [
  {
    name: "Instagram",
    handle: "@kaalupicourses",
    href: siteConfig.community.instagram,
    color: "#E4405F",
    iconPath:
      "M12 2.16c3.2 0 3.58.01 4.85.07c1.17.05 1.81.25 2.23.41c.56.22.96.48 1.38.9s.68.82.9 1.38c.16.42.36 1.06.41 2.23c.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.81-.41 2.23c-.22.56-.48.96-.9 1.38s-.82.68-1.38.9c-.42.16-1.06.36-2.23.41c-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.81-.25-2.23-.41a3.81 3.81 0 0 1-1.38-.9a3.81 3.81 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23c-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.81.41-2.23c.22-.56.48-.96.9-1.38s.82-.68 1.38-.9c.42-.16 1.06-.36 2.23-.41c1.27-.06 1.65-.07 4.85-.07M12 0C8.74 0 8.33.01 7.05.07C5.78.13 4.9.33 4.14.63c-.79.31-1.46.72-2.13 1.39A5.91 5.91 0 0 0 .63 4.14C.33 4.9.13 5.77.07 7.05C.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91c.31.79.72 1.46 1.39 2.13c.67.67 1.34 1.08 2.13 1.39c.76.3 1.63.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56c.79-.31 1.46-.72 2.13-1.39c.67-.67 1.08-1.34 1.39-2.13c.3-.76.5-1.63.56-2.91c.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91a5.91 5.91 0 0 0-1.39-2.13A5.91 5.91 0 0 0 19.86.63c-.76-.3-1.63-.5-2.91-.56C15.67.01 15.26 0 12 0zm0 5.84a6.16 6.16 0 1 0 0 12.32a6.16 6.16 0 0 0 0-12.32M12 16a4 4 0 1 1 0-8a4 4 0 0 1 0 8m6.41-11.85a1.44 1.44 0 1 0 0 2.881a1.44 1.44 0 0 0 0-2.881",
  },
  {
    name: "YouTube",
    handle: "@Kaalupi-r9j",
    href: siteConfig.community.youtube,
    color: "#FF0000",
    iconPath:
      "M23.5 6.2a3.02 3.02 0 0 0-2.13-2.14c-1.88-.51-9.37-.51-9.37-.51s-7.49 0-9.37.51A3.02 3.02 0 0 0 .5 6.2C0 8.07 0 12 0 12s0 3.93.5 5.8a3.02 3.02 0 0 0 2.13 2.14c1.88.51 9.37.51 9.37.51s7.49 0 9.37-.51a3.02 3.02 0 0 0 2.13-2.14c.5-1.87.5-5.8.5-5.8s0-3.93-.5-5.8M9.6 15.6V8.4l6.27 3.6z",
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

      {/* Main channels: Discord + WhatsApp */}
      <section className="border-t border-[#F0E8D8]">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="grid gap-6 md:grid-cols-2">
            {channels.map((channel) => (
              <article
                key={channel.name}
                className="flex flex-col rounded-3xl border-2 border-[#F0E8D8] bg-white p-8 transition hover:border-[#F5A62A] hover:shadow-lg"
              >
                <div className="flex items-center gap-4">
                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-2xl"
                    style={{ backgroundColor: `${channel.color}20`, color: channel.color }}
                  >
                    <svg className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d={channel.iconPath} />
                    </svg>
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

      {/* Social channels: IG, YouTube */}
      <section className="border-t border-[#F0E8D8] bg-white">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="mb-8 max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#7AB648]">
              Konten Edukasi
            </p>
            <h2 className="mt-3 text-2xl font-extrabold text-[#2D5016]">
              Follow di sosial media buat tips harian
            </h2>
            <p className="mt-2 text-sm text-[#444]">
              Konten singkat tentang AI, programming, dan dunia IT — gratis, bisa dipake siapa aja.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {socials.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 rounded-2xl border-2 border-[#F0E8D8] bg-white p-5 transition hover:border-[#F5A62A]"
              >
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-xl"
                  style={{ backgroundColor: `${social.color}20`, color: social.color }}
                >
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d={social.iconPath} />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-[#2D5016]">{social.name}</p>
                  <p className="text-sm text-[#444]">{social.handle}</p>
                </div>
                <span className="text-sm font-bold text-[#F5A62A] transition group-hover:translate-x-1">
                  →
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Rules */}
      <section className="border-t border-[#F0E8D8] bg-[#FEFBF5]">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <h2 className="text-3xl font-extrabold text-[#2D5016]">Aturan main</h2>
          <p className="mt-3 text-sm text-[#444]">
            Komunitas yang sehat butuh aturan sederhana. Lima poin ini mempertahankan kualitas diskusi.
          </p>
          <ol className="mt-8 space-y-4">
            {rules.map((rule, i) => (
              <li
                key={rule}
                className="flex items-start gap-4 rounded-2xl border border-[#F0E8D8] bg-white p-5"
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
