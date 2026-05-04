import { SignIn } from "@clerk/nextjs";
import Link from "next/link";

export default async function LoginPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Left - Info */}
        <div className="flex flex-col justify-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500/20 to-yellow-400/20 lg:mx-0">
            <span className="text-2xl font-black text-amber-300">K</span>
          </div>
          <h1 className="mt-6 text-3xl font-semibold text-white lg:text-4xl">
            Selamat datang di Kaalupi
          </h1>
          <p className="mt-4 text-base leading-7 text-slate-300">
            Platform kursus IT terlengkap untuk meningkatkan skill teknologi kamu. Dari programming hingga cyber security.
          </p>

          <div className="mt-8 space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-500/20">
                <svg className="h-4 w-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-white">Akses Seumur Hidup</p>
                <p className="text-sm text-slate-400">Sekali beli, akses materi selamanya</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-500/20">
                <svg className="h-4 w-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-white">Kurikulum Terkini</p>
                <p className="text-sm text-slate-400">Materi selalu diupdate sesuai industri</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-500/20">
                <svg className="h-4 w-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-white">Belajar Fleksibel</p>
                <p className="text-sm text-slate-400">Akses kapan saja, di mana saja</p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex items-center gap-4 text-sm text-slate-400">
            <span>Belum punya akun?</span>
            <Link href="/courses" className="text-amber-300 hover:text-amber-200">
              Lihat katalog →
            </Link>
          </div>
        </div>

        {/* Right - Sign In Form */}
        <div className="flex items-center justify-center">
          <div className="w-full max-w-sm">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
              <SignIn
                appearance={{
                  elements: {
                    formButtonPrimary:
                      "bg-gradient-to-r from-orange-500 to-yellow-400 text-slate-950 hover:opacity-90 rounded-full text-sm font-semibold",
                    card: "bg-transparent shadow-none",
                    headerTitle: "text-white text-lg",
                    headerSubtitle: "text-slate-400 text-sm",
                    socialButtonsBlockButton: "border-white/10 text-white hover:bg-white/5 rounded-xl",
                    socialButtonsBlockButtonText: "text-sm",
                    formFieldInput: "bg-slate-950/40 border-white/10 text-white rounded-xl text-sm",
                    formFieldLabel: "text-slate-400 text-sm",
                    footerActionLink: "text-amber-300 hover:text-amber-200 text-sm",
                    footerActionText: "text-slate-500 text-sm",
                    dividerLine: "bg-white/10",
                    dividerText: "text-slate-500 text-xs",
                  },
                }}
              />
            </div>

            <div className="mt-6 rounded-xl border border-amber-300/20 bg-amber-300/5 p-5">
              <p className="mb-2 text-xs font-semibold text-amber-300">
                Demo Accounts
              </p>
              <p className="text-xs leading-6 text-slate-400">
                Gunakan email yang sudah terdaftar untuk login. Jika belum punya akun, silakan sign up terlebih dahulu.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
