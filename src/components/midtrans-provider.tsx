"use client";

import { useEffect } from "react";

const SANDBOX_SNAP = "https://app.sandbox.midtrans.com";
const PRODUCTION_SNAP = "https://app.midtrans.com";

export function MidtransProvider() {
  const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;
  const isProduction = process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === "true";
  const snapBaseUrl = isProduction ? PRODUCTION_SNAP : SANDBOX_SNAP;

  useEffect(() => {
    if (!clientKey) return;

    const script = document.createElement("script");
    script.src = `${snapBaseUrl}/snap/snap.js`;
    script.setAttribute("data-client-key", clientKey);
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [clientKey, snapBaseUrl]);

  return null;
}
