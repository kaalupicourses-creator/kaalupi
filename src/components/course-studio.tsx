"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { Course } from "@/lib/data";

type Material = {
  id: string;
  course_slug: string;
  title: string;
  content: string | null;
  video_url: string | null;
  module_index: number;
  order_index: number;
  created_at: string;
};

type Props = {
  courses: Course[];
  initialSlug: string;
};

export function CourseStudio({ courses, initialSlug }: Props) {
  const router = useRouter();
  const [selectedSlug, setSelectedSlug] = useState(initialSlug);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeModule, setActiveModule] = useState(0);
  const [editing, setEditing] = useState<Partial<Material> | null>(null);
  const [showAI, setShowAI] = useState(false);
  const [showBulk, setShowBulk] = useState(false);
  const [autoFilling, setAutoFilling] = useState(false);
  const [toast, setToast] = useState<{ kind: "ok" | "err"; msg: string } | null>(null);

  const course = courses.find((c) => c.slug === selectedSlug);

  const fetchMaterials = useCallback(async (slug: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/course-materials?course_slug=${slug}&staff=1`);
      const data = (await res.json()) as { materials?: Material[]; error?: string };
      if (!res.ok) throw new Error(data.error);
      setMaterials(data.materials ?? []);
    } catch (e) {
      setToast({ kind: "err", msg: e instanceof Error ? e.message : "Gagal memuat materi" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedSlug) fetchMaterials(selectedSlug);
  }, [selectedSlug, fetchMaterials]);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  function startNew() {
    if (!course) return;
    const moduleMaterials = materials.filter((m) => m.module_index === activeModule);
    const nextOrder = moduleMaterials.length;
    setEditing({
      course_slug: selectedSlug,
      title: "",
      content: "",
      video_url: "",
      module_index: activeModule,
      order_index: nextOrder,
    });
  }

  function startEdit(m: Material) {
    setEditing({ ...m });
  }

  async function saveEditing() {
    if (!editing) return;
    if (!editing.title?.trim()) {
      setToast({ kind: "err", msg: "Judul wajib diisi" });
      return;
    }

    setLoading(true);
    try {
      const isUpdate = !!editing.id;
      const url = isUpdate ? `/api/course-materials/${editing.id}` : "/api/course-materials";
      const method = isUpdate ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          course_slug: editing.course_slug,
          title: editing.title,
          content: editing.content ?? "",
          video_url: editing.video_url ?? "",
          module_index: editing.module_index,
          order_index: editing.order_index,
        }),
      });
      const data = (await res.json()) as { success?: boolean; error?: string };
      if (!res.ok || !data.success) throw new Error(data.error ?? "Gagal simpan");

      setToast({ kind: "ok", msg: isUpdate ? "Materi diupdate" : "Materi ditambahkan" });
      setEditing(null);
      await fetchMaterials(selectedSlug);
    } catch (e) {
      setToast({ kind: "err", msg: e instanceof Error ? e.message : "Gagal simpan" });
    } finally {
      setLoading(false);
    }
  }

  async function deleteMaterial(id: string) {
    if (!confirm("Yakin hapus materi ini?")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/course-materials/${id}`, { method: "DELETE" });
      const data = (await res.json()) as { success?: boolean; error?: string };
      if (!res.ok || !data.success) throw new Error(data.error ?? "Gagal hapus");
      setToast({ kind: "ok", msg: "Materi dihapus" });
      await fetchMaterials(selectedSlug);
    } catch (e) {
      setToast({ kind: "err", msg: e instanceof Error ? e.message : "Gagal hapus" });
    } finally {
      setLoading(false);
    }
  }

  async function autoFillCourse() {
    if (!course) return;
    if (
      !confirm(
        `Auto-generate materi untuk SEMUA ${course.modules.length} modul "${course.title}"?\n\nIni butuh ~30 detik. Materi yang udah ada ngga akan dihapus (skip).`
      )
    )
      return;
    setAutoFilling(true);
    try {
      const res = await fetch("/api/ai/auto-fill-course", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ course_slug: selectedSlug }),
      });
      const data = (await res.json()) as {
        success?: boolean;
        summary?: { generated: number; skipped: number; errors: number };
        error?: string;
      };
      if (!res.ok || !data.summary) throw new Error(data.error ?? "Gagal auto-fill");
      const { generated, skipped, errors } = data.summary;
      setToast({
        kind: errors === 0 ? "ok" : "err",
        msg: `${generated} dibuat, ${skipped} di-skip${errors > 0 ? `, ${errors} error` : ""}`,
      });
      await fetchMaterials(selectedSlug);
    } catch (e) {
      setToast({ kind: "err", msg: e instanceof Error ? e.message : "Auto-fill gagal" });
    } finally {
      setAutoFilling(false);
    }
  }

  async function moveMaterial(id: string, direction: "up" | "down") {
    const m = materials.find((x) => x.id === id);
    if (!m) return;
    const siblings = materials
      .filter((x) => x.module_index === m.module_index)
      .sort((a, b) => a.order_index - b.order_index);
    const idx = siblings.findIndex((x) => x.id === id);
    const swapWith = direction === "up" ? siblings[idx - 1] : siblings[idx + 1];
    if (!swapWith) return;

    setLoading(true);
    try {
      // Swap order_index via temp value to avoid unique constraint clash
      await fetch(`/api/course-materials/${m.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_index: 9999 }),
      });
      await fetch(`/api/course-materials/${swapWith.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_index: m.order_index }),
      });
      await fetch(`/api/course-materials/${m.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_index: swapWith.order_index }),
      });
      await fetchMaterials(selectedSlug);
    } catch {
      setToast({ kind: "err", msg: "Gagal pindah urutan" });
    } finally {
      setLoading(false);
    }
  }

  const moduleMaterials = materials.filter((m) => m.module_index === activeModule);

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      {/* SIDEBAR — Course + Module nav */}
      <aside className="space-y-4">
        <div className="rounded-2xl border border-[#F0E8D8] bg-white p-4">
          <label className="block text-xs font-bold uppercase tracking-wider text-[#2D5016] mb-2">
            Course Aktif
          </label>
          <select
            value={selectedSlug}
            onChange={(e) => {
              setSelectedSlug(e.target.value);
              setActiveModule(0);
              setEditing(null);
              router.replace(`/dashboard/studio?course=${e.target.value}`);
            }}
            className="w-full rounded-xl border border-[#F0E8D8] bg-[#FEFBF5] px-3 py-2 text-sm font-semibold text-[#2D5016] focus:border-[#F5A62A] focus:outline-none"
          >
            {courses.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.title}
              </option>
            ))}
          </select>
          {course && (
            <div className="mt-3 space-y-1 text-xs text-[#444444]">
              <p>{course.modules.length} modul</p>
              <p>Level: {course.level}</p>
              <p>{course.price === 0 ? "Gratis" : `Rp ${course.price.toLocaleString("id-ID")}`}</p>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-[#F0E8D8] bg-white p-4">
          <p className="text-xs font-bold uppercase tracking-wider text-[#2D5016] mb-3">
            Modul Course
          </p>
          <div className="space-y-1">
            {course?.modules.map((mod, idx) => {
              const count = materials.filter((m) => m.module_index === idx).length;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveModule(idx);
                    setEditing(null);
                  }}
                  className={`w-full text-left rounded-lg px-3 py-2 text-sm transition ${
                    activeModule === idx
                      ? "bg-[#F5A62A] text-[#2D5016] font-bold"
                      : "text-[#444444] hover:bg-[#FEFBF5]"
                  }`}
                >
                  <span className="font-semibold">{idx + 1}.</span> {mod}
                  <span className="ml-2 text-xs opacity-70">({count})</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-[#F0E8D8] bg-white p-4 space-y-2">
          <button
            onClick={autoFillCourse}
            disabled={autoFilling}
            className="w-full rounded-xl bg-gradient-to-r from-[#7AB648] to-[#2D5016] px-4 py-3 text-sm font-bold text-white hover:opacity-90 disabled:opacity-60 transition"
          >
            {autoFilling ? "⏳ Generating..." : "⚡ Auto-Fill Semua Modul"}
          </button>
          <p className="text-[10px] text-[#444] text-center leading-4">
            Sekali klik, AI bikin materi pembuka untuk semua modul.
          </p>
          <div className="border-t border-[#F0E8D8] my-2" />
          <button
            onClick={startNew}
            className="w-full rounded-xl bg-[#F5A62A] px-4 py-2.5 text-sm font-bold text-[#2D5016] hover:opacity-90"
          >
            + Tambah Materi
          </button>
          <button
            onClick={() => setShowAI(true)}
            className="w-full rounded-xl bg-[#E3F2FD] px-4 py-2.5 text-sm font-bold text-[#1565C0] hover:bg-[#1565C0] hover:text-white border border-[#1565C0] transition"
          >
            🤖 AI Generate (1 materi)
          </button>
          <button
            onClick={() => setShowBulk(true)}
            className="w-full rounded-xl border-2 border-[#2D5016] px-4 py-2.5 text-sm font-semibold text-[#2D5016] hover:bg-[#2D5016] hover:text-white transition"
          >
            📥 Bulk Import (JSON)
          </button>
        </div>
      </aside>

      {/* MAIN — List + editor */}
      <main className="space-y-4">
        {toast && (
          <div
            className={`rounded-xl px-4 py-3 text-sm font-semibold ${
              toast.kind === "ok"
                ? "bg-green-50 border border-green-200 text-green-800"
                : "bg-red-50 border border-red-200 text-red-800"
            }`}
          >
            {toast.kind === "ok" ? "✅ " : "⚠️ "}
            {toast.msg}
          </div>
        )}

        {/* List materi modul aktif */}
        <div className="rounded-2xl border border-[#F0E8D8] bg-white p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-extrabold text-[#2D5016]">
                Modul {activeModule + 1}: {course?.modules[activeModule]}
              </h2>
              <p className="text-xs text-[#444444] mt-1">
                {moduleMaterials.length} materi · Klik materi untuk edit
              </p>
            </div>
          </div>

          {loading && materials.length === 0 ? (
            <p className="text-sm text-[#999] py-8 text-center">Memuat...</p>
          ) : moduleMaterials.length === 0 ? (
            <div className="rounded-xl border-2 border-dashed border-[#F0E8D8] py-10 text-center">
              <p className="text-sm text-[#999]">Belum ada materi di modul ini.</p>
              <button
                onClick={startNew}
                className="mt-3 rounded-lg bg-[#F5A62A] px-4 py-2 text-xs font-bold text-[#2D5016]"
              >
                + Tambah materi pertama
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {moduleMaterials.map((m, idx) => (
                <div
                  key={m.id}
                  className={`group rounded-xl border p-4 transition ${
                    editing?.id === m.id
                      ? "border-[#F5A62A] bg-[#FFF3D6]/50"
                      : "border-[#F0E8D8] bg-[#FEFBF5] hover:border-[#F5A62A]"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[#FFF3D6] text-xs font-bold text-[#F5A62A]">
                      {m.order_index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[#2D5016] truncate">{m.title}</p>
                      <div className="mt-1 flex flex-wrap gap-2 text-xs text-[#444444]">
                        {m.video_url && <span className="rounded-full bg-blue-50 px-2 py-0.5 text-blue-700">▶ Video</span>}
                        {m.content && <span className="rounded-full bg-green-50 px-2 py-0.5 text-green-700">📄 Artikel ({m.content.length} char)</span>}
                        {!m.video_url && !m.content && <span className="rounded-full bg-yellow-50 px-2 py-0.5 text-yellow-800">⚠️ Kosong</span>}
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition">
                      <button
                        onClick={() => moveMaterial(m.id, "up")}
                        disabled={idx === 0}
                        className="text-xs px-2 py-1 rounded hover:bg-white disabled:opacity-30"
                        title="Naik"
                      >
                        ↑
                      </button>
                      <button
                        onClick={() => moveMaterial(m.id, "down")}
                        disabled={idx === moduleMaterials.length - 1}
                        className="text-xs px-2 py-1 rounded hover:bg-white disabled:opacity-30"
                        title="Turun"
                      >
                        ↓
                      </button>
                    </div>
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => startEdit(m)}
                        className="rounded-lg bg-[#2D5016] px-3 py-1 text-xs font-semibold text-white hover:bg-[#1A3A0F]"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteMaterial(m.id)}
                        className="rounded-lg border border-red-300 bg-white px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Editor inline */}
        {editing && (
          <div className="rounded-2xl border-2 border-[#F5A62A] bg-white p-6">
            <h3 className="text-lg font-extrabold text-[#2D5016] mb-4">
              {editing.id ? "Edit Materi" : "Materi Baru"}
            </h3>

            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#2D5016] mb-1">
                    Modul
                  </label>
                  <select
                    value={editing.module_index ?? 0}
                    onChange={(e) =>
                      setEditing({ ...editing, module_index: parseInt(e.target.value) })
                    }
                    className="w-full rounded-xl border border-[#F0E8D8] px-3 py-2 text-sm"
                  >
                    {course?.modules.map((mod, idx) => (
                      <option key={idx} value={idx}>
                        {idx + 1}. {mod}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-[#2D5016] mb-1">
                    Urutan
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={editing.order_index ?? 0}
                    onChange={(e) =>
                      setEditing({ ...editing, order_index: parseInt(e.target.value) })
                    }
                    className="w-full rounded-xl border border-[#F0E8D8] px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#2D5016] mb-1">
                  Judul Materi *
                </label>
                <input
                  value={editing.title ?? ""}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                  placeholder="Contoh: Pengenalan Prompt Engineering"
                  className="w-full rounded-xl border border-[#F0E8D8] px-3 py-2.5 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#2D5016] mb-1">
                  URL Video (YouTube/Drive/.mp4)
                </label>
                <input
                  type="url"
                  value={editing.video_url ?? ""}
                  onChange={(e) => setEditing({ ...editing, video_url: e.target.value })}
                  placeholder="https://youtube.com/watch?v=..."
                  className="w-full rounded-xl border border-[#F0E8D8] px-3 py-2.5 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#2D5016] mb-1">
                  Konten (HTML / Markdown)
                </label>
                <textarea
                  value={editing.content ?? ""}
                  onChange={(e) => setEditing({ ...editing, content: e.target.value })}
                  rows={10}
                  placeholder="<h2>Judul</h2><p>Isi materi...</p>"
                  className="w-full rounded-xl border border-[#F0E8D8] px-3 py-2.5 text-sm font-mono leading-6"
                />
                <p className="mt-1 text-xs text-[#999]">
                  Tip: pakai HTML tag biasa atau biarin AI Generate yang isiin.
                </p>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={saveEditing}
                  disabled={loading}
                  className="rounded-xl bg-[#F5A62A] px-6 py-2.5 text-sm font-bold text-[#2D5016] hover:opacity-90 disabled:opacity-60"
                >
                  {loading ? "Menyimpan..." : editing.id ? "Update Materi" : "Simpan Materi"}
                </button>
                <button
                  onClick={() => setEditing(null)}
                  className="rounded-xl border-2 border-[#2D5016] px-6 py-2.5 text-sm font-semibold text-[#2D5016] hover:bg-[#2D5016] hover:text-white"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        )}

        {/* AI Generate Modal */}
        {showAI && course && (
          <AIGenerateModal
            course={course}
            moduleIndex={activeModule}
            onClose={() => setShowAI(false)}
            onSuccess={async () => {
              setShowAI(false);
              await fetchMaterials(selectedSlug);
              setToast({ kind: "ok", msg: "AI generate selesai" });
            }}
          />
        )}

        {/* Bulk import modal */}
        {showBulk && course && (
          <BulkImportModal
            courseSlug={selectedSlug}
            onClose={() => setShowBulk(false)}
            onSuccess={async (count) => {
              setShowBulk(false);
              await fetchMaterials(selectedSlug);
              setToast({ kind: "ok", msg: `${count} materi diimport` });
            }}
          />
        )}
      </main>
    </div>
  );
}

function AIGenerateModal({
  course,
  moduleIndex,
  onClose,
  onSuccess,
}: {
  course: Course;
  moduleIndex: number;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [topic, setTopic] = useState("");
  const [length, setLength] = useState<"short" | "medium" | "long">("medium");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function generate() {
    if (!topic.trim()) {
      setError("Topik wajib diisi");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/ai/generate-material", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          course_slug: course.slug,
          course_title: course.title,
          module_title: course.modules[moduleIndex],
          module_index: moduleIndex,
          topic,
          length,
        }),
      });
      const data = (await res.json()) as { success?: boolean; error?: string };
      if (!res.ok || !data.success) throw new Error(data.error ?? "Gagal generate");
      onSuccess();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal generate");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
        <h3 className="text-xl font-extrabold text-[#2D5016]">🤖 AI Generate Materi</h3>
        <p className="mt-1 text-xs text-[#444444]">
          Untuk: <strong>{course.modules[moduleIndex]}</strong>
        </p>

        <div className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-[#2D5016] mb-1">
              Topik / Sub-Materi
            </label>
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Contoh: Cara nulis prompt yang efektif"
              className="w-full rounded-xl border border-[#F0E8D8] px-3 py-2.5 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-[#2D5016] mb-1">
              Panjang Konten
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["short", "medium", "long"] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setLength(l)}
                  className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
                    length === l
                      ? "bg-[#F5A62A] text-[#2D5016]"
                      : "bg-[#FEFBF5] text-[#444444] hover:bg-[#FFF3D6]"
                  }`}
                >
                  {l === "short" ? "Singkat" : l === "medium" ? "Sedang" : "Panjang"}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button
              onClick={generate}
              disabled={loading}
              className="flex-1 rounded-xl bg-[#1565C0] px-5 py-2.5 text-sm font-bold text-white hover:opacity-90 disabled:opacity-60"
            >
              {loading ? "Generating..." : "Generate Materi"}
            </button>
            <button
              onClick={onClose}
              className="rounded-xl border-2 border-[#2D5016] px-5 py-2.5 text-sm font-semibold text-[#2D5016]"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function BulkImportModal({
  courseSlug,
  onClose,
  onSuccess,
}: {
  courseSlug: string;
  onClose: () => void;
  onSuccess: (count: number) => void;
}) {
  const [json, setJson] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const example = JSON.stringify(
    [
      {
        title: "Pengenalan AI",
        module_index: 0,
        order_index: 0,
        video_url: "https://youtube.com/watch?v=xxx",
        content: "<p>Isi materi...</p>",
      },
    ],
    null,
    2
  );

  async function importBulk() {
    setError("");
    setLoading(true);
    try {
      const parsed = JSON.parse(json);
      if (!Array.isArray(parsed)) throw new Error("Harus berupa array JSON");
      const items = parsed.map((p) => ({ ...p, course_slug: courseSlug }));

      const res = await fetch("/api/course-materials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const data = (await res.json()) as { success?: boolean; count?: number; error?: string };
      if (!res.ok || !data.success) throw new Error(data.error ?? "Gagal import");
      onSuccess(data.count ?? 0);
    } catch (e) {
      setError(e instanceof Error ? e.message : "JSON invalid");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">
        <h3 className="text-xl font-extrabold text-[#2D5016]">📥 Bulk Import Materi</h3>
        <p className="mt-1 text-xs text-[#444444]">
          Paste array JSON. Item dengan (module_index, order_index) sama akan ter-update otomatis.
        </p>

        <textarea
          value={json}
          onChange={(e) => setJson(e.target.value)}
          rows={12}
          placeholder={example}
          className="mt-4 w-full rounded-xl border border-[#F0E8D8] px-3 py-2.5 text-xs font-mono"
        />

        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

        <div className="mt-4 flex gap-3">
          <button
            onClick={importBulk}
            disabled={loading}
            className="flex-1 rounded-xl bg-[#F5A62A] px-5 py-2.5 text-sm font-bold text-[#2D5016] hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Importing..." : "Import"}
          </button>
          <button
            onClick={() => setJson(example)}
            className="rounded-xl border-2 border-[#2D5016] px-5 py-2.5 text-sm font-semibold text-[#2D5016]"
          >
            Pakai Contoh
          </button>
          <button
            onClick={onClose}
            className="rounded-xl border-2 border-[#2D5016] px-5 py-2.5 text-sm font-semibold text-[#2D5016]"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
