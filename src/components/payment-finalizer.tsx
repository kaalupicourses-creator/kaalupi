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
      <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 text-center">
        {state === "loading" && (
          <>
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-amber-300/10">
              <svg className="h-10 w-10 animate-spin text-amber-300" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
            <h1 className="mt-6 text-2xl font-semibold text-white">
              Verifying Payment
            </h1>
            <p className="mt-3 text-sm leading-7 text-slate-300">{message}</p>
          </>
        )}

        {state === "success" && (
          <>
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/20">
              <svg className="h-10 w-10 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="mt-6 text-2xl font-semibold text-white">
              Payment Successful!
            </h1>
            <p className="mt-3 text-sm leading-7 text-slate-300">{message}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/access"
                className="rounded-full bg-[linear-gradient(135deg,#f97316,#facc15)] px-5 py-3 text-sm font-semibold text-slate-950"
              >
                Start Learning
              </Link>
              <Link
                href="/dashboard"
                className="rounded-full border border-white/12 px-5 py-3 text-sm text-white"
              >
                Go to Dashboard
              </Link>
            </div>
          </>
        )}

        {state === "error" && (
          <>
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-rose-500/20">
              <svg className="h-10 w-10 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="mt-6 text-2xl font-semibold text-white">
              Payment Issue
            </h1>
            <p className="mt-3 text-sm leading-7 text-slate-300">{message}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/courses"
                className="rounded-full bg-[linear-gradient(135deg,#f97316,#facc15)] px-5 py-3 text-sm font-semibold text-slate-950"
              >
                Browse Courses
              </Link>
              <Link
                href="/contact"
                className="rounded-full border border-white/12 px-5 py-3 text-sm text-white"
              >
                Contact Support
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
