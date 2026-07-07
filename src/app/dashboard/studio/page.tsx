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
  const meta = (user?.publicMetadata ?? {}) as { role?: string; instructor_banned?: boolean };
  const role = meta.role;
  if (role !== "admin" && role !== "instructor") redirect("/dashboard");

  // Instructor yang kena pause/ban ga bisa buka studio
  if (role === "instructor" && meta.instructor_banned === true) {
    return (
      <div className="bg-[#FEFBF5] min-h-screen">
        <div className="mx-auto max-w-2xl px-6 py-20 text-center">
          <div className="rounded-2xl border-2 border-[#E06C5A] bg-[#FBEEEA] p-8">
            <p className="text-4xl">⛔</p>
            <h1 className="mt-3 text-2xl font-extrabold text-[#B23A22]">Akun Lu Lagi Di-pause</h1>
            <p className="mt-3 text-sm leading-7 text-[#7A3020]">
              Upload materi lagi dikunci sementara karena telat dari target yang disepakati.
              Hubungi admin buat diskusi biar dibuka lagi.
            </p>
            <Link
              href="/dashboard/instructor"
              className="mt-6 inline-block rounded-xl bg-[#2D5016] px-6 py-2.5 text-sm font-bold text-white transition hover:opacity-90"
            >
              ← Balik ke Room Instructor
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const allCourses = await getCourses();
  const sp = await searchParams;
  const selectedSlug = sp.course ?? allCourses[0]?.slug ?? "";

  return (
    <div className="bg-[#FEFBF5] min-h-screen">
      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#7AB648]">
              Course Studio
            </p>
            <h1 className="mt-2 text-3xl font-extrabold text-[#2D5016]">
              Kelola materi course
            </h1>
          </div>
          <Link
            href="/dashboard"
            className="rounded-xl border-2 border-[#2D5016] px-5 py-2.5 text-sm font-semibold text-[#2D5016] transition hover:bg-[#2D5016] hover:text-white"
          >
            ← Dashboard
          </Link>
        </div>

        {/* Quick tips */}
        <div className="mb-6 rounded-2xl border border-[#F0E8D8] bg-white p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-[#2D5016] mb-3">Cara kerja</p>
          <ol className="space-y-2 text-sm text-[#444]">
            <li className="flex gap-3">
              <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#F5A62A] text-xs font-bold text-[#2D5016]">1</span>
              <span>Pilih course → pilih section di sidebar kiri.</span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#F5A62A] text-xs font-bold text-[#2D5016]">2</span>
              <span>Klik <strong>+ Tambah Materi</strong> → isi judul, URL video, dan artikel (boleh salah satu).</span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#F5A62A] text-xs font-bold text-[#2D5016]">3</span>
              <span>Klik <strong>👁 Preview Tampilan Student</strong> untuk lihat tampilan persis yang dilihat student.</span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#F5A62A] text-xs font-bold text-[#2D5016]">4</span>
              <span>Hover card materi → ↑↓ untuk reorder. Klik Edit untuk ubah isi.</span>
            </li>
          </ol>
          <p className="mt-3 text-xs text-[#999]">
            Tips: pakai <strong>YouTube unlisted</strong> supaya video bisa diakses tapi ngga muncul di search.
          </p>
        </div>

        <CourseStudio courses={allCourses} initialSlug={selectedSlug} role={role} />
      </div>
    </div>
  );
}
