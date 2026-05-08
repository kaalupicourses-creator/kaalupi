import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { generateContent } from "@/lib/ai-provider";
import { getEnrollments } from "@/lib/db";
import { getCourseBySlug } from "@/lib/content";

export const runtime = "nodejs";

type Message = { role: "user" | "assistant"; content: string };

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await currentUser();
  const userEmail = user?.primaryEmailAddress?.emailAddress ?? "";

  let body: { courseSlug?: string; moduleIndex?: number; messages?: Message[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { courseSlug, moduleIndex = 0, messages = [] } = body;
  if (!courseSlug || messages.length === 0) {
    return NextResponse.json({ error: "courseSlug and messages required" }, { status: 400 });
  }

  // Verify enrollment to gate AI Tutor as a paid perk
  let enrollments: string[] = [];
  try {
    enrollments = await getEnrollments(userEmail);
  } catch (err) {
    console.error("[ai/tutor] getEnrollments failed:", err);
  }
  if (!enrollments.includes(courseSlug)) {
    return NextResponse.json(
      { error: "Daftar/beli course ini dulu untuk akses AI Tutor" },
      { status: 403 },
    );
  }

  const course = await getCourseBySlug(courseSlug);
  if (!course) {
    return NextResponse.json({ error: "Course tidak ditemukan" }, { status: 404 });
  }

  const moduleTitle = course.modules[moduleIndex] ?? course.modules[0] ?? "";
  const systemPrompt = `Lu adalah AI Tutor Kaalupi — sabar, ramah, pakai bahasa Indonesia casual seperti coach dari Bogor.
Course: "${course.title}"
Kategori: ${course.category}
Level: ${course.level}
Modul yang lagi student tanyain: "${moduleTitle}"

Konteks belajar lengkap:
${course.outcomes.map((o, i) => `- Outcome ${i + 1}: ${o}`).join("\n")}

Daftar modul:
${course.modules.map((m, i) => `${i + 1}. ${m}`).join("\n")}

Aturan jawab:
- Pakai bahasa Indonesia santai, seperti ngobrol antar teman dewasa.
- Jelasin step-by-step kalau topiknya teknis.
- Kalau pertanyaan keluar dari konteks course, kasih jawaban singkat lalu arahin balik ke modul yang relevan.
- Jangan ngarang link, file, atau fitur yang ngga ada di Kaalupi.
- Maks 250 kata per jawaban — singkat, padat, langsung ke inti.`;

  const last = messages[messages.length - 1];
  const userPrompt = messages
    .map((m) => (m.role === "user" ? `STUDENT: ${m.content}` : `TUTOR: ${m.content}`))
    .join("\n\n")
    .concat(last.role === "user" ? "\n\nTUTOR:" : "");

  const result = await generateContent(systemPrompt, userPrompt, 1024);
  if (!result.content) {
    return NextResponse.json(
      { error: result.error ?? "AI gagal memberi jawaban — coba lagi" },
      { status: 502 },
    );
  }

  return NextResponse.json({ reply: result.content, provider: result.provider });
}
