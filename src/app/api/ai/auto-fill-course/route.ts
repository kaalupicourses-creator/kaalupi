import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { getCourseBySlug } from "@/lib/content";
import { generateContent } from "@/lib/ai-provider";

/**
 * POST /api/ai/auto-fill-course
 * Generate 1 materi pembuka per modul (idempotent: skip yang udah ada).
 *
 * Body: { course_slug }
 */
export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Akses ditolak." }, { status: 401 });

  const clerk = await clerkClient();
  const user = await clerk.users.getUser(userId);
  const role = (user.publicMetadata as { role?: string })?.role;
  if (role !== "admin" && role !== "instructor") {
    return NextResponse.json({ error: "Hanya admin/instructor." }, { status: 403 });
  }

  const body = (await request.json()) as { course_slug?: string };
  const courseSlug = body.course_slug?.trim();
  if (!courseSlug) {
    return NextResponse.json({ error: "course_slug wajib." }, { status: 400 });
  }

  const course = await getCourseBySlug(courseSlug);
  if (!course) {
    return NextResponse.json({ error: "Course tidak ditemukan." }, { status: 404 });
  }

  const supabase = getSupabaseAdmin();
  const results: Array<{
    module: number;
    status: "ok" | "skip" | "error";
    reason?: string;
    provider?: string;
  }> = [];

  for (let moduleIdx = 0; moduleIdx < course.modules.length; moduleIdx++) {
    const moduleTitle = course.modules[moduleIdx];

    // Idempotent: skip kalau modul ini udah punya materi order_index 0
    const { data: existing } = await supabase
      .from("materials")
      .select("id")
      .eq("course_slug", courseSlug)
      .eq("module_index", moduleIdx)
      .eq("order_index", 0)
      .maybeSingle();

    if (existing) {
      results.push({ module: moduleIdx, status: "skip", reason: "sudah ada" });
      continue;
    }

    const systemPrompt = `Lu adalah instructor course IT Indonesia yang nulis materi belajar gampang dicerna pemula.
Aturan WAJIB:
- Bahasa Indonesia casual-profesional
- Format HTML clean: <h2>, <h3>, <p>, <ul>, <li>, <strong>, <em>, <code>, <pre>
- Struktur: pembukaan kasih konteks → penjelasan inti (3-5 sub-section) → contoh konkret di Indonesia → ringkasan → mini exercise
- 700-1200 kata
- Jangan tulis preamble, langsung mulai dari <h2>`;

    const userPrompt = `Tulis materi belajar untuk:
**Course**: ${course.title}
**Modul**: ${moduleTitle}

Buat materi PEMBUKA modul ini yang kasih overview lengkap topik. Output HTML siap pakai.`;

    const ai = await generateContent(systemPrompt, userPrompt, 4096);

    if (!ai.content) {
      results.push({ module: moduleIdx, status: "error", reason: ai.error ?? "AI kosong" });
      continue;
    }

    const { error: insertError } = await supabase.from("materials").insert({
      course_slug: courseSlug,
      title: moduleTitle,
      content: ai.content,
      module_index: moduleIdx,
      order_index: 0,
    });

    if (insertError) {
      results.push({ module: moduleIdx, status: "error", reason: insertError.message });
    } else {
      results.push({ module: moduleIdx, status: "ok", provider: ai.provider });
    }
  }

  const okCount = results.filter((r) => r.status === "ok").length;
  const skipCount = results.filter((r) => r.status === "skip").length;
  const errCount = results.filter((r) => r.status === "error").length;

  return NextResponse.json({
    success: errCount === 0,
    summary: { generated: okCount, skipped: skipCount, errors: errCount },
    details: results,
  });
}
