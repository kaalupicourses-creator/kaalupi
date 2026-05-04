"use client";

import Script from "next/script";

type Props = {
  snapUrl: string;
  clientKey: string;
};

export function MidtransScript({ snapUrl, clientKey }: Props) {
  return (
    <Script
      src={snapUrl}
      data-client-key={clientKey}
      strategy="afterInteractive"
      id="midtrans-snap"
      onLoad={() => {
        console.log("[Midtrans] Snap.js berhasil dimuat ✓");
      }}
      onError={() => {
        console.error("[Midtrans] Gagal memuat Snap.js — cek koneksi atau CORS");
      }}
    />
  );
}
