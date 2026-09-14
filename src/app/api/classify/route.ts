import { NextRequest, NextResponse } from "next/server";
import { classifyComplaint } from "@/lib/classifier";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const description = typeof body?.description === "string" ? body.description.trim() : "";

    if (!description) {
      return NextResponse.json(
        { error: "Missing 'description' field." },
        { status: 400 }
      );
    }

    const result = await classifyComplaint(description);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Classification failed:", error);

    // Graceful fallback so submissions never hard-fail because of the AI.
    // `fallback: true` tells the caller the AI did not run, so the UI can
    // distinguish "AI chose others" from "AI unavailable".
    return NextResponse.json(
      {
        category: "others",
        confidence: 0,
        fallback: true,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 200 }
    );
  }
}
