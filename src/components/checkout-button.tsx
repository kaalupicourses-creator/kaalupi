"use client";

import { useState } from "react";

declare global {
  interface Window {
    snap?: {
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
      console.log("[Checkout] Step 1 — Memulai checkout untuk course:", slug);

      // Cek apakah Snap sudah siap sebelum request token
      if (typeof window !== "undefined" && !window.snap) {
        console.warn("[Checkout] window.snap belum tersedia — Snap.js mungkin masih loading");
      }

      console.log("[Checkout] Step 2 — Mengirim request ke /api/checkout...");
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ slug, amount }),
      });

      console.log("[Checkout] Step 3 — Response status:", response.status);

      if (!response.ok) {
        let errorPayload: { error?: string } = {};
        try {
          errorPayload = (await response.json()) as { error?: string };
        } catch {
          const rawText = await response.text().catch(() => "(empty)");
          console.error("[Checkout] API error (non-JSON):", response.status, rawText);
          setError(`Checkout gagal (${response.status}). Cek console untuk detail.`);
          return;
        }
        console.error("[Checkout] API error:", response.status, errorPayload);
        setError(errorPayload.error ?? `Checkout gagal (${response.status}).`);
        return;
      }

      const payload = (await response.json()) as { snapToken?: string };
      console.log("[Checkout] Step 4 — Snap token diterima:", payload.snapToken ? "✓" : "❌ kosong");

      if (!payload.snapToken) {
        setError("Token pembayaran tidak diterima dari server.");
        return;
      }

      console.log("[Checkout] Step 5 — Cek ketersediaan window.snap...");
      if (typeof window === "undefined" || !window.snap) {
        console.error("[Checkout] window.snap tidak tersedia. Kemungkinan: Snap.js gagal load atau belum selesai load.");
        setError("Payment system belum siap. Coba refresh halaman lalu coba lagi.");
        return;
      }

      console.log("[Checkout] Step 6 — Membuka Midtrans Snap popup...");
      window.snap.pay(payload.snapToken, {
        onSuccess: (result: Record<string, unknown>) => {
          console.log("[Checkout] ✅ Pembayaran sukses:", result);
          const orderId = (result.order_id as string) ?? "";
          window.location.href = `/payment/result?order_id=${orderId}&status_code=${result.status_code ?? ""}&transaction_status=${result.transaction_status ?? ""}&source=snap`;
        },
        onPending: (result: Record<string, unknown>) => {
          console.log("[Checkout] ⏳ Pembayaran pending:", result);
          const orderId = (result.order_id as string) ?? "";
          window.location.href = `/payment/result?order_id=${orderId}&source=pending`;
        },
        onError: (result: Record<string, unknown>) => {
          console.error("[Checkout] ❌ Pembayaran error:", result);
          window.location.href = "/payment/result?source=error";
        },
        onClose: () => {
          console.log("[Checkout] ℹ️ Snap popup ditutup oleh user");
          window.location.href = "/payment/result?source=closed";
        },
      });
    } catch (err) {
      console.error("[Checkout] Unhandled error:", err);
      setError("Terjadi kesalahan saat checkout. Lihat console untuk detail.");
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
        className="w-full rounded-xl bg-[#F5A62A] px-5 py-3 text-sm font-bold text-[#2D5016] transition hover:opacity-90 disabled:opacity-60"
      >
        {loading ? "Memproses..." : "Bayar Course"}
      </button>
      {error ? (
        <p className="text-sm text-red-600 font-medium">{error}</p>
      ) : null}
    </div>
  );
}
