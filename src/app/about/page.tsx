import Link from "next/link";
import type { Metadata } from "next";
import { siteConfig, founders } from "@/lib/data";
import { FounderIllustration } from "@/components/founder-illustration";

export const metadata: Metadata = {
  title: "Tentang Kaalupi — Kenapa Kami Bangun Ini",
  description:
    "Kaalupi dibangun untuk demokratisasi AI dan IT skill di Indonesia. Cerita di balik platform, tim, dan kenapa kami pilih jalur Founding Members.",
};

const milestones = [
  {
    label: "Hari nol",
    title: "Ide muncul, sempet mati",
    body: "Ide Kaalupi sempat muncul tapi mati ditengah jalan karena minim resource dan fokus. Project ini sempet jadi 'cita-cita yg ditunda'.",
  },
  {
    label: "Reboot",
    title: "Dihidupin lagi",
    body: "Modal pribadi 600K+, deploy stack modern (Next.js, Supabase, Clerk, Midtrans), bangun infrastruktur dari nol sampai deployable di Vercel.",
  },
  {
    label: "Tim 4 orang",
    title: "Bareng-bareng dari awal",
    body: "Tim 4 orang gabung — masing-masing pegang track yang akan dibangun. Belum ngomongin equity formal — fokusnya bangun produk dulu.",
  },
  {
    label: "Hari ini",
    title: "Founding Members buka",
    body: "Course gratis 'Cyber Security untuk Pemula' siap akses. Slot 100 Founding Members dibuka — early supporters dapet akses lifetime ke semua course Kaalupi.",
  },
];

const principles = [
  {
    title: "Bahasa Indonesia tanpa nge-formal",
    body: "Kami nulis kayak ngobrol antar teman dewasa — bukan dosen, bukan iklan. Lu gampang ngerti, ngga capek baca.",
  },
  {
    title: "Pace lu sendiri",
    body: "Ngga ada deadline live class. Materi singkat, padet, banyak edit. Bisa di-pause, ulang, atau lompat sesuai kebutuhan.",
  },
  {
    title: "AI as a leverage",
    body: "Kaalupi ngga jualan AI sebagai trend. AI dipakai sebagai akselerator buat target lu — kerjaan, bisnis, atau skill personal.",
  },
  {
    title: "Komunitas > sekedar materi",
    body: "Discord & WhatsApp aktif. Mentor langsung jawab. Belajar bareng punya completion 65% vs sendirian 10% — jadi kami buka komunitas dari hari pertama.",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-[#FEFBF5]">
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#7AB648]">
            Tentang Kaalupi
          </p>
          <h1 className="mt-6 text-4xl font-extrabold text-[#2D5016] md:text-5xl">
            Kami bangun{" "}
            <span className="text-[#F5A62A]">platform belajar IT yang jujur</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-[#444444]">
            Bukan course factory yang jual jam belajar. Kaalupi dibangun untuk bantu orang
            Indonesia memanfaatkan AI dan teknologi buat capai target hidup —
            karier, bisnis, atau sekadar skill baru.
          </p>
        </div>
      </section>

      {/* Story / Timeline */}
      <section className="border-t border-[#F0E8D8]">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <div className="mb-10 max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#7AB648]">Cerita</p>
            <h2 className="mt-3 text-3xl font-extrabold text-[#2D5016]">
              Dari ide yg sempet mati ke product hidup
            </h2>
          </div>

          <div className="relative grid gap-6 md:grid-cols-2">
            {milestones.map((m) => (
              <article
                key={m.title}
                className="rounded-2xl border border-[#F0E8D8] bg-white p-6 transition hover:border-[#F5A62A] hover:shadow-sm"
              >
                <span className="inline-block rounded-full bg-[#FFF3D6] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#5C4813]">
                  {m.label}
                </span>
                <h3 className="mt-4 text-lg font-extrabold text-[#2D5016]">{m.title}</h3>
                <p className="mt-2 text-sm leading-7 text-[#444]">{m.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="border-t border-[#F0E8D8] bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#7AB648]">Prinsip</p>
            <h2 className="mt-3 text-3xl font-extrabold text-[#2D5016]">
              4 hal yang ngga akan kami kompromiin
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {principles.map((p, i) => (
              <article
                key={p.title}
                className="rounded-2xl border border-[#F0E8D8] bg-[#FEFBF5] p-7 transition hover:border-[#F5A62A]"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5A62A] text-sm font-extrabold text-[#2D5016]">
                  {i + 1}
                </div>
                <h3 className="mt-4 text-lg font-extrabold text-[#2D5016]">{p.title}</h3>
                <p className="mt-2 text-sm leading-7 text-[#444]">{p.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="border-t border-[#F0E8D8]">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#7AB648]">Tim</p>
            <h2 className="mt-3 text-3xl font-extrabold text-[#2D5016]">4 orang. 4 disiplin.</h2>
            <p className="mt-3 text-sm leading-7 text-[#444]">
              Tiap track Kaalupi dipegang sama orang yang emang jago di bidangnya.
              Kami masih kecil — tapi itu bonus: respon cepat, feedback langsung dipakai.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {founders.map((founder) => (
              <article
                key={founder.name}
                className="rounded-2xl border border-[#F0E8D8] bg-white p-6 transition hover:border-[#F5A62A]"
              >
                <FounderIllustration
                  bg={founder.illustration.bg}
                  accent={founder.illustration.accent}
                  shape={founder.illustration.shape}
                />
                <h3 className="mt-5 text-base font-extrabold text-[#2D5016]">{founder.name}</h3>
                <p className="mt-1 text-xs font-bold uppercase tracking-wider text-[#7AB648]">
                  {founder.role}
                </p>
                <p className="mt-3 text-sm leading-6 text-[#444]">{founder.bio}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="border-t border-[#F0E8D8] bg-[#FEFBF5]">
        <div className="mx-auto max-w-4xl px-6 py-16 text-center">
          <h2 className="text-3xl font-extrabold text-[#2D5016]">Mau ngobrol langsung?</h2>
          <p className="mt-3 text-sm leading-7 text-[#444]">
            Ada saran, mau partnership, atau cuma mau nanya — kami balas semua DM.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm">
            <a
              href={`mailto:${siteConfig.email}`}
              className="rounded-xl border-2 border-[#2D5016] px-5 py-2.5 font-bold text-[#2D5016] transition hover:bg-[#2D5016] hover:text-white"
            >
              Email — {siteConfig.email}
            </a>
            <a
              href={siteConfig.community.discord}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-[#5865F2] px-5 py-2.5 font-bold text-white transition hover:opacity-90"
            >
              Discord
            </a>
            <a
              href={siteConfig.community.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-[#25D366] px-5 py-2.5 font-bold text-white transition hover:opacity-90"
            >
              WhatsApp Group
            </a>
          </div>

          <div className="mt-12 inline-flex flex-wrap items-center justify-center gap-6 rounded-2xl border border-[#F0E8D8] bg-white px-6 py-4 text-xs text-[#5C4813]">
            <span>Bogor, Indonesia</span>
            <span className="text-[#F0E8D8]">·</span>
            <span>{siteConfig.phone}</span>
          </div>

          <div className="mt-8">
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#F5A62A] hover:underline"
            >
              Cek course yang udah rilis →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
