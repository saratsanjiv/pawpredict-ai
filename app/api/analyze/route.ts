import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { checkRateLimit } from "@/lib/rateLimit";
import { sanitizeText, sanitizeSymptoms, validateImage } from "@/lib/sanitize";
import { AnalyzeRequestSchema, HealthReportSchema } from "@/lib/validation";

// ─── Anthropic client (server-side only — key never sent to browser) ──────────
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// ─── CORS helper — only allow requests from our own origin ────────────────────
function getCorsHeaders(req: NextRequest) {
  const origin = req.headers.get("origin") ?? "";
  const allowed = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const isAllowed = origin === allowed || process.env.NODE_ENV === "development";
  return {
    "Access-Control-Allow-Origin": isAllowed ? origin : "null",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

// Handle preflight
export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, { status: 204, headers: getCorsHeaders(req) });
}

export async function POST(req: NextRequest) {
  const corsHeaders = getCorsHeaders(req);

  // ── 1. Rate limiting ────────────────────────────────────────────────────────
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  const { allowed, remaining, resetIn } = checkRateLimit(ip);

  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a moment and try again." },
      {
        status: 429,
        headers: {
          ...corsHeaders,
          "Retry-After": String(Math.ceil(resetIn / 1000)),
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

  // ── 2. Parse & validate request body ────────────────────────────────────────
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON in request body." },
      { status: 400, headers: corsHeaders }
    );
  }

  // Check content-length to reject huge payloads early
  const contentLength = Number(req.headers.get("content-length") ?? 0);
  if (contentLength > 6_000_000) {
    return NextResponse.json(
      { error: "Request payload too large." },
      { status: 413, headers: corsHeaders }
    );
  }

  const parsed = AnalyzeRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request data.", details: parsed.error.flatten() },
      { status: 422, headers: corsHeaders }
    );
  }

  const data = parsed.data;

  // ── 3. Sanitize all inputs ──────────────────────────────────────────────────
  const name        = sanitizeText(data.name, 50) || "your pet";
  const breed       = sanitizeText(data.breed, 100) || "unknown breed";
  const age         = sanitizeText(data.age, 60) || "unknown";
  const weight      = sanitizeText(data.weight, 40) || "unknown";
  const sex         = sanitizeText(data.sex, 30) || "unknown";
  const diet        = sanitizeText(data.diet, 60) || "unknown";
  const exercise    = sanitizeText(data.exercise, 80) || "unknown";
  const vaccines    = sanitizeText(data.vaccines, 40) || "unknown";
  const lastVet     = sanitizeText(data.lastVet, 40) || "unknown";
  const environment = sanitizeText(data.environment, 40) || "unknown";
  const medHistory  = sanitizeText(data.medicalHistory, 500) || "none reported";
  const otherSymp   = sanitizeText(data.otherSymptoms, 300);
  const symptoms    = sanitizeSymptoms(data.symptoms ?? []);
  if (otherSymp) symptoms.push(`Other: ${otherSymp}`);

  // ── 4. Validate image (optional) ────────────────────────────────────────────
  const imageResult = data.imageBase64 ? validateImage(data.imageBase64) : null;

  // ── 5. Build AI prompt ──────────────────────────────────────────────────────
  const systemPrompt = `You are PawPredict AI, a warm and expert veterinary health assessment AI.
Analyze the provided pet data and return ONLY valid JSON — no markdown fences, no preamble.

Return this exact structure:
{
  "overallScore": <number 0-100>,
  "summary": "<2-3 friendly, warm sentences summarizing overall health>",
  "categories": {
    "nutrition": { "score": <0-100>, "detail": "<1-2 sentences>" },
    "activity": { "score": <0-100>, "detail": "<1-2 sentences>" },
    "preventiveCare": { "score": <0-100>, "detail": "<1-2 sentences>" },
    "symptoms": { "score": <0-100>, "detail": "<1-2 sentences>" },
    "skinCoat": { "score": <0-100>, "detail": "<1-2 sentences>" }
  },
  "riskFlags": ["<risk flag>"],
  "recommendations": ["<rec 1>", "<rec 2>", "<rec 3>"],
  "urgency": "low" | "moderate" | "high",
  "urgencyNote": "<one sentence>",
  "skinCoatFindings": "<detailed paragraph — analyze photo if provided, else infer from symptoms>",
  "breedRisks": "<1-2 sentences about known breed-specific health risks>"
}

Always remind pet owners to consult a licensed veterinarian for any serious concerns.`;

  const userContent: Anthropic.MessageParam["content"] = [];

  if (imageResult?.valid && imageResult.data) {
    userContent.push({
      type: "image",
      source: {
        type: "base64",
        media_type: imageResult.mediaType!,
        data: imageResult.data,
      },
    });
  }

  userContent.push({
    type: "text",
    text: `${data.petType.toUpperCase()} HEALTH ASSESSMENT:
Name: ${name}
Breed: ${breed}
Age: ${age}
Weight: ${weight}
Sex: ${sex}
Diet: ${diet}
Exercise: ${exercise}
Vaccinations: ${vaccines}
Last vet visit: ${lastVet}
Living environment: ${environment}
Medical history / medications: ${medHistory}
Current symptoms: ${symptoms.length > 0 ? symptoms.join(", ") : "none reported"}
${imageResult?.valid ? "Coat/skin photo: provided above — please analyze it." : "No photo provided."}

Generate the health risk report JSON.`,
  });

  // ── 6. Call Anthropic API (server-side — key never exposed) ─────────────────
  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: "user", content: userContent }],
    });

    const rawText = message.content
      .filter((b) => b.type === "text")
      .map((b) => (b as Anthropic.TextBlock).text)
      .join("")
      .replace(/```json|```/g, "")
      .trim();

    // Parse and validate the AI response shape
    let report: unknown;
    try {
      report = JSON.parse(rawText);
    } catch {
      return NextResponse.json(
        { error: "AI returned malformed data. Please try again." },
        { status: 502, headers: corsHeaders }
      );
    }

    const validated = HealthReportSchema.safeParse(report);
    if (!validated.success) {
      return NextResponse.json(
        { error: "AI response did not match expected format. Please try again." },
        { status: 502, headers: corsHeaders }
      );
    }

    return NextResponse.json(validated.data, {
      status: 200,
      headers: {
        ...corsHeaders,
        "X-RateLimit-Remaining": String(remaining),
      },
    });
  } catch (err: unknown) {
    // Don't leak internal error details to the client
    console.error("[PawPredict API Error]", err);

    const isAnthropicError = err instanceof Anthropic.APIError;
    if (isAnthropicError && err.status === 429) {
      return NextResponse.json(
        { error: "AI service is busy. Please try again in a moment." },
        { status: 429, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      { error: "Something went wrong on our end. Please try again." },
      { status: 500, headers: corsHeaders }
    );
  }
}
