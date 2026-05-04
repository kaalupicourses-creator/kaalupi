import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { MaterialForm } from "@/components/material-form";

export default async function NewContentPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/login?redirect=/dashboard/content/new");
  }

  const { sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  if (role !== "admin" && role !== "instructor") {
    redirect("/dashboard");
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <div className="mb-10">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500/20 to-yellow-400/20">
            <svg className="h-5 w-5 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-300">
              Content Studio
            </p>
            <h1 className="mt-1 text-3xl font-semibold text-white">
              Publish materi baru
            </h1>
          </div>
        </div>
        <p className="mt-4 text-sm text-slate-400">
          Isi form di bawah untuk menambahkan course baru ke katalog.
        </p>
      </div>
      <MaterialForm />
    </div>
  );
}
