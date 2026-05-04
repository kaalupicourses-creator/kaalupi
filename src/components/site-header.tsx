"use client";

import Link from "next/link";
import Image from "next/image";
import { UserButton, useAuth } from "@clerk/nextjs";

const links = [
  { href: "/courses", label: "Courses" },
  { href: "/about", label: "Tentang" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Kontak" },
];

export function SiteHeaderClient() {
  const { isSignedIn } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-[#F0E8D8] bg-[#FEFBF5]/95 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Kaalupi"
            width={140}
            height={40}
            className="h-10 w-auto"
            priority
          />
        </Link>

        {/* Nav links */}
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
          {/* Waitlist CTA */}
          <Link
            href="/waitlist"
            className="rounded-full bg-[#FFF3D6] px-4 py-1.5 text-[#5C4813] font-bold hover:bg-[#F5A62A] hover:text-[#2D5016] transition-colors"
          >
            Waitlist
          </Link>
        </nav>

        {/* Auth */}
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
        </div>
      </div>
    </header>
  );
}
