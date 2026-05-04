import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { BlogForm } from "@/components/blog-form";

export default async function NewBlogPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/login?redirect=/dashboard/blog/new");
  }

  const { currentUser } = await import("@clerk/nextjs/server");
  const user = await currentUser();
  const role = (user?.publicMetadata as { role?: string })?.role;

  if (role !== "admin" && role !== "instructor") {
    redirect("/dashboard");
  }

  return (
    <div className="bg-[#FEFBF5] min-h-screen">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="mb-10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF3D6]">
              <svg className="h-5 w-5 text-[#F5A62A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#7AB648]">
                Blog Studio
              </p>
              <h1 className="mt-1 text-3xl font-extrabold text-[#2D5016]">
                Tulis artikel baru
              </h1>
            </div>
          </div>
          <p className="mt-4 text-sm text-[#444444]">
            Tulis dan publish artikel untuk blog Kaalupi.
          </p>
        </div>
        <BlogForm />
      </div>
    </div>
  );
}
