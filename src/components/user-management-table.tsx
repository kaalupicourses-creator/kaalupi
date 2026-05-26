"use client";

import { useEffect, useState } from "react";

type Role = "admin" | "instructor" | "student";

type User = {
  id: string;
  email: string;
  name: string;
  username: string | null;
  imageUrl: string;
  role: Role;
  onboarding_completed: boolean;
  goal: string | null;
  interest: string | null;
  created_at: number;
  last_sign_in_at: number | null;
};

const ROLE_BADGE: Record<Role, { bg: string; text: string }> = {
  admin: { bg: "bg-[#F5A62A]", text: "text-[#2D5016]" },
  instructor: { bg: "bg-[#7AB648]", text: "text-white" },
  student: { bg: "bg-[#F0E8D8]", text: "text-[#5C4813]" },
};

export function UserManagementTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | Role>("all");
  const [search, setSearch] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const r = await fetch("/api/admin/users");
      const d = await r.json();
      if (!r.ok) {
        setError(d.error ?? "Gagal load user");
        return;
      }
      setUsers(d.users ?? []);
    } catch {
      setError("Koneksi terputus");
    } finally {
      setLoading(false);
    }
  }

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function changeRole(userId: string, role: Role) {
    setUpdating(userId);
    try {
      const r = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, role }),
      });
      const d = await r.json();
      if (!r.ok) {
        alert(d.error ?? "Gagal ubah role");
        return;
      }
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role } : u)),
      );
    } finally {
      setUpdating(null);
    }
  }

  const filtered = users.filter((u) => {
    if (filter !== "all" && u.role !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        u.email.toLowerCase().includes(q) ||
        u.name.toLowerCase().includes(q) ||
        (u.username ?? "").toLowerCase().includes(q)
      );
    }
    return true;
  });

  const counts = {
    all: users.length,
    admin: users.filter((u) => u.role === "admin").length,
    instructor: users.filter((u) => u.role === "instructor").length,
    student: users.filter((u) => u.role === "student").length,
  };

  return (
    <div className="space-y-4">
      {/* Filter + search */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-2">
          {(["all", "admin", "instructor", "student"] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
                filter === f
                  ? "bg-[#2D5016] text-white"
                  : "bg-white border border-[#F0E8D8] text-[#444] hover:border-[#F5A62A]"
              }`}
            >
              {f === "all" ? "Semua" : f.charAt(0).toUpperCase() + f.slice(1)} ({counts[f]})
            </button>
          ))}
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari nama / email / username..."
          className="flex-1 min-w-[200px] rounded-xl border border-[#F0E8D8] bg-white px-4 py-2 text-sm text-[#444] placeholder:text-[#999] focus:border-[#F5A62A] focus:outline-none"
        />
        <button
          type="button"
          onClick={load}
          disabled={loading}
          className="rounded-xl border-2 border-[#2D5016] bg-white px-4 py-2 text-sm font-bold text-[#2D5016] hover:bg-[#2D5016] hover:text-white disabled:opacity-50"
        >
          {loading ? "..." : "Refresh"}
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-[#F0E8D8] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#FEFBF5] border-b border-[#F0E8D8]">
              <tr className="text-left">
                <th className="px-4 py-3 font-bold text-[#2D5016]">User</th>
                <th className="px-4 py-3 font-bold text-[#2D5016]">Role</th>
                <th className="px-4 py-3 font-bold text-[#2D5016]">Onboarding</th>
                <th className="px-4 py-3 font-bold text-[#2D5016]">Last sign-in</th>
                <th className="px-4 py-3 font-bold text-[#2D5016]">Ubah role</th>
              </tr>
            </thead>
            <tbody>
              {loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-[#999]">
                    Memuat...
                  </td>
                </tr>
              )}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-[#999]">
                    Ngga ada user yang cocok.
                  </td>
                </tr>
              )}
              {filtered.map((u) => (
                <tr
                  key={u.id}
                  className="border-b border-[#F0E8D8] last:border-0 hover:bg-[#FEFBF5]"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {u.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={u.imageUrl}
                          alt=""
                          className="h-9 w-9 rounded-full bg-[#F0E8D8]"
                        />
                      ) : (
                        <div className="h-9 w-9 rounded-full bg-[#FFF3D6] flex items-center justify-center text-sm font-bold text-[#2D5016]">
                          {(u.name || u.email).charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-semibold text-[#2D5016] truncate">
                          {u.name || "(no name)"}
                        </p>
                        <p className="text-xs text-[#5C4813] truncate">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${ROLE_BADGE[u.role].bg} ${ROLE_BADGE[u.role].text}`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {u.onboarding_completed ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#7AB648]">
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        Done {u.goal ? `· ${u.goal}` : ""}
                      </span>
                    ) : (
                      <span className="text-xs text-[#999]">Belum selesai</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-[#5C4813]">
                    {u.last_sign_in_at
                      ? new Date(u.last_sign_in_at).toLocaleString("id-ID", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })
                      : "Belum pernah"}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={u.role}
                      disabled={updating === u.id}
                      onChange={(e) => changeRole(u.id, e.target.value as Role)}
                      className="rounded-lg border border-[#F0E8D8] bg-white px-2 py-1 text-xs font-semibold text-[#2D5016] focus:border-[#F5A62A] focus:outline-none disabled:opacity-50"
                    >
                      <option value="student">Student</option>
                      <option value="instructor">Instructor</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-[#5C4813]">
        Menampilkan {filtered.length} dari {users.length} user (max 100 terbaru).
      </p>
    </div>
  );
}
