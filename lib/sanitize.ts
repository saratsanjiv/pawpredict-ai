/**
 * Sanitizes and validates all user inputs before they reach the AI.
 * Prevents prompt injection, XSS, and oversized payloads.
 */

// Strip HTML tags and dangerous characters
export function sanitizeText(input: unknown, maxLength = 500): string {
  if (typeof input !== "string") return "";
  return input
    .replace(/<[^>]*>/g, "")           // Strip HTML tags
    .replace(/[<>&"'`]/g, "")          // Strip dangerous chars
    .replace(/\n{3,}/g, "\n\n")        // Collapse excessive newlines
    .trim()
    .slice(0, maxLength);
}

// Validate that a value is one of an allowed set
export function sanitizeEnum<T extends string>(
  input: unknown,
  allowed: T[],
  fallback: T
): T {
  if (typeof input === "string" && allowed.includes(input as T)) {
    return input as T;
  }
  return fallback;
}

// Validate symptom list — must be an array of known strings
const KNOWN_SYMPTOMS = [
  "Lethargy",
  "Loss of appetite",
  "Vomiting",
  "Diarrhea",
  "Excessive thirst",
  "Frequent urination",
  "Coughing / sneezing",
  "Limping / stiffness",
  "Itching / scratching",
  "Hair loss",
  "Bad breath",
  "Eye / nose discharge",
] as const;

export function sanitizeSymptoms(input: unknown): string[] {
  if (!Array.isArray(input)) return [];
  const known = input
    .filter((s): s is string => typeof s === "string" && KNOWN_SYMPTOMS.includes(s as any))
    .slice(0, 15); // max 15 items

  // Allow one "other" free-text entry — sanitized separately
  return known;
}

// Validate image: must be base64 JPEG or PNG, max ~4MB
export function validateImage(
  base64: unknown
): { valid: boolean; data?: string; mediaType?: "image/jpeg" | "image/png" } {
  if (!base64 || typeof base64 !== "string") return { valid: false };

  // Check size: base64 ~= 4/3 of binary; 4MB binary = ~5.3MB base64
  if (base64.length > 5_500_000) return { valid: false };

  // Detect image type from base64 prefix
  const jpegMagic = base64.startsWith("/9j/");
  const pngMagic = base64.startsWith("iVBOR");

  if (!jpegMagic && !pngMagic) return { valid: false };

  return {
    valid: true,
    data: base64,
    mediaType: jpegMagic ? "image/jpeg" : "image/png",
  };
}
