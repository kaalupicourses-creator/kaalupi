import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { InstructorAdmin } from "@/components/instructor-admin";
import { isSuperAdmin } from "@/lib/auth";
import { getCourses } from "@/lib/content";

export default async function InstructorsAdminPage() {
  const { userId } = await auth();
  if (!userId) redirect("/login?redirect=/dashboard/instructors");

  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress ?? "";
  if (!isSuperAdmin(email)) redirect("/dashboard");

  const allCourses = await getCourses();
  const courseOpts = allCourses.map((c) => ({ slug: c.slug, title: c.title }));

  return (
    <div className="bg-[#FEFBF5] min-h-screen">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#7AB648]">Super Admin · Instructor</p>
            <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-[#2D5016]">Pantau Instructor</h1>
            <p className="mt-2 max-w-2xl text-sm text-[#444]">
              Assign course + target ke instructor, pantau progress asli (dari materi yang beneran ke-upload), dan pause
              akun yang telat. Progress otomatis dari database — ga bisa diakalin.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="rounded-xl border-2 border-[#2D5016] px-4 py-2 text-sm font-semibold text-[#2D5016] transition hover:bg-[#2D5016] hover:text-white"
          >
            ← Dashboard
          </Link>
        </div>

        <div className="mb-6 rounded-2xl border border-[#F0E8D8] bg-white p-5">
          <p className="mb-2 text-sm font-bold text-[#2D5016]">Cara pakai</p>
          <ol className="space-y-1.5 text-sm leading-6 text-[#444]">
            <li>1. Assign course ke instructor + set target materi & deadline sesuai kesepakatan.</li>
            <li>2. Progress bar keisi otomatis tiap dia upload materi beneran (bukan ngaku-ngaku).</li>
            <li>3. Kalau lewat deadline & belum kelar → muncul label <strong>TELAT</strong> (kuning).</li>
            <li>4. Kalau dia telat tanpa alasan valid → klik <strong>Pause / Ban</strong>. Dia ga bisa upload sampai lu buka lagi.</li>
          </ol>
        </div>

        <InstructorAdmin courses={courseOpts} />
      </div>
    </div>
  );
}
