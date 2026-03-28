import { z } from "zod";

export const AnalyzeRequestSchema = z.object({
  petType: z.enum(["dog", "cat"]),
  name: z.string().max(50).optional(),
  breed: z.string().max(100).optional(),
  age: z.string().max(60).optional(),
  weight: z.string().max(40).optional(),
  sex: z.string().max(30).optional(),
  diet: z.string().max(60).optional(),
  exercise: z.string().max(80).optional(),
  vaccines: z.string().max(40).optional(),
  lastVet: z.string().max(40).optional(),
  environment: z.string().max(40).optional(),
  medicalHistory: z.string().max(500).optional(),
  symptoms: z.array(z.string().max(100)).max(15).optional(),
  otherSymptoms: z.string().max(300).optional(),
  // image is validated separately due to size
  imageBase64: z.string().max(5_600_000).optional(),
});

export type AnalyzeRequest = z.infer<typeof AnalyzeRequestSchema>;

export const HealthReportSchema = z.object({
  overallScore: z.number().min(0).max(100),
  summary: z.string(),
  categories: z.object({
    nutrition: z.object({ score: z.number(), detail: z.string() }),
    activity: z.object({ score: z.number(), detail: z.string() }),
    preventiveCare: z.object({ score: z.number(), detail: z.string() }),
    symptoms: z.object({ score: z.number(), detail: z.string() }),
    skinCoat: z.object({ score: z.number(), detail: z.string() }),
  }),
  riskFlags: z.array(z.string()),
  recommendations: z.array(z.string()),
  urgency: z.enum(["low", "moderate", "high"]),
  urgencyNote: z.string(),
  skinCoatFindings: z.string(),
  breedRisks: z.string(),
});

export type HealthReport = z.infer<typeof HealthReportSchema>;
