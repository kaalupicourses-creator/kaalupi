"use client";

import { useState } from "react";

declare global {
  interface Window {
    snap: {
      pay: (token: string, options: Record<string, unknown>) => void;
    };
  }
}

export function CheckoutButton({ slug, amount }: { slug: string; amount: number }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCheckout() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ slug, amount }),
      });

      if (!response.ok) {
        const errorPayload = (await response.json()) as { error?: string };
        setError(errorPayload.error ?? `Checkout gagal (${response.status}).`);
        return;
      }

      const payload = (await response.json()) as { snapToken?: string };

      if (!payload.snapToken) {
        setError("Token pembayaran tidak diterima dari server.");
        return;
      }

      if (typeof window.snap === "undefined") {
        setError("Payment system belum siap. Coba refresh halaman.");
        return;
      }

      window.snap.pay(payload.snapToken, {
        onSuccess: (result: Record<string, unknown>) => {
          const orderId = (result.order_id as string) ?? "";
          window.location.href = `/payment/result?order_id=${orderId}&status_code=${result.status_code ?? ""}&transaction_status=${result.transaction_status ?? ""}&source=snap`;
        },
        onPending: (result: Record<string, unknown>) => {
          const orderId = (result.order_id as string) ?? "";
          window.location.href = `/payment/result?order_id=${orderId}&source=pending`;
        },
        onError: () => {
          window.location.href = "/payment/result?source=error";
        },
        onClose: () => {
          window.location.href = "/payment/result?source=closed";
        },
      });
    } catch (err) {
      console.error("Checkout error:", err);
      setError("Terjadi kesalahan saat checkout.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={handleCheckout}
        disabled={loading}
        className="w-full rounded-full bg-[linear-gradient(135deg,#f97316,#facc15)] px-5 py-3 text-sm font-semibold text-slate-950 transition hover:opacity-90 disabled:opacity-60"
      >
        {loading ? "Processing..." : "Bayar Course"}
      </button>
      {error ? <p className="text-sm text-rose-300">{error}</p> : null}
    </div>
  );
}
