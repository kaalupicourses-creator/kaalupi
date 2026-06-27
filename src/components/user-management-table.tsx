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
  is_super_admin: boolean;
  is_founding_member: boolean;
  onboarding_completed: boolean;
  goal: string | null;
  created_at: number;
  last_sign_in_at: number | null;
};

const ROLE_BADGE: Record<string, { bg: string; text: string }> = {
  super_admin: { bg: "bg-[#2D5016]", text: "text-white" },
  admin: { bg: "bg-[#F5A62A]", text: "text-[#2D5016]" },
  instructor: { bg: "bg-[#7AB648]", text: "text-white" },
  student: { bg: "bg-[#F0E8D8]", text: "text-[#5C4813]" },
};

export function UserManagementTable({ isSuperAdmin }: { isSuperAdmin: boolean }) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "founding" | Role>("all");
  const [search, setSearch] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<User | null>(null);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const r = await fetch("/api/admin/users");
      const d = await r.json();
      if (!r.ok) { setError(d.error ?? "Gagal load user"); return; }
      setUsers(d.users ?? []);
    } catch {
      setError("Koneksi terputus");
    } finally {
      setLoading(false);
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { load(); }, []);

  async function changeRole(userId: string, role: Role) {
    setUpdating(userId + "-role");
    try {
      const r = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, role }),
      });
      const d = await r.json();
      if (!r.ok) { alert(d.error ?? "Gagal ubah role"); return; }
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role } : u)));
    } finally {
      setUpdating(null);
    }
  }

  async function toggleFoundingMember(email: string, currentlyFounding: boolean) {
    setUpdating(email + "-founding");
    const action = currentlyFounding ? "revoke_founding" : "grant_founding";
    try {
      const r = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, email }),
      });
      const d = await r.json();
      if (!r.ok) { alert(d.error ?? "Gagal ubah founding status"); return; }
      setUsers((prev) =>
        prev.map((u) => (u.email === email ? { ...u, is_founding_member: !currentlyFounding } : u)),
      );
    } finally {
      setUpdating(null);
    }
  }

  async function deleteUser(user: User) {
    setUpdating(user.id + "-delete");
    setConfirmDelete(null);
    try {
      const r = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.id, email: user.email }),
      });
      const d = await r.json();
      if (!r.ok) { alert(d.error ?? "Gagal hapus user"); return; }
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
    } finally {
      setUpdating(null);
    }
  }

  const filtered = users.filter((u) => {
    if (filter === "founding" && !u.is_founding_member) return false;
    if (filter !== "all" && filter !== "founding" && u.role !== filter) return false;
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
    founding: users.filter((u) => u.is_founding_member).length,
    admin: users.filter((u) => u.role === "admin" || u.is_super_admin).length,
    instructor: users.filter((u) => u.role === "instructor").length,
    student: users.filter((u) => u.role === "student").length,
  };

  return (
    <div className="space-y-4">
      {/* Confirm delete dialog */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="mx-4 max-w-sm w-full rounded-2xl border border-red-200 bg-white p-6 shadow-xl">
            <h3 className="text-lg font-extrabold text-red-600">Hapus User?</h3>
            <p className="mt-2 text-sm text-[#444]">
              Akun <strong>{confirmDelete.email}</strong> akan dihapus permanen dari Clerk
              dan semua data (enrollments, progress, badge, sertifikat, payment) akan ikut terhapus.
            </p>
            <p className="mt-2 text-xs font-bold text-red-500">Aksi ini tidak bisa di-undo.</p>
            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => deleteUser(confirmDelete)}
                className="flex-1 rounded-xl bg-red-600 py-2 text-sm font-bold text-white hover:bg-red-700"
              >
                Ya, Hapus
              </button>
              <button
                type="button"
                onClick={() => setConfirmDelete(null)}
                className="flex-1 rounded-xl border-2 border-[#2D5016] py-2 text-sm font-bold text-[#2D5016] hover:bg-[#2D5016] hover:text-white"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter + search */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-2">
          {(["all", "founding", "admin", "instructor", "student"] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
                filter === f
                  ? "bg-[#2D5016] text-white"
                  : "border border-[#F0E8D8] bg-white text-[#444] hover:border-[#F5A62A]"
              }`}
            >
              {f === "all" ? "Semua" : f === "founding" ? "Founding Members" : f.charAt(0).toUpperCase() + f.slice(1)}
              {" "}({counts[f]})
            </button>
          ))}
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari nama / email..."
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
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-[#F0E8D8] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-[#F0E8D8] bg-[#FEFBF5]">
              <tr className="text-left">
                <th className="px-4 py-3 font-bold text-[#2D5016]">User</th>
                <th className="px-4 py-3 font-bold text-[#2D5016]">Role</th>
                <th className="px-4 py-3 font-bold text-[#2D5016]">Founding</th>
                <th className="px-4 py-3 font-bold text-[#2D5016]">Last sign-in</th>
                {isSuperAdmin && <th className="px-4 py-3 font-bold text-[#2D5016]">Aksi</th>}
              </tr>
            </thead>
            <tbody>
              {loading && filtered.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-10 text-center text-[#999]">Memuat...</td></tr>
              )}
              {!loading && filtered.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-10 text-center text-[#999]">Ngga ada user.</td></tr>
              )}
              {filtered.map((u) => {
                const isDisabled = !!updating;
                const roleKey = u.is_super_admin ? "super_admin" : u.role;
                return (
                  <tr key={u.id} className="border-b border-[#F0E8D8] last:border-0 hover:bg-[#FEFBF5]">
                    {/* User info */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {u.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={u.imageUrl} alt="" className="h-9 w-9 rounded-full bg-[#F0E8D8]" />
                        ) : (
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFF3D6] text-sm font-bold text-[#2D5016]">
                            {(u.name || u.email).charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-[#2D5016]">{u.name || "(no name)"}</p>
                          <p className="truncate text-xs text-[#5C4813]">{u.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="px-4 py-3">
                      {u.is_super_admin ? (
                        <span className="rounded-full bg-[#2D5016] px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
                          Super Admin
                        </span>
                      ) : isSuperAdmin ? (
                        <select
                          value={u.role}
                          disabled={isDisabled}
                          onChange={(e) => changeRole(u.id, e.target.value as Role)}
                          className="rounded-lg border border-[#F0E8D8] bg-white px-2 py-1 text-xs font-semibold text-[#2D5016] focus:border-[#F5A62A] focus:outline-none disabled:opacity-50"
                        >
                          <option value="student">Student</option>
                          <option value="instructor">Instructor</option>
                          <option value="admin">Admin</option>
                        </select>
                      ) : (
                        <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${ROLE_BADGE[roleKey]?.bg} ${ROLE_BADGE[roleKey]?.text}`}>
                          {u.role}
                        </span>
                      )}
                    </td>

                    {/* Founding Member toggle */}
                    <td className="px-4 py-3">
                      {isSuperAdmin && !u.is_super_admin ? (
                        <button
                          type="button"
                          disabled={isDisabled}
                          onClick={() => toggleFoundingMember(u.email, u.is_founding_member)}
                          className={`rounded-full px-3 py-1 text-xs font-bold transition disabled:opacity-50 ${
                            u.is_founding_member
                              ? "bg-[#FFF3D6] text-[#5C4813] hover:bg-red-100 hover:text-red-600"
                              : "border border-[#F0E8D8] bg-white text-[#999] hover:border-[#F5A62A] hover:text-[#5C4813]"
                          }`}
                        >
                          {updating === u.email + "-founding"
                            ? "..."
                            : u.is_founding_member
                            ? "Founding ✓"
                            : "+ Grant"}
                        </button>
                      ) : u.is_founding_member ? (
                        <span className="rounded-full bg-[#FFF3D6] px-3 py-1 text-xs font-bold text-[#5C4813]">Founding</span>
                      ) : (
                        <span className="text-xs text-[#CCC]">—</span>
                      )}
                    </td>

                    {/* Last sign-in */}
                    <td className="px-4 py-3 text-xs text-[#5C4813]">
                      {u.last_sign_in_at
                        ? new Date(u.last_sign_in_at).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })
                        : "Belum pernah"}
                    </td>

                    {/* Super admin actions */}
                    {isSuperAdmin && (
                      <td className="px-4 py-3">
                        {!u.is_super_admin && (
                          <button
                            type="button"
                            disabled={isDisabled}
                            onClick={() => setConfirmDelete(u)}
                            className="rounded-lg border border-red-200 bg-red-50 px-3 py-1 text-xs font-bold text-red-600 transition hover:bg-red-600 hover:text-white disabled:opacity-50"
                          >
                            Hapus
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-[#5C4813]">
        {filtered.length} dari {users.length} user · {counts.founding} Founding Members
      </p>
    </div>
  );
}
