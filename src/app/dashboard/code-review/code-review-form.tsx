"use client";

import { useState } from "react";

type Step = "input" | "questioning" | "analyzing" | "result";

interface Question {
  id: string;
  question: string;
  options: { label: string; value: string }[];
  multiSelect?: boolean;
}

interface ReviewResult {
  summary: string;
  explanation: string;
  bugs: string[];
  suggestions: string[];
  improvements: string[];
  codeQuality: number;
}

export default function CodeReviewForm() {
  const [step, setStep] = useState<Step>("input");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Conversation state
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [currentSelections, setCurrentSelections] = useState<string[]>([]);

  // Result
  const [result, setResult] = useState<ReviewResult | null>(null);

  const handleInitialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/code-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          description,
          answers: {},
          stage: "initial",
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to analyze code");

      if (json.nextQuestion) {
        setQuestions([json.nextQuestion]);
        setCurrentQuestionIndex(0);
        setAnswers({});
        setCurrentSelections([]);
        setStep("questioning");
      } else if (json.result) {
        setResult(json.result);
        setStep("result");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSubmit = async () => {
    if (currentSelections.length === 0) return;

    const currentQ = questions[currentQuestionIndex];
    const newAnswers = { ...answers, [currentQ.id]: currentSelections };
    setAnswers(newAnswers);

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/code-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          description,
          answers: newAnswers,
          stage: "followup",
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to get next question");

      if (json.nextQuestion) {
        setQuestions([...questions.slice(0, currentQuestionIndex + 1), json.nextQuestion]);
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setCurrentSelections([]);
      } else if (json.result) {
        setResult(json.result);
        setStep("result");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const toggleSelection = (value: string) => {
    if (questions[currentQuestionIndex]?.multiSelect) {
      setCurrentSelections((prev) =>
        prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
      );
    } else {
      setCurrentSelections([value]);
    }
  };

  const handleReset = () => {
    setStep("input");
    setCode("");
    setDescription("");
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setCurrentSelections([]);
    setResult(null);
    setError("");
  };

  return (
    <div className="rounded-2xl border border-[#F0E8D8] bg-white p-8 shadow-sm">
      {/* Input Step */}
      {step === "input" && (
        <>
          <h2 className="text-xl font-extrabold text-[#2D5016] mb-6">Paste Kode Anda</h2>
          <form onSubmit={handleInitialSubmit} className="space-y-6">
            <div>
              <label htmlFor="code" className="block text-sm font-semibold text-[#2D5016] mb-2">
                Kode Anda
              </label>
              <textarea
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                rows={12}
                placeholder="// Paste kode Anda di sini...&#10;// Bisa JavaScript, Python, Java, dll"
                required
                className="w-full rounded-xl border border-[#F0E8D8] bg-[#FEFBF5] px-4 py-3 text-sm font-mono text-[#2D5016] placeholder:text-[#999999] focus:border-[#F5A62A] focus:outline-none resize-y"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-[#2D5016] mb-2">
                Konteks Tambahan (Opsional)
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Jelaskan tujuan kode ini atau pertanyaan spesifik..."
                className="w-full rounded-xl border border-[#F0E8D8] bg-[#FEFBF5] px-4 py-3 text-sm text-[#2D5016] placeholder:text-[#999999] focus:border-[#F5A62A] focus:outline-none resize-y"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !code.trim()}
              className="rounded-xl bg-[#F5A62A] px-6 py-3 text-sm font-bold text-[#2D5016] transition hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "⏳ Sedang menganalisis..." : "🤖 Mulai AI Review"}
            </button>
          </form>
        </>
      )}

      {/* Questioning Step */}
      {step === "questioning" && (
        <>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-[#2D5016]">🤖 AI Sedang Bertanya</h2>
            <span className="rounded-full bg-[#FFF3D6] px-3 py-1 text-xs font-semibold text-[#5C4813]">
              Pertanyaan {currentQuestionIndex + 1}
            </span>
          </div>

          {/* Progress bar */}
          <div className="mb-6 h-1.5 w-full overflow-hidden rounded-full bg-[#F0E8D8]">
            <div
              className="h-full rounded-full bg-[#F5A62A] transition-all"
              style={{ width: `${((currentQuestionIndex + 1) / (questions.length + 1)) * 100}%` }}
            />
          </div>

          {questions[currentQuestionIndex] && (
            <div className="space-y-6">
              <div className="rounded-xl bg-[#FFF3D6] p-4">
                <p className="text-sm font-semibold text-[#5C4813]">
                  {questions[currentQuestionIndex].question}
                </p>
              </div>

              <div className="space-y-3">
                {questions[currentQuestionIndex].options.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => toggleSelection(option.value)}
                    className={`w-full rounded-xl border-2 p-4 text-left transition ${
                      currentSelections.includes(option.value)
                        ? "border-[#F5A62A] bg-[#FFF3D6]"
                        : "border-[#F0E8D8] bg-[#FEFBF5] hover:border-[#F5A62A]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-5 w-5 items-center justify-center rounded ${
                          currentSelections.includes(option.value)
                            ? "bg-[#F5A62A] text-white"
                            : "border-2 border-[#999999]"
                        }`}
                      >
                        {currentSelections.includes(option.value) && "✓"}
                      </div>
                      <span className="text-sm text-[#2D5016]">{option.label}</span>
                    </div>
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={handleAnswerSubmit}
                disabled={loading || currentSelections.length === 0}
                className="rounded-xl bg-[#F5A62A] px-6 py-3 text-sm font-bold text-[#2D5016] transition hover:opacity-90 disabled:opacity-50"
              >
                {loading ? "⏳ Menganalisis..." : "Lanjut →"}
              </button>
            </div>
          )}
        </>
      )}

      {/* Analyzing Step */}
      {step === "analyzing" && (
        <div className="py-12 text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-[#F5A62A] border-t-transparent" />
          <p className="text-sm font-semibold text-[#2D5016]">AI sedang menganalisis kode Anda...</p>
        </div>
      )}

      {/* Result Step */}
      {step === "result" && result && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-[#2D5016]">📋 Hasil Review</h2>
            <button
              onClick={handleReset}
              className="rounded-xl border-2 border-[#2D5016] px-4 py-2 text-xs font-semibold text-[#2D5016] transition hover:bg-[#2D5016] hover:text-white"
            >
              🔄 Review Baru
            </button>
          </div>

          {/* Summary */}
          <div className="rounded-xl bg-[#FEFBF5] p-6 border border-[#F0E8D8]">
            <h3 className="mb-2 text-sm font-bold text-[#2D5016]">📝 Ringkasan</h3>
            <p className="text-sm text-[#444444]">{result.summary}</p>
          </div>

          {/* Code Quality Score */}
          <div className="rounded-xl bg-white p-4 border border-[#F0E8D8]">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-[#2D5016]">Code Quality Score</span>
              <span
                className={`text-2xl font-extrabold ${
                  result.codeQuality >= 80
                    ? "text-[#7AB648]"
                    : result.codeQuality >= 60
                      ? "text-[#F5A62A]"
                      : "text-red-500"
                }`}
              >
                {result.codeQuality}/100
              </span>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[#F0E8D8]">
              <div
                className={`h-full rounded-full transition-all ${
                  result.codeQuality >= 80
                    ? "bg-[#7AB648]"
                    : result.codeQuality >= 60
                      ? "bg-[#F5A62A]"
                      : "bg-red-500"
                }`}
                style={{ width: `${result.codeQuality}%` }}
              />
            </div>
          </div>

          {/* Explanation */}
          <div className="rounded-xl bg-[#E3F2FD] p-6 border border-blue-200">
            <h3 className="mb-3 text-sm font-bold text-[#1565C0]">💡 Penjelasan Kode</h3>
            <p className="text-sm text-[#444444] whitespace-pre-wrap">{result.explanation}</p>
          </div>

          {/* Bugs */}
          {result.bugs.length > 0 && (
            <div className="rounded-xl bg-red-50 p-6 border border-red-200">
              <h3 className="mb-3 text-sm font-bold text-red-600">🐛 Potential Bugs</h3>
              <ul className="space-y-2">
                {result.bugs.map((bug, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-red-700">
                    <span className="mt-0.5">⚠️</span>
                    <span>{bug}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Suggestions */}
          {result.suggestions.length > 0 && (
            <div className="rounded-xl bg-[#FFF3D6] p-6 border border-[#F5A62A]">
              <h3 className="mb-3 text-sm font-bold text-[#5C4813]">💡 Saran Perbaikan</h3>
              <ul className="space-y-2">
                {result.suggestions.map((suggestion, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[#444444]">
                    <span className="text-[#F5A62A] mt-0.5">•</span>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Improvements */}
          {result.improvements.length > 0 && (
            <div className="rounded-xl bg-[#E8F5E9] p-6 border border-[#7AB648]">
              <h3 className="mb-3 text-sm font-bold text-[#2D5016]">🚀 Pengembangan Lanjutan</h3>
              <ul className="space-y-2">
                {result.improvements.map((imp, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[#444444]">
                    <span className="text-[#7AB648] mt-0.5">→</span>
                    <span>{imp}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
    </div>
  );
}
