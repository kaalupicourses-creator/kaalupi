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
  role?: string;
};

export function CourseStudio({ courses, initialSlug, role }: Props) {
  const router = useRouter();
  const isAdmin = role === "admin" || role === "super_admin";
  const [selectedSlug, setSelectedSlug] = useState(initialSlug);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeModule, setActiveModule] = useState(0);
  const [editing, setEditing] = useState<Partial<Material> | null>(null);
  const [toast, setToast] = useState<{ kind: "ok" | "err"; msg: string } | null>(null);
  // Section rename state
  const [renamingModule, setRenamingModule] = useState<number | null>(null);
  const [renameValue, setRenameValue] = useState("");
  // Price editing state (admin only)
  const [editingPrice, setEditingPrice] = useState(false);
  const [priceValue, setPriceValue] = useState("");

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

  // eslint-disable-next-line react-hooks/set-state-in-effect
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
    setEditing({
      course_slug: selectedSlug,
      title: "",
      content: "",
      video_url: "",
      module_index: activeModule,
      order_index: moduleMaterials.length,
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

  async function saveRenameModule() {
    if (!course || renamingModule === null) return;
    const trimmed = renameValue.trim();
    if (!trimmed) { setToast({ kind: "err", msg: "Nama section tidak boleh kosong" }); return; }
    const newModules = course.modules.map((m, i) => i === renamingModule ? trimmed : m);
    setLoading(true);
    try {
      const res = await fetch(`/api/courses/${selectedSlug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ modules: newModules }),
      });
      const data = (await res.json()) as { success?: boolean; error?: string };
      if (!res.ok || !data.success) throw new Error(data.error ?? "Gagal rename");
      setToast({ kind: "ok", msg: "Nama section diupdate" });
      setRenamingModule(null);
      router.refresh();
    } catch (e) {
      setToast({ kind: "err", msg: e instanceof Error ? e.message : "Gagal rename" });
    } finally {
      setLoading(false);
    }
  }

  async function savePrice() {
    const price = parseInt(priceValue.replace(/\D/g, ""), 10);
    if (!Number.isFinite(price) || price < 0) {
      setToast({ kind: "err", msg: "Harga tidak valid" });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/courses/${selectedSlug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ price }),
      });
      const data = (await res.json()) as { success?: boolean; error?: string };
      if (!res.ok || !data.success) throw new Error(data.error ?? "Gagal simpan harga");
      setToast({ kind: "ok", msg: `Harga diupdate ke Rp ${price.toLocaleString("id-ID")}` });
      setEditingPrice(false);
      router.refresh();
    } catch (e) {
      setToast({ kind: "err", msg: e instanceof Error ? e.message : "Gagal simpan harga" });
    } finally {
      setLoading(false);
    }
  }

  const moduleMaterials = materials.filter((m) => m.module_index === activeModule);

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      {/* SIDEBAR */}
      <aside className="space-y-4">
        {/* Course selector */}
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
              <p>{course.modules.length} section · {materials.length} materi total</p>
              <p>Harga: {course.price === 0 ? "Gratis" : `Rp ${course.price.toLocaleString("id-ID")}`}</p>
            </div>
          )}
        </div>

        {/* Module/Section nav */}
        <div className="rounded-2xl border border-[#F0E8D8] bg-white p-4">
          <p className="text-xs font-bold uppercase tracking-wider text-[#2D5016] mb-3">
            Section
          </p>
          <div className="space-y-1">
            {course?.modules.map((mod, idx) => {
              const count = materials.filter((m) => m.module_index === idx).length;
              const isRenaming = renamingModule === idx;
              return (
                <div key={idx}>
                  {isRenaming ? (
                    <div className="rounded-lg border border-[#F5A62A] bg-[#FFF3D6] p-2 space-y-1.5">
                      <input
                        autoFocus
                        value={renameValue}
                        onChange={(e) => setRenameValue(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") saveRenameModule(); if (e.key === "Escape") setRenamingModule(null); }}
                        className="w-full rounded-lg border border-[#F0E8D8] px-2 py-1 text-xs"
                      />
                      <div className="flex gap-1">
                        <button onClick={saveRenameModule} disabled={loading} className="flex-1 rounded bg-[#F5A62A] py-1 text-[10px] font-bold text-[#2D5016]">Simpan</button>
                        <button onClick={() => setRenamingModule(null)} className="flex-1 rounded border border-[#F0E8D8] py-1 text-[10px] text-[#444]">Batal</button>
                      </div>
                    </div>
                  ) : (
                    <div className={`group flex items-center gap-1 rounded-lg transition ${activeModule === idx ? "bg-[#F5A62A]" : "hover:bg-[#FEFBF5]"}`}>
                      <button
                        onClick={() => { setActiveModule(idx); setEditing(null); }}
                        className={`flex-1 text-left px-3 py-2 text-sm ${activeModule === idx ? "text-[#2D5016] font-bold" : "text-[#444444]"}`}
                      >
                        <span className="font-semibold">{idx + 1}.</span> {mod}
                        <span className="ml-1.5 text-xs opacity-60">({count})</span>
                      </button>
                      <button
                        onClick={() => { setRenamingModule(idx); setRenameValue(mod); }}
                        className="mr-1 rounded px-1.5 py-1 text-[10px] opacity-0 group-hover:opacity-60 hover:!opacity-100 transition"
                        title="Rename section"
                      >✏️</button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="rounded-2xl border border-[#F0E8D8] bg-white p-4 space-y-2">
          <button
            onClick={startNew}
            className="w-full rounded-xl bg-[#F5A62A] px-4 py-2.5 text-sm font-bold text-[#2D5016] hover:opacity-90 transition"
          >
            + Tambah Materi
          </button>
          <a
            href={`/access/${selectedSlug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full rounded-xl border-2 border-[#2D5016] px-4 py-2.5 text-center text-sm font-semibold text-[#2D5016] hover:bg-[#2D5016] hover:text-white transition"
          >
            👁 Preview Tampilan Student
          </a>
        </div>

        {/* Price editor — admin only */}
        {isAdmin && course && (
          <div className="rounded-2xl border border-[#F0E8D8] bg-white p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-[#2D5016] mb-3">
              Harga Course
            </p>
            {editingPrice ? (
              <div className="space-y-2">
                <div className="flex items-center gap-1 text-xs text-[#444]">
                  <span>Rp</span>
                  <input
                    autoFocus
                    type="text"
                    value={priceValue}
                    onChange={(e) => setPriceValue(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") savePrice(); if (e.key === "Escape") setEditingPrice(false); }}
                    placeholder="199000"
                    className="flex-1 rounded-lg border border-[#F0E8D8] px-2 py-1 text-sm"
                  />
                </div>
                <div className="flex gap-1">
                  <button onClick={savePrice} disabled={loading} className="flex-1 rounded-lg bg-[#F5A62A] py-1.5 text-xs font-bold text-[#2D5016]">Simpan</button>
                  <button onClick={() => setEditingPrice(false)} className="flex-1 rounded-lg border border-[#F0E8D8] py-1.5 text-xs text-[#444]">Batal</button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-[#2D5016]">
                  Rp {course.price.toLocaleString("id-ID")}
                </span>
                <button
                  onClick={() => { setEditingPrice(true); setPriceValue(String(course.price)); }}
                  className="rounded-lg border border-[#F0E8D8] px-3 py-1 text-xs font-semibold text-[#444] hover:border-[#F5A62A] hover:text-[#2D5016] transition"
                >
                  Ubah
                </button>
              </div>
            )}
          </div>
        )}
      </aside>

      {/* MAIN */}
      <main className="space-y-4">
        {toast && (
          <div className={`rounded-xl px-4 py-3 text-sm font-semibold ${
            toast.kind === "ok"
              ? "bg-green-50 border border-green-200 text-green-800"
              : "bg-red-50 border border-red-200 text-red-800"
          }`}>
            {toast.kind === "ok" ? "✅ " : "⚠️ "}{toast.msg}
          </div>
        )}

        {/* Header section aktif */}
        <div className="rounded-2xl border border-[#F0E8D8] bg-white p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-extrabold text-[#2D5016]">
                Section {activeModule + 1}: {course?.modules[activeModule]}
              </h2>
              <p className="text-xs text-[#444444] mt-1">
                {moduleMaterials.length} materi · klik Edit di card materi untuk ubah isi atau URL video
              </p>
            </div>
            <button
              onClick={startNew}
              className="rounded-xl bg-[#F5A62A] px-4 py-2 text-sm font-bold text-[#2D5016] hover:opacity-90"
            >
              + Tambah
            </button>
          </div>

          {loading && materials.length === 0 ? (
            <p className="text-sm text-[#999] py-8 text-center">Memuat...</p>
          ) : moduleMaterials.length === 0 ? (
            <div className="rounded-xl border-2 border-dashed border-[#F0E8D8] py-10 text-center">
              <p className="text-sm text-[#999]">Belum ada materi di section ini.</p>
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
                        {m.video_url && (
                          <span className="rounded-full bg-blue-50 px-2 py-0.5 text-blue-700">▶ Video</span>
                        )}
                        {m.content && (
                          <span className="rounded-full bg-green-50 px-2 py-0.5 text-green-700">
                            Artikel ({m.content.length} char)
                          </span>
                        )}
                        {!m.video_url && !m.content && (
                          <span className="rounded-full bg-yellow-50 px-2 py-0.5 text-yellow-800">Kosong</span>
                        )}
                      </div>
                    </div>
                    {/* Reorder */}
                    <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition">
                      <button
                        onClick={() => moveMaterial(m.id, "up")}
                        disabled={idx === 0}
                        className="text-xs px-2 py-1 rounded hover:bg-white disabled:opacity-30"
                        title="Naik"
                      >↑</button>
                      <button
                        onClick={() => moveMaterial(m.id, "down")}
                        disabled={idx === moduleMaterials.length - 1}
                        className="text-xs px-2 py-1 rounded hover:bg-white disabled:opacity-30"
                        title="Turun"
                      >↓</button>
                    </div>
                    {/* Actions */}
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
              {editing.id ? "Edit Materi" : "Tambah Materi Baru"}
            </h3>

            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#2D5016] mb-1">
                    Section
                  </label>
                  <select
                    value={editing.module_index ?? 0}
                    onChange={(e) => setEditing({ ...editing, module_index: parseInt(e.target.value) })}
                    className="w-full rounded-xl border border-[#F0E8D8] px-3 py-2 text-sm"
                  >
                    {course?.modules.map((mod, idx) => (
                      <option key={idx} value={idx}>{idx + 1}. {mod}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-[#2D5016] mb-1">
                    Urutan di Section
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={editing.order_index ?? 0}
                    onChange={(e) => setEditing({ ...editing, order_index: parseInt(e.target.value) })}
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
                  placeholder="Contoh: Hacker vs Cracker — Meluruskan Mitos"
                  className="w-full rounded-xl border border-[#F0E8D8] px-3 py-2.5 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#2D5016] mb-1">
                  URL Video
                  <span className="ml-1 font-normal text-[#999] normal-case">(YouTube unlisted / Drive / .mp4)</span>
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
                  Konten Artikel
                  <span className="ml-1 font-normal text-[#999] normal-case">(HTML — boleh kosong kalau cuma video)</span>
                </label>
                <textarea
                  value={editing.content ?? ""}
                  onChange={(e) => setEditing({ ...editing, content: e.target.value })}
                  rows={10}
                  placeholder={"<h2>Judul</h2>\n<p>Isi materi...</p>\n<ul><li>Poin 1</li></ul>"}
                  className="w-full rounded-xl border border-[#F0E8D8] px-3 py-2.5 text-sm font-mono leading-6"
                />
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={saveEditing}
                  disabled={loading}
                  className="rounded-xl bg-[#F5A62A] px-6 py-2.5 text-sm font-bold text-[#2D5016] hover:opacity-90 disabled:opacity-60"
                >
                  {loading ? "Menyimpan..." : editing.id ? "Update" : "Simpan"}
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
      </main>
    </div>
  );
}
