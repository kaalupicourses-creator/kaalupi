"use client";

import { useState } from "react";

export function CertificateButton({ courseSlug }: { courseSlug: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [certUrl, setCertUrl] = useState<string | null>(null);
  const [linkedInUrl, setLinkedInUrl] = useState<string | null>(null);

  async function handleClaim() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/certificates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseSlug, shareLinkedIn: true }),
      });
      const data = await response.json();
      if (!response.ok || !data.url) {
        setError(data.error ?? "Gagal generate sertifikat — coba lagi");
        return;
      }
      // Render as clickable links instead of window.open (which gets popup-blocked
      // because it runs after an await, outside a direct user gesture).
      setCertUrl(data.url);
      setLinkedInUrl(data.linkedInUrl ?? null);
    } catch (err) {
      console.error("[certificate] error:", err);
      setError("Gagal generate sertifikat — coba lagi");
    } finally {
      setLoading(false);
    }
  }

  // After generation: show download + share links (direct anchors = no popup block)
  if (certUrl) {
    return (
      <div className="mt-3 space-y-2">
        <a
          href={certUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-lg bg-[#2D5016] px-4 py-2.5 text-center text-sm font-bold text-white transition hover:bg-[#1A3A0F]"
        >
          Buka / Download Sertifikat (PDF)
        </a>
        {linkedInUrl && (
          <a
            href={linkedInUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-lg bg-[#0A66C2] px-4 py-2.5 text-center text-sm font-bold text-white transition hover:opacity-90"
          >
            Share ke LinkedIn
          </a>
        )}
        <p className="text-center text-xs text-[#5C4813]">
          Sertifikat sudah tersimpan di akun lu — bisa diakses lagi kapan aja.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-3">
      <button
        type="button"
        onClick={handleClaim}
        disabled={loading}
        className="w-full rounded-lg bg-[#2D5016] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1A3A0F] disabled:opacity-60"
      >
        {loading ? "Membuat sertifikat..." : "Klaim Sertifikat & Share LinkedIn"}
      </button>
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  );
}
