import Link from "next/link";
import { PaymentPendingRedirect } from "@/components/payment-pending-redirect";

export default async function PaymentPendingPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string; wa?: string }>;
}) {
  const sp = await searchParams;
  const submissionId = sp.id ?? "";
  const waUrl = sp.wa ?? "";

  return (
    <div className="bg-[#FEFBF5] min-h-screen">
      <div className="mx-auto max-w-2xl px-6 py-16">
        <div className="rounded-3xl border-2 border-[#F5A62A] bg-white p-8 shadow-md">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FFF3D6]">
            <svg className="h-8 w-8 text-[#F5A62A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 className="text-center text-2xl font-extrabold text-[#2D5016]">
            Submission udah masuk!
          </h1>
          <p className="mt-3 text-center text-sm leading-6 text-[#444]">
            Sekarang lu tinggal kirim notifikasi ke Admin via WhatsApp. Pesannya udah ke-pre-fill —
            tinggal klik <strong>Send</strong> di WhatsApp.
          </p>

          <div className="mt-6 rounded-xl bg-[#FFF3D6] p-4 text-xs text-[#5C4813]">
            <strong className="block text-[#2D5016] mb-1">ID Submission</strong>
            <code className="font-mono">{submissionId || "(error)"}</code>
            <p className="mt-2">Catat ID ini buat referensi kalau perlu follow up.</p>
          </div>

          <PaymentPendingRedirect waUrl={waUrl} />

          <div className="mt-8 rounded-xl border border-[#F0E8D8] bg-[#FEFBF5] p-4">
            <p className="text-sm font-bold text-[#2D5016]">Setelah kirim WA, apa yg terjadi?</p>
            <ol className="mt-3 space-y-1.5 text-xs leading-5 text-[#444] list-decimal pl-5">
              <li>Admin terima notif di dashboard internal Kaalupi.</li>
              <li>Admin cek dana masuk ke rekening / e-wallet.</li>
              <li>Begitu valid (biasanya &lt; 1 jam jam kerja), admin approve.</li>
              <li>Lu dapet email konfirmasi + akses course aktif otomatis di dashboard.</li>
            </ol>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm">
            <Link
              href="/dashboard"
              className="rounded-xl border-2 border-[#2D5016] px-5 py-2.5 font-bold text-[#2D5016] hover:bg-[#2D5016] hover:text-white"
            >
              Buka Dashboard
            </Link>
            <Link
              href="/courses"
              className="text-[#5C4813] font-semibold hover:text-[#F5A62A]"
            >
              Kembali ke katalog
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
