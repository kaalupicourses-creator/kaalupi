"use client";

import { useState } from "react";

interface Props {
  moduleIndex: number;
  isCompleted: boolean;
  onComplete: (moduleIndex: number) => Promise<void>;
}

export function MarkDoneButton({ moduleIndex, isCompleted, onComplete }: Props) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(isCompleted);

  async function handle() {
    if (done || loading) return;
    setLoading(true);
    try {
      await onComplete(moduleIndex);
      setDone(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handle}
      disabled={done || loading}
      title={done ? "Selesai" : "Tandai selesai"}
      className={`flex-shrink-0 flex h-5 w-5 items-center justify-center rounded-full border-2 transition ${
        done
          ? "border-[#7AB648] bg-[#7AB648]"
          : loading
          ? "border-[#F5A62A] opacity-50"
          : "border-[#D0C8B8] hover:border-[#F5A62A]"
      }`}
    >
      {done && (
        <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      )}
      {loading && (
        <svg className="h-3 w-3 animate-spin text-[#F5A62A]" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
    </button>
  );
}
