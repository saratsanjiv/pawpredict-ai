import { z } from "zod/v4";

export const TriageLevelSchema = z.enum(["emergency", "urgent", "routine"]);
export type TriageLevel = z.infer<typeof TriageLevelSchema>;

const LikelihoodSchema = z.enum(["high", "moderate", "low"]);

export const VetAssessmentSchema = z.object({
  triage: z.object({
    level: TriageLevelSchema.describe("emergency = see immediately; urgent = within 24–48 hours; routine = can be scheduled"),
    rationale: z.string().describe("1–2 sentences justifying the triage level"),
  }),
  clinicalSummary: z.string().describe("3–4 sentence clinical summary in veterinary terminology: signalment, key findings, leading concern"),
  differentials: z.array(
    z.object({
      condition: z.string(),
      likelihood: LikelihoodSchema,
      supporting: z.array(z.string()).describe("Short findings from the case that support this differential"),
      against: z.array(z.string()).describe("Short findings that argue against it; empty if none"),
    })
  ).describe("2–4 differentials, most likely first"),
  recommendedDiagnostics: z.array(
    z.object({
      test: z.string(),
      purpose: z.string().describe("One short sentence"),
      priority: z.enum(["first-line", "if indicated"]),
    })
  ).describe("2–5 diagnostics, first-line tests first"),
  imageFindings: z.string().nullable().describe("Objective description of the photo in dermatological terms; null if no photo is available"),
  redFlags: z.array(z.string()).describe("Findings that change urgency or management, including zoonotic risk; empty if none"),
  clientCommunication: z.string().describe("Draft message the vet could send the owner: plain language, warm, 3–4 sentences, no definitive diagnosis"),
  confidence: z.object({
    level: LikelihoodSchema,
    limitations: z.array(z.string()).describe("What limits confidence, e.g. no physical exam, photo quality"),
  }),
});

export type VetAssessment = z.infer<typeof VetAssessmentSchema>;

export interface CaseIntake {
  id: string;
  minutesAgo: number;
  status: "new" | "reviewed";
  patient: {
    name: string;
    species: "dog" | "cat";
    breed: string;
    age: string;
    sex: string;
    weight: string;
  };
  ownerName: string;
  chiefComplaint: string;
  symptoms: string[];
  ownerNotes: string;
  history: {
    diet: string;
    environment: string;
    vaccines: string;
    lastVet: string;
    medicalHistory: string;
  };
  photo: { region: string } | null;
}

export interface VetCase extends CaseIntake {
  assessment: VetAssessment;
}
