import { redirect } from "next/navigation";
import { auth, currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { getCourses } from "@/lib/content";
import { CourseStudio } from "@/components/course-studio";

export default async function StudioPage({
  searchParams,
}: {
  searchParams: Promise<{ course?: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/login?redirect=/dashboard/studio");

  const user = await currentUser();
  const role = (user?.publicMetadata as { role?: string })?.role;
  if (role !== "admin" && role !== "instructor") redirect("/dashboard");

  const allCourses = await getCourses();
  const sp = await searchParams;
  const selectedSlug = sp.course ?? allCourses[0]?.slug ?? "";

  return (
    <div className="bg-[#FEFBF5] min-h-screen">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#7AB648]">
              Course Studio
            </p>
            <h1 className="mt-2 text-3xl font-extrabold text-[#2D5016]">
              Kelola materi course
            </h1>
            <p className="mt-2 text-sm text-[#444444]">
              Satu tempat untuk tambah, edit, hapus, dan urutkan materi. Pakai AI generate buat draft cepat.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="rounded-xl border-2 border-[#2D5016] px-5 py-2.5 text-sm font-semibold text-[#2D5016] transition hover:bg-[#2D5016] hover:text-white"
          >
            ← Dashboard
          </Link>
        </div>

        <CourseStudio courses={allCourses} initialSlug={selectedSlug} />
      </div>
    </div>
  );
}
