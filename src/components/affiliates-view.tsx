"use client";

import { useEffect, useState } from "react";

type Affiliate = {
  id: string;
  code: string;
  name: string;
  email: string | null;
  commission_pct: number;
  sales_count: number;
  pending_count: number;
  revenue: number;
  commission_owed: number;
};

const rp = (n: number) => "Rp " + n.toLocaleString("id-ID");
const SITE = "https://kaalupi.vercel.app";
const DEFAULT_COURSE = "cyber-security-pemula";

export function AffiliatesView() {
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  // Form state
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pct, setPct] = useState("20");
  const [submitting, setSubmitting] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const r = await fetch("/api/admin/affiliates", { cache: "no-store" });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error ?? "Gagal load");
      setAffiliates(d.affiliates ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal load");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function createAffiliate(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const r = await fetch("/api/admin/affiliates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, name, email, commission_pct: Number(pct) }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error ?? "Gagal bikin");
      setCode("");
      setName("");
      setEmail("");
      setPct("20");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal bikin");
    } finally {
      setSubmitting(false);
    }
  }

  async function removeAffiliate(id: string, codeLabel: string) {
    if (!confirm(`Hapus afiliasi "${codeLabel}"? Data komisi lama ikut ilang.`)) return;
    try {
      const r = await fetch("/api/admin/affiliates", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!r.ok) {
        const d = await r.json();
        throw new Error(d.error ?? "Gagal hapus");
      }
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal hapus");
    }
  }

  function copyLink(codeVal: string) {
    const link = `${SITE}/checkout/${DEFAULT_COURSE}?ref=${codeVal}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(link).then(() => {
        setCopied(codeVal);
        setTimeout(() => setCopied(null), 1500);
      });
    }
  }

  const totalOwed = affiliates.reduce((s, a) => s + a.commission_owed, 0);

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      {/* Create form */}
      <form onSubmit={createAffiliate} className="rounded-2xl border border-[#F0E8D8] bg-white p-6 shadow-sm">
        <p className="mb-4 text-sm font-bold text-[#2D5016]">Bikin Afiliasi Baru</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="text-xs font-semibold text-[#5C4813]">Kode unik</label>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="FAIRUS10"
              className="mt-1 w-full rounded-xl border border-[#F0E8D8] bg-[#FEFBF5] px-3 py-2 text-sm font-mono focus:border-[#F5A62A] focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-[#5C4813]">Nama</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Fairus"
              className="mt-1 w-full rounded-xl border border-[#F0E8D8] bg-[#FEFBF5] px-3 py-2 text-sm focus:border-[#F5A62A] focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-[#5C4813]">Email (opsional)</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="fairus@email.com"
              className="mt-1 w-full rounded-xl border border-[#F0E8D8] bg-[#FEFBF5] px-3 py-2 text-sm focus:border-[#F5A62A] focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-[#5C4813]">Komisi (%)</label>
            <input
              type="number"
              value={pct}
              min={0}
              max={100}
              onChange={(e) => setPct(e.target.value)}
              className="mt-1 w-full rounded-xl border border-[#F0E8D8] bg-[#FEFBF5] px-3 py-2 text-sm focus:border-[#F5A62A] focus:outline-none"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="mt-4 rounded-xl bg-[#F5A62A] px-6 py-2.5 text-sm font-bold text-[#2D5016] transition hover:opacity-90 disabled:opacity-50"
        >
          {submitting ? "Nyimpen..." : "+ Bikin Afiliasi"}
        </button>
      </form>

      {/* Summary */}
      <div className="rounded-2xl border-2 border-[#F5A62A] bg-[#FFF3D6] p-5">
        <p className="text-xs font-bold uppercase tracking-wider text-[#7AB648]">Total Komisi Terhutang</p>
        <p className="mt-1 text-3xl font-black text-[#F5A62A]">{rp(totalOwed)}</p>
        <p className="mt-1 text-xs text-[#5C4813]">
          Dari {affiliates.length} afiliasi. Ini yang perlu lu bayar ke mereka (dari penjualan yang udah di-approve).
        </p>
      </div>

      {/* Table */}
      {loading ? (
        <p className="text-sm text-[#444]">Loading...</p>
      ) : affiliates.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-[#F0E8D8] bg-white p-10 text-center">
          <p className="text-sm font-bold text-[#2D5016]">Belum ada afiliasi</p>
          <p className="mt-1 text-sm text-[#444]">Bikin afiliasi pertama di form atas.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-[#F0E8D8] bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#F0E8D8] text-left text-xs uppercase tracking-wider text-[#7AB648]">
                <th className="px-4 py-3">Kode / Nama</th>
                <th className="px-4 py-3">Komisi</th>
                <th className="px-4 py-3">Penjualan</th>
                <th className="px-4 py-3">Omzet</th>
                <th className="px-4 py-3">Komisi Terhutang</th>
                <th className="px-4 py-3">Link</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {affiliates.map((a) => (
                <tr key={a.id} className="border-b border-[#F0E8D8] last:border-0">
                  <td className="px-4 py-3">
                    <p className="font-mono font-bold text-[#2D5016]">{a.code}</p>
                    <p className="text-xs text-[#444]">{a.name}{a.email ? ` · ${a.email}` : ""}</p>
                  </td>
                  <td className="px-4 py-3 font-semibold text-[#2D5016]">{a.commission_pct}%</td>
                  <td className="px-4 py-3">
                    <span className="font-bold text-[#2D5016]">{a.sales_count}</span>
                    {a.pending_count > 0 && (
                      <span className="ml-1 text-xs text-[#F5A62A]">(+{a.pending_count} pending)</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-[#444]">{rp(a.revenue)}</td>
                  <td className="px-4 py-3 font-bold text-[#F5A62A]">{rp(a.commission_owed)}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => copyLink(a.code)}
                      className="rounded-lg bg-[#2D5016] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#1A3A0F]"
                    >
                      {copied === a.code ? "Tersalin!" : "Salin Link"}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => removeAffiliate(a.id, a.code)}
                      className="text-xs font-semibold text-red-600 hover:underline"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
