import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

/**
 * POST /api/ai/generate-material
 * Generate konten materi pakai Anthropic Claude API.
 * Auto-save ke materials table.
 *
 * Body: { course_slug, course_title, module_title, module_index, topic, length }
 * length: "short" (200-400 kata) | "medium" (500-900 kata) | "long" (1000-1800 kata)
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

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY belum diset di .env" },
      { status: 500 }
    );
  }

  const wordTarget =
    body.length === "short" ? "200-400" : body.length === "long" ? "1000-1800" : "500-900";

  const systemPrompt = `Lu adalah instructor course IT Indonesia yang menulis materi belajar yang gampang dicerna pemula.

Aturan output WAJIB:
- Bahasa Indonesia casual-profesional (kayak ngobrol sama temen tapi tetap rapi)
- Format HTML clean: <h2>, <h3>, <p>, <ul>, <li>, <strong>, <em>, <code>, <pre>
- Bagi materi dengan <h2> untuk section utama, <h3> untuk sub-section
- Selalu ada: pembukaan kasih konteks → penjelasan inti → contoh konkret → ringkasan → mini exercise/refleksi
- Hindari jargon ngga perlu. Kalau pakai istilah teknis, langsung jelasin singkat.
- Panjang konten: ${wordTarget} kata
- Jangan tulis preamble seperti "Berikut materi..." langsung ke kontennya.`;

  const userPrompt = `Tulis materi belajar untuk course berikut:

**Course**: ${body.course_title}
**Modul**: ${body.module_title}
**Topik spesifik**: ${body.topic}

Output: HTML siap pakai (tanpa wrapper <html><body>, langsung dari <h2>).`;

  try {
    const claudeRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-5-20250929",
        max_tokens: 4000,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
      }),
    });

    if (!claudeRes.ok) {
      const errText = await claudeRes.text();
      console.error("[Claude] error:", errText);
      return NextResponse.json(
        { error: "AI generation gagal. Cek ANTHROPIC_API_KEY." },
        { status: 500 }
      );
    }

    const claudeData = (await claudeRes.json()) as {
      content?: Array<{ type: string; text?: string }>;
    };
    const content = claudeData.content?.find((c) => c.type === "text")?.text ?? "";
    if (!content) {
      return NextResponse.json({ error: "AI tidak mengembalikan konten." }, { status: 500 });
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
      title: body.topic ?? "Materi AI Generated",
      content,
      module_index: body.module_index ?? 0,
      order_index: nextOrder,
    });

    if (insertError) {
      console.error("[AI generate save] error:", insertError.message);
      return NextResponse.json(
        { error: "Generated tapi gagal save ke DB." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("[AI generate] error:", e);
    return NextResponse.json({ error: "Internal error." }, { status: 500 });
  }
}
