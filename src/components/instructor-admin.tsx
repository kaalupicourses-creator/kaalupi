"use client";

import { useEffect, useState } from "react";

type CourseOpt = { slug: string; title: string };
type Row = {
  id: string;
  instructor_email: string;
  course_slug: string;
  commission_pct: number;
  target_materials: number;
  deadline: string | null;
  uploaded: number;
  progress_pct: number;
  revenue: number;
  commission: number;
  banned: boolean;
};

const rp = (n: number) => "Rp " + n.toLocaleString("id-ID");

export function InstructorAdmin({ courses }: { courses: CourseOpt[] }) {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [email, setEmail] = useState("");
  const [slug, setSlug] = useState(courses[0]?.slug ?? "");
  const [pct, setPct] = useState("30");
  const [target, setTarget] = useState("21");
  const [deadline, setDeadline] = useState("");
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const r = await fetch("/api/admin/instructor-assignments", { cache: "no-store" });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error ?? "Gagal load");
      setRows(d.assignments ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal load");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, []);

  async function assign(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const r = await fetch("/api/admin/instructor-assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          instructor_email: email,
          course_slug: slug,
          commission_pct: Number(pct),
          target_materials: Number(target),
          deadline: deadline || null,
        }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error ?? "Gagal");
      setEmail("");
      setDeadline("");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal");
    } finally {
      setSaving(false);
    }
  }

  async function toggleBan(em: string, banned: boolean) {
    const action = banned ? "unban" : "ban";
    if (!confirm(`Yakin mau ${action === "ban" ? "PAUSE (ban)" : "buka ban"} ${em}?`)) return;
    await fetch("/api/admin/instructor-assignments", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: em, action }),
    });
    await load();
  }

  async function removeAssignment(id: string) {
    if (!confirm("Hapus assignment ini?")) return;
    await fetch("/api/admin/instructor-assignments", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    await load();
  }

  function behind(r: Row) {
    if (!r.deadline || r.progress_pct >= 100) return false;
    return new Date(r.deadline).getTime() < Date.now();
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</div>
      )}

      {/* Assign form */}
      <form onSubmit={assign} className="rounded-2xl border border-[#F0E8D8] bg-white p-5 sm:p-6 shadow-sm">
        <p className="mb-4 text-sm font-bold text-[#2D5016]">Assign Course ke Instructor</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email instructor"
            className="rounded-xl border border-[#F0E8D8] bg-[#FEFBF5] px-3 py-2 text-sm focus:border-[#F5A62A] focus:outline-none lg:col-span-2"
          />
          <select
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="rounded-xl border border-[#F0E8D8] bg-[#FEFBF5] px-3 py-2 text-sm focus:border-[#F5A62A] focus:outline-none"
          >
            {courses.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.title}
              </option>
            ))}
          </select>
          <input
            type="number"
            value={pct}
            onChange={(e) => setPct(e.target.value)}
            placeholder="% komisi"
            title="% komisi"
            className="rounded-xl border border-[#F0E8D8] bg-[#FEFBF5] px-3 py-2 text-sm focus:border-[#F5A62A] focus:outline-none"
          />
          <input
            type="number"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            placeholder="target materi"
            title="total materi yang ditargetkan"
            className="rounded-xl border border-[#F0E8D8] bg-[#FEFBF5] px-3 py-2 text-sm focus:border-[#F5A62A] focus:outline-none"
          />
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <label className="text-xs font-semibold text-[#5C4813]">Deadline:</label>
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="rounded-xl border border-[#F0E8D8] bg-[#FEFBF5] px-3 py-2 text-sm focus:border-[#F5A62A] focus:outline-none"
          />
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-[#F5A62A] px-6 py-2 text-sm font-bold text-[#2D5016] transition hover:opacity-90 disabled:opacity-50"
          >
            {saving ? "Nyimpen..." : "Simpan Assignment"}
          </button>
        </div>
      </form>

      {/* Table */}
      {loading ? (
        <p className="text-sm text-[#444]">Loading...</p>
      ) : rows.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-[#F0E8D8] bg-white p-10 text-center">
          <p className="text-sm font-bold text-[#2D5016]">Belum ada assignment</p>
          <p className="mt-1 text-sm text-[#444]">Assign course ke instructor di form atas.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {rows.map((r) => (
            <div
              key={r.id}
              className={`rounded-2xl border bg-white p-4 sm:p-5 shadow-sm ${r.banned ? "border-[#E06C5A]" : behind(r) ? "border-[#E0B84A]" : "border-[#F0E8D8]"}`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-bold text-[#2D5016] break-all">{r.instructor_email}</p>
                  <p className="text-xs text-[#444]">{r.course_slug} · {r.commission_pct}% komisi</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {r.banned && <span className="rounded-full bg-[#FBEEEA] px-2.5 py-1 text-[10px] font-bold text-[#B23A22]">PAUSED</span>}
                  {!r.banned && behind(r) && <span className="rounded-full bg-[#FCF3D6] px-2.5 py-1 text-[10px] font-bold text-[#8A6A12]">TELAT</span>}
                  <button
                    onClick={() => toggleBan(r.instructor_email, r.banned)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-bold text-white ${r.banned ? "bg-[#7AB648] hover:opacity-90" : "bg-[#E06C5A] hover:opacity-90"}`}
                  >
                    {r.banned ? "Buka Ban" : "Pause / Ban"}
                  </button>
                  <button onClick={() => removeAssignment(r.id)} className="text-xs font-semibold text-red-600 hover:underline">
                    Hapus
                  </button>
                </div>
              </div>

              <div className="mt-3 grid gap-3 sm:grid-cols-3 text-sm">
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-[#5C4813]">
                    <span>Materi {r.uploaded}/{r.target_materials || "?"}</span>
                    <span>{r.progress_pct}%</span>
                  </div>
                  <div className="mt-1.5 h-2 rounded-full bg-[#F0E8D8] overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-[#F5A62A] to-[#7AB648]" style={{ width: `${r.progress_pct}%` }} />
                  </div>
                </div>
                <div className="text-xs text-[#5C4813]">
                  <span className="font-bold uppercase text-[#7AB648]">Deadline: </span>
                  {r.deadline ? new Date(r.deadline).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                </div>
                <div className="text-xs text-[#5C4813]">
                  <span className="font-bold uppercase text-[#7AB648]">Komisi: </span>
                  <span className="font-bold text-[#F5A62A]">{rp(r.commission)}</span> ({rp(r.revenue)} omzet)
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
