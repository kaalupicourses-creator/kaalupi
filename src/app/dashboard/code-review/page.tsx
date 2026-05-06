import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getEnrollments, getCourses } from "@/lib/content";
import CodeReviewForm from "./code-review-form";

export default async function CodeReviewPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/login?redirect=/dashboard/code-review");
  }

  const enrollments = await getEnrollments(userId);
  const courses = await getCourses();
  const enrolledCourses = courses.filter((c) => enrollments.includes(c.slug));

  return (
    <div className="bg-[#FEFBF5] min-h-screen">
      <div className="mx-auto max-w-7xl px-6 py-16">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 rounded-xl border-2 border-[#2D5016] px-4 py-2 text-sm font-semibold text-[#2D5016] transition hover:bg-[#2D5016] hover:text-white"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Kembali
          </Link>
          <div>
            <h1 className="text-3xl font-extrabold text-[#2D5016]">AI Code Review</h1>
            <p className="mt-1 text-sm text-[#444444]">Submit kode Anda dan dapatkan feedback otomatis</p>
          </div>
        </div>

        {/* Info Box */}
        <div className="mb-8 rounded-2xl border border-[#F0E8D8] bg-[#FFF3D6] p-6">
          <div className="flex items-start gap-3">
            <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#F5A62A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm font-bold text-[#5C4813]">Cara Kerja AI Code Review</p>
              <p className="mt-1 text-xs text-[#5C4813]">
                Kode Anda akan dianalisis oleh AI untuk memberikan saran perbaikan terkait best practices,
                efisiensi, dan kemungkinan bug. Fitur ini menggunakan teknologi AI untuk membantu pembelajaran Anda.
              </p>
            </div>
          </div>
        </div>

        {/* Submission Form */}
        <CodeReviewForm enrolledCourses={enrolledCourses} />

        {/* Previous Reviews */}
        <div className="mt-10 rounded-2xl border border-[#F0E8D8] bg-white p-8 shadow-sm">
          <h2 className="text-xl font-extrabold text-[#2D5016]">Review Sebelumnya</h2>
          <div className="mt-6 rounded-xl border border-[#F0E8D8] bg-[#FEFBF5] p-6 text-center">
            <svg className="mx-auto h-12 w-12 text-[#7AB648]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="mt-3 text-sm font-semibold text-[#2D5016]">Belum ada review</p>
            <p className="mt-1 text-xs text-[#444444]">Submit kode pertama Anda untuk memulai</p>
          </div>
        </div>
      </div>
    </div>
  );
}
