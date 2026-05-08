import { SignUp } from "@clerk/nextjs";
import Link from "next/link";

export default async function RegisterPage() {
  return (
    <div className="bg-[#FEFBF5] min-h-screen">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col justify-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#2D5016] lg:mx-0">
              <span className="text-2xl font-black text-[#F5A62A]">K</span>
            </div>
            <h1 className="mt-6 text-3xl font-extrabold text-[#2D5016] lg:text-4xl">
              Mulai Perjalanan Belajarmu
            </h1>
            <p className="mt-4 text-base leading-7 text-[#444444]">
              Daftar gratis dan dapatkan akses ke course IT pertama di Indonesia yang mengintegrasikan AI tools ke setiap project.
            </p>

            <div className="mt-8 space-y-4">
              {[
                { title: "Gratis Selamanya", desc: "Course foundation gratis, akses langsung tanpa bayar" },
                { title: "Belajar Langsung Praktik", desc: "Setiap modul ada project nyata yang bisa masuk portofolio" },
                { title: "AI Terintegrasi", desc: "Pakai AI tools di setiap project, sesuai standar industri" },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-3">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[#E8F5E9]">
                    <svg className="h-4 w-4 text-[#7AB648]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-[#2D5016]">{item.title}</p>
                    <p className="text-sm text-[#444444]">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex items-center gap-4 text-sm text-[#444444]">
              <span>Sudah punya akun?</span>
              <Link href="/login" className="font-semibold text-[#F5A62A] hover:text-[#2D5016] transition">
                Masuk di sini →
              </Link>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="w-full max-w-sm">
              <div className="rounded-2xl border border-[#F0E8D8] bg-white p-8 shadow-sm">
                <SignUp
                  forceRedirectUrl="/onboarding"
                  signInForceRedirectUrl="/dashboard"
                  appearance={{
                    elements: {
                      formButtonPrimary:
                        "bg-[#F5A62A] text-[#2D5016] hover:opacity-90 rounded-xl text-sm font-bold",
                      card: "bg-transparent shadow-none",
                      headerTitle: "text-[#2D5016] text-lg font-extrabold",
                      headerSubtitle: "text-[#444444] text-sm",
                      socialButtonsBlockButton: "border-[#F0E8D8] text-[#2D5016] hover:bg-[#FEFBF5] rounded-xl",
                      socialButtonsBlockButtonText: "text-sm font-semibold",
                      formFieldInput: "bg-[#FEFBF5] border-[#F0E8D8] text-[#444444] rounded-xl text-sm focus:border-[#F5A62A]",
                      formFieldLabel: "text-[#2D5016] text-sm font-semibold",
                      footerActionLink: "text-[#F5A62A] hover:text-[#2D5016] text-sm font-semibold",
                      footerActionText: "text-[#444444] text-sm",
                      dividerLine: "bg-[#F0E8D8]",
                      dividerText: "text-[#444444] text-xs",
                    },
                  }}
                />
              </div>

              <div className="mt-6 rounded-xl border border-[#F0E8D8] bg-[#FFF3D6] p-5">
                <p className="mb-2 text-xs font-bold text-[#5C4813]">
                  💡 Kenapa daftar di Kaalupi?
                </p>
                <ul className="space-y-1.5 text-xs leading-6 text-[#444444]">
                  <li>✅ Course gratis untuk pemula — langsung akses</li>
                  <li>✅ Sertifikat resmi + badge pencapaian</li>
                  <li>✅ Belajar pakai AI tools dari hari pertama</li>
                  <li>✅ Garansi 14 hari uang kembali untuk course premium</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
