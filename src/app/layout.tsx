import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/react";
import { SiteHeaderClient } from "@/components/site-header";
import { ConditionalFooter } from "@/components/conditional-footer";
import { NavProgress } from "@/components/nav-progress";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://kaalupi.vercel.app"),
  title: {
    default: "Kaalupi | Platform Belajar Skill Digital Indonesia — Dari Nol ke Pro",
    template: "%s | Kaalupi",
  },
  description: "Platform belajar skill digital dalam bahasa Indonesia. Web Development, Network Engineering, Design, dan pelajaran akademik — langsung praktik, sertifikat resmi, akses lifetime.",
  keywords: ["belajar web development", "kursus IT Indonesia", "web dev bareng AI", "network engineer", "belajar design", "kursus online Indonesia", "sertifikat"],
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    title: "Kaalupi | Platform Belajar Skill Digital Indonesia",
    description: "Belajar Web Dev, Network, Design, dan lainnya — bahasa Indonesia, langsung praktik, akses lifetime.",
    url: "https://kaalupi.vercel.app",
    siteName: "Kaalupi",
    images: [{ url: "/og", width: 1200, height: 630, alt: "Kaalupi - Platform Belajar Skill Digital Indonesia" }],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kaalupi | Platform Belajar Skill Digital Indonesia",
    description: "Belajar Web Dev, Network, Design, dan lainnya — bahasa Indonesia, langsung praktik.",
    images: ["/og"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="id" className={`${nunito.variable} h-full antialiased`}>
        <body
          className="min-h-full bg-[#FEFBF5] text-[#444444]"
          style={{ fontFamily: "var(--font-nunito), 'Segoe UI', sans-serif" }}
        >
          <NavProgress />
          <div className="relative min-h-screen flex flex-col">
            <SiteHeaderClient />
            <main className="flex-1">{children}</main>
            <ConditionalFooter />
          </div>
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
