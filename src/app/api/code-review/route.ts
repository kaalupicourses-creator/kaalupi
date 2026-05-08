import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

interface Question {
  id: string;
  question: string;
  options: { label: string; value: string }[];
  multiSelect?: boolean;
}

// Simple in-memory rate limiter: userId -> { count, resetAt }
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 10; // max reviews per window
const RATE_LIMIT_WINDOW = 24 * 60 * 60 * 1000; // 24 jam

function checkRateLimit(userId: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(userId);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(userId, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return { allowed: true, remaining: RATE_LIMIT_MAX - 1 };
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return { allowed: false, remaining: 0 };
  }

  entry.count++;
  return { allowed: true, remaining: RATE_LIMIT_MAX - entry.count };
}

export async function GET(_request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const clerk = await clerkClient();
    const user = await clerk.users.getUser(userId);
    const userEmail = user.primaryEmailAddress?.emailAddress ?? "";

    const { getSupabaseAdmin } = await import("@/lib/supabase-admin");
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("code_reviews")
      .select("*")
      .eq("user_email", userEmail)
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) {
      return NextResponse.json({ reviews: [] });
    }

    return NextResponse.json({ reviews: data ?? [] });
  } catch {
    return NextResponse.json({ reviews: [] });
  }
}

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Rate limit check
  const limit = checkRateLimit(userId);
  if (!limit.allowed) {
    return NextResponse.json({
      error: "Kamu sudah mencapai batas maksimal review hari ini (10x). Silakan coba lagi besok.",
    }, { status: 429 });
  }

  let body: {
    code?: string;
    description?: string;
    messages?: Message[];
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (!body.code) {
    return NextResponse.json({ error: "Code is required" }, { status: 400 });
  }

  try {
    const code = body.code;
    const description = body.description || "";
    // Strip system role dari client — prevent injection
    const messages = (body.messages || []).filter((m) => m.role !== "system");

    let responseData: NextResponse;
    if (process.env.OPENAI_API_KEY) {
      responseData = await handleOpenAIReview(code, description, messages);
    } else {
      responseData = handleSmartReview(code, description, messages);
    }

    // Non-blocking: save result to review history if this is a final result
    try {
      const bodyCopy = await responseData.clone().json();
      if (bodyCopy && bodyCopy.result) {
        const clerk = await clerkClient();
        const user = await clerk.users.getUser(userId);
        const userEmail = user.primaryEmailAddress?.emailAddress ?? "";
        await saveReviewHistory(userEmail, code, description, bodyCopy.result);
      }
    } catch {
      // best-effort
    }

    return responseData;
  } catch (error) {
    console.error("Code review error:", error);
    return NextResponse.json({ error: "Failed to analyze code" }, { status: 500 });
  }
}

async function saveReviewHistory(userEmail: string, code: string, description: string, result: Record<string, unknown>) {
  const { getSupabaseAdmin } = await import("@/lib/supabase-admin");
  const supabase = getSupabaseAdmin();
  await supabase.from("code_reviews").insert({
    user_email: userEmail,
    code: code.slice(0, 2000),
    description: description.slice(0, 500),
    summary: (result.summary as string)?.slice(0, 500) ?? "",
    code_quality: (result.codeQuality as number) ?? 0,
  });
}

