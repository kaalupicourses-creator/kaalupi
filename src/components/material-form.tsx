"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const inputClass = "rounded-xl border border-[#F0E8D8] bg-[#FEFBF5] px-4 py-3 text-[#444444] placeholder:text-[#999] outline-none focus:border-[#F5A62A] focus:ring-2 focus:ring-[#F5A62A]/20 transition";
const labelClass = "text-sm font-semibold text-[#2D5016]";

export function MaterialForm() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setMessage("");
    setError("");

    const response = await fetch("/api/materials", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: formData.get("title"),
        category: formData.get("category"),
        level: formData.get("level"),
        duration: formData.get("duration"),
        price: formData.get("price"),
        summary: formData.get("summary"),
        hero: formData.get("hero"),
        modules: formData.get("modules"),
        outcomes: formData.get("outcomes"),
        format: formData.get("format"),
      }),
    });

    const payload = (await response.json()) as { error?: string; message?: string };

    if (!response.ok) {
      setError(payload.error ?? "Gagal menyimpan course.");
      setLoading(false);
      return;
    }

    setMessage(payload.message ?? "Course berhasil disimpan.");
    setLoading(false);
    router.refresh();
  }

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();
        await handleSubmit(new FormData(event.currentTarget));
      }}
      className="grid gap-6 rounded-2xl border border-[#F0E8D8] bg-white p-8 shadow-sm"
    >
      <div className="grid gap-6 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label className={labelClass}>Judul Course</label>
          <input
            name="title"
            required
            placeholder="e.g. Cyber Security untuk Pemula"
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className={labelClass}>Kategori</label>
          <input
            name="category"
            required
            placeholder="e.g. Programming, Cyber Security"
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className={labelClass}>Level</label>
          <input
            name="level"
            required
            placeholder="e.g. Pemula, Menengah"
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className={labelClass}>Durasi</label>
          <input
            name="duration"
            required
            placeholder="e.g. 12 minggu, 40 jam"
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className={labelClass}>Harga (IDR)</label>
          <input
            name="price"
            required
            type="number"
            placeholder="e.g. 250000"
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className={labelClass}>Format</label>
          <select
            name="format"
            className={inputClass}
          >
            <option value="video">Video</option>
            <option value="article">Article</option>
            <option value="blended">Blended</option>
          </select>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <label className={labelClass}>Summary</label>
        <textarea
          name="summary"
          required
          rows={3}
          placeholder="Deskripsi singkat untuk card dan preview course"
          className={inputClass}
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className={labelClass}>Hero Description</label>
        <textarea
          name="hero"
          required
          rows={3}
          placeholder="Teks positioning untuk halaman detail course"
          className={inputClass}
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className={labelClass}>Modul</label>
        <p className="text-xs text-[#444444]">Satu modul per baris</p>
        <textarea
          name="modules"
          required
          rows={4}
          placeholder={"Pengantar AI\nDasar Machine Learning\nTopic Lanjutan\nProject Akhir"}
          className={inputClass}
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className={labelClass}>Learning Outcomes</label>
        <p className="text-xs text-[#444444]">Satu outcome per baris</p>
        <textarea
          name="outcomes"
          required
          rows={4}
          placeholder={"Membangun aplikasi nyata\nMemahami konsep inti\nMenguasai best practices"}
          className={inputClass}
        />
      </div>
      {error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4">
          <p className="text-sm font-medium text-rose-700">{error}</p>
        </div>
      ) : null}
      {message ? (
        <div className="rounded-xl border border-[#7AB648]/30 bg-[#E8F5E9] p-4">
          <p className="text-sm font-medium text-[#2D5016]">{message}</p>
        </div>
      ) : null}
      <button
        type="submit"
        disabled={loading}
        className="rounded-xl bg-[#F5A62A] px-5 py-3 font-bold text-[#2D5016] transition hover:opacity-90 disabled:opacity-60"
      >
        {loading ? "Menyimpan..." : "Publish Course"}
      </button>
    </form>
  );
}
