import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeaderClient } from "@/components/site-header";
import { MidtransProvider } from "@/components/midtrans-provider";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://kaalupi.vercel.app"),
  title: {
    default: "Kaalupi | AI-First Career Platform Indonesia — Dari Nol ke AI Specialist",
    template: "%s | Kaalupi",
  },
  description: "Platform course IT profesional dengan integrasi AI tools. Pelajari AI, Programming, Network, dan Cyber Security dalam bahasa Indonesia. Gratis untuk pemula, sertifikat resmi, garansi 14 hari.",
  keywords: ["course IT", "belajar AI", "programming Indonesia", "cyber security", "network engineer", "AI tools", "career platform"],
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    title: "Kaalupi | AI-First Career Platform Indonesia",
    description: "Dari nol jadi AI Specialist dalam 3 bulan. Course IT dengan integrasi AI tools, bahasa Indonesia, langsung praktik.",
    url: "https://kaalupi.vercel.app",
    siteName: "Kaalupi",
    images: [
      {
        url: "/og",
        width: 1200,
        height: 630,
        alt: "Kaalupi - AI-First Career Platform Indonesia",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kaalupi | AI-First Career Platform Indonesia",
    description: "Dari nol jadi AI Specialist dalam 3 bulan. Course IT dengan integrasi AI tools.",
    images: ["/og"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="id" className={`${nunito.variable} h-full antialiased`}>
        <body
          className="min-h-full bg-[#FEFBF5] text-[#444444]"
          style={{ fontFamily: "var(--font-nunito), 'Segoe UI', sans-serif" }}
        >
          <div className="relative min-h-screen flex flex-col">
            <SiteHeaderClient />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </div>
          <MidtransProvider />
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
