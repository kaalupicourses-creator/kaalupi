import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { getCourseBySlug } from "@/lib/content";

/**
 * POST /api/ai/auto-fill-course
 * Generate semua materi (1 per modul) sekaligus pakai Gemini.
 * Tiap modul jadi 1 materi inti + topik dari `modules[]` di data.ts.
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

  const geminiKey = process.env.GEMINI_API_KEY;
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  if (!geminiKey && !anthropicKey) {
    return NextResponse.json(
      {
        error:
          "GEMINI_API_KEY belum diset. Daftar gratis di https://aistudio.google.com/apikey",
      },
      { status: 500 }
    );
  }

  const supabase = getSupabaseAdmin();
  const results: Array<{ module: number; status: "ok" | "skip" | "error"; reason?: string }> = [];

  for (let moduleIdx = 0; moduleIdx < course.modules.length; moduleIdx++) {
    const moduleTitle = course.modules[moduleIdx];

    // Cek kalau materi udah ada (skip biar idempotent)
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

    let content = "";

    // Try Gemini first
    if (geminiKey) {
      try {
        const r = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${geminiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              systemInstruction: { parts: [{ text: systemPrompt }] },
              contents: [{ role: "user", parts: [{ text: userPrompt }] }],
              generationConfig: { temperature: 0.7, maxOutputTokens: 4096 },
            }),
          }
        );
        if (r.ok) {
          const d = (await r.json()) as {
            candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
          };
          content = d.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
        }
      } catch {
        /* fallthrough */
      }
    }

    // Fallback Claude
    if (!content && anthropicKey) {
      try {
        const r = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": anthropicKey,
            "anthropic-version": "2023-06-01",
          },
          body: JSON.stringify({
            model: "claude-sonnet-4-5-20250929",
            max_tokens: 4000,
            system: systemPrompt,
            messages: [{ role: "user", content: userPrompt }],
          }),
        });
        if (r.ok) {
          const d = (await r.json()) as { content?: Array<{ type: string; text?: string }> };
          content = d.content?.find((c) => c.type === "text")?.text ?? "";
        }
      } catch {
        /* fallthrough */
      }
    }

    if (!content) {
      results.push({ module: moduleIdx, status: "error", reason: "AI gagal generate" });
      continue;
    }

    content = content.replace(/^```html\s*/i, "").replace(/```\s*$/i, "").trim();

    const { error: insertError } = await supabase.from("materials").insert({
      course_slug: courseSlug,
      title: moduleTitle,
      content,
      module_index: moduleIdx,
      order_index: 0,
    });

    if (insertError) {
      results.push({ module: moduleIdx, status: "error", reason: insertError.message });
    } else {
      results.push({ module: moduleIdx, status: "ok" });
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
