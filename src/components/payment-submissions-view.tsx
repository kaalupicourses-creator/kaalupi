"use client";

import { useEffect, useState, useMemo } from "react";

type Status = "pending" | "approved" | "rejected";

type Submission = {
  id: string;
  user_email: string;
  user_name: string | null;
  user_phone: string | null;
  course_slug: string;
  course_title: string | null;
  amount: number;
  payment_method: string;
  sender_account: string | null;
  status: Status;
  notes: string | null;
  whatsapp_sent: boolean;
  submitted_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
};

const TEAM_EMAIL_DOMAINS_OR_KEYWORDS = ["kamilalfaris", "kaalupi"]; // tweak kalau perlu

const formatRupiah = (n: number) => `Rp ${n.toLocaleString("id-ID")}`;
const formatDate = (s: string) =>
  new Date(s).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });

const METHOD_LABEL: Record<string, string> = {
  dana: "DANA",
  bca: "BCA",
  bsi: "BSI",
  qris: "QRIS",
};

const STATUS_BADGE: Record<Status, { bg: string; text: string; label: string }> = {
  pending: { bg: "bg-[#FFF3D6]", text: "text-[#5C4813]", label: "Menunggu" },
  approved: { bg: "bg-[#E8F5E9]", text: "text-[#2D5016]", label: "Approved" },
  rejected: { bg: "bg-red-50", text: "text-red-700", label: "Rejected" },
};

type Tab = "pending" | "founding" | "regular" | "rejected" | "all";

