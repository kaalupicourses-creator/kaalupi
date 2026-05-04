"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const categories = [
  "Career",
  "Programming",
  "Network Engineer",
  "Cyber Security",
  "AI",
  "Designer",
  "General",
];

export function BlogForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    title: "",
    category: "Career",
    excerpt: "",
    content: "",
    published: "true",
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
      const res = await fetch("/api/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = (await res.json()) as { success?: boolean; error?: string; slug?: string };

      if (!res.ok || !data.success) {
        setError(data.error ?? "Gagal mempublish artikel.");
        return;
      }

      setSuccess("Artikel berhasil dipublish!");
      setTimeout(() => router.push("/blog"), 1500);
    } catch {
      setError("Terjadi kesalahan jaringan.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
          {success}
        </div>
      )}

      {/* Title */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-[#2D5016] mb-2">
          Judul Artikel *
        </label>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          required
          placeholder="Contoh: Cara Belajar AI dalam 30 Hari"
          className="w-full rounded-xl border border-[#F0E8D8] bg-white px-4 py-3 text-sm text-[#2D5016] placeholder-[#999] focus:border-[#F5A62A] focus:outline-none focus:ring-2 focus:ring-[#F5A62A]/20"
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-[#2D5016] mb-2">
          Kategori
        </label>
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="w-full rounded-xl border border-[#F0E8D8] bg-white px-4 py-3 text-sm text-[#2D5016] focus:border-[#F5A62A] focus:outline-none focus:ring-2 focus:ring-[#F5A62A]/20"
        >
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Excerpt */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-[#2D5016] mb-2">
          Ringkasan (excerpt) *
        </label>
        <textarea
          name="excerpt"
          value={form.excerpt}
          onChange={handleChange}
          required
          rows={2}
          placeholder="Satu atau dua kalimat yang menggambarkan isi artikel."
          className="w-full rounded-xl border border-[#F0E8D8] bg-white px-4 py-3 text-sm text-[#2D5016] placeholder-[#999] focus:border-[#F5A62A] focus:outline-none focus:ring-2 focus:ring-[#F5A62A]/20 resize-none"
        />
      </div>

      {/* Content */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-[#2D5016] mb-2">
          Isi Artikel *
        </label>
        <p className="mb-2 text-xs text-[#444444]">
          Pisahkan setiap paragraf dengan baris kosong (Enter dua kali).
        </p>
        <textarea
          name="content"
          value={form.content}
          onChange={handleChange}
          required
          rows={14}
          placeholder={"Paragraf pertama...\n\nParagraf kedua...\n\nParagraf ketiga..."}
          className="w-full rounded-xl border border-[#F0E8D8] bg-white px-4 py-3 text-sm text-[#2D5016] placeholder-[#999] focus:border-[#F5A62A] focus:outline-none focus:ring-2 focus:ring-[#F5A62A]/20 font-mono leading-7"
        />
      </div>

      {/* Published */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-[#2D5016] mb-2">
          Status
        </label>
        <select
          name="published"
          value={form.published}
          onChange={handleChange}
          className="w-full rounded-xl border border-[#F0E8D8] bg-white px-4 py-3 text-sm text-[#2D5016] focus:border-[#F5A62A] focus:outline-none focus:ring-2 focus:ring-[#F5A62A]/20"
        >
          <option value="true">Publish sekarang</option>
          <option value="false">Simpan sebagai draft</option>
        </select>
      </div>

      <div className="flex gap-4 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-[#F5A62A] px-8 py-3 text-sm font-bold text-[#2D5016] transition hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "Memproses..." : "Publish Artikel"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-xl border-2 border-[#2D5016] px-6 py-3 text-sm font-semibold text-[#2D5016] transition hover:bg-[#2D5016] hover:text-white"
        >
          Batal
        </button>
      </div>
    </form>
  );
}
