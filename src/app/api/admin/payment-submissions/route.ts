import { NextResponse } from "next/server";
import { auth, currentUser, clerkClient } from "@clerk/nextjs/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { sendApprovalEmail } from "@/lib/email";
import { courses } from "@/lib/data";

export const runtime = "nodejs";

async function requireAdmin() {
  const { userId } = await auth();
  if (!userId) return { error: "Unauthorized", status: 401 as const };
  const user = await currentUser();
  const role = (user?.publicMetadata as { role?: string })?.role;
  if (role !== "admin") return { error: "Forbidden — admin only", status: 403 as const };
  return {
    ok: true as const,
    adminEmail: user?.primaryEmailAddress?.emailAddress ?? "",
  };
}

// GET /api/admin/payment-submissions?status=pending|approved|rejected|all
export async function GET(request: Request) {
  const guard = await requireAdmin();
  if ("error" in guard) {
    return NextResponse.json({ error: guard.error }, { status: guard.status });
  }

  const url = new URL(request.url);
  const statusFilter = url.searchParams.get("status") ?? "all";

  const supabase = getSupabaseAdmin();
  let query = supabase
    .from("payment_submissions")
    .select("*")
    .order("submitted_at", { ascending: false })
    .limit(200);

  if (statusFilter !== "all") {
    query = query.eq("status", statusFilter);
  }

  const { data, error } = await query;
  if (error) {
    console.error("[admin/payment-submissions] list failed:", error);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }

  // Pisahin tim founder (admin/instructor) dari list — supaya yang ditampilin
  // di "Founding Members" tab ngga termasuk tim sendiri.
  // Kita cek pakai role di Clerk: skip user dgn role admin atau instructor.
  // Untuk efisiensi, cukup return semua, frontend yg filter.
  return NextResponse.json({
    submissions: data,
    counts: {
      total: data.length,
    },
  });
}

