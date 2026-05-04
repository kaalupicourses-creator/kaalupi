"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function LoginForm({ redirect }: { redirect: string }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError("");

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: formData.get("email"),
        password: formData.get("password"),
        redirect,
      }),
    });

    const payload = (await response.json()) as { error?: string; redirect?: string };

    if (!response.ok) {
      setError(payload.error ?? "Login gagal.");
      setLoading(false);
      return;
    }

    router.push(payload.redirect ?? "/dashboard");
    router.refresh();
  }

  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-[0_30px_80px_rgba(0,0,0,0.24)]">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-300">
          Demo Accounts
        </p>
        <p className="mt-3 text-sm leading-7 text-slate-300">
          admin@kaalupi.dev / admin123, mentor@kaalupi.dev / mentor123,
          student@kaalupi.dev / student123
        </p>
      </div>

      <form
        onSubmit={async (event) => {
          event.preventDefault();
          await handleSubmit(new FormData(event.currentTarget));
        }}
        className="space-y-5"
      >
        <div>
          <label className="mb-2 block text-sm text-slate-300">Email</label>
          <input
            name="email"
            type="email"
            required
            className="w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white outline-none transition focus:border-amber-300"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm text-slate-300">Password</label>
          <input
            name="password"
            type="password"
            required
            className="w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white outline-none transition focus:border-amber-300"
            placeholder="••••••••"
          />
        </div>
        {error ? <p className="text-sm text-rose-300">{error}</p> : null}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-[linear-gradient(135deg,#f97316,#facc15)] px-5 py-3 font-semibold text-slate-950 transition hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "Processing..." : "Login"}
        </button>
      </form>
    </div>
  );
}
