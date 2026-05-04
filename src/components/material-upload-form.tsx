"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Course } from "@/lib/data";

interface Props {
  courses: Course[];
}

export function MaterialUploadForm({ courses }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    course_slug: courses[0]?.slug ?? "",
    title: "",
    video_url: "",
    content: "",
    module_index: "0",
    order_index: "0",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch("/api/course-materials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = (await res.json()) as { success?: boolean; error?: string };

      if (!res.ok || !data.success) {
        setError(data.error ?? "Gagal menyimpan materi.");
        return;
      }

      setSuccess("Materi berhasil ditambahkan!");
      setForm((prev) => ({ ...prev, title: "", video_url: "", content: "" }));
    } catch {
      setError("Terjadi kesalahan jaringan.");
    } finally {
      setLoading(false);
    }
  }

  const selectedCourse = courses.find((c) => c.slug === form.course_slug);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
          ✅ {success}
        </div>
      )}

      {/* Course */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-[#2D5016] mb-2">
          Course *
        </label>
        <select
          name="course_slug"
          value={form.course_slug}
          onChange={handleChange}
          required
          className="w-full rounded-xl border border-[#F0E8D8] bg-white px-4 py-3 text-sm text-[#2D5016] focus:border-[#F5A62A] focus:outline-none focus:ring-2 focus:ring-[#F5A62A]/20"
        >
          {courses.map((c) => (
            <option key={c.slug} value={c.slug}>{c.title}</option>
          ))}
        </select>
      </div>

      {/* Modul */}
      {selectedCourse && (
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#2D5016] mb-2">
            Modul (index)
          </label>
          <select
            name="module_index"
            value={form.module_index}
            onChange={handleChange}
            className="w-full rounded-xl border border-[#F0E8D8] bg-white px-4 py-3 text-sm text-[#2D5016] focus:border-[#F5A62A] focus:outline-none focus:ring-2 focus:ring-[#F5A62A]/20"
          >
            {selectedCourse.modules.map((mod, idx) => (
              <option key={idx} value={idx}>{idx + 1}. {mod}</option>
            ))}
          </select>
        </div>
      )}

      {/* Judul Materi */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-[#2D5016] mb-2">
          Judul Materi *
        </label>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          required
          placeholder="Contoh: Pengenalan Prompt Engineering"
          className="w-full rounded-xl border border-[#F0E8D8] bg-white px-4 py-3 text-sm text-[#2D5016] placeholder-[#999] focus:border-[#F5A62A] focus:outline-none focus:ring-2 focus:ring-[#F5A62A]/20"
        />
      </div>

      {/* Video URL */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-[#2D5016] mb-2">
          URL Video
        </label>
        <p className="mb-2 text-xs text-[#444444]">
          Bisa berupa link YouTube, Google Drive, atau URL video langsung (.mp4).
        </p>
        <input
          name="video_url"
          value={form.video_url}
          onChange={handleChange}
          type="url"
          placeholder="https://youtube.com/watch?v=... atau https://..."
          className="w-full rounded-xl border border-[#F0E8D8] bg-white px-4 py-3 text-sm text-[#2D5016] placeholder-[#999] focus:border-[#F5A62A] focus:outline-none focus:ring-2 focus:ring-[#F5A62A]/20"
        />
      </div>

      {/* Konten Teks */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-[#2D5016] mb-2">
          Konten Teks (opsional)
        </label>
        <p className="mb-2 text-xs text-[#444444]">
          Catatan atau teks pendamping video. Bisa dikosongkan jika hanya upload video.
        </p>
        <textarea
          name="content"
          value={form.content}
          onChange={handleChange}
          rows={6}
          placeholder="Tulis catatan, rangkuman, atau deskripsi materi..."
          className="w-full rounded-xl border border-[#F0E8D8] bg-white px-4 py-3 text-sm text-[#2D5016] placeholder-[#999] focus:border-[#F5A62A] focus:outline-none focus:ring-2 focus:ring-[#F5A62A]/20 leading-7"
        />
      </div>

      {/* Order */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-[#2D5016] mb-2">
          Urutan dalam Modul
        </label>
        <input
          name="order_index"
          value={form.order_index}
          onChange={handleChange}
          type="number"
          min="0"
          className="w-full rounded-xl border border-[#F0E8D8] bg-white px-4 py-3 text-sm text-[#2D5016] focus:border-[#F5A62A] focus:outline-none focus:ring-2 focus:ring-[#F5A62A]/20"
        />
      </div>

      <div className="flex gap-4 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-[#F5A62A] px-8 py-3 text-sm font-bold text-[#2D5016] transition hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "Menyimpan..." : "Simpan Materi"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          className="rounded-xl border-2 border-[#2D5016] px-6 py-3 text-sm font-semibold text-[#2D5016] transition hover:bg-[#2D5016] hover:text-white"
        >
          Kembali ke Dashboard
        </button>
      </div>
    </form>
  );
}
