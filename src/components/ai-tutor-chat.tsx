"use client";

import { useEffect, useRef, useState } from "react";

type Message = { role: "user" | "assistant"; content: string };

interface Props {
  courseSlug: string;
  courseTitle: string;
  moduleIndex: number;
}

export function AiTutorChat({ courseSlug, courseTitle, moduleIndex }: Props) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `Halo! Gw AI Tutor lu di course "${courseTitle}". Tanya apa aja seputar materi ini — dari konsep, contoh praktik, sampai cara nge-prompt. Gw bantu sebisa gw, kapanpun.`,
    },
  ]);
  const [error, setError] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    const next: Message[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    setError("");
    try {
      const r = await fetch("/api/ai/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseSlug, moduleIndex, messages: next }),
      });
      const data = (await r.json()) as { reply?: string; error?: string };
      if (!r.ok || !data.reply) {
        setError(data.error ?? "AI ngga merespon, coba lagi sebentar.");
        return;
      }
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply ?? "" }]);
    } catch (err) {
      console.error("[ai-tutor] send failed:", err);
      setError("Koneksi terputus. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-[#F5A62A] px-5 py-3 text-sm font-bold text-[#2D5016] shadow-xl transition hover:opacity-90 ${
          open ? "hidden" : "flex"
        }`}
        aria-label="Buka AI Tutor"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        AI Tutor
      </button>

      {open && (
        <div className="fixed bottom-0 right-0 z-50 flex h-[600px] max-h-[100vh] w-full max-w-md flex-col rounded-t-3xl border border-[#F0E8D8] bg-white shadow-2xl sm:bottom-6 sm:right-6 sm:rounded-3xl">
          <div className="flex items-center justify-between gap-3 rounded-t-3xl border-b border-[#F0E8D8] bg-[#FFF3D6] px-5 py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F5A62A]">
                <svg className="h-5 w-5 text-[#2D5016]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-extrabold text-[#2D5016]">AI Tutor Kaalupi</p>
                <p className="text-xs text-[#5C4813]">Konteks: {courseTitle}</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Tutup"
              className="rounded-lg p-1.5 text-[#2D5016] hover:bg-white/60"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-6 ${
                    m.role === "user"
                      ? "bg-[#2D5016] text-white"
                      : "bg-[#FEFBF5] text-[#444] border border-[#F0E8D8]"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="rounded-2xl bg-[#FEFBF5] border border-[#F0E8D8] px-4 py-2.5 text-sm text-[#444]">
                  <span className="inline-flex items-center gap-1">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#F5A62A]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#F5A62A] [animation-delay:120ms]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#F5A62A] [animation-delay:240ms]" />
                  </span>
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="mx-4 mb-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">{error}</div>
          )}

          <div className="border-t border-[#F0E8D8] bg-white px-3 py-3">
            <div className="flex items-end gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Tanya apa aja seputar modul ini..."
                rows={2}
                className="flex-1 resize-none rounded-xl border border-[#F0E8D8] bg-[#FEFBF5] px-3 py-2 text-sm text-[#444] placeholder:text-[#999] focus:border-[#F5A62A] focus:outline-none"
                disabled={loading}
              />
              <button
                type="button"
                onClick={send}
                disabled={loading || !input.trim()}
                className="rounded-xl bg-[#F5A62A] px-4 py-2 text-sm font-bold text-[#2D5016] transition hover:opacity-90 disabled:opacity-50"
              >
                Kirim
              </button>
            </div>
            <p className="mt-2 text-[10px] text-[#999]">
              AI bisa salah — verifikasi info penting di sumber resmi.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
