import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { AffiliatesView } from "@/components/affiliates-view";
import { isSuperAdmin } from "@/lib/auth";
import { getCourses } from "@/lib/content";

export default async function AffiliatesAdminPage() {
  const { userId } = await auth();
  if (!userId) redirect("/login?redirect=/dashboard/affiliates");

  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress ?? "";
  if (!isSuperAdmin(email)) redirect("/dashboard");

  // Course yang bisa dibeli (published, bukan coming soon, ada harga) — buat link referral
  const allCourses = await getCourses();
  const buyableCourses = allCourses
    .filter((c) => c.is_published !== false && !c.comingSoon && c.price > 0)
    .map((c) => ({ slug: c.slug, title: c.title }));

  return (
    <div className="bg-[#FEFBF5] min-h-screen">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#7AB648]">
              Super Admin · Afiliasi
            </p>
            <h1 className="mt-2 text-3xl font-extrabold text-[#2D5016]">Sistem Afiliasi</h1>
            <p className="mt-2 max-w-2xl text-sm text-[#444]">
              Bikin kode referral buat orang yang bantu jualan. Tiap ada yang beli lewat link mereka,
              komisi otomatis keitung. Cuma keluar duit pas penjualan di-approve — variable cost.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="rounded-xl border-2 border-[#2D5016] px-5 py-2.5 text-sm font-semibold text-[#2D5016] transition hover:bg-[#2D5016] hover:text-white"
          >
            ← Dashboard
          </Link>
        </div>

        {/* Cara kerja */}
        <div className="mb-6 rounded-2xl border border-[#F0E8D8] bg-white p-5 shadow-sm">
          <p className="mb-2 text-sm font-bold text-[#2D5016]">Cara kerja</p>
          <ol className="space-y-1.5 text-sm leading-6 text-[#444]">
            <li>1. Bikin afiliasi → dapet kode unik (misal <span className="font-mono font-bold">FAIRUS10</span>).</li>
            <li>2. Klik &quot;Salin Link&quot; → kasih link-nya ke afiliasi buat di-share.</li>
            <li>3. Tiap ada yang beli lewat link itu, kecatet otomatis di sini.</li>
            <li>4. Setelah lu approve pembayarannya, komisi masuk ke &quot;Komisi Terhutang&quot;.</li>
            <li>5. Lu transfer manual ke afiliasi sesuai jumlah yang tertera.</li>
          </ol>
        </div>

        <AffiliatesView courses={buyableCourses} />
      </div>
    </div>
  );
}
