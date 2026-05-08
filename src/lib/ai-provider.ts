/**
 * Unified AI provider helper.
 * Tries Gemini 2.5 Flash first (free tier), fallback to Claude (paid).
 * Returns { content, provider, error } - never throws.
 */

export type AIProviderResult = {
  content: string;
  provider: "gemini" | "claude" | "none";
  error?: string;
};

const GEMINI_MODEL = "gemini-2.5-flash";
const CLAUDE_MODEL = "claude-sonnet-4-5-20250929";

export async function generateContent(
  systemPrompt: string,
  userPrompt: string,
  maxTokens = 4096
): Promise<AIProviderResult> {
  const geminiKey = process.env.GEMINI_API_KEY;
  const anthropicKey = process.env.ANTHROPIC_API_KEY;

  if (!geminiKey && !anthropicKey) {
    return {
      content: "",
      provider: "none",
      error:
        "Tidak ada AI key. Set GEMINI_API_KEY (gratis: https://aistudio.google.com/apikey) atau ANTHROPIC_API_KEY di .env",
    };
  }

  // PROVIDER 1: Gemini 2.5 Flash (FREE)
  if (geminiKey) {
    try {
      const r = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${geminiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: systemPrompt }] },
            contents: [{ role: "user", parts: [{ text: userPrompt }] }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: maxTokens,
            },
            safetySettings: [
              { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_ONLY_HIGH" },
              { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_ONLY_HIGH" },
              { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_ONLY_HIGH" },
              { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_ONLY_HIGH" },
            ],
          }),
        }
      );

      const data = (await r.json()) as {
        candidates?: Array<{
          content?: { parts?: Array<{ text?: string }> };
          finishReason?: string;
          safetyRatings?: unknown;
        }>;
        error?: { message?: string; code?: number; status?: string };
        promptFeedback?: { blockReason?: string };
      };

      if (!r.ok) {
        const reason = data.error?.message ?? `HTTP ${r.status}`;
        console.error("[Gemini] HTTP error:", reason);
        // Don't fail yet - try Claude fallback
      } else if (data.promptFeedback?.blockReason) {
        console.error("[Gemini] Prompt blocked:", data.promptFeedback.blockReason);
      } else {
        const candidate = data.candidates?.[0];
        const text = candidate?.content?.parts?.[0]?.text;
        const finishReason = candidate?.finishReason;

        if (text && text.trim().length > 0) {
          return { content: cleanContent(text), provider: "gemini" };
        }
        if (finishReason === "SAFETY") {
          console.error("[Gemini] Safety filter triggered");
        } else if (finishReason === "MAX_TOKENS") {
          console.error("[Gemini] Max tokens hit (perlu naikin maxOutputTokens)");
        } else {
          console.error("[Gemini] Empty response. finishReason:", finishReason);
        }
      }
    } catch (e) {
      console.error("[Gemini] fetch error:", e);
    }
  }

  // PROVIDER 2: Claude (FALLBACK)
  if (anthropicKey) {
    try {
      const r = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": anthropicKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: CLAUDE_MODEL,
          max_tokens: maxTokens,
          system: systemPrompt,
          messages: [{ role: "user", content: userPrompt }],
        }),
      });
      if (r.ok) {
        const d = (await r.json()) as { content?: Array<{ type: string; text?: string }> };
        const text = d.content?.find((c) => c.type === "text")?.text ?? "";
        if (text) return { content: cleanContent(text), provider: "claude" };
      } else {
        const errText = await r.text();
        console.error("[Claude] HTTP error:", errText);
      }
    } catch (e) {
      console.error("[Claude] error:", e);
    }
  }

  return {
    content: "",
    provider: "none",
    error:
      "AI gagal generate (lihat Vercel logs untuk detail). Cek: 1) GEMINI_API_KEY valid, 2) Quota belum habis (1500/hari), 3) Topik ngga sensitif buat safety filter.",
  };
}

function cleanContent(raw: string): string {
  return raw
    .replace(/^```html\s*/i, "")
    .replace(/^```\s*/, "")
    .replace(/```\s*$/, "")
    .trim();
}
