import { CANDIDATE_LABELS, ComplaintCategory } from "./categories";

export interface ClassificationResult {
  category: ComplaintCategory;
  confidence: number;
}

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

/**
 * Model used for classification. `qwen/qwen3.8-27b` is a fast, capable model
 * available on Groq that works well for single-label classification tasks.
 * `enable_thinking: false` disables chain-of-thought output so the response
 * is just the category name with no extra tokens.
 */
const GROQ_MODEL = "qwen/qwen3.8-27b";

/**
 * Few-shot examples that anchor the model's notion of each category.
 * Without these, small fast models tend to under-classify (e.g. grade
 * discrepancies and registration issues drift into "others").
 */
const FEW_SHOT_EXAMPLES = [
  {
    text: "My mid-term grade for Advanced Calculus was entered incorrectly in the portal as 45% instead of the 75% marked on my paper.",
    category: "academic",
  },
  {
    text: "There is no running water in block C and the light in the corridor has been broken for a week.",
    category: "hostel",
  },
  {
    text: "The school portal charged me twice for this semester's fees and I need a refund of the duplicate payment.",
    category: "fees",
  },
  {
    text: "A lecturer publicly humiliated me during class and refused to let me explain my absence.",
    category: "staff",
  },
  {
    text: "I cannot log in to the student portal and the dashboard shows an error whenever I submit a form.",
    category: "technical",
  },
  {
    text: "The cafeteria menu does not have enough vegetarian options for students.",
    category: "others",
  },
] as const;

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
      // Disable Qwen3 chain-of-thought so the response is a bare category name
      enable_thinking: false,
      max_tokens: 10,
      messages: [
        {
          role: "system",
          content:
            `You are a classifier for university student complaints. ` +
            `Categorize the complaint into exactly one of these categories: ` +
            `${CANDIDATE_LABELS.join(", ")}.\n\n` +
            `Guidelines:\n` +
            `- "academic" covers anything about courses, exams, grades, results, ` +
            `transcripts, lectures, attendance, registration/add-drop, or academic records.\n` +
            `- "fees" covers payments, charges, refunds, and billing.\n` +
            `- "hostel" covers accommodation, rooms, and residence facilities.\n` +
            `- "staff" covers misconduct or behavior of lecturers/administrators.\n` +
            `- "technical" covers IT problems, logins, portals/apps not working.\n` +
            `- Use "others" ONLY when no other category fits.\n\n` +
            `Respond with ONLY the category name, nothing else.`,
        },
        ...FEW_SHOT_EXAMPLES.flatMap((example) => [
          { role: "user", content: example.text },
          { role: "assistant", content: example.category },
        ]),
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
