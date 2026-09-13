const HUGGING_FACE_API_URL = "https://api-inference.huggingface.co/models/facebook/bart-large-mnli";

export type ComplaintCategory = 'academic' | 'hostel' | 'fees' | 'staff' | 'technical' | 'others';

export const CANDIDATE_LABELS: ComplaintCategory[] = [
  'academic',
  'hostel',
  'fees',
  'staff',
  'technical',
  'others'
];

export async function classifyComplaint(description: string): Promise<ComplaintCategory> {
  const token = process.env.HUGGING_FACE_API_TOKEN;

  if (!token) {
    console.error("AI Token missing. Falling back to 'others'.");
    return 'others';
  }

  try {
    const response = await fetch(HUGGING_FACE_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: description,
        parameters: { candidate_labels: CANDIDATE_LABELS },
      }),
    });

    if (!response.ok) {
      throw new Error(`AI API Error: ${response.statusText}`);
    }

    const result = await response.json();
    
    // The model returns labels sorted by score. The first one is the winner.
    return result.labels[0] as ComplaintCategory;

  } catch (error) {
    console.error("AI Classification failed:", error);
    return 'others'; // Safety fallback
  }
}
