import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

interface Message {
  role: "user" | "assistant";
  content: string;
}

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
    const messages = body.messages || [];

    // If OpenAI API key exists, use real AI
    if (process.env.OPENAI_API_KEY) {
      return await handleOpenAIReview(code, description, messages);
    }

    // Fallback: Smarter rule-based system
    return handleSmartReview(code, description, messages);
  } catch (error) {
    console.error("Code review error:", error);
    return NextResponse.json({ error: "Failed to analyze code" }, { status: 500 });
  }
}

async function handleOpenAIReview(
  code: string,
  description: string,
  messages: Message[]
) {
  const apiKey = process.env.OPENAI_API_KEY!;

  // Build conversation history
  const systemPrompt = `You are an expert code reviewer. Analyze the submitted code and have a conversation with the user to understand context better.

Your goals:
1. Ask RELEVANT questions based on what you see in the code (not generic questions)
2. Identify potential bugs, issues, or improvements
3. Provide clear explanations

When asking questions, ALWAYS format your response as JSON:
{
  "type": "question",
  "question": "Your question here?",
  "options": [
    {"label": "Option text", "value": "option_value"},
    ...
  ],
  "multiSelect": false
}

When you have enough context and can provide a full review, respond with JSON:
{
  "type": "result",
  "result": {
    "summary": "Brief summary",
    "explanation": "Detailed explanation of how the code works",
    "bugs": ["list of potential bugs"],
    "suggestions": ["list of suggestions"],
    "improvements": ["list of improvements"],
    "codeQuality": 85
  }
}

Keep questions SHORT and SPECIFIC to the code. Don't ask about language (detect it from code). Ask about purpose, edge cases, or specific patterns you notice.`;

  const openaiMessages: Message[] = [{ role: "system", content: systemPrompt }];

  // Add context about the code
  if (messages.length === 0) {
    openaiMessages.push({
      role: "user",
      content: `Please review this code:\n\n\`\`\`\n${code}\n\`\`\`\n\nAdditional context: ${description || "None"}`,
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
    // If AI didn't return valid JSON, try to extract question or provide fallback
    console.error("Failed to parse AI response:", aiResponse);
    return NextResponse.json({
      nextQuestion: {
        id: `q_fallback_${Date.now()}`,
        question: "I notice some things in your code. What specific aspect would you like me to focus on?",
        options: [
          { label: "Explain how the code works", value: "explain" },
          { label: "Check for bugs", value: "bugs" },
          { label: "Suggest improvements", value: "improve" },
          { label: "All of the above", value: "all" },
        ],
        multiSelect: true,
      },
    });
  }
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

  // Question based on code patterns
  if (analysis.hasAsync) {
    questions.push({
      id: "async_context",
      question: "I see async/await in your code. What's this asynchronous operation trying to accomplish?",
      options: [
        { label: "Fetching data from API", value: "fetch_api" },
        { label: "Reading/writing files", value: "file_io" },
        { label: "Database operation", value: "database" },
        { label: "User interaction/event", value: "user_event" },
        { label: "Other", value: "other" },
      ],
    });
  }

  if (analysis.hasLoops) {
    questions.push({
      id: "loop_purpose",
      question: "I notice loops in your code. How large can the data set be?",
      options: [
        { label: "Small (under 100 items)", value: "small" },
        { label: "Medium (100-10,000 items)", value: "medium" },
        { label: "Large (10,000+ items)", value: "large" },
        { label: "Unbounded/user input", value: "unbounded" },
      ],
    });
  }

  if (analysis.hasDOM) {
    questions.push({
      id: "dom_purpose",
      question: "This looks like browser code. What framework are you using (if any)?",
      options: [
        { label: "Vanilla JS (no framework)", value: "vanilla" },
        { label: "React / Next.js", value: "react" },
        { label: "Vue", value: "vue" },
        { label: "Other framework", value: "other" },
      ],
    });
  }

  if (analysis.hasDatabase) {
    questions.push({
      id: "db_context",
      question: "I see database operations. Is this using an ORM or raw queries?",
      options: [
        { label: "ORM (Prisma, Mongoose, etc)", value: "orm" },
        { label: "Raw SQL queries", value: "raw_sql" },
        { label: "Both", value: "both" },
      ],
    });
  }

  if (analysis.hasFetch) {
    questions.push({
      id: "api_error_handling",
      question: "For the API calls in your code, how do you want to handle errors?",
      options: [
        { label: "Show user-friendly message", value: "user_message" },
        { label: "Retry automatically", value: "retry" },
        { label: "Log and ignore", value: "log_ignore" },
        { label: "Throw/Crash", value: "throw" },
      ],
    });
  }

  // Default question if no specific pattern detected
  if (questions.length === 0) {
    questions.push({
      id: "general_purpose",
      question: "What's the main purpose of this code?",
      options: [
        { label: "Data processing/manipulation", value: "data" },
        { label: "User interface/interaction", value: "ui" },
        { label: "API/backend logic", value: "backend" },
        { label: "Utility/helper function", value: "utility" },
        { label: "Learning/practice code", value: "learning" },
      ],
    });
  }

  // Return the most relevant question based on analysis
  return questions[0];
}

function generateFollowUpQuestion(code: string, analysis: AnalysisResult, messages: Message[]): Question | null {
  const lastAnswer = messages[messages.length - 1]?.content || "";

  // If they mentioned large data sets and no error handling
  if (lastAnswer.includes("large") && !analysis.hasTryCatch) {
    return {
      id: "error_handling",
      question: "With large datasets, what happens if an error occurs mid-processing?",
      options: [
        { label: "Code has proper try-catch", value: "has_try_catch" },
        { label: "Error would crash the process", value: "would_crash" },
        { label: "Need to add error handling", value: "need_add" },
      ],
    };
  }

  // If they're using React and have complex logic
  if (lastAnswer.includes("react") && analysis.complexity > 20) {
    return {
      id: "react_patterns",
      question: "For this React logic, are you using any state management?",
      options: [
        { label: "Just useState/useReducer", value: "local_state" },
        { label: "Context API", value: "context" },
        { label: "Redux/Zustand/other", value: "external" },
        { label: "No state management needed", value: "none" },
      ],
    };
  }

  // Generic follow-up
  return {
    id: "specific_focus",
    question: "What specific part of the code concerns you most?",
    options: [
      { label: "Logic correctness", value: "logic" },
      { label: "Performance", value: "performance" },
      { label: "Readability", value: "readability" },
      { label: "Error handling", value: "errors" },
      { label: "All of the above", value: "all" },
    ],
  };
}

function generateAdaptiveResult(code: string, analysis: AnalysisResult, messages: Message[]) {
  const language = analysis.language;
  const isJS = language === "javascript";
  const isPython = language === "python";

  // Build explanation based on code analysis
  let explanation = `This ${language} code `;
  if (analysis.hasFunctions) explanation += "defines functions to handle specific logic. ";
  if (analysis.hasAsync) explanation += "Uses asynchronous operations (async/await). ";
  if (analysis.hasLoops) explanation += "Contains loops for iterative processing. ";
  if (analysis.hasConditions) explanation += "Has conditional logic to handle different scenarios. ";
  if (analysis.hasDOM) explanation += "Interacts with the DOM (browser). ";
  if (analysis.hasFetch) explanation += "Makes HTTP requests to external APIs. ";

  // Detect bugs based on patterns
  const bugs: string[] = [];
  if (isJS) {
    if (code.includes("== ") && !code.includes("=== ")) {
      bugs.push("Using '==' can cause type coercion. Use '===' for strict equality.");
    }
    if (code.includes("var ")) {
      bugs.push("'var' has function scope issues. Use 'let' or 'const' instead.");
    }
    if (analysis.hasAsync && code.includes("forEach")) {
      bugs.push("forEach doesn't work with async/await. Use for...of or map with Promise.all().");
    }
  }
  if (isPython) {
    if (code.includes("== None") && !code.includes("is None")) {
      bugs.push("Use 'is None' instead of '== None' for None comparisons in Python.");
    }
  }

  // Suggestions
  const suggestions: string[] = [];
  if (!analysis.hasComments) {
    suggestions.push("Add comments to explain complex logic.");
  }
  if (!analysis.hasTryCatch && analysis.complexity > 10) {
    suggestions.push("Add try-catch blocks for error handling.");
  }
  if (isJS && !code.includes("const ") && !code.includes("let ")) {
    suggestions.push("Use 'const' for unchanging variables and 'let' for mutable ones.");
  }

  // Improvements
  const improvements: string[] = [];
  if (analysis.hasLoops && analysis.complexity > 20) {
    improvements.push("Consider breaking down complex logic into smaller functions.");
  }
  improvements.push("Add unit tests to ensure code reliability.");
  if (isJS) {
    improvements.push("Consider using TypeScript for better type safety.");
  }

  // Calculate code quality
  let codeQuality = 70;
  if (analysis.hasTryCatch) codeQuality += 10;
  if (analysis.hasComments) codeQuality += 5;
  if (isJS && (code.includes("const ") || code.includes("let "))) codeQuality += 10;
  if (bugs.length > 0) codeQuality -= bugs.length * 10;
  codeQuality = Math.max(0, Math.min(100, codeQuality));

  return {
    summary: `${language.charAt(0).toUpperCase() + language.slice(1)} code review - Complexity: ${
      analysis.complexity > 30 ? "High" : analysis.complexity > 15 ? "Medium" : "Low"
    }`,
    explanation,
    bugs,
    suggestions,
    improvements,
    codeQuality,
  };
}
