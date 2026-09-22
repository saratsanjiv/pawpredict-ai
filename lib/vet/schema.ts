import { z } from "zod";

export const TriageLevelSchema = z.enum(["emergency", "urgent", "routine"]);
export type TriageLevel = z.infer<typeof TriageLevelSchema>;

const LikelihoodSchema = z.enum(["high", "moderate", "low"]);

export const VetAssessmentSchema = z.object({
  triage: z.object({
    level: TriageLevelSchema,
    rationale: z.string(),
  }),
  clinicalSummary: z.string(),
  differentials: z.array(
    z.object({
      condition: z.string(),
      likelihood: LikelihoodSchema,
      supporting: z.array(z.string()),
      against: z.array(z.string()),
    })
  ),
  recommendedDiagnostics: z.array(
    z.object({
      test: z.string(),
      purpose: z.string(),
      priority: z.enum(["first-line", "if indicated"]),
    })
  ),
  imageFindings: z.string().nullable(),
  redFlags: z.array(z.string()),
  clientCommunication: z.string(),
  confidence: z.object({
    level: LikelihoodSchema,
    limitations: z.array(z.string()),
  }),
});

export type VetAssessment = z.infer<typeof VetAssessmentSchema>;

export interface VetCase {
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
  assessment: VetAssessment;
}
