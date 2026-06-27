import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { UserManagementTable } from "@/components/user-management-table";
import { isSuperAdmin } from "@/lib/auth";

export default async function UsersAdminPage() {
  const { userId } = await auth();
  if (!userId) redirect("/login?redirect=/dashboard/users");

  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress ?? "";
  const role = (user?.publicMetadata as { role?: string })?.role;
  const superAdmin = isSuperAdmin(email);

  if (role !== "admin" && !superAdmin) redirect("/dashboard");

  return (
    <div className="bg-[#FEFBF5] min-h-screen">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#7AB648]">
              {superAdmin ? "Super Admin" : "Admin"} · User Management
            </p>
            <h1 className="mt-2 text-3xl font-extrabold text-[#2D5016]">Kelola User & Role</h1>
            {superAdmin && (
              <p className="mt-1 text-xs font-semibold text-[#F5A62A]">
                Mode Super Admin — lu bisa hapus user, grant/revoke Founding Member, dan ubah semua role.
              </p>
            )}
          </div>
          <Link
            href="/dashboard"
            className="rounded-xl border-2 border-[#2D5016] px-5 py-2.5 text-sm font-semibold text-[#2D5016] transition hover:bg-[#2D5016] hover:text-white"
          >
            ← Dashboard
          </Link>
        </div>

        {/* Role legend */}
        <div className="mb-6 rounded-2xl border border-[#F0E8D8] bg-white p-5 shadow-sm">
          <p className="mb-3 text-sm font-bold text-[#2D5016]">Apa beda tiap role?</p>
          <div className={`grid gap-3 text-sm ${superAdmin ? "md:grid-cols-4" : "md:grid-cols-3"}`}>
            {superAdmin && (
              <div className="rounded-xl border border-[#2D5016] bg-[#2D5016] p-4 text-white">
                <p className="font-bold">Super Admin</p>
                <ul className="mt-2 space-y-1 text-xs leading-5 opacity-90">
                  <li>• Hapus user permanen</li>
                  <li>• Grant/revoke Founding Member</li>
                  <li>• Promote ke admin</li>
                  <li>• Semua fitur admin</li>
                </ul>
              </div>
            )}
            <div className="rounded-xl border border-[#F0E8D8] bg-[#FEFBF5] p-4">
              <p className="font-bold text-[#2D5016]">Admin</p>
              <ul className="mt-2 space-y-1 text-xs leading-5 text-[#444]">
                <li>• Semua fitur instructor</li>
                <li>• Kelola user & role</li>
                <li>• Approve pembayaran</li>
                <li>• Lihat analytics</li>
              </ul>
            </div>
            <div className="rounded-xl border border-[#F0E8D8] bg-[#FEFBF5] p-4">
              <p className="font-bold text-[#2D5016]">Instructor</p>
              <ul className="mt-2 space-y-1 text-xs leading-5 text-[#444]">
                <li>• Akses Course Studio</li>
                <li>• Tambah/edit materi</li>
                <li>• Tulis artikel blog</li>
              </ul>
            </div>
            <div className="rounded-xl border border-[#F0E8D8] bg-[#FEFBF5] p-4">
              <p className="font-bold text-[#2D5016]">Student</p>
              <ul className="mt-2 space-y-1 text-xs leading-5 text-[#444]">
                <li>• Akses course yang dibeli</li>
                <li>• Track progress & sertifikat</li>
                <li>• Akses komunitas</li>
              </ul>
            </div>
          </div>
        </div>

        <UserManagementTable isSuperAdmin={superAdmin} />
      </div>
    </div>
  );
}
