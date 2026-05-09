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

        {/* Quick Start Guide */}
        <details className="mb-6 rounded-2xl border-2 border-[#F5A62A] bg-[#FFF3D6] open:shadow-md">
          <summary className="cursor-pointer list-none px-6 py-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5A62A] text-lg">
                  ⚡
                </div>
                <div>
                  <p className="text-sm font-extrabold text-[#2D5016]">Cara pakai Studio (3 menit)</p>
                  <p className="text-xs text-[#5C4813]">Klik untuk lihat panduan lengkap</p>
                </div>
              </div>
              <span className="text-[#5C4813] text-sm">▾</span>
            </div>
          </summary>
          <div className="border-t border-[#F5A62A]/30 px-6 py-5 text-sm leading-7 text-[#444]">
            <ol className="space-y-4">
              <li className="flex gap-3">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#F5A62A] text-xs font-bold text-[#2D5016]">
                  1
                </span>
                <div>
                  <strong className="text-[#2D5016]">Pilih Course di sidebar kiri.</strong> Setiap
                  course punya beberapa modul (terpisah jadi outline). Pilih course yang mau diisi.
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#F5A62A] text-xs font-bold text-[#2D5016]">
                  2
                </span>
                <div>
                  <strong className="text-[#2D5016]">Klik modul</strong> yang mau diisi (di bawah
                  daftar course). Materi yang masuk akan otomatis di-tag ke modul itu.
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#F5A62A] text-xs font-bold text-[#2D5016]">
                  3
                </span>
                <div>
                  <strong className="text-[#2D5016]">Pilih cara input materi:</strong>
                  <ul className="mt-2 ml-4 space-y-1.5 list-disc text-xs">
                    <li>
                      <strong>+ Tambah Materi</strong> — input manual (judul + video URL +
                      konten HTML).
                    </li>
                    <li>
                      <strong>AI Generate (1 materi)</strong> — kasih topik singkat, AI nulis
                      draft HTML otomatis pake Gemini.
                    </li>
                    <li>
                      <strong>Bulk Import (JSON)</strong> — paste JSON array kalau lu udah punya
                      draft di Notion/Google Doc.
                    </li>
                    <li>
                      <strong>Auto-Fill Semua Modul</strong> — sekali klik, AI bikin materi
                      pembuka untuk semua modul yang masih kosong.
                    </li>
                  </ul>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#F5A62A] text-xs font-bold text-[#2D5016]">
                  4
                </span>
                <div>
                  <strong className="text-[#2D5016]">Edit / hapus / atur urutan.</strong>
                  Klik Edit di card materi untuk ubah, atau panah ↑↓ untuk reorder. Hover materi
                  buat liat tombolnya.
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#F5A62A] text-xs font-bold text-[#2D5016]">
                  5
                </span>
                <div>
                  <strong className="text-[#2D5016]">Test sebagai student</strong> — buka{" "}
                  <code className="rounded bg-white px-1 py-0.5 text-xs">/access/[slug-course]</code>
                  {" "}di tab baru. Kalau materi udah ada, tampil di situ.
                </div>
              </li>
            </ol>

            <div className="mt-5 rounded-xl bg-white p-4 border border-[#F5A62A]/30">
              <p className="text-xs font-bold text-[#2D5016] mb-2">💡 Tips kerja efisien</p>
              <ul className="space-y-1 text-xs text-[#444]">
                <li>• <strong>Mulai dari Auto-Fill</strong> dulu untuk dapet draft semua modul, baru polish satu-satu.</li>
                <li>• <strong>Video URL boleh kosong</strong> — modul bisa cuma artikel HTML.</li>
                <li>• <strong>Pakai unlisted YouTube link</strong> kalau video sensitive (boleh diakses tapi ngga muncul di search).</li>
                <li>• <strong>HTML simple aja</strong>: h2, p, ul, code, strong. Hindari script/iframe.</li>
              </ul>
            </div>
          </div>
        </details>

        <CourseStudio courses={allCourses} initialSlug={selectedSlug} />
      </div>
    </div>
  );
}
