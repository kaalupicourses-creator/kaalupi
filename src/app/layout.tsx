import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeaderClient } from "@/components/site-header";
import { siteConfig } from "@/lib/data";
import { getMidtransConfig } from "@/lib/midtrans";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Kaalupi | IT Course Platform",
    template: "%s | Kaalupi",
  },
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const midtrans = getMidtransConfig();

  return (
    <ClerkProvider>
      <html lang="id" className="h-full antialiased">
        <body className="min-h-full bg-[radial-gradient(circle_at_top,_rgba(250,204,21,0.12),_transparent_28%),linear-gradient(180deg,#08111d_0%,#08111d_50%,#07101a_100%)] text-white">
          <div className="relative min-h-screen overflow-hidden">
            <div className="absolute inset-x-0 top-0 -z-10 h-[32rem] bg-[radial-gradient(circle_at_top_left,_rgba(249,115,22,0.18),_transparent_38%)]" />
            <SiteHeaderClient />
            <main>{children}</main>
            <SiteFooter />
          </div>
          {midtrans.enabled && midtrans.clientKey && (
            <Script
              src={`${midtrans.snapBaseUrl}/snap.js`}
              data-client-key={midtrans.clientKey}
              strategy="afterInteractive"
            />
          )}
        </body>
      </html>
    </ClerkProvider>
  );
}
