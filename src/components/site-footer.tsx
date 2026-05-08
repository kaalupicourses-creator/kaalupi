import Link from "next/link";
import { siteConfig } from "@/lib/data";

const socialLinks = [
  { href: siteConfig.community.discord, label: "Discord" },
  { href: siteConfig.community.whatsapp, label: "WhatsApp" },
  { href: siteConfig.community.instagram, label: "Instagram" },
  { href: siteConfig.community.tiktok, label: "TikTok" },
  { href: siteConfig.community.youtube, label: "YouTube" },
];

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/courses", label: "Courses" },
  { href: "/komunitas", label: "Komunitas" },
  { href: "/waitlist", label: "Waitlist" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "Tentang" },
  { href: "/contact", label: "Kontak" },
];

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-[#F0E8D8] bg-[#2D5016]">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link href="/" className="text-2xl font-black text-white tracking-tight">
              Kaalupi
            </Link>
            <p className="mt-4 max-w-md text-sm leading-7 text-white/70">
              {siteConfig.description}
            </p>
          </div>

          <div>
            <p className="text-sm font-bold text-white">Navigasi</p>
            <div className="mt-4 flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className="text-sm text-white/60 transition hover:text-white">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-bold text-white">Kontak</p>
            <div className="mt-4 space-y-3">
              {[
                { icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z", value: siteConfig.email },
                { icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z", value: siteConfig.phone },
                { icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z", value: siteConfig.address },
              ].map((item) => (
                <div key={item.value} className="flex items-center gap-2 text-sm text-white/60">
                  <svg className="h-4 w-4 text-[#F5A62A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                  </svg>
                  {item.value}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-white/40">&copy; {year} Kaalupi. All rights reserved.</p>
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-white/60">
            {socialLinks.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-[#F5A62A]"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
