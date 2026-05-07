"use client";

import Link from "next/link";
import { useState } from "react";
import { UserButton, useAuth } from "@clerk/nextjs";

const links = [
  { href: "/", label: "Beranda" },
  { href: "/courses", label: "Courses" },
  { href: "/about", label: "Tentang" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Kontak" },
];

export function SiteHeaderClient() {
  const { isSignedIn } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-[#F0E8D8] bg-[#FEFBF5]/95 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="text-2xl font-black text-[#2D5016] tracking-tight">
          Kaalupi
        </Link>

        {/* Nav links — desktop */}
        <nav className="hidden items-center gap-6 text-sm font-semibold text-[#2D5016] lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-[#F5A62A] transition-colors"
            >
              {link.label}
            </Link>
          ))}
          {isSignedIn && (
            <Link
              href="/dashboard/code-review"
              className="hover:text-[#F5A62A] transition-colors"
            >
              AI Review
            </Link>
          )}
          {/* Waitlist CTA */}
          <Link
            href="/waitlist"
            className="rounded-full bg-[#FFF3D6] px-4 py-1.5 text-[#5C4813] font-bold hover:bg-[#F5A62A] hover:text-[#2D5016] transition-colors"
          >
            Waitlist
          </Link>
        </nav>

        {/* Auth + Hamburger */}
        <div className="flex items-center gap-3">
          {isSignedIn ? (
            <>
              <Link
                href="/dashboard"
                className="hidden rounded-full border-2 border-[#2D5016] px-4 py-2 text-sm font-semibold text-[#2D5016] transition hover:bg-[#2D5016] hover:text-[#FEFBF5] sm:block"
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
              className="rounded-full bg-[#F5A62A] px-5 py-2 text-sm font-bold text-[#2D5016] transition hover:opacity-90"
            >
              Login
            </Link>
          )}

          {/* Hamburger */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex items-center justify-center rounded-lg border border-[#F0E8D8] p-2 text-[#2D5016] transition hover:bg-[#F0E8D8] lg:hidden"
            aria-label="Toggle menu"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav className="border-t border-[#F0E8D8] bg-[#FEFBF5] px-6 pb-6 pt-4 lg:hidden">
          <div className="flex flex-col gap-3 text-sm font-semibold text-[#2D5016]">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-xl px-4 py-2.5 transition hover:bg-[#F0E8D8]"
              >
                {link.label}
              </Link>
            ))}
            {isSignedIn && (
              <Link
                href="/dashboard/code-review"
                onClick={() => setMobileOpen(false)}
                className="rounded-xl px-4 py-2.5 transition hover:bg-[#F0E8D8]"
              >
                AI Review
              </Link>
            )}
            <Link
              href="/waitlist"
              onClick={() => setMobileOpen(false)}
              className="rounded-xl bg-[#FFF3D6] px-4 py-2.5 text-[#5C4813] font-bold text-center hover:bg-[#F5A62A] hover:text-[#2D5016] transition-colors"
            >
              Waitlist
            </Link>
            {isSignedIn && (
              <Link
                href="/dashboard"
                onClick={() => setMobileOpen(false)}
                className="rounded-xl border-2 border-[#2D5016] px-4 py-2.5 text-center"
              >
                Dashboard
              </Link>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
