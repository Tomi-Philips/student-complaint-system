import { CANDIDATE_LABELS, ComplaintCategory } from "./categories";

export interface ClassificationResult {
  category: ComplaintCategory;
  confidence: number;
}

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

/**
 * Model used for classification. `llama-3.1-8b-instant` is fast and cheap,
 * which suits a single-label classification task on complaint submission.
 */
const GROQ_MODEL = "llama-3.1-8b-instant";

/**
 * Classify a complaint description into one of the fixed categories using
 * the Groq API (OpenAI-compatible chat completions endpoint).
 *
 * Must be called server-side only (API route / server component) — the API
 * key is never exposed to the browser.
 */
export async function classifyComplaint(
  description: string
): Promise<ClassificationResult> {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not configured on the server.");
  }

  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      temperature: 0,
      max_tokens: 10,
      messages: [
        {
          role: "system",
          content:
            `You are a classifier for university student complaints. ` +
            `Categorize the complaint into exactly one of these categories: ` +
            `${CANDIDATE_LABELS.join(", ")}. ` +
            `Respond with ONLY the category name, nothing else.`,
        },
        {
          role: "user",
          content: description,
        },
      ],
    }),
    // Never let the AI call hang the submission flow for too long
    signal: AbortSignal.timeout(15_000),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(
      `Groq API error ${response.status}: ${detail.slice(0, 200)}`
    );
  }

  const result = await response.json();
  const raw: string = result?.choices?.[0]?.message?.content?.trim() ?? "";

  const category = raw.toLowerCase() as ComplaintCategory;
  if (CANDIDATE_LABELS.includes(category)) {
    return { category, confidence: 1 };
  }

  // Model returned something unexpected — try a lenient keyword match
  const match = CANDIDATE_LABELS.find((label) => raw.toLowerCase().includes(label));
  if (match) {
    return { category: match, confidence: 0.5 };
  }

  throw new Error(`Groq returned an unrecognized category: "${raw.slice(0, 50)}"`);
}
