import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

interface Question {
  id: string;
  question: string;
  options: { label: string; value: string }[];
  multiSelect?: boolean;
}

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: {
    code?: string;
    description?: string;
    answers?: Record<string, string[]>;
    stage?: "initial" | "followup";
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
    const answers = body.answers || {};
    const stage = body.stage || "initial";

    // Generate questions based on code analysis
    if (stage === "initial" || (stage === "followup" && Object.keys(answers).length < 3)) {
      const nextQuestion = generateFollowUpQuestion(code, description, answers, stage);
      if (nextQuestion) {
        return NextResponse.json({ nextQuestion });
      }
    }

    // Generate final analysis when we have enough context
    const result = generateFinalAnalysis(code, description, answers);
    return NextResponse.json({ result });
  } catch (error) {
    console.error("Code review error:", error);
    return NextResponse.json({ error: "Failed to analyze code" }, { status: 500 });
  }
}

function generateFollowUpQuestion(
  code: string,
  description: string,
  answers: Record<string, string[]>,
  stage: string
): Question | null {
  const answeredCount = Object.keys(answers).length;

  // Question 1: Programming language
  if (!answers["language"]) {
    return {
      id: "language",
      question: "Bahasa pemrograman apa yang digunakan dalam kode ini?",
      options: [
        { label: "JavaScript / TypeScript", value: "javascript" },
        { label: "Python", value: "python" },
        { label: "Java", value: "java" },
        { label: "C/C++", value: "cpp" },
        { label: "PHP", value: "php" },
        { label: "Lainnya", value: "other" },
      ],
    };
  }

  // Question 2: Purpose
  if (!answers["purpose"]) {
    return {
      id: "purpose",
      question: "Apa tujuan utama dari kode ini?",
      options: [
        { label: "Web frontend (UI/interaksi)", value: "frontend" },
        { label: "Web backend (API/server)", value: "backend" },
        { label: "Data processing / analysis", value: "data" },
        { label: "Algorithm / logic exercise", value: "algorithm" },
        { label: "Automation / script", value: "automation" },
        { label: "Lainnya", value: "other" },
      ],
    };
  }

  // Question 3: Context
  if (!answers["context"]) {
    return {
      id: "context",
      question: "Dalam konteks apa kode ini dijalankan? (bisa pilih lebih dari satu)",
      options: [
        { label: "React / Next.js app", value: "react" },
        { label: "Node.js server", value: "nodejs" },
        { label: "Browser standalone", value: "browser" },
        { label: "CLI / terminal", value: "cli" },
        { label: "Jupyter notebook", value: "jupyter" },
        { label: "Tidak tahu / tidak yakin", value: "unknown" },
      ],
      multiSelect: true,
    };
  }

  // Question 4: Issues
  if (!answers["issues"]) {
    return {
      id: "issues",
      question: "Apakah ada masalah yang sudah Anda ketahui pada kode ini?",
      options: [
        { label: "Ada error / tidak jalan", value: "error" },
        { label: "Takut ada bug / logic salah", value: "bug" },
        { label: "Kode berjalan tapi kurang efisien", value: "performance" },
        { label: "Kurang bersih / susah dibaca", value: "readability" },
        { label: "Tidak ada masalah yang diketahui", value: "none" },
      ],
      multiSelect: true,
    };
  }

  // Question 5: Experience
  if (!answers["experience"]) {
    return {
      id: "experience",
      question: "Apa level pengalaman Anda dengan bahasa/kode ini?",
      options: [
        { label: "Pemula (baru belajar)", value: "beginner" },
        { label: "Menengah (sudah pernah buat project)", value: "intermediate" },
        { label: "Mahir (sudah sering pakai)", value: "advanced" },
      ],
    };
  }

  // Question 6: Specific request
  if (!answers["request"]) {
    return {
      id: "request",
      question: "Apa yang paling ingin Anda ketahui dari review ini? (bisa pilih lebih dari satu)",
      options: [
        { label: "Penjelasan cara kerja kodenya", value: "explain" },
        { label: "Cek apakah ada bug", value: "debug" },
        { label: "Saran perbaikan kode", value: "improve" },
        { label: "Cara menulis kode yang lebih bersih", value: "clean" },
        { label: "Cara mengoptimasi performa", value: "optimize" },
      ],
      multiSelect: true,
    };
  }

  return null; // Enough questions asked
}

