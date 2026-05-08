import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { UserProfile } from "@clerk/nextjs";

export default async function ProfilePage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/login?redirect=/profile");
  }

  return (
    <div className="bg-[#FEFBF5] min-h-screen">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#444] hover:text-[#F5A62A]"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Kembali ke Dashboard
            </Link>
            <h1 className="mt-3 text-3xl font-extrabold text-[#2D5016]">Profil Kamu</h1>
            <p className="mt-2 text-sm text-[#444]">
              Atur foto, nama, username, email, dan keamanan akun. Perubahan langsung sinkron ke
              dashboard dan sertifikat.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-[#F0E8D8] bg-white p-2 sm:p-6 shadow-sm">
          <UserProfile
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "shadow-none border-0 bg-transparent",
                navbar: "bg-[#FEFBF5] border-r border-[#F0E8D8]",
                navbarButton: "text-[#2D5016] font-semibold",
                navbarButtonActive: "bg-[#FFF3D6] text-[#2D5016]",
                profileSectionPrimaryButton:
                  "bg-[#F5A62A] text-[#2D5016] hover:opacity-90 rounded-xl text-sm font-bold",
                formButtonPrimary:
                  "bg-[#F5A62A] text-[#2D5016] hover:opacity-90 rounded-xl text-sm font-bold",
                formFieldInput:
                  "bg-[#FEFBF5] border-[#F0E8D8] text-[#444] rounded-xl text-sm focus:border-[#F5A62A]",
                formFieldLabel: "text-[#2D5016] text-sm font-semibold",
                headerTitle: "text-[#2D5016] text-lg font-extrabold",
                headerSubtitle: "text-[#444] text-sm",
                badge: "bg-[#FFF3D6] text-[#5C4813]",
                profileSectionTitle: "text-[#2D5016] font-extrabold",
                profileSectionSubtitle: "text-[#444]",
              },
            }}
            path="/profile"
            routing="path"
          />
        </div>
      </div>
    </div>
  );
}
