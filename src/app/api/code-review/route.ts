import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { courseSlug?: string; module?: string; code?: string; description?: string };
  try {
    body = (await request.json()) as {
      courseSlug?: string;
      module?: string;
      code?: string;
      description?: string;
    };
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (!body.code || !body.courseSlug) {
    return NextResponse.json(
      { error: "Code and course slug are required" },
      { status: 400 }
    );
  }

  try {
    // AI Review using free/low-cost AI API
    // Option 1: Use OpenAI-compatible API if available
    // Option 2: Use rule-based analysis for basic review
    const review = await generateCodeReview(body.code, body.module ?? "General");

    // In production, save to database for instructor follow-up
    // await supabase.from("code_reviews").insert({ ... });

    return NextResponse.json({
      success: true,
      review,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Code review error:", error);
    return NextResponse.json(
      { error: "Failed to generate review" },
      { status: 500 }
    );
  }
}

async function generateCodeReview(code: string, module: string) {
  // Basic rule-based analysis (free, no API cost)
  const suggestions: string[] = [];
  const issues: { type: "warning" | "error" | "info"; message: string }[] = [];

  // Check code length
  if (code.length < 50) {
    issues.push({
      type: "warning",
      message: "Kode terlalu pendek. Pastikan Anda mengirimkan implementasi lengkap.",
    });
  }

  // Check for common issues
  if (code.includes("var ")) {
    suggestions.push(
      "Gunakan `let` atau `const` daripada `var` untuk deklarasi variable (ES6 best practice)."
    );
  }

  if (code.includes("== ") && !code.includes("=== ")) {
    suggestions.push(
      "Gunakan strict equality `===` dan `!==` daripada `==` dan `!=` untuk menghindari type coercion."
    );
  }

  if (code.includes("console.log")) {
    suggestions.push(
      "Hapus `console.log()` sebelum production atau gunakan proper logging library."
    );
  }

  // Check for comments
  const commentCount = (code.match(/\/\/|\/\*|\*/g) || []).length;
  if (commentCount === 0) {
    suggestions.push(
      "Tambahkan komentar untuk menjelaskan logika kode, terutama untuk bagian yang kompleks."
    );
  }

  // Check function length (simple heuristic)
  const functions = code.split("function").length - 1;
  if (functions > 0) {
    const lines = code.split("\n").length;
    if (lines / functions > 50) {
      suggestions.push(
        "Fungsi terlalu panjang. Pertimbangkan untuk memecah menjadi fungsi yang lebih kecil (Single Responsibility Principle)."
      );
    }
  }

  // Positive feedback
  if (code.includes("async ") && code.includes("await ")) {
    suggestions.push("✅ Penggunaan async/await sudah baik untuk menangani operasi asynchronous.");
  }

  if (code.includes("try ") && code.includes("catch")) {
    suggestions.push("✅ Error handling dengan try-catch sudah diterapkan.");
  }

  // Module-specific suggestions
  if (module.toLowerCase().includes("api")) {
    suggestions.push(
      "Pastikan API endpoints memiliki validasi input dan error handling yang memadai."
    );
    suggestions.push(
      "Gunakan HTTP status codes yang sesuai (200, 400, 401, 403, 500, dll)."
    );
  }

  if (module.toLowerCase().includes("database")) {
    suggestions.push(
      "Gunakan parameterized queries atau ORM untuk mencegah SQL injection."
    );
    suggestions.push("Pastikan koneksi database ditutup dengan benar atau gunakan connection pooling.");
  }

  // General best practices
  suggestions.push(
    "Gunakan nama variable dan fungsi yang deskriptif (camelCase untuk JavaScript)."
  );
  suggestions.push(
    "Format kode dengan konsisten (gunakan Prettier atau ESLint)."
  );

  return {
    summary: `Review untuk ${module}`,
    codeQuality: calculateCodeQuality(code, issues),
    suggestions: suggestions.slice(0, 8), // Limit to 8 suggestions
    issues,
    nextSteps: [
      "Perbaiki issue yang ditemukan berdasarkan prioritas.",
      "Tulis unit test untuk kode Anda.",
      "Gunakan linter (ESLint) untuk menjaga konsistensi kode.",
      "Submit ulang untuk review lanjutan setelah perbaikan.",
    ],
  };
}

function calculateCodeQuality(code: string, issues: { type: string }[]): number {
  let score = 70; // Base score

  // Deduct for issues
  score -= issues.filter((i) => i.type === "error").length * 15;
  score -= issues.filter((i) => i.type === "warning").length * 5;

  // Add for good practices
  if (code.includes("const ") || code.includes("let ")) score += 10;
  if (code.includes("//") || code.includes("/*")) score += 5;
  if (code.includes("try ") && code.includes("catch")) score += 10;

  return Math.max(0, Math.min(100, score));
}
