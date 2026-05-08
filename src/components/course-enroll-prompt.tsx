"use client";

import Link from "next/link";
import { useState } from "react";

interface Props {
  slug: string;
  isFree?: boolean;
}

export function CourseEnrollPrompt({ slug, isFree }: Props) {
  const [show, setShow] = useState(false);
  const next = encodeURIComponent(`/courses/${slug}`);

  return (
    <>
      <button
        type="button"
        onClick={() => setShow(true)}
        className="block w-full rounded-xl bg-[#F5A62A] px-5 py-3.5 text-center text-sm font-bold text-[#2D5016] transition hover:opacity-90"
      >
        {isFree ? "Daftar Gratis" : "Beli Course"}
      </button>

      {show && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A2E0A]/60 p-4 backdrop-blur-sm"
          onClick={() => setShow(false)}
        >
          <div
            className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFF3D6]">
              <svg className="h-7 w-7 text-[#F5A62A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
            </div>
            <h3 className="text-center text-xl font-extrabold text-[#2D5016]">
              Login dulu, baru bisa enroll
            </h3>
            <p className="mt-3 text-center text-sm leading-6 text-[#444]">
              {isFree
                ? "Course ini gratis — tapi perlu akun supaya kami bisa simpen progress, kasih sertifikat, dan auto-enroll ke fitur lain."
                : "Buat akun dulu supaya kami bisa kirim materi, simpen progress, dan kasih akses lifetime setelah bayar."}
            </p>

            <div className="mt-6 flex flex-col gap-3">
              <Link
                href={`/register?redirect=${next}`}
                className="rounded-xl bg-[#F5A62A] py-3.5 text-center text-sm font-extrabold text-[#2D5016] shadow-md transition hover:opacity-90"
              >
                Daftar Gratis (1 menit) →
              </Link>
              <Link
                href={`/login?redirect=${next}`}
                className="rounded-xl border-2 border-[#2D5016] py-3 text-center text-sm font-bold text-[#2D5016] transition hover:bg-[#2D5016] hover:text-white"
              >
                Sudah punya akun? Masuk
              </Link>
            </div>

            <button
              type="button"
              onClick={() => setShow(false)}
              className="mt-4 w-full text-xs text-[#999] hover:text-[#2D5016]"
            >
              Nanti aja
            </button>
          </div>
        </div>
      )}
    </>
  );
}