async function handleOpenAIReview(
  code: string,
  description: string,
  messages: Message[]
) {
  const apiKey = process.env.OPENAI_API_KEY!;

  // Build conversation history
  const systemPrompt = `Anda adalah ahli code reviewer. Analisis kode yang dikirim dan lakukan percakapan dengan user untuk memahami konteks dengan lebih baik.

Tujuan Anda:
1. Ajukan pertanyaan yang RELEVAN berdasarkan apa yang Anda lihat di kode (bukan pertanyaan generik)
2. Identifikasi potensi bug, masalah, atau perbaikan
3. Berikan penjelasan yang jelas

Saat mengajukan pertanyaan, SELALU format respons Anda sebagai JSON:
{
  "type": "question",
  "question": "Pertanyaan Anda di sini?",
  "options": [
    {"label": "Teks opsi", "value": "nilai_opsi"},
    ...
  ],
  "multiSelect": false
}

Saat Anda sudah punya cukup konteks dan bisa memberikan review lengkap, respons dengan JSON:
{
  "type": "result",
  "result": {
    "summary": "Ringkasan singkat",
    "explanation": "Penjelasan detail cara kerja kode",
    "bugs": ["daftar potensi bug"],
    "suggestions": ["daftar saran"],
    "improvements": ["daftar pengembangan"],
    "codeQuality": 85
  }
}

Buat pertanyaan yang SINGKAT dan SPESIFIK untuk kode tersebut. Jangan tanya bahasa (deteksi dari kode). Tanya tentang tujuan, edge cases, atau pola spesifik yang Anda perhatikan.`;

  const openaiMessages: Message[] = [{ role: "system", content: systemPrompt }];

  // Add context about the code
  if (messages.length === 0) {
    openaiMessages.push({
      role: "user",
      content: `Tolong review kode ini:\n\n\`\`\`\n${code}\n\`\`\`\n\nKonteks tambahan: ${description || "Tidak ada"}`,
    });
  } else {
    // Add conversation history
    messages.forEach((msg) => openaiMessages.push(msg));
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: openaiMessages,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error("OpenAI API error:", error);
    return NextResponse.json({ error: "AI service unavailable" }, { status: 500 });
  }

  const data = await response.json();
  const aiResponse = data.choices[0].message.content;

  try {
    const parsed = JSON.parse(aiResponse);

    if (parsed.type === "question") {
      return NextResponse.json({
        nextQuestion: {
          id: `q_${Date.now()}`,
          question: parsed.question,
          options: parsed.options,
          multiSelect: parsed.multiSelect || false,
        },
      });
    } else if (parsed.type === "result") {
      return NextResponse.json({ result: parsed.result });
    }
  } catch {
    console.error("Failed to parse AI response:", aiResponse);
    return NextResponse.json({
      nextQuestion: {
        id: `q_fallback_${Date.now()}`,
        question: "Saya melihat beberapa hal dalam kode Anda. Aspek apa yang ingin Anda fokuskan?",
        options: [
          { label: "Jelaskan cara kerja kode", value: "explain" },
          { label: "Cek bug", value: "bugs" },
          { label: "Saran perbaikan", value: "improve" },
          { label: "Semua di atas", value: "all" },
        ],
        multiSelect: true,
      },
    });
  }

  // Fallback if JSON parsed but type is unknown
  return NextResponse.json({
    nextQuestion: {
      id: `q_fallback_${Date.now()}`,
      question: "Apa yang ingin kamu fokuskan dari kode ini?",
      options: [
        { label: "Penjelasan kode", value: "explain" },
        { label: "Cari bug", value: "bugs" },
        { label: "Saran perbaikan", value: "improve" },
      ],
      multiSelect: true,
    },
  });
}

function handleSmartReview(
  code: string,
  description: string,
  messages: Message[]
) {
  // Adaptive rule-based system that generates relevant questions based on code analysis
  const codeAnalysis = analyzeCode(code);

  if (messages.length === 0) {
    // First interaction - ask question based on code analysis
    const question = generateFirstQuestion(code, codeAnalysis);
    return NextResponse.json({ nextQuestion: question });
  }

  if (messages.length < 3) {
    // Follow-up questions based on previous answers and code
    const question = generateFollowUpQuestion(code, codeAnalysis, messages);
    if (question) {
      return NextResponse.json({ nextQuestion: question });
    }
  }

  // Generate final result
  const result = generateAdaptiveResult(code, codeAnalysis, messages);
  return NextResponse.json({ result });
}

function analyzeCode(code: string) {
  const analysis = {
    language: detectLanguage(code),
    hasAsync: code.includes("async ") || code.includes("await "),
    hasLoops: /\b(for|while|forEach|map|filter)\b/.test(code),
    hasConditions: /\b(if|else|switch|case)\b/.test(code),
    hasTryCatch: code.includes("try") && code.includes("catch"),
    hasFunctions: /\b(function|def |=>)\b/.test(code),
    hasComments: /\/\/|\/\*|\#/.test(code),
    hasDOM: /\b(document|window|querySelector|getElementById)\b/.test(code),
    hasFetch: /\b(fetch|axios|request)\b/.test(code),
    hasDatabase: /\b(SELECT|INSERT|UPDATE|DELETE|query|prisma|mongoose)\b/i.test(code),
    complexity: calculateComplexity(code),
  };
  return analysis;
}

