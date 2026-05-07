import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getEnrollments } from "@/lib/content";

export default async function AccessIndexPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/login?redirect=/access");
  }

  const clerkUser = await currentUser();
  const userEmail = clerkUser?.primaryEmailAddress?.emailAddress ?? "";

  const enrollments = await getEnrollments(userEmail);
  
  return (
    <div className="bg-[#FEFBF5] min-h-screen">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-8 flex items-center gap-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 rounded-xl border-2 border-[#2D5016] px-4 py-2 text-sm font-semibold text-[#2D5016] transition hover:bg-[#2D5016] hover:text-white"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Kembali ke Dashboard
          </Link>
        </div>

        <h1 className="text-3xl font-extrabold text-[#2D5016]">My Courses</h1>
        <p className="mt-2 text-sm text-[#444444]">Pilih course untuk melanjutkan pembelajaran</p>

        {enrollments.length > 0 ? (
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {enrollments.map((slug) => (
              <Link
                key={slug}
                href={`/access/${slug}`}
                className="group block rounded-2xl border border-[#F0E8D8] bg-white p-6 shadow-sm transition hover:border-[#F5A62A] hover:shadow-md"
              >
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-xl bg-[#F5A62A]/20 flex items-center justify-center text-[#F5A62A] font-bold">
                    ▶
                  </div>
                  <div>
                    <h3 className="font-bold text-[#2D5016] group-hover:text-[#F5A62A] transition">{slug}</h3>
                    <p className="text-xs text-[#444444] mt-1">Klik untuk melanjutkan</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-[#F0E8D8] bg-white p-10 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#F0E8D8]">
              <svg className="h-8 w-8 text-[#2D5016]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <p className="mt-4 text-base font-bold text-[#2D5016]">Belum ada course aktif</p>
            <p className="mt-2 text-sm text-[#444444]">Buka katalog lalu lakukan checkout untuk mulai belajar.</p>
            <Link
              href="/courses"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#F5A62A] px-5 py-3 text-sm font-bold text-[#2D5016] transition hover:opacity-90"
            >
              Lihat Katalog
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
