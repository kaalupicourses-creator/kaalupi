"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Props = {
  orderId: string;
  statusCode?: string;
  transactionStatus?: string;
  source?: string;
};

export function PaymentFinalizer({
  orderId,
  statusCode,
  transactionStatus,
  source,
}: Props) {
  const hasOrderId = Boolean(orderId);
  const [state, setState] = useState<"loading" | "success" | "error">(
    hasOrderId ? "loading" : "error",
  );
  const [message, setMessage] = useState(
    hasOrderId
      ? "Memverifikasi status pembayaran..."
      : "Order ID tidak ditemukan.",
  );

  useEffect(() => {
    async function finalize() {
      const response = await fetch("/api/payment/finalize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId,
          statusCode,
          transactionStatus,
          source,
        }),
      });

      const payload = (await response.json()) as { success?: boolean; message?: string };

      if (!response.ok || !payload.success) {
        setState("error");
        setMessage(payload.message ?? "Pembayaran belum bisa diverifikasi.");
        return;
      }

      setState("success");
      setMessage(payload.message ?? "Pembayaran berhasil diverifikasi.");
    }

    if (!orderId) {
      return;
    }

    void finalize();
  }, [orderId, source, statusCode, transactionStatus]);

  return (
    <div className="mx-auto max-w-lg">
      <div className="rounded-2xl border border-[#F0E8D8] bg-white p-8 text-center shadow-sm">
        {state === "loading" && (
          <>
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#FFF3D6]">
              <svg className="h-10 w-10 animate-spin text-[#F5A62A]" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
            <h1 className="mt-6 text-2xl font-extrabold text-[#2D5016]">
              Memverifikasi Pembayaran
            </h1>
            <p className="mt-3 text-sm leading-7 text-[#444444]">{message}</p>
          </>
        )}

        {state === "success" && (
          <>
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#E8F5E9]">
              <svg className="h-10 w-10 text-[#7AB648]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="mt-6 text-2xl font-extrabold text-[#2D5016]">
              Pembayaran Berhasil!
            </h1>
            <p className="mt-3 text-sm leading-7 text-[#444444]">{message}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/access"
                className="rounded-xl bg-[#F5A62A] px-5 py-3 text-sm font-bold text-[#2D5016] transition hover:opacity-90"
              >
                Mulai Belajar
              </Link>
              <Link
                href="/dashboard"
                className="rounded-xl border-2 border-[#2D5016] px-5 py-3 text-sm font-semibold text-[#2D5016] transition hover:bg-[#2D5016] hover:text-white"
              >
                Ke Dashboard
              </Link>
            </div>
          </>
        )}

        {state === "error" && (
          <>
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-rose-100">
              <svg className="h-10 w-10 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="mt-6 text-2xl font-extrabold text-[#2D5016]">
              Ada Masalah
            </h1>
            <p className="mt-3 text-sm leading-7 text-[#444444]">{message}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/courses"
                className="rounded-xl bg-[#F5A62A] px-5 py-3 text-sm font-bold text-[#2D5016] transition hover:opacity-90"
              >
                Lihat Course
              </Link>
              <Link
                href="/contact"
                className="rounded-xl border-2 border-[#2D5016] px-5 py-3 text-sm font-semibold text-[#2D5016] transition hover:bg-[#2D5016] hover:text-white"
              >
                Hubungi Support
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
