import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { UserManagementTable } from "@/components/user-management-table";

export default async function UsersAdminPage() {
  const { userId } = await auth();
  if (!userId) redirect("/login?redirect=/dashboard/users");

  const user = await currentUser();
  const role = (user?.publicMetadata as { role?: string })?.role;
  if (role !== "admin") redirect("/dashboard");

  return (
    <div className="bg-[#FEFBF5] min-h-screen">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#7AB648]">
              Admin · User Management
            </p>
            <h1 className="mt-2 text-3xl font-extrabold text-[#2D5016]">Kelola User & Role</h1>
            <p className="mt-2 text-sm text-[#444]">
              Atur role tiap user. Admin akses semua, instructor akses studio + blog,
              student cuma akses course.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="rounded-xl border-2 border-[#2D5016] px-5 py-2.5 text-sm font-semibold text-[#2D5016] transition hover:bg-[#2D5016] hover:text-white"
          >
            ← Dashboard
          </Link>
        </div>

        <div className="mb-6 rounded-2xl border border-[#F0E8D8] bg-white p-5 shadow-sm">
          <p className="text-sm font-bold text-[#2D5016] mb-3">Apa beda tiap role?</p>
          <div className="grid gap-3 md:grid-cols-3 text-sm">
            <div className="rounded-xl border border-[#F0E8D8] bg-[#FEFBF5] p-4">
              <p className="font-bold text-[#2D5016]">Admin</p>
              <ul className="mt-2 space-y-1 text-xs text-[#444] leading-5">
                <li>• Semua fitur instructor</li>
                <li>• Kelola user & role</li>
                <li>• Lihat analytics platform</li>
                <li>• Settings sistem</li>
              </ul>
            </div>
            <div className="rounded-xl border border-[#F0E8D8] bg-[#FEFBF5] p-4">
              <p className="font-bold text-[#2D5016]">Instructor</p>
              <ul className="mt-2 space-y-1 text-xs text-[#444] leading-5">
                <li>• Course Studio (edit/tambah materi)</li>
                <li>• Tulis & edit artikel blog</li>
                <li>• AI Code Review</li>
                <li>• Akses semua course untuk preview</li>
              </ul>
            </div>
            <div className="rounded-xl border border-[#F0E8D8] bg-[#FEFBF5] p-4">
              <p className="font-bold text-[#2D5016]">Student</p>
              <ul className="mt-2 space-y-1 text-xs text-[#444] leading-5">
                <li>• Akses course yang udah enroll/beli</li>
                <li>• Chat AI Tutor 24/7</li>
                <li>• Klaim sertifikat & badge</li>
                <li>• Edit profil pribadi</li>
              </ul>
            </div>
          </div>
        </div>

        <UserManagementTable />
      </div>
    </div>
  );
}
