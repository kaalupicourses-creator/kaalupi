"use client";

import { useEffect, useState } from "react";

type Analytics = {
  users: { total: number };
  enrollments: {
    total: number;
    last_7d: number;
    last_30d: number;
    mastery: number;
    per_course: Record<string, number>;
  };
  revenue: { total_idr: number; paid_orders: number };
  engagement: { active_learners_30d: number; modules_completed_30d: number };
  content: { materials: number; blog_posts: number; waitlist: number };
};

const formatRupiah = (n: number) =>
  `Rp ${n.toLocaleString("id-ID")}`;

export function AnalyticsView() {
  const [data, setData] = useState<Analytics | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const r = await fetch("/api/admin/analytics");
      const d = await r.json();
      if (!r.ok) {
        setError(d.error ?? "Gagal load analytics");
        return;
      }
      setData(d as Analytics);
    } catch {
      setError("Koneksi terputus");
    } finally {
      setLoading(false);
    }
  }

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading && !data) {
    return <p className="rounded-xl border border-[#F0E8D8] bg-white p-8 text-center text-sm text-[#999]">Memuat data...</p>;
  }
  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        {error}
        <button onClick={load} className="ml-3 font-bold underline">Retry</button>
      </div>
    );
  }
  if (!data) return null;

  return (
    <div className="space-y-6">
      {/* Top KPI grid */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card label="Total User" value={data.users.total} hint="Akun terdaftar" />
        <Card label="Total Enrollment" value={data.enrollments.total} hint={`${data.enrollments.last_7d} dalam 7 hari, ${data.enrollments.last_30d} dalam 30 hari`} />
        <Card label="Founding Members" value={`${data.enrollments.mastery}/100`} hint="Mastery enrollment" />
        <Card label="Revenue" value={formatRupiah(data.revenue.total_idr)} hint={`${data.revenue.paid_orders} order paid`} />
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card label="Active Learners (30d)" value={data.engagement.active_learners_30d} hint="Unique user yang complete minimal 1 modul" />
        <Card label="Modul Selesai (30d)" value={data.engagement.modules_completed_30d} hint="Total modul completed" />
        <Card label="Waitlist" value={data.content.waitlist} hint="Subscriber notifikasi" />
      </section>

      {/* Per course */}
      <section className="rounded-2xl border border-[#F0E8D8] bg-white p-6 shadow-sm">
        <h2 className="text-lg font-extrabold text-[#2D5016]">Enrollment per Course</h2>
        {Object.keys(data.enrollments.per_course).length === 0 ? (
          <p className="mt-3 text-sm text-[#999]">Belum ada enrollment.</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {Object.entries(data.enrollments.per_course)
              .sort((a, b) => b[1] - a[1])
              .map(([slug, count]) => (
                <li key={slug} className="flex items-center justify-between rounded-xl border border-[#F0E8D8] bg-[#FEFBF5] px-4 py-3">
                  <span className="font-semibold text-[#2D5016]">{slug}</span>
                  <span className="rounded-full bg-[#FFF3D6] px-3 py-1 text-xs font-bold text-[#5C4813]">{count} student</span>
                </li>
              ))}
          </ul>
        )}
      </section>

      <section className="rounded-2xl border border-[#F0E8D8] bg-white p-6 shadow-sm">
        <h2 className="text-lg font-extrabold text-[#2D5016]">Konten</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3 text-sm">
          <div className="rounded-xl border border-[#F0E8D8] bg-[#FEFBF5] p-4">
            <p className="text-xs text-[#5C4813]">Materi (modul) terinput</p>
            <p className="mt-1 text-2xl font-extrabold text-[#2D5016]">{data.content.materials}</p>
          </div>
          <div className="rounded-xl border border-[#F0E8D8] bg-[#FEFBF5] p-4">
            <p className="text-xs text-[#5C4813]">Blog post</p>
            <p className="mt-1 text-2xl font-extrabold text-[#2D5016]">{data.content.blog_posts}</p>
          </div>
          <div className="rounded-xl border border-[#F0E8D8] bg-[#FEFBF5] p-4">
            <p className="text-xs text-[#5C4813]">Subscriber waitlist</p>
            <p className="mt-1 text-2xl font-extrabold text-[#2D5016]">{data.content.waitlist}</p>
          </div>
        </div>
      </section>

      <button
        type="button"
        onClick={load}
        className="rounded-xl border-2 border-[#2D5016] bg-white px-4 py-2 text-sm font-bold text-[#2D5016] hover:bg-[#2D5016] hover:text-white"
      >
        Refresh data
      </button>
    </div>
  );
}

function Card({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="rounded-2xl border border-[#F0E8D8] bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wider text-[#5C4813]">{label}</p>
      <p className="mt-2 text-2xl font-extrabold text-[#2D5016]">{value}</p>
      {hint && <p className="mt-1 text-xs text-[#999]">{hint}</p>}
    </div>
  );
}