function detectLanguage(code: string): string {
  if (/\b(import|export|const|let|var|function|=>)\b/.test(code) && !/\bdef \b/.test(code))
    return "javascript";
  if (/\bdef \b|\bimport \b/.test(code) && !/\b(function|=>)\b/.test(code)) return "python";
  if (/\bpublic\s+class|System\.out\b/.test(code)) return "java";
  if (/\b#include|printf\b/.test(code)) return "c/c++";
  return "unknown";
}

function calculateComplexity(code: string): number {
  let score = 0;
  score += (code.match(/\b(if|else)\b/g) || []).length * 2;
  score += (code.match(/\b(for|while)\b/g) || []).length * 3;
  score += (code.match(/\b(function|def )\b/g) || []).length * 5;
  score += (code.match(/\b(try|catch)\b/g) || []).length * 2;
  return Math.min(100, score);
}

type AnalysisResult = ReturnType<typeof analyzeCode>;

function generateFirstQuestion(code: string, analysis: AnalysisResult): Question {
  const questions: Question[] = [];

  // Pertanyaan berdasarkan pola kode
  if (analysis.hasAsync) {
    questions.push({
      id: "async_context",
      question: "Saya melihat async/await di kode Anda. Apa yang coba dicapai dari operasi asynchronous ini?",
      options: [
        { label: "Mengambil data dari API", value: "fetch_api" },
        { label: "Membaca/menulis file", value: "file_io" },
        { label: "Operasi database", value: "database" },
        { label: "Interaksi user/event", value: "user_event" },
        { label: "Lainnya", value: "other" },
      ],
    });
  }

  if (analysis.hasLoops) {
    questions.push({
      id: "loop_purpose",
      question: "Saya melihat loop di kode Anda. Seberapa besar dataset yang diolah?",
      options: [
        { label: "Kecil (di bawah 100 item)", value: "small" },
        { label: "Sedang (100-10.000 item)", value: "medium" },
        { label: "Besar (10.000+ item)", value: "large" },
        { label: "Tidak terbatas/input user", value: "unbounded" },
      ],
    });
  }

  if (analysis.hasDOM) {
    questions.push({
      id: "dom_purpose",
      question: "Ini terlihat seperti kode browser. Framework apa yang Anda gunakan (jika ada)?",
      options: [
        { label: "Vanila JS (tanpa framework)", value: "vanila" },
        { label: "React / Next.js", value: "react" },
        { label: "Vue", value: "vue" },
        { label: "Framework lainnya", value: "other" },
      ],
    });
  }

  if (analysis.hasDatabase) {
    questions.push({
      id: "db_context",
      question: "Saya melihat operasi database. Apakah menggunakan ORM atau raw queries?",
      options: [
        { label: "ORM (Prisma, Mongoose, dll)", value: "orm" },
        { label: "Raw SQL queries", value: "raw_sql" },
        { label: "Keduanya", value: "both" },
      ],
    });
  }

  if (analysis.hasFetch) {
    questions.push({
      id: "api_error_handling",
      question: "Untuk pemanggilan API di kode ini, bagaimana Anda ingin menangani error?",
      options: [
        { label: "Tampilkan pesan user-friendly", value: "user_message" },
        { label: "Coba lagi otomatis", value: "retry" },
        { label: "Log dan abaikan", value: "log_ignore" },
        { label: "Throw/Crash", value: "throw" },
      ],
    });
  }

  // Pertanyaan default kalau nggak ada pola yang terdeteksi
  if (questions.length === 0) {
    questions.push({
      id: "general_purpose",
      question: "Apa tujuan utama dari kode ini?",
      options: [
        { label: "Pemrosesan/manipulasi data", value: "data" },
        { label: "User interface/interaksi", value: "ui" },
        { label: "Logika API/backend", value: "backend" },
        { label: "Fungsi utility/helper", value: "utility" },
        { label: "Kode belajar/latihan", value: "learning" },
      ],
    });
  }

  // Return pertanyaan yang paling relevan
  return questions[0];
}

function generateFollowUpQuestion(code: string, analysis: AnalysisResult, messages: Message[]): Question | null {
  const lastAnswer = messages[messages.length - 1]?.content || "";

  // Kalau mereka menyebutkan dataset besar dan tidak ada error handling
  if (lastAnswer.includes("large") && !analysis.hasTryCatch) {
    return {
      id: "error_handling",
      question: "Dengan dataset yang besar, apa yang terjadi jika ada error saat memproses?",
      options: [
        { label: "Kode sudah punya try-catch", value: "has_try_catch" },
        { label: "Error akan menyebabkan crash", value: "would_crash" },
        { label: "Perlu ditambah error handling", value: "need_add" },
      ],
    };
  }

  // Kalau mereka pakai React dan punya logika kompleks
  if (lastAnswer.includes("react") && analysis.complexity > 20) {
    return {
      id: "react_patterns",
      question: "Untuk logika React ini, apakah Anda menggunakan state management?",
      options: [
        { label: "Hanya useState/useReducer", value: "local_state" },
        { label: "Context API", value: "context" },
        { label: "Redux/Zustand/lainnya", value: "external" },
        { label: "Tidak butuh state management", value: "none" },
      ],
    };
  }

  // Follow-up generik
  return {
    id: "specific_focus",
    question: "Bagian mana dari kode yang paling mengkhawatirkan Anda?",
    options: [
      { label: "Kebenaran logika", value: "logic" },
      { label: "Performa", value: "performance" },
      { label: "Keterbacaan", value: "readability" },
      { label: "Penanganan error", value: "errors" },
      { label: "Semua di atas", value: "all" },
    ],
  };
}

function generateAdaptiveResult(code: string, analysis: AnalysisResult, messages: Message[]) {
  const language = analysis.language;
  const isJS = language === "javascript";
  const isPython = language === "python";

  // Buat penjelasan berdasarkan analisis kode
  let explanation = `Kode ${language} ini `;
  if (analysis.hasFunctions) explanation += "mendefinisikan fungsi-fungsi untuk menangani logika tertentu. ";
  if (analysis.hasAsync) explanation += "Menggunakan operasi asynchronous (async/await). ";
  if (analysis.hasLoops) explanation += "Berisi loop untuk pemrosesan iteratif. ";
  if (analysis.hasConditions) explanation += "Memiliki logika kondisional untuk menangani skenario berbeda. ";
  if (analysis.hasDOM) explanation += "Berinteraksi dengan DOM (browser). ";
  if (analysis.hasFetch) explanation += "Melakukan HTTP request ke API eksternal. ";

  // Deteksi bug berdasarkan pola
  const bugs: string[] = [];
  if (isJS) {
    if (code.includes("== ") && !code.includes("=== ")) {
      bugs.push("Penggunaan '==' bisa menyebabkan type coercion. Gunakan '===' untuk perbandingan yang ketat.");
    }
    if (code.includes("var ")) {
      bugs.push("'var' memiliki masalah scoping. Gunakan 'let' atau 'const' sebagai gantinya.");
    }
    if (analysis.hasAsync && code.includes("forEach")) {
      bugs.push("forEach tidak bekerja dengan async/await. Gunakan for...of atau map dengan Promise.all().");
    }
  }
  if (isPython) {
    if (code.includes("== None") && !code.includes("is None")) {
      bugs.push("Gunakan 'is None' daripada '== None' untuk perbandingan dengan None di Python.");
    }
  }

  // Saran
  const suggestions: string[] = [];
  if (!analysis.hasComments) {
    suggestions.push("Tambahkan komentar untuk menjelaskan logika kompleks.");
  }
  if (!analysis.hasTryCatch && analysis.complexity > 10) {
    suggestions.push("Tambahkan blok try-catch untuk penanganan error.");
  }
  if (isJS && !code.includes("const ") && !code.includes("let ")) {
    suggestions.push("Gunakan 'const' untuk variable yang tidak berubah dan 'let' untuk yang mutable.");
  }

  // Pengembangan
  const improvements: string[] = [];
  if (analysis.hasLoops && analysis.complexity > 20) {
    improvements.push("Pertimbangkan untuk memecah logika kompleks menjadi fungsi-fungsi yang lebih kecil.");
  }
  improvements.push("Tambahkan unit test untuk memastikan keandalan kode.");
  if (isJS) {
    improvements.push("Pertimbangkan penggunaan TypeScript untuk type safety yang lebih baik.");
  }

  // Hitung code quality
  let codeQuality = 70;
  if (analysis.hasTryCatch) codeQuality += 10;
  if (analysis.hasComments) codeQuality += 5;
  if (isJS && (code.includes("const ") || code.includes("let "))) codeQuality += 10;
  if (bugs.length > 0) codeQuality -= bugs.length * 10;
  codeQuality = Math.max(0, Math.min(100, codeQuality));

  return {
    summary: `Review kode ${language.charAt(0).toUpperCase() + language.slice(1)} - Kompleksitas: ${
      analysis.complexity > 30 ? "Tinggi" : analysis.complexity > 15 ? "Sedang" : "Rendah"
    }`,
    explanation,
    bugs,
    suggestions,
    improvements,
    codeQuality,
  };
}
