import type { UserRole } from "@/lib/data";

const styles: Record<UserRole, string> = {
  admin: "bg-rose-100 text-rose-700 ring-1 ring-rose-300",
  instructor: "bg-[#E3F2FD] text-[#1565C0] ring-1 ring-blue-200",
  student: "bg-[#E8F5E9] text-[#2D5016] ring-1 ring-[#7AB648]/30",
};

export function RoleBadge({ role }: { role: UserRole }) {
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${styles[role]}`}>
      {role}
    </span>
  );
}
