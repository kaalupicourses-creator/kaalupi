import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-6">
      <div className="rounded-3xl border border-[#F0E8D8] bg-white p-12 text-center shadow-sm max-w-md w-full">
        <p className="text-6xl font-extrabold text-[#F5A62A]">404</p>
        <h1 className="mt-4 text-2xl font-extrabold text-[#2D5016]">Halaman tidak ditemukan</h1>
        <p className="mt-3 text-sm text-[#444444]">Halaman yang kamu cari tidak ada atau sudah dipindahkan.</p>
        <Link href="/" className="mt-8 inline-block rounded-xl bg-[#F5A62A] px-6 py-3 text-sm font-bold text-[#2D5016] hover:opacity-90 transition">
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
