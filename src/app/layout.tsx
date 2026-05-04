import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeaderClient } from "@/components/site-header";
import { MidtransScript } from "@/components/midtrans-script";
import { siteConfig } from "@/lib/data";
import { getMidtransConfig } from "@/lib/midtrans";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: {
    default: "Kaalupi | Kursus IT Indonesia",
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
          {midtrans.enabled && midtrans.clientKey && (
            <MidtransScript
              snapUrl={`${midtrans.snapBaseUrl}/snap/snap.js`}
              clientKey={midtrans.clientKey}
            />
          )}
        </body>
      </html>
    </ClerkProvider>
  );
}
