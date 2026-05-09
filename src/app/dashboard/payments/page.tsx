import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { PaymentSubmissionsView } from "@/components/payment-submissions-view";

export default async function PaymentsAdminPage() {
  const { userId } = await auth();
  if (!userId) redirect("/login?redirect=/dashboard/payments");
  const user = await currentUser();
  const role = (user?.publicMetadata as { role?: string })?.role;
  if (role !== "admin") redirect("/dashboard");

  return (
    <div className="bg-[#FEFBF5] min-h-screen">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#7AB648]">
              Admin · Pembayaran
            </p>
            <h1 className="mt-2 text-3xl font-extrabold text-[#2D5016]">Manual Payment Queue</h1>
            <p className="mt-2 text-sm text-[#444]">
              Review pembayaran masuk. Approve = enrollment auto-aktif + (kalau Mastery) Founding
              Member badge + email konfirmasi.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="rounded-xl border-2 border-[#2D5016] px-5 py-2.5 text-sm font-semibold text-[#2D5016] transition hover:bg-[#2D5016] hover:text-white"
          >
            ← Dashboard
          </Link>
        </div>

        <PaymentSubmissionsView />
      </div>
    </div>
  );
}
