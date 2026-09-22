import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod/v4";
import { checkRateLimit } from "@/lib/rateLimit";
import { getCase } from "@/lib/vet/cases";
import { assessCase, AssessmentError } from "@/lib/vet/assess";

export const maxDuration = 120;

const RequestSchema = z.object({ caseId: z.string().max(40) });

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";
  const { allowed, resetIn } = checkRateLimit(ip);
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a moment and try again." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(resetIn / 1000)) } }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON in request body." }, { status: 400 });
  }

  const parsed = RequestSchema.safeParse(body);
  const vetCase = parsed.success ? getCase(parsed.data.caseId) : undefined;
  if (!vetCase) {
    return NextResponse.json({ error: "Case not found." }, { status: 404 });
  }

  try {
    const { assessment } = await assessCase(vetCase);
    return NextResponse.json(assessment);
  } catch (err) {
    console.error("[PawPredict vet assess error]", err);

    if (err instanceof AssessmentError) {
      return NextResponse.json({ error: "The AI couldn't produce a complete assessment. Please try again." }, { status: 502 });
    }
    if (err instanceof Anthropic.RateLimitError || (err instanceof Anthropic.APIError && err.status === 529)) {
      return NextResponse.json({ error: "AI service is busy. Please try again in a moment." }, { status: 503 });
    }
    return NextResponse.json({ error: "Something went wrong on our end. Please try again." }, { status: 500 });
  }
}
