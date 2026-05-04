"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
      className="grid gap-6 rounded-[2rem] border border-white/10 bg-white/5 p-8"
    >
      <div className="grid gap-6 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-300">Course Title</label>
          <input
            name="title"
            required
            placeholder="e.g. Master React Development"
            className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white placeholder:text-slate-600 outline-none focus:border-amber-300"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-300">Category</label>
          <input
            name="category"
            required
            placeholder="e.g. Programming, Cyber Security"
            className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white placeholder:text-slate-600 outline-none focus:border-amber-300"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-300">Level</label>
          <input
            name="level"
            required
            placeholder="e.g. Beginner, Intermediate"
            className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white placeholder:text-slate-600 outline-none focus:border-amber-300"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-300">Duration</label>
          <input
            name="duration"
            required
            placeholder="e.g. 12 weeks, 40 hours"
            className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white placeholder:text-slate-600 outline-none focus:border-amber-300"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-300">Price (IDR)</label>
          <input
            name="price"
            required
            type="number"
            placeholder="e.g. 250000"
            className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white placeholder:text-slate-600 outline-none focus:border-amber-300"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-300">Format</label>
          <select
            name="format"
            className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white outline-none focus:border-amber-300"
          >
            <option value="video">Video</option>
            <option value="article">Article</option>
            <option value="blended">Blended</option>
          </select>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-slate-300">Summary</label>
        <textarea
          name="summary"
          required
          rows={3}
          placeholder="Short description for course cards and previews"
          className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white placeholder:text-slate-600 outline-none focus:border-amber-300"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-slate-300">Hero Description</label>
        <textarea
          name="hero"
          required
          rows={3}
          placeholder="Positioning text for the course detail page"
          className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white placeholder:text-slate-600 outline-none focus:border-amber-300"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-slate-300">Modules</label>
        <p className="text-xs text-slate-500">One module per line</p>
        <textarea
          name="modules"
          required
          rows={4}
          placeholder="Introduction&#10;Fundamentals&#10;Advanced Topics&#10;Final Project"
          className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white placeholder:text-slate-600 outline-none focus:border-amber-300"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-slate-300">Learning Outcomes</label>
        <p className="text-xs text-slate-500">One outcome per line</p>
        <textarea
          name="outcomes"
          required
          rows={4}
          placeholder="Build real-world applications&#10;Understand core concepts&#10;Master best practices"
          className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white placeholder:text-slate-600 outline-none focus:border-amber-300"
        />
      </div>
      {error ? <p className="text-sm text-rose-300">{error}</p> : null}
      {message ? <p className="text-sm text-emerald-300">{message}</p> : null}
      <button
        type="submit"
        disabled={loading}
        className="rounded-full bg-[linear-gradient(135deg,#f97316,#facc15)] px-5 py-3 font-semibold text-slate-950 transition hover:opacity-90 disabled:opacity-60"
      >
        {loading ? "Menyimpan..." : "Publish Course"}
      </button>
    </form>
  );
}
