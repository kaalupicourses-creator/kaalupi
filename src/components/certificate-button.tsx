"use client";

import { useState } from "react";

export function CertificateButton({ courseSlug }: { courseSlug: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleClaim() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/certificates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseSlug }),
      });
      const data = await response.json();
      if (data.url) {
        window.open(data.url, "_blank");
      } else {
        setError(data.error ?? "Gagal generate sertifikat");
      }
    } catch (err) {
      console.error("[certificate] error:", err);
      setError("Gagal generate sertifikat — coba lagi");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-3">
      <button
        type="button"
        onClick={handleClaim}
        disabled={loading}
        className="rounded-lg bg-[#2D5016] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1A3A0F] disabled:opacity-60"
      >
        {loading ? "Memproses..." : "Klaim Sertifikat & Share LinkedIn"}
      </button>
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  );
}
