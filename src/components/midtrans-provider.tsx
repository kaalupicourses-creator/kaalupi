"use client";

import { useEffect } from "react";
import { getMidtransConfig } from "@/lib/midtrans";

export function MidtransProvider() {
  const midtrans = getMidtransConfig();

  useEffect(() => {
    if (!midtrans.enabled || !midtrans.clientKey) return;

    const script = document.createElement("script");
    script.src = `${midtrans.snapBaseUrl}/snap/snap.js`;
    script.setAttribute("data-client-key", midtrans.clientKey);
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [midtrans]);

  return null;
}
