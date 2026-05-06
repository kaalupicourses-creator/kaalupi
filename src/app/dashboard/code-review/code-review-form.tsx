"use client";

import { useState } from "react";

interface Course {
  slug: string;
  title: string;
}

interface ReviewResult {
  review: {
    codeQuality: number;
    suggestions: string[];
    nextSteps: string[];
  };
}

export default function CodeReviewForm({ enrolledCourses }: { enrolledCourses: Course[] }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ReviewResult | null>(null);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      courseSlug: formData.get("courseSlug"),
      module: formData.get("module"),
      code: formData.get("code"),
      description: formData.get("description"),
    };

    try {
      const res = await fetch("/api/code-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to submit");
      setResult(json as ReviewResult);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-[#F0E8D8] bg-white p-8 shadow-sm">
      <h2 className="text-xl font-extrabold text-[#2D5016]">Submit Kode untuk Review</h2>

      <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
        {/* Course Selection */}
        <div>
          <label htmlFor="course" className="block text-sm font-semibold text-[#2D5016] mb-2">
            Pilih Course
          </label>
          <select
            id="course"
            name="courseSlug"
            required
            className="w-full rounded-xl border border-[#F0E8D8] bg-[#FEFBF5] px-4 py-3 text-sm text-[#2D5016] focus:border-[#F5A62A] focus:outline-none"
          >
            <option value="">-- Pilih Course --</option>
            {enrolledCourses.map((course) => (
              <option key={course.slug} value={course.slug}>
                {course.title}
              </option>
            ))}
          </select>
        </div>

        {/* Module Selection */}
        <div>
          <label htmlFor="module" className="block text-sm font-semibold text-[#2D5016] mb-2">
            Modul
          </label>
          <input
            type="text"
            id="module"
            name="module"
            placeholder="Contoh: Modul 3 - API Design"
            required
            className="w-full rounded-xl border border-[#F0E8D8] bg-[#FEFBF5] px-4 py-3 text-sm text-[#2D5016] placeholder:text-[#999999] focus:border-[#F5A62A] focus:outline-none"
          />
        </div>

        {/* Code Input */}
        <div>
          <label htmlFor="code" className="block text-sm font-semibold text-[#2D5016] mb-2">
            Kode Anda
          </label>
          <textarea
            id="code"
            name="code"
            rows={12}
            placeholder="// Paste kode Anda di sini...&#10;// Pastikan kode relatif dengan materi course"
            required
            className="w-full rounded-xl border border-[#F0E8D8] bg-[#FEFBF5] px-4 py-3 text-sm font-mono text-[#2D5016] placeholder:text-[#999999] focus:border-[#F5A62A] focus:outline-none resize-y"
          />
          <p className="mt-2 text-xs text-[#444444]">
            Tip: Sertakan komentar yang menjelaskan apa yang kode ini lakukan untuk hasil review yang lebih baik.
          </p>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-semibold text-[#2D5016] mb-2">
            Deskripsi / Pertanyaan (Opsional)
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            placeholder="Jelaskan apa yang ingin Anda review atau pertanyaan spesifik..."
            className="w-full rounded-xl border border-[#F0E8D8] bg-[#FEFBF5] px-4 py-3 text-sm text-[#2D5016] placeholder:text-[#999999] focus:border-[#F5A62A] focus:outline-none resize-y"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-[#F5A62A] px-6 py-3 text-sm font-bold text-[#2D5016] transition hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "⏳ Sedang menganalisis..." : "🤖 Submit untuk AI Review"}
        </button>
      </form>

      {/* Error Message */}
      {error && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Review Result */}
      {result && result.review && (
        <div className="mt-8 rounded-2xl border border-[#7AB648] bg-[#FEFBF5] p-6">
          <h3 className="text-lg font-extrabold text-[#2D5016] mb-4">📋 Hasil Review</h3>

          {/* Quality Score */}
          <div className="mb-6 rounded-xl bg-white p-4 border border-[#F0E8D8]">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-[#2D5016]">Code Quality Score</span>
              <span className={`text-2xl font-extrabold ${
                result.review.codeQuality >= 80 ? "text-[#7AB648]" :
                result.review.codeQuality >= 60 ? "text-[#F5A62A]" : "text-red-500"
              }`}>
                {result.review.codeQuality}/100
              </span>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[#F0E8D8]">
              <div
                className={`h-full rounded-full transition-all ${
                  result.review.codeQuality >= 80 ? "bg-[#7AB648]" :
                  result.review.codeQuality >= 60 ? "bg-[#F5A62A]" : "bg-red-500"
                }`}
                style={{ width: `${result.review.codeQuality}%` }}
              />
            </div>
          </div>

          {/* Suggestions */}
          {result.review.suggestions && result.review.suggestions.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-bold text-[#2D5016] mb-2">💡 Saran Perbaikan</h4>
              <ul className="space-y-2">
                {result.review.suggestions.map((suggestion: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[#444444]">
                    <span className="text-[#F5A62A] mt-0.5">•</span>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Next Steps */}
          {result.review.nextSteps && (
            <div className="mt-4 rounded-xl bg-[#FFF3D6] p-4">
              <h4 className="text-sm font-bold text-[#5C4813] mb-2">🚀 Langkah Selanjutnya</h4>
              <ul className="space-y-1">
                {result.review.nextSteps.map((step: string, i: number) => (
                  <li key={i} className="text-xs text-[#5C4813]">✓ {step}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
