"use client";

import { useEffect, useState } from "react";

type SlotInfo = {
  taken: number;
  remaining: number;
  founding_limit: number;
  is_sold_out: boolean;
  current_price: number;
  original_price: number;
};

export function FoundingSlotCounter({
  slug,
  variant = "card",
}: {
  slug: string;
  variant?: "card" | "inline" | "compact";
}) {
  const [info, setInfo] = useState<SlotInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/founding-slot?slug=${slug}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) return;
        setInfo(d as SlotInfo);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading || !info) {
    return null;
  }

  const percent = Math.round((info.taken / info.founding_limit) * 100);

  if (variant === "compact") {
    return (
      <div className="inline-flex items-center gap-2 rounded-full bg-[#FFF3D6] px-3 py-1 text-xs font-bold text-[#5C4813]">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#F5A62A] opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-[#F5A62A]" />
        </span>
        {info.is_sold_out
          ? "Founding Members SOLD OUT"
          : `Slot tersisa: ${info.remaining}/${info.founding_limit}`}
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <div className="rounded-xl border border-[#F0E8D8] bg-[#FFF3D6] px-4 py-3">
        <div className="flex items-center justify-between text-xs font-bold text-[#5C4813]">
          <span>
            {info.is_sold_out
              ? "🔥 Founding Members SOLD OUT — harga regular"
              : `🔥 Founding Members tersisa: ${info.remaining}/${info.founding_limit}`}
          </span>
          <span>{percent}%</span>
        </div>
        <div className="mt-2 h-1.5 rounded-full bg-white overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#F5A62A] to-[#7AB648] transition-all"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    );
  }

  // Default: card variant
  return (
    <div className="rounded-2xl border-2 border-[#F5A62A] bg-gradient-to-br from-[#FFF3D6] to-[#FEFBF5] p-5">
      <div className="flex items-center gap-2">
        <span className="rounded-full bg-[#F5A62A] px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-[#2D5016]">
          Founding Members
        </span>
        {!info.is_sold_out && (
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#F5A62A] opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#F5A62A]" />
          </span>
        )}
      </div>

      {info.is_sold_out ? (
        <p className="mt-3 text-sm font-bold text-[#2D5016]">
          🎉 Founding Members SOLD OUT — sekarang harga regular Rp{" "}
          {info.current_price.toLocaleString("id-ID")}
        </p>
      ) : (
        <>
          <p className="mt-3 text-sm font-bold text-[#2D5016]">
            Slot tersisa: <span className="text-[#F5A62A]">{info.remaining}</span>/
            {info.founding_limit}
          </p>
          <div className="mt-2 h-2 rounded-full bg-white overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#F5A62A] to-[#7AB648] transition-all"
              style={{ width: `${percent}%` }}
            />
          </div>
          <p className="mt-3 text-xs text-[#5C4813] leading-5">
            Setelah <strong>{info.founding_limit} student</strong> terdaftar, harga balik ke{" "}
            <strong>Rp {info.original_price.toLocaleString("id-ID")}</strong>. Jangan ketinggalan.
          </p>
        </>
      )}
    </div>
  );
}
