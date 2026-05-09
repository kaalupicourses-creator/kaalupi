"use client";

import { useEffect, useState } from "react";

export function PaymentPendingRedirect({ waUrl }: { waUrl: string }) {
  const [seconds, setSeconds] = useState(5);
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    if (!waUrl || opened) return;
    if (seconds <= 0) {
      window.open(waUrl, "_blank");
      setOpened(true);
      return;
    }
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds, waUrl, opened]);

  if (!waUrl) {
    return (
      <p className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-700 text-center">
        Link WhatsApp tidak terdeteksi. Hubungi admin secara manual.
      </p>
    );
  }

  return (
    <div className="mt-6">
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => setOpened(true)}
        className="block w-full rounded-xl bg-[#25D366] px-5 py-4 text-center text-base font-extrabold text-white shadow-md transition hover:opacity-90"
      >
        Buka WhatsApp Sekarang →
      </a>
      <p className="mt-3 text-center text-xs text-[#5C4813]">
        {opened
          ? "WhatsApp sudah terbuka di tab baru. Tinggal klik Send."
          : `Otomatis terbuka dalam ${seconds} detik...`}
      </p>
    </div>
  );
}
