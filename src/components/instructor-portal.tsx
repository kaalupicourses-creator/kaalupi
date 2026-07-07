"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type CourseRow = {
  course_slug: string;
  course_title: string;
  commission_pct: number;
  target_materials: number;
  uploaded: number;
  progress_pct: number;
  revenue: number;
  commission: number;
  deadline: string | null;
  days_left: number | null;
};

type Data = {
  email: string;
  banned: boolean;
  total_commission: number;
  courses: CourseRow[];
};

const rp = (n: number) => "Rp " + n.toLocaleString("id-ID");

export function InstructorPortal() {
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/instructor/me", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setData(d.error ? null : d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-sm text-[#444]">Loading...</p>;
  if (!data) return <p className="text-sm text-[#444]">Gagal load data.</p>;

  return (
    <div className="space-y-6">
      {/* Ban banner */}
      {data.banned && (
        <div className="rounded-2xl border-2 border-[#E06C5A] bg-[#FBEEEA] p-5">
          <p className="text-sm font-extrabold text-[#B23A22]">⛔ Akun lu lagi di-pause</p>
          <p className="mt-1 text-sm text-[#7A3020]">
            Lu telat dari target yang disepakati, jadi upload materi lagi dikunci sementara. Hubungi admin
            buat diskusi biar dibuka lagi.
          </p>
        </div>
      )}

      {/* Total komisi */}
      <div className="rounded-2xl border-2 border-[#F5A62A] bg-[#FFF3D6] p-5">
        <p className="text-xs font-bold uppercase tracking-wider text-[#7AB648]">Total Komisi Lu</p>
        <p className="mt-1 text-3xl font-black text-[#F5A62A]">{rp(data.total_commission)}</p>
        <p className="mt-1 text-xs text-[#5C4813]">
          Dari penjualan course lu yang udah dikonfirmasi bayar. Transparan — update otomatis.
        </p>
      </div>

      {/* Per course */}
      {data.courses.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-[#F0E8D8] bg-white p-10 text-center">
          <p className="text-sm font-bold text-[#2D5016]">Belum ada course yang di-assign</p>
          <p className="mt-1 text-sm text-[#444]">Admin belum nyetting course & target buat lu. Sabar ya.</p>
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {data.courses.map((c) => {
            const behind =
              c.days_left !== null && c.days_left < 0 && c.progress_pct < 100;
            return (
              <div key={c.course_slug} className="rounded-2xl border border-[#F0E8D8] bg-white p-6 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-extrabold text-[#2D5016]">{c.course_title}</h3>
                  <span className="shrink-0 rounded-full bg-[#FFF3D6] px-2.5 py-1 text-[10px] font-bold text-[#5C4813]">
                    {c.commission_pct}% komisi
                  </span>
                </div>

                {/* Progress */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs font-bold text-[#5C4813]">
                    <span>
                      Materi: {c.uploaded}/{c.target_materials || "?"}
                    </span>
                    <span>{c.progress_pct}%</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-[#F0E8D8] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#F5A62A] to-[#7AB648] transition-all"
                      style={{ width: `${c.progress_pct}%` }}
                    />
                  </div>
                </div>

                {/* Deadline + profit */}
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-xl bg-[#FEFBF5] p-3">
                    <p className="text-[10px] font-bold uppercase text-[#7AB648]">Deadline</p>
                    <p className="mt-0.5 font-bold text-[#2D5016]">
                      {c.deadline ? new Date(c.deadline).toLocaleDateString("id-ID", { day: "numeric", month: "short" }) : "—"}
                    </p>
                    {c.days_left !== null && (
                      <p className={`text-[11px] font-semibold ${behind ? "text-[#B23A22]" : "text-[#5C4813]"}`}>
                        {c.days_left >= 0 ? `${c.days_left} hari lagi` : `telat ${Math.abs(c.days_left)} hari`}
                      </p>
                    )}
                  </div>
                  <div className="rounded-xl bg-[#FEFBF5] p-3">
                    <p className="text-[10px] font-bold uppercase text-[#7AB648]">Profit lu</p>
                    <p className="mt-0.5 font-bold text-[#F5A62A]">{rp(c.commission)}</p>
                    <p className="text-[11px] text-[#5C4813]">dari {rp(c.revenue)} omzet</p>
                  </div>
                </div>

                {behind && (
                  <p className="mt-3 text-xs font-semibold text-[#B23A22]">
                    ⚠️ Lu udah lewat deadline & belum kelar. Gas kejar biar ga kena pause.
                  </p>
                )}

                {!data.banned && (
                  <Link
                    href={`/dashboard/studio?course=${c.course_slug}`}
                    className="mt-4 block rounded-xl bg-[#F5A62A] px-4 py-2.5 text-center text-sm font-bold text-[#2D5016] hover:opacity-90 transition"
                  >
                    Upload Materi →
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