// PATCH /api/admin/payment-submissions
// body: { id, action: 'approve' | 'reject', notes? }
export async function PATCH(request: Request) {
  const guard = await requireAdmin();
  if ("error" in guard) {
    return NextResponse.json({ error: guard.error }, { status: guard.status });
  }

  let body: { id?: string; action?: "approve" | "reject"; notes?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { id, action, notes } = body;
  if (!id || !action) {
    return NextResponse.json({ error: "id dan action wajib" }, { status: 400 });
  }
  if (action !== "approve" && action !== "reject") {
    return NextResponse.json({ error: "action harus approve atau reject" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();

  const { data: submission, error: fetchErr } = await supabase
    .from("payment_submissions")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchErr || !submission) {
    return NextResponse.json({ error: "Submission tidak ditemukan" }, { status: 404 });
  }
  if (submission.status !== "pending") {
    return NextResponse.json(
      { error: `Submission sudah berstatus ${submission.status}, ngga bisa diubah lagi.` },
      { status: 400 },
    );
  }

  const newStatus = action === "approve" ? "approved" : "rejected";
  const { error: updateErr } = await supabase
    .from("payment_submissions")
    .update({
      status: newStatus,
      notes: notes ?? null,
      reviewed_at: new Date().toISOString(),
      reviewed_by: guard.adminEmail,
    })
    .eq("id", id);

  if (updateErr) {
    console.error("[admin/payment-submissions] update failed:", updateErr);
    return NextResponse.json({ error: "Gagal update status" }, { status: 500 });
  }

  // Kalau approve, buat enrollment + (kalau Mastery) Founding Member badge + bonus poin
  let foundingBadgeAwarded = false;
  if (action === "approve") {
    const { error: enrollErr } = await supabase.from("enrollments").upsert(
      {
        user_email: submission.user_email,
        course_slug: submission.course_slug,
        status: "active",
      },
      { onConflict: "user_email,course_slug" },
    );

    if (enrollErr) {
      console.error("[admin/payment-submissions] enrollment failed:", enrollErr);
    }

    // Auto-create order record juga buat audit trail
    await supabase.from("orders").upsert(
      {
        order_id: `manual-${submission.id}`,
        user_email: submission.user_email,
        course_slug: submission.course_slug,
        amount: submission.amount,
        status: "paid",
        payment_type: `manual_${submission.payment_method}`,
        midtrans_response: { manual: true, submission_id: submission.id },
      },
      { onConflict: "order_id" },
    );

    // Founding Member badge — CUMA kalau beli tier Founding (bayar founding_bundle_price), bukan course-aja
    const flagship = courses.find((c) => c.slug === submission.course_slug);
    const boughtFoundingTier =
      !!flagship?.founding_bundle_price && (submission.amount ?? 0) >= flagship.founding_bundle_price;

    if (boughtFoundingTier) {
      // Cap 100 founding member — hitung dari badge (bukan enrollment, karena tier 50K jg enroll)
      const { data: fb } = await supabase
        .from("badges").select("id").eq("name", "Founding Member").maybeSingle();
      let foundingCount = 0;
      if (fb?.id) {
        const { count } = await supabase
          .from("user_badges").select("id", { count: "exact", head: true }).eq("badge_id", fb.id);
        foundingCount = count ?? 0;
      }

      if (foundingCount < 100) {
        let { data: badge } = await supabase
          .from("badges")
          .select("id")
          .eq("name", "Founding Member")
          .maybeSingle();

        if (!badge) {
          const { data: newBadge } = await supabase
            .from("badges")
            .insert({
              name: "Founding Member",
              description:
                "Salah satu dari 100 orang pertama yang percaya sama Kaalupi dari hari pertama.",
              icon: "🏛️",
              required_points: 0,
            })
            .select()
            .single();
          badge = newBadge;
        }

        if (badge?.id) {
          await supabase.from("user_badges").upsert(
            { user_email: submission.user_email, badge_id: badge.id },
            { onConflict: "user_email,badge_id" },
          );
          foundingBadgeAwarded = true;

          // Set Clerk metadata + auto-enroll ke course founding_free lain (perk founding member)
          try {
            const clerk = await clerkClient();
            const ul = await clerk.users.getUserList({ emailAddress: [submission.user_email], limit: 1 });
            const tu = ul.data[0];
            if (tu) {
              await clerk.users.updateUserMetadata(tu.id, {
                publicMetadata: { ...(tu.publicMetadata ?? {}), is_founding_member: true },
              });
            }
            // Cuma course yang UDAH LAUNCH (bukan comingSoon) — biar dashboard ga penuh course kosong
            const freeSlugs = courses
              .filter(
                (c) =>
                  c.founding_free &&
                  c.is_published !== false &&
                  !c.comingSoon &&
                  c.slug !== submission.course_slug,
              )
              .map((c) => c.slug);
            await Promise.all(
              freeSlugs.map((slug) =>
                supabase.from("enrollments").upsert(
                  { user_email: submission.user_email, course_slug: slug, status: "active" },
                  { onConflict: "user_email,course_slug" },
                ),
              ),
            );
          } catch (err) {
            console.error("[approve] set founding metadata failed:", err);
          }

          // 100 bonus poin
          const { data: existingPoints } = await supabase
            .from("user_points")
            .select("points")
            .eq("user_email", submission.user_email)
            .maybeSingle();
          const newPoints =
            ((existingPoints?.points as number | undefined) ?? 0) + 100;
          await supabase
            .from("user_points")
            .upsert(
              { user_email: submission.user_email, points: newPoints },
              { onConflict: "user_email" },
            );
        }
      }
    }

    // Send congrats email — best-effort, tidak gagalin response
    try {
      await sendApprovalEmail({
        to: submission.user_email,
        userName: submission.user_name ?? submission.user_email,
        courseTitle: submission.course_title ?? submission.course_slug,
        isFoundingMember: foundingBadgeAwarded,
      });
    } catch (err) {
      console.error("[admin/payment-submissions] email send failed:", err);
    }
  }

  return NextResponse.json({
    success: true,
    new_status: newStatus,
    founding_badge_awarded: foundingBadgeAwarded,
  });
}
