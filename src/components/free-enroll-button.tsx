"use client";

import { useState } from "react";

export function FreeEnrollButton({ slug }: { slug: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function enroll() {
    setLoading(true);
    setError("");
    try {
      const r = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, amount: 0, isFree: true }),
      });
      const d = await r.json();
      if (!r.ok) {
        setError(d.error ?? "Gagal enroll");
        return;
      }
      window.location.href = `/access/${slug}`;
    } catch {
      setError("Koneksi terputus");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={enroll}
        disabled={loading}
        className="block w-full rounded-xl bg-[#F5A62A] px-5 py-3.5 text-center text-sm font-bold text-[#2D5016] hover:opacity-90 transition disabled:opacity-60"
      >
        {loading ? "Memproses..." : "Daftar Gratis & Mulai Belajar →"}
      </button>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
