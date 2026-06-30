"use client";

import { usePathname } from "next/navigation";
import { SiteFooter } from "@/components/site-footer";

export function ConditionalFooter() {
  const pathname = usePathname();
  if (pathname.startsWith("/access/")) return null;
  return <SiteFooter />;
}

export function useIsAccessPage() {
  const pathname = usePathname();
  return pathname.startsWith("/access/");
}