function generateFinalAnalysis(
  code: string,
  description: string,
  answers: Record<string, string[]>
): {
  summary: string;
  explanation: string;
  bugs: string[];
  suggestions: string[];
  improvements: string[];
  codeQuality: number;
} {
  const language = answers["language"]?.[0] || "unknown";
  const purpose = answers["purpose"]?.[0] || "unknown";
  const contexts = answers["context"] || [];
  const issues = answers["issues"] || [];
  const experience = answers["experience"]?.[0] || "intermediate";
  const requests = answers["request"] || [];

  const isJS = language === "javascript";
  const isPython = language === "python";

  // Generate explanation
  let explanation = "";
  if (isJS) {
    explanation = generateJSExplanation(code);
  } else if (isPython) {
    explanation = generatePythonExplanation(code);
  } else {
    explanation = `Kode ini ditulis dalam bahasa ${language}. `;
    if (code.includes("function") || code.includes("def ")) {
      explanation += "Kode ini berisi definisi fungsi yang menangani suatu logika tertentu. ";
    }
    if (code.includes("if ") || code.includes("if(")) {
      explanation += "Terdapat pengkondisian (if-else) untuk menangani berbagai skenario. ";
    }
    if (code.includes("for ") || code.includes("while ")) {
      explanation += "Ada loop/perulangan untuk memproses data berulang kali. ";
    }
  }

  explanation += `\n\nKode ini dibuat untuk keperluan ${getPurposeText(purpose)}. `;
  if (contexts.length > 0) {
    explanation += `Dijalankan dalam konteks: ${contexts.map(getContextText).join(", ")}. `;
  }
  if (description) {
    explanation += `\n\nKonteks tambahan dari Anda: ${description}`;
  }

  // Detect bugs
  const bugs: string[] = [];
  if (issues.includes("error")) {
    if (isJS) {
      if (code.includes("== ") && !code.includes("=== ")) {
        bugs.push("Penggunaan '==' bisa menyebabkan type coercion yang tidak diinginkan. Gunakan '===' untuk perbandingan yang lebih aman.");
      }
      if (code.includes("var ")) {
        bugs.push("Penggunaan 'var' dapat menyebabkan masalah scoping. Gunakan 'let' atau 'const'.");
      }
    }
    if (isPython && code.includes("== None") && !code.includes("is None")) {
      bugs.push("Untuk membandingkan dengan None di Python, gunakan 'is None' bukan '== None'.");
    }
  }

  if (issues.includes("bug")) {
    // Check for common logic issues
    if (code.includes("parseInt") && !code.includes("radix")) {
      bugs.push("parseInt() sebaiknya diberi parameter radix (basis bilangan), contoh: parseInt(str, 10).");
    }
    if (isJS && code.includes("forEach") && code.includes("await")) {
      bugs.push("forEach tidak bisa digunakan dengan async/await. Gunakan for...of atau map dengan Promise.all().");
    }
  }

  // Suggestions
  const suggestions: string[] = [];
  if (requests.includes("explain")) {
    if (code.includes("async ") && code.includes("await ")) {
      suggestions.push("✅ Penggunaan async/await sudah baik untuk menangani operasi asynchronous.");
    }
    if (code.includes("try ") && code.includes("catch")) {
      suggestions.push("✅ Error handling dengan try-catch sudah diterapkan.");
    } else {
      suggestions.push("Tambahkan try-catch untuk menangani kemungkinan error, terutama pada operasi yang bisa gagal.");
    }
  }

  if (requests.includes("clean")) {
    const commentCount = (code.match(/\/\/|\/\*|\#/g) || []).length;
    if (commentCount === 0) {
      suggestions.push("Tambahkan komentar untuk menjelaskan logika kode, terutama untuk bagian yang kompleks.");
    }
    if (isJS && (code.includes("var ") || !code.includes("const "))) {
      suggestions.push("Gunakan 'const' untuk variable yang tidak berubah dan 'let' untuk yang berubah (ES6 best practice).");
    }
  }

  if (requests.includes("improve")) {
    const lines = code.split("\n").length;
    const functions = (code.match(/function|def /g) || []).length;
    if (functions > 0 && lines / functions > 50) {
      suggestions.push("Fungsi terlalu panjang. Pertimbangkan untuk memecah menjadi fungsi yang lebih kecil (Single Responsibility Principle).");
    }
    suggestions.push("Gunakan nama variable dan fungsi yang deskriptif (camelCase untuk JavaScript, snake_case untuk Python).");
    suggestions.push("Format kode dengan konsisten (gunakan Prettier atau ESLint untuk JS, Black untuk Python).");
  }

  // Improvements
  const improvements: string[] = [];
  if (requests.includes("optimize")) {
    if (isJS) {
      improvements.push("Pertimbangkan untuk menggunakan memoization atau caching untuk fungsi yang sering dipanggil dengan input yang sama.");
    }
    if (isPython) {
      improvements.push("Gunakan list comprehension atau generator untuk iterasi yang lebih efisien di Python.");
    }
    improvements.push("Hindari nested loop yang dalam (O(n²) atau lebih) jika memungkinkan. Gunakan struktur data yang tepat.");
  }

  if (purpose === "frontend" && isJS) {
    improvements.push("Gunakan React hooks atau state management yang tepat untuk aplikasi yang lebih scalable.");
    improvements.push("Pertimbangkan untuk memisahkan logic dari component (separation of concerns).");
  }

  if (purpose === "backend" && isJS) {
    improvements.push("Tambahkan validasi input yang ketat untuk mencegah injection attacks.");
    improvements.push("Gunakan middleware untuk logging, error handling, dan authentication.");
  }

  improvements.push("Tulis unit test untuk kode Anda (Jest untuk JS, pytest untuk Python).");
  improvements.push("Gunakan TypeScript untuk JavaScript agar lebih type-safe (jika belum).");

  // Calculate code quality
  let codeQuality = 70;
  if (isJS) {
    if (code.includes("const ") || code.includes("let ")) codeQuality += 10;
    if (code.includes("//") || code.includes("/*")) codeQuality += 5;
    if (code.includes("try ") && code.includes("catch")) codeQuality += 10;
    if (code.includes("== ") && !code.includes("=== ")) codeQuality -= 10;
    if (code.includes("var ")) codeQuality -= 15;
  }
  if (isPython) {
    if (code.includes("#")) codeQuality += 5;
    if (code.includes("try:") && code.includes("except")) codeQuality += 10;
  }
  codeQuality = Math.max(0, Math.min(100, codeQuality));

  // Summary
  const summary = `Review untuk kode ${getLanguageText(language)} - Level: ${getExperienceText(experience)}. ${
    bugs.length > 0
      ? `Ditemukan ${bugs.length} potensi masalah.`
      : "Tidak ditemukan bug mayor."
  } Kualitas kode: ${codeQuality >= 80 ? "Baik" : codeQuality >= 60 ? "Cukup" : "Perlu perbaikan"}.`;

  return {
    summary,
    explanation,
    bugs,
    suggestions,
    improvements,
    codeQuality,
  };
}

function generateJSExplanation(code: string): string {
  let explanation = "Kode ini ditulis dalam JavaScript. ";

  if (code.includes("function")) {
    const funcMatches = code.match(/function\s+(\w+)/g) || [];
    if (funcMatches.length > 0) {
      explanation += `Kode ini mendefinisikan ${funcMatches.length} fungsi: ${funcMatches
        .map((f) => f.replace("function ", ""))
        .join(", ")}. `;
    }
  }

  if (code.includes("=>")) {
    explanation += "Ada penggunaan arrow functions (=>) yang merupakan fitur ES6 untuk fungsi yang lebih ringkas. ";
  }

  if (code.includes("const ") || code.includes("let ")) {
    explanation += "Menggunakan deklarasi variable modern (const/let) dari ES6. ";
  } else if (code.includes("var ")) {
    explanation += "Menggunakan 'var' untuk deklarasi variable (disarankan ganti ke let/const). ";
  }

  if (code.includes("if ") || code.includes("if(")) {
    explanation += "Ada pengkondisian (if-else) untuk menangani berbagai skenario. ";
  }

  if (code.includes("for ") || code.includes("while ") || code.includes(".map(") || code.includes(".forEach(")) {
    explanation += "Menggunakan iterasi/loop untuk memproses data berulang kali. ";
  }

  if (code.includes("async ") && code.includes("await ")) {
    explanation += "Kode ini menangani operasi asynchronous dengan async/await. ";
  }

  if (code.includes("fetch(") || code.includes("axios")) {
    explanation += "Melakukan HTTP request ke API eksternal. ";
  }

  return explanation;
}

function generatePythonExplanation(code: string): string {
  let explanation = "Kode ini ditulis dalam Python. ";

  if (code.includes("def ")) {
    const funcMatches = code.match(/def\s+(\w+)/g) || [];
    if (funcMatches.length > 0) {
      explanation += `Kode ini mendefinisikan ${funcMatches.length} fungsi: ${funcMatches
        .map((f) => f.replace("def ", ""))
        .join(", ")}. `;
    }
  }

  if (code.includes("import ") || code.includes("from ")) {
    explanation += "Mengimpor module/library eksternal. ";
  }

  if (code.includes("if ") || code.includes("if(")) {
    explanation += "Ada pengkondisian (if-else) untuk menangani berbagai skenario. ";
  }

  if (code.includes("for ") || code.includes("while ")) {
    explanation += "Menggunakan loop untuk memproses data berulang kali. ";
  }

  if (code.includes("try:") && code.includes("except")) {
    explanation += "Menggunakan try-except untuk error handling. ";
  }

  if (code.includes("class ")) {
    explanation += "Mendefinisikan class (Object-Oriented Programming). ";
  }

  return explanation;
}

function getLanguageText(lang: string): string {
  const map: Record<string, string> = {
    javascript: "JavaScript/TypeScript",
    python: "Python",
    java: "Java",
    cpp: "C/C++",
    php: "PHP",
    other: "Lainnya",
  };
  return map[lang] || lang;
}

function getPurposeText(purpose: string): string {
  const map: Record<string, string> = {
    frontend: "web frontend (UI/interaksi pengguna)",
    backend: "web backend (API/server)",
    data: "pemrosesan atau analisis data",
    algorithm: "latihan algoritma/logika",
    automation: "otomatisasi atau scripting",
    other: "keperluan lainnya",
  };
  return map[purpose] || purpose;
}

function getContextText(context: string): string {
  const map: Record<string, string> = {
    react: "React/Next.js app",
    nodejs: "Node.js server",
    browser: "Browser standalone",
    cli: "CLI/Terminal",
    jupyter: "Jupyter notebook",
    unknown: "Tidak yakin",
  };
  return map[context] || context;
}

function getExperienceText(exp: string): string {
  const map: Record<string, string> = {
    beginner: "Pemula",
    intermediate: "Menengah",
    advanced: "Mahir",
  };
  return map[exp] || exp;
}
