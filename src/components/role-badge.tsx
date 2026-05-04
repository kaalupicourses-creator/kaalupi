import type { UserRole } from "@/lib/data";

const styles: Record<UserRole, string> = {
  admin: "bg-rose-500/15 text-rose-200 ring-1 ring-rose-400/30",
  instructor: "bg-sky-500/15 text-sky-200 ring-1 ring-sky-400/30",
  student: "bg-emerald-500/15 text-emerald-200 ring-1 ring-emerald-400/30",
};

export function RoleBadge({ role }: { role: UserRole }) {
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${styles[role]}`}>
      {role}
    </span>
  );
}
