import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { isSuperAdmin } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function requireSuperAdmin() {
  const { userId } = await auth();
  if (!userId) return { error: "Unauthorized", status: 401 as const };
  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress ?? "";
  if (!isSuperAdmin(email)) {
    return { error: "Forbidden — super admin only", status: 403 as const };
  }
  return { ok: true as const };
}

type Affiliate = {
  id: string;
  code: string;
  name: string;
  email: string | null;
  commission_pct: number;
  created_at: string;
};

// GET — list affiliates + laporan komisi
export async function GET() {
  const guard = await requireSuperAdmin();
  if ("error" in guard) {
    return NextResponse.json({ error: guard.error }, { status: guard.status });
  }

  const supabase = getSupabaseAdmin();

  const { data: affiliates } = await supabase
    .from("affiliates")
    .select("*")
    .order("created_at", { ascending: false });

  // Ambil semua submission yg punya referral_code buat hitung komisi
  const { data: subs } = await supabase
    .from("payment_submissions")
    .select("referral_code, amount, status")
    .not("referral_code", "is", null);

  const rows = (affiliates ?? []).map((a: Affiliate) => {
    const mySubs = (subs ?? []).filter((s) => s.referral_code === a.code);
    const approved = mySubs.filter((s) => s.status === "approved");
    const pending = mySubs.filter((s) => s.status === "pending");
    const revenue = approved.reduce((sum, s) => sum + (s.amount ?? 0), 0);
    const commission = Math.round((revenue * a.commission_pct) / 100);
    return {
      ...a,
      sales_count: approved.length,
      pending_count: pending.length,
      revenue,
      commission_owed: commission,
    };
  });

  return NextResponse.json({ affiliates: rows });
}

// POST — bikin afiliasi baru
export async function POST(request: Request) {
  const guard = await requireSuperAdmin();
  if ("error" in guard) {
    return NextResponse.json({ error: guard.error }, { status: guard.status });
  }

  let body: { code?: string; name?: string; email?: string; commission_pct?: number };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const code = body.code?.trim().toUpperCase();
  const name = body.name?.trim();
  const pct = Number(body.commission_pct);

  if (!code || !name) {
    return NextResponse.json({ error: "Kode & nama wajib" }, { status: 400 });
  }
  if (!/^[A-Z0-9]{3,20}$/.test(code)) {
    return NextResponse.json(
      { error: "Kode harus 3-20 karakter, huruf/angka aja (contoh: FAIRUS10)" },
      { status: 400 },
    );
  }
  if (!Number.isFinite(pct) || pct < 0 || pct > 100) {
    return NextResponse.json({ error: "Persen komisi harus 0-100" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("affiliates")
    .insert({
      code,
      name,
      email: body.email?.trim() || null,
      commission_pct: pct,
    })
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ error: "Kode itu udah kepake, pilih yang lain" }, { status: 409 });
    }
    console.error("[admin/affiliates] create failed:", error);
    return NextResponse.json({ error: "Gagal bikin afiliasi" }, { status: 500 });
  }

  return NextResponse.json({ success: true, affiliate: data });
}

// DELETE — hapus afiliasi
export async function DELETE(request: Request) {
  const guard = await requireSuperAdmin();
  if ("error" in guard) {
    return NextResponse.json({ error: guard.error }, { status: guard.status });
  }

  let body: { id?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (!body.id) return NextResponse.json({ error: "id wajib" }, { status: 400 });

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("affiliates").delete().eq("id", body.id);
  if (error) {
    return NextResponse.json({ error: "Gagal hapus afiliasi" }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