export function PaymentSubmissionsView() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<Tab>("pending");
  const [actioning, setActioning] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const r = await fetch("/api/admin/payment-submissions?status=all");
      const d = await r.json();
      if (!r.ok) {
        setError(d.error ?? "Gagal load");
        return;
      }
      setSubmissions((d.submissions ?? []) as Submission[]);
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

  const isTeam = (s: Submission) => {
    const email = s.user_email.toLowerCase();
    return TEAM_EMAIL_DOMAINS_OR_KEYWORDS.some((kw) => email.includes(kw));
  };

  const counts = useMemo(() => {
    const pending = submissions.filter((s) => s.status === "pending" && !isTeam(s)).length;
    const founding = submissions.filter(
      (s) =>
        s.status === "approved" &&
        s.course_slug === "cyber-security-mastery" &&
        !isTeam(s),
    ).length;
    const regular = submissions.filter(
      (s) =>
        s.status === "approved" &&
        s.course_slug !== "cyber-security-mastery" &&
        !isTeam(s),
    ).length;
    const rejected = submissions.filter((s) => s.status === "rejected").length;
    return { pending, founding, regular, rejected, all: submissions.length };
  }, [submissions]);

  const filtered = useMemo(() => {
    let list = submissions;
    switch (tab) {
      case "pending":
        list = list.filter((s) => s.status === "pending" && !isTeam(s));
        break;
      case "founding":
        list = list.filter(
          (s) =>
            s.status === "approved" &&
            s.course_slug === "cyber-security-mastery" &&
            !isTeam(s),
        );
        break;
      case "regular":
        list = list.filter(
          (s) =>
            s.status === "approved" &&
            s.course_slug !== "cyber-security-mastery" &&
            !isTeam(s),
        );
        break;
      case "rejected":
        list = list.filter((s) => s.status === "rejected");
        break;
      case "all":
        // keep all, but exclude team for cleanliness — toggle if needed
        break;
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (s) =>
          s.user_email.toLowerCase().includes(q) ||
          (s.user_name ?? "").toLowerCase().includes(q) ||
          (s.user_phone ?? "").includes(q) ||
          (s.course_title ?? "").toLowerCase().includes(q),
      );
    }
    return list;
  }, [submissions, tab, search]);

  async function review(id: string, action: "approve" | "reject", notes?: string) {
    setActioning(id);
    try {
      const r = await fetch("/api/admin/payment-submissions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action, notes }),
      });
      const d = await r.json();
      if (!r.ok) {
        alert(d.error ?? "Gagal review");
        return;
      }
      await load();
    } finally {
      setActioning(null);
    }
  }

  function approve(id: string) {
    if (confirm("Approve pembayaran ini? Akses course akan langsung aktif untuk user.")) {
      review(id, "approve");
    }
  }
  function reject(id: string) {
    const notes = prompt("Alasan reject (opsional):");
    if (notes !== null) review(id, "reject", notes);
  }

  return (
    <div className="space-y-5">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
          <button onClick={load} className="ml-3 font-bold underline">Retry</button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-2">
          {([
            { id: "pending", label: "Menunggu", count: counts.pending },
            { id: "founding", label: "Founding Members", count: counts.founding },
            { id: "regular", label: "Buyer biasa", count: counts.regular },
            { id: "rejected", label: "Rejected", count: counts.rejected },
            { id: "all", label: "Semua", count: counts.all },
          ] as const).map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`rounded-full px-4 py-1.5 text-xs font-bold transition ${
                tab === t.id
                  ? "bg-[#2D5016] text-white"
                  : "bg-white border border-[#F0E8D8] text-[#444] hover:border-[#F5A62A]"
              }`}
            >
              {t.label} ({t.count})
            </button>
          ))}
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari email / nama / no HP / course..."
          className="flex-1 min-w-[200px] rounded-xl border border-[#F0E8D8] bg-white px-4 py-2 text-sm focus:border-[#F5A62A] focus:outline-none"
        />
        <button
          type="button"
          onClick={load}
          disabled={loading}
          className="rounded-xl border-2 border-[#2D5016] bg-white px-4 py-2 text-sm font-bold text-[#2D5016] hover:bg-[#2D5016] hover:text-white disabled:opacity-50"
        >
          {loading ? "..." : "Refresh"}
        </button>
      </div>

      {tab === "founding" && (
        <div className="rounded-xl border border-[#F5A62A] bg-[#FFF3D6] p-4 text-sm leading-6 text-[#5C4813]">
          <strong className="block text-[#2D5016] mb-1">Founding Members ({counts.founding}/100)</strong>
          User yang udah approved Mastery — punya privilege lifetime access ke semua course.
          Tim Kaalupi (founder) ngga ditampilin di sini.
        </div>
      )}

      {/* Cards */}
      {loading && filtered.length === 0 ? (
        <p className="rounded-xl border border-[#F0E8D8] bg-white p-8 text-center text-sm text-[#999]">
          Memuat...
        </p>
      ) : filtered.length === 0 ? (
        <p className="rounded-xl border-2 border-dashed border-[#F0E8D8] bg-[#FEFBF5] p-10 text-center text-sm text-[#999]">
          Belum ada submission di tab ini.
        </p>
      ) : (
        <div className="space-y-3">
          {filtered.map((s) => (
            <article
              key={s.id}
              className="rounded-2xl border border-[#F0E8D8] bg-white p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ${STATUS_BADGE[s.status].bg} ${STATUS_BADGE[s.status].text}`}
                    >
                      {STATUS_BADGE[s.status].label}
                    </span>
                    <span className="rounded-full bg-[#FFF3D6] px-2.5 py-0.5 text-[10px] font-bold text-[#5C4813]">
                      {METHOD_LABEL[s.payment_method] ?? s.payment_method}
                    </span>
                    {s.course_slug === "cyber-security-mastery" && (
                      <span className="rounded-full bg-[#F5A62A] px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-[#2D5016]">
                        Mastery / Founding
                      </span>
                    )}
                  </div>
                  <p className="text-base font-extrabold text-[#2D5016]">
                    {s.user_name || s.user_email}
                  </p>
                  <p className="text-sm text-[#5C4813]">{s.user_email}</p>
                  {s.user_phone && (
                    <p className="text-xs text-[#5C4813] mt-0.5">📱 {s.user_phone}</p>
                  )}
                  {s.sender_account && (
                    <p className="text-xs text-[#5C4813] mt-0.5">
                      Pengirim: <strong>{s.sender_account}</strong>
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-xl font-extrabold text-[#F5A62A]">
                    {formatRupiah(s.amount)}
                  </p>
                  <p className="text-xs text-[#5C4813]">{s.course_title ?? s.course_slug}</p>
                  <p className="mt-1 text-[10px] text-[#999]">
                    Submit: {formatDate(s.submitted_at)}
                  </p>
                  {s.reviewed_at && (
                    <p className="text-[10px] text-[#999]">
                      Review: {formatDate(s.reviewed_at)} oleh {s.reviewed_by}
                    </p>
                  )}
                </div>
              </div>

              {s.notes && (
                <p className="mt-3 rounded-lg bg-[#FEFBF5] px-3 py-2 text-xs italic text-[#5C4813]">
                  Note: {s.notes}
                </p>
              )}

              {s.status === "pending" && (
                <div className="mt-4 flex flex-wrap gap-2 border-t border-[#F0E8D8] pt-4">
                  <button
                    type="button"
                    onClick={() => approve(s.id)}
                    disabled={actioning === s.id}
                    className="rounded-lg bg-[#7AB648] px-4 py-2 text-sm font-bold text-white hover:opacity-90 disabled:opacity-50"
                  >
                    ✓ Approve & Aktifin Course
                  </button>
                  <button
                    type="button"
                    onClick={() => reject(s.id)}
                    disabled={actioning === s.id}
                    className="rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50 disabled:opacity-50"
                  >
                    ✗ Reject
                  </button>
                  <a
                    href={`mailto:${s.user_email}`}
                    className="rounded-lg border border-[#F0E8D8] bg-white px-4 py-2 text-sm font-semibold text-[#2D5016] hover:border-[#F5A62A]"
                  >
                    Email user
                  </a>
                  {s.user_phone && (
                    <a
                      href={`https://wa.me/${s.user_phone.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg bg-[#25D366] px-4 py-2 text-sm font-bold text-white hover:opacity-90"
                    >
                      Chat WA
                    </a>
                  )}
                </div>
              )}
            </article>
          ))}
        </div>
      )}

      <p className="text-xs text-[#5C4813]">
        Menampilkan {filtered.length} dari {submissions.length} submission. Tim Kaalupi otomatis
        di-exclude dari tab Founding/Regular.
      </p>
    </div>
  );
}
