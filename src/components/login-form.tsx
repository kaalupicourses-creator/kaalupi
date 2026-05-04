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
    <div className="rounded-2xl border border-[#F0E8D8] bg-white p-8 shadow-sm">
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#7AB648]">
          Demo Accounts
        </p>
        <p className="mt-3 text-sm leading-7 text-[#444444]">
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
          <label className="mb-2 block text-sm font-semibold text-[#2D5016]">Email</label>
          <input
            name="email"
            type="email"
            required
            className="w-full rounded-xl border border-[#F0E8D8] bg-[#FEFBF5] px-4 py-3 text-[#444444] outline-none transition focus:border-[#F5A62A] focus:ring-2 focus:ring-[#F5A62A]/20"
            placeholder="kamu@example.com"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-[#2D5016]">Password</label>
          <input
            name="password"
            type="password"
            required
            className="w-full rounded-xl border border-[#F0E8D8] bg-[#FEFBF5] px-4 py-3 text-[#444444] outline-none transition focus:border-[#F5A62A] focus:ring-2 focus:ring-[#F5A62A]/20"
            placeholder="••••••••"
          />
        </div>
        {error ? (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-3">
            <p className="text-sm font-medium text-rose-700">{error}</p>
          </div>
        ) : null}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-[#F5A62A] px-5 py-3 font-bold text-[#2D5016] transition hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "Memproses..." : "Login"}
        </button>
      </form>
    </div>
  );
}
