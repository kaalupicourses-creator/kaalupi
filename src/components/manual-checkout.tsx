"use client";

import { useState } from "react";
import Link from "next/link";
import type { PaymentMethod } from "@/lib/data";

interface Props {
  courseSlug: string;
  courseTitle: string;
  amount: number;
  userEmail: string;
  userName: string;
  isMastery: boolean;
  paymentMethods: PaymentMethod[];
  referralCode?: string | null;
  foundingBundlePrice?: number | null;
}

const formatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

export function ManualCheckout({
  courseSlug,
  courseTitle,
  amount,
  userEmail,
  userName,
  isMastery,
  paymentMethods,
  referralCode,
  foundingBundlePrice,
}: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [senderAccount, setSenderAccount] = useState("");
  const [refInput, setRefInput] = useState(referralCode ?? "");
  const [tier, setTier] = useState<"course" | "founding">(
    foundingBundlePrice ? "founding" : "course",
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const activeMethod = paymentMethods.find((m) => m.id === selected);
  const effectiveAmount =
    foundingBundlePrice && tier === "founding" ? foundingBundlePrice : amount;

  function copyValue(value: string, label: string) {
    if (typeof navigator === "undefined" || !navigator.clipboard) return;
    navigator.clipboard.writeText(value).then(() => {
      setCopiedField(label);
      setTimeout(() => setCopiedField(null), 1500);
    });
  }

  async function submitProof() {
    if (!selected) {
      setError("Pilih metode pembayaran dulu");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const r = await fetch("/api/payment-submission", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          course_slug: courseSlug,
          payment_method: selected,
          sender_account: senderAccount.trim() || null,
          referral_code: refInput.trim() || null,
          tier: foundingBundlePrice ? tier : undefined,
        }),
      });
      const d = await r.json();
      if (!r.ok) {
        if (d.already_enrolled) {
          window.location.href = `/access/${courseSlug}`;
          return;
        }
        if (d.already_pending) {
          setError(d.error ?? "Submission lama lu masih nunggu");
          return;
        }
        setError(d.error ?? "Gagal submit");
        return;
      }
      // Redirect to WhatsApp with pre-filled message
      window.location.href = `/payment/pending?id=${encodeURIComponent(d.submission_id)}&wa=${encodeURIComponent(d.whatsapp_url)}`;
    } catch {
      setError("Koneksi terputus, coba lagi");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#7AB648]">Checkout</p>
        <h1 className="mt-2 text-3xl font-extrabold text-[#2D5016]">Bayar pakai metode favorit lu</h1>
        <p className="mt-2 text-sm text-[#444]">
          Pilih metode → transfer manual → klik &quot;Saya Sudah Bayar&quot; → kirim bukti via WhatsApp.
          Akses course aktif begitu admin konfirmasi (biasanya &lt; 1 jam jam kerja).
        </p>
        {/* Kode referral / marketing — biar tau customer dari mana (buat komisi marketer) */}
        <div className="mt-4 rounded-xl border border-[#F0E8D8] bg-white p-4">
          <label className="text-xs font-bold text-[#2D5016]">
            Kode referral / nama yang ngajak <span className="font-normal text-[#5C4813]">(opsional)</span>
          </label>
          <p className="mt-0.5 text-xs text-[#5C4813]">
            Kalau lu tau Kaalupi dari temen/marketing kita, masukin kodenya di sini biar dia dapet apresiasi.
          </p>
          <input
            value={refInput}
            onChange={(e) => setRefInput(e.target.value.toUpperCase())}
            placeholder="Contoh: RENDI20"
            className="mt-2 w-full rounded-lg border border-[#F0E8D8] bg-[#FEFBF5] px-3 py-2 text-sm font-mono text-[#2D5016] focus:border-[#F5A62A] focus:outline-none"
          />
          {referralCode && (
            <p className="mt-1.5 text-[11px] font-semibold text-[#7AB648]">
              ✓ Kode dari link kepasang otomatis
            </p>
          )}
        </div>
      </div>

      {/* Pilih paket (cuma di course flagship, kalau slot founding masih ada) */}
      {foundingBundlePrice && (
        <section className="rounded-2xl border border-[#F0E8D8] bg-white p-6">
          <p className="text-xs font-bold uppercase tracking-wider text-[#7AB648] mb-4">
            Pilih paket
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setTier("course")}
              className={`rounded-xl border-2 p-4 text-left transition ${tier === "course" ? "border-[#F5A62A] bg-[#FFF3D6]" : "border-[#F0E8D8] bg-white hover:border-[#F5A62A]/50"}`}
            >
              <p className="text-sm font-extrabold text-[#2D5016]">Course Aja</p>
              <p className="mt-1 text-2xl font-black text-[#2D5016]">{formatter.format(amount)}</p>
              <p className="mt-1 text-xs text-[#5C4813]">Akses course ini seumur hidup.</p>
            </button>
            <button
              type="button"
              onClick={() => setTier("founding")}
              className={`relative rounded-xl border-2 p-4 text-left transition ${tier === "founding" ? "border-[#F5A62A] bg-[#FFF3D6]" : "border-[#F0E8D8] bg-white hover:border-[#F5A62A]/50"}`}
            >
              <span className="absolute -top-2.5 right-3 rounded-full bg-[#2D5016] px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-[#F5A62A]">
                Paling Worth It
              </span>
              <p className="text-sm font-extrabold text-[#2D5016]">Course + Founding Member</p>
              <p className="mt-1 text-2xl font-black text-[#F5A62A]">{formatter.format(foundingBundlePrice)}</p>
              <p className="mt-1 text-xs text-[#5C4813]">
                Course ini + <strong>course pemula & akademik gratis</strong> + diskon 25% semua course premium + Discord eksklusif.
              </p>
            </button>
          </div>
          <p className="mt-3 text-xs text-[#5C4813]">
            🔥 Founding Member cuma buat <strong>100 orang pertama</strong>. Setelah penuh, opsi ini ditutup.
          </p>
        </section>
      )}

      {/* Step 1: Pick method */}
      <section className="rounded-2xl border border-[#F0E8D8] bg-white p-6">
        <p className="text-xs font-bold uppercase tracking-wider text-[#7AB648] mb-4">
          Step 1 · Pilih metode
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {paymentMethods.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setSelected(m.id)}
              className={`flex items-center gap-3 rounded-xl border-2 p-4 text-left transition ${
                selected === m.id
                  ? "border-[#F5A62A] bg-[#FFF3D6]"
                  : "border-[#F0E8D8] bg-[#FEFBF5] hover:border-[#F5A62A]"
              }`}
            >
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-white text-lg">
                {m.id === "dana" && (
                  <svg className="h-5 w-5 text-[#118EEA]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.18L19.82 8 12 11.82 4.18 8 12 4.18z" />
                  </svg>
                )}
                {m.id === "bca" && <span className="text-xs font-extrabold text-[#0050AE]">BCA</span>}
                {m.id === "bsi" && <span className="text-[10px] font-extrabold text-[#00A754]">BSI</span>}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-[#2D5016] truncate">{m.name}</p>
                <p className="text-xs text-[#5C4813] capitalize">{m.type}</p>
              </div>
              {selected === m.id && (
                <svg className="h-5 w-5 flex-shrink-0 text-[#F5A62A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Step 2: Show details for selected method */}
      {activeMethod && (
        <section className="rounded-2xl border border-[#F5A62A] bg-[#FFF3D6] p-6">
          <p className="text-xs font-bold uppercase tracking-wider text-[#7AB648] mb-4">
            Step 2 · Transfer ke {activeMethod.name}
          </p>

          <div className="space-y-3">
            <div className="rounded-xl border border-[#F5A62A]/40 bg-white p-4">
              <p className="text-xs text-[#5C4813]">Nama penerima</p>
              <p className="mt-1 text-base font-bold text-[#2D5016]">{activeMethod.accountName}</p>
            </div>

            <div className="rounded-xl border border-[#F5A62A]/40 bg-white p-4">
                <p className="text-xs text-[#5C4813]">
                  {activeMethod.type === "ewallet" ? "Nomor DANA" : "Nomor rekening"}
                </p>
                <div className="mt-1 flex items-center gap-3">
                  <p className="text-xl font-extrabold text-[#2D5016] font-mono">
                    {activeMethod.accountNumber}
                  </p>
                  <button
                    type="button"
                    onClick={() => copyValue(activeMethod.accountNumber.replace(/\D/g, ""), "account")}
                    className="rounded-lg bg-[#2D5016] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#1A3A0F]"
                  >
                    {copiedField === "account" ? "Tersalin!" : "Salin"}
                  </button>
                </div>
              </div>

            <div className="rounded-xl border border-[#F5A62A]/40 bg-white p-4">
              <p className="text-xs text-[#5C4813]">Jumlah transfer</p>
              <div className="mt-1 flex items-center gap-3">
                <p className="text-2xl font-extrabold text-[#F5A62A]">
                  {formatter.format(effectiveAmount)}
                </p>
                <button
                  type="button"
                  onClick={() => copyValue(String(effectiveAmount), "amount")}
                  className="rounded-lg bg-[#2D5016] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#1A3A0F]"
                >
                  {copiedField === "amount" ? "Tersalin!" : "Salin nominal"}
                </button>
              </div>
              <p className="mt-2 text-xs text-[#5C4813]">
                ⚠️ Transfer pakai nominal yang <strong>sama persis</strong> supaya admin lebih cepat verify.
              </p>
            </div>


            <div className="rounded-xl bg-white/50 p-4 text-xs leading-6 text-[#5C4813]">
              <strong className="block text-[#2D5016] mb-1">Cara bayar:</strong>
              {activeMethod.instructions}
            </div>
          </div>
        </section>
      )}

      {/* Step 3: Confirm */}
      {activeMethod && (
        <section className="rounded-2xl border border-[#F0E8D8] bg-white p-6">
          <p className="text-xs font-bold uppercase tracking-wider text-[#7AB648] mb-4">
            Step 3 · Konfirmasi pembayaran
          </p>
          <p className="text-sm text-[#444] mb-4">
            Setelah transfer, klik tombol di bawah. Lu bakal di-redirect ke WhatsApp Admin Kaalupi
            dengan pesan udah ke-pre-fill — tinggal klik <strong>Send</strong>.
          </p>

          <label className="block text-xs font-semibold text-[#2D5016] mb-2">
            (Opsional) Nama / no rekening pengirim:
          </label>
          <input
            type="text"
            value={senderAccount}
            onChange={(e) => setSenderAccount(e.target.value)}
            placeholder={
              activeMethod.type === "ewallet"
                ? "08xxxxxxxxxx atas nama..."
                : "Nama atas nama / no rekening pengirim"
            }
            className="w-full rounded-xl border border-[#F0E8D8] bg-[#FEFBF5] px-4 py-2.5 text-sm text-[#444] placeholder:text-[#999] focus:border-[#F5A62A] focus:outline-none"
          />
          <p className="mt-2 text-xs text-[#5C4813]">
            Bantu admin matching dana lebih cepat. Boleh kosong kalau lupa.
          </p>

          {error && (
            <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
          )}

          <button
            type="button"
            onClick={submitProof}
            disabled={submitting}
            className="mt-5 w-full rounded-xl bg-[#25D366] px-5 py-4 text-base font-extrabold text-white shadow-md transition hover:opacity-90 disabled:opacity-60"
          >
            {submitting ? "Memproses..." : "Saya Sudah Bayar — Kirim Bukti via WhatsApp"}
          </button>
          <p className="mt-2 text-center text-xs text-[#5C4813]">
            Pesan akan otomatis berisi: course, jumlah, metode, email lu, &amp; submission ID.
          </p>
        </section>
      )}

      <details className="rounded-2xl border border-[#F0E8D8] bg-white p-5 open:shadow-sm">
        <summary className="cursor-pointer text-sm font-semibold text-[#2D5016]">
          Cara Kaalupi verify pembayaran (klik untuk detail)
        </summary>
        <ol className="mt-4 space-y-3 text-sm leading-7 text-[#444] pl-5 list-decimal">
          <li>Lu transfer manual ke rekening / e-wallet di atas.</li>
          <li>Klik &quot;Saya Sudah Bayar&quot; → di-redirect ke WhatsApp Admin dgn pesan auto-fill.</li>
          <li>Tinggal klik Send. Pesan udah berisi info lengkap (course, email, jumlah, ID).</li>
          <li>Admin terima notif di dashboard internal &amp; verifikasi dana di rekening.</li>
          <li>Begitu valid, admin approve di dashboard. Akses course lu otomatis aktif.</li>
          <li>{isMastery
            ? "Founding Member badge + 100 bonus poin auto-grant. Email konfirmasi + invite Discord eksklusif dikirim."
            : "Email konfirmasi dikirim, course masuk dashboard lu."}</li>
        </ol>
      </details>

      <Link
        href={`/courses/${courseSlug}`}
        className="inline-flex items-center gap-1 text-xs font-semibold text-[#5C4813] hover:text-[#F5A62A]"
      >
        ← Kembali ke detail course
      </Link>
    </div>
  );
}
