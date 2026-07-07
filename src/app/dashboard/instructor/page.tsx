import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { InstructorPortal } from "@/components/instructor-portal";

export default async function InstructorPortalPage() {
  const { userId } = await auth();
  if (!userId) redirect("/login?redirect=/dashboard/instructor");

  const user = await currentUser();
  const role = (user?.publicMetadata as { role?: string })?.role;
  if (role !== "instructor" && role !== "admin") redirect("/dashboard");

  const name = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "Instructor";

  return (
    <div className="bg-[#FEFBF5] min-h-screen">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8 sm:py-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#7AB648]">Room Instructor</p>
            <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-[#2D5016]">Halo, {name}</h1>
            <p className="mt-2 text-sm text-[#444]">Progress, profit, dan deadline course lu — semua di sini.</p>
          </div>
          <Link
            href="/dashboard"
            className="rounded-xl border-2 border-[#2D5016] px-4 py-2 text-sm font-semibold text-[#2D5016] transition hover:bg-[#2D5016] hover:text-white"
          >
            ← Dashboard
          </Link>
        </div>

        <InstructorPortal />
      </div>
    </div>
  );
}
