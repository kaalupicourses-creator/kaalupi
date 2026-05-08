import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { generateContent } from "@/lib/ai-provider";

/**
 * POST /api/ai/generate-material
 * Body: { course_slug, course_title, module_title, module_index, topic, length }
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

  const body = (await request.json()) as {
    course_slug?: string;
    course_title?: string;
    module_title?: string;
    module_index?: number;
    topic?: string;
    length?: "short" | "medium" | "long";
  };

  if (!body.topic?.trim()) {
    return NextResponse.json({ error: "Topik wajib diisi." }, { status: 400 });
  }

  const wordTarget =
    body.length === "short" ? "200-400" : body.length === "long" ? "1000-1800" : "500-900";

  const systemPrompt = `Lu adalah instructor course IT Indonesia yang nulis materi belajar gampang dicerna pemula.

Aturan output WAJIB:
- Bahasa Indonesia casual-profesional (kayak ngobrol sama temen, tapi rapi)
- Format HTML clean: <h2>, <h3>, <p>, <ul>, <li>, <strong>, <em>, <code>, <pre>
- Bagi materi: <h2> untuk section utama, <h3> untuk sub-section
- Struktur: pembukaan kasih konteks → penjelasan inti → contoh konkret → ringkasan → mini exercise/refleksi
- Hindari jargon ngga perlu. Kalau pakai istilah teknis, langsung jelasin singkat.
- Panjang ${wordTarget} kata
- Jangan tulis preamble seperti "Berikut materi..." langsung ke kontennya.`;

  const userPrompt = `Tulis materi belajar untuk:

**Course**: ${body.course_title ?? "Course"}
**Modul**: ${body.module_title ?? "Modul"}
**Topik spesifik**: ${body.topic}

Output: HTML siap pakai (tanpa wrapper <html><body>, langsung dari <h2>).`;

  const result = await generateContent(systemPrompt, userPrompt, 4096);

  if (!result.content) {
    return NextResponse.json(
      { error: result.error ?? "AI gagal generate materi." },
      { status: 500 }
    );
  }

  // Auto-save ke DB
  const supabase = getSupabaseAdmin();
  const { data: existing } = await supabase
    .from("materials")
    .select("order_index")
    .eq("course_slug", body.course_slug ?? "")
    .eq("module_index", body.module_index ?? 0)
    .order("order_index", { ascending: false })
    .limit(1);

  const nextOrder = ((existing?.[0]?.order_index as number | undefined) ?? -1) + 1;

  const { error: insertError } = await supabase.from("materials").insert({
    course_slug: body.course_slug,
    title: body.topic,
    content: result.content,
    module_index: body.module_index ?? 0,
    order_index: nextOrder,
  });

  if (insertError) {
    console.error("[AI generate save] error:", insertError.message);
    return NextResponse.json(
      { error: `Generated tapi gagal save: ${insertError.message}` },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, provider: result.provider });
}
