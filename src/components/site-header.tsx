"use client";

import Link from "next/link";
import { UserButton, useAuth } from "@clerk/nextjs";

const links = [
  { href: "/", label: "Home" },
  { href: "/courses", label: "Courses" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeaderClient() {
  const { isSignedIn } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[rgba(7,12,20,0.72)] backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#f97316,#facc15)] font-black text-slate-950">
            K
          </div>
          <div>
            <p className="text-lg font-semibold tracking-[0.2em] text-white">
              KAALUPI
            </p>
            <p className="text-xs text-slate-400">IT Course Platform</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-slate-300 lg:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-white">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {isSignedIn ? (
            <>
              <Link
                href="/dashboard"
                className="rounded-full border border-white/12 px-4 py-2 text-sm text-white transition hover:border-amber-300 hover:text-amber-200"
              >
                Dashboard
              </Link>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "h-9 w-9",
                  },
                }}
              />
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-amber-200"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
