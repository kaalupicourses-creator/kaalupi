import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { MaterialUploadForm } from "@/components/material-upload-form";
import { getCourses } from "@/lib/content";

export default async function NewMaterialPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/login?redirect=/dashboard/materials/new");
  }

  const { currentUser } = await import("@clerk/nextjs/server");
  const user = await currentUser();
  const role = (user?.publicMetadata as { role?: string })?.role;

  if (role !== "admin" && role !== "instructor") {
    redirect("/dashboard");
  }

  const courses = await getCourses();

  return (
    <div className="bg-[#FEFBF5] min-h-screen">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="mb-10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8F5E9]">
              <svg className="h-5 w-5 text-[#2D5016]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#7AB648]">
                Material Studio
              </p>
              <h1 className="mt-1 text-3xl font-extrabold text-[#2D5016]">
                Tambah materi / video
              </h1>
            </div>
          </div>
          <p className="mt-4 text-sm text-[#444444]">
            Tambahkan video atau konten teks ke dalam modul course yang sudah ada.
          </p>
        </div>
        <MaterialUploadForm courses={courses.filter((c) => !c.comingSoon)} />
      </div>
    </div>
  );
}
