import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-24">
      <div className="rounded-[2rem] border border-white/10 bg-white/5 p-10 text-center">
        <p className="text-sm text-amber-300">404</p>
        <h1 className="mt-4 text-4xl font-semibold text-white">Halaman tidak ditemukan</h1>
        <Link href="/" className="mt-6 inline-block rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950">
          Kembali ke home
        </Link>
      </div>
    </div>
  );
}
