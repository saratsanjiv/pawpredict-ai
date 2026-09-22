import { VetAssessmentSchema, type CaseIntake, type TriageLevel, type VetCase } from "./schema";
import stored from "./assessments.json";

export const ASSESSMENT_META = { model: stored.model, generatedAt: stored.generatedAt };

export const TRIAGE_ORDER: Record<TriageLevel, number> = { emergency: 0, urgent: 1, routine: 2 };

export function getCase(id: string) {
  return CASES.find((c) => c.id === id);
}

export function getSortedCases() {
  return [...CASES].sort(
    (a, b) =>
      TRIAGE_ORDER[a.assessment.triage.level] - TRIAGE_ORDER[b.assessment.triage.level] ||
      a.minutesAgo - b.minutesAgo
  );
}

export const CASE_INTAKES: CaseIntake[] = [
  {
    id: "pp-1001",
    minutesAgo: 190,
    status: "reviewed",
    patient: { name: "Bella", species: "dog", breed: "Labrador Retriever", age: "3 years", sex: "Female (spayed)", weight: "28 kg" },
    ownerName: "J. Martinez",
    chiefComplaint: "Constant paw licking and red belly skin",
    symptoms: ["Itching / scratching", "Paw licking", "Red skin on belly"],
    ownerNotes: "Gets worse every spring and summer. Licks her paws at night so much it wakes us up. Paws look rusty-brown between the toes.",
    history: {
      diet: "Commercial dry food (kibble)",
      environment: "Indoor & outdoor",
      vaccines: "Up to date",
      lastVet: "6–12 months ago",
      medicalHistory: "Two ear infections last year. Monthly flea/tick chewable, occasionally missed.",
    },
    photo: { region: "Ventral abdomen" },
  },
  {
    id: "pp-1002",
    minutesAgo: 45,
    status: "new",
    patient: { name: "Max", species: "dog", breed: "Golden Retriever", age: "6 years", sex: "Male (neutered)", weight: "34 kg" },
    ownerName: "S. Okafor",
    chiefComplaint: "Wet, painful sore on cheek appeared overnight",
    symptoms: ["Itching / scratching", "Moist red patch", "Pain when touched"],
    ownerNotes: "Came back from swimming yesterday. This morning there's a big wet red patch below his left ear. He won't let us touch it. He's been shaking his head.",
    history: {
      diet: "Commercial dry food (kibble)",
      environment: "Mostly outdoor",
      vaccines: "Up to date",
      lastVet: "Within 6 months",
      medicalHistory: "None reported.",
    },
    photo: { region: "Left cheek, below the ear" },
  },
  {
    id: "pp-1003",
    minutesAgo: 80,
    status: "new",
    patient: { name: "Luna", species: "cat", breed: "Domestic Shorthair", age: "2 years", sex: "Female (spayed)", weight: "4 kg" },
    ownerName: "R. Chen",
    chiefComplaint: "Round bald, scaly patches on face and ears",
    symptoms: ["Hair loss", "Scaling / flaking"],
    ownerNotes: "We adopted a kitten 5 weeks ago and it has a similar patch. My daughter now has an itchy red ring on her forearm.",
    history: {
      diet: "Commercial wet food",
      environment: "Indoor & outdoor",
      vaccines: "Up to date",
      lastVet: "1–2 years ago",
      medicalHistory: "None reported.",
    },
    photo: { region: "Face and left pinna" },
  },
  {
    id: "pp-1004",
    minutesAgo: 25,
    status: "new",
    patient: { name: "Rocky", species: "dog", breed: "Boxer", age: "9 years", sex: "Male (neutered)", weight: "31 kg" },
    ownerName: "D. Williams",
    chiefComplaint: "Lump on side that grew quickly and changes size",
    symptoms: ["Skin lump", "Redness around lump"],
    ownerNotes: "Noticed a pea-sized lump on his right side about 3 weeks ago. It's now grape-sized. Some days it's red and puffy, then it goes down again.",
    history: {
      diet: "Commercial dry food (kibble)",
      environment: "Mostly indoor",
      vaccines: "Up to date",
      lastVet: "6–12 months ago",
      medicalHistory: "Two lipomas removed 2 years ago.",
    },
    photo: { region: "Right lateral thorax" },
  },
  {
    id: "pp-1005",
    minutesAgo: 140,
    status: "new",
    patient: { name: "Milo", species: "cat", breed: "Persian", age: "12 years", sex: "Male (neutered)", weight: "3.6 kg (was 4.5 kg last year)" },
    ownerName: "A. Novak",
    chiefComplaint: "Weight loss, drinking a lot, greasy unkempt coat",
    symptoms: ["Excessive thirst", "Frequent urination", "Vomiting", "Weight loss", "Poor coat"],
    ownerNotes: "Eating well or even more than usual, but getting thinner. Vomits a few times a week. His coat looks greasy and matted along his back and he's stopped grooming.",
    history: {
      diet: "Mixed diet",
      environment: "Indoor only",
      vaccines: "Partially vaccinated",
      lastVet: "Over 2 years ago",
      medicalHistory: "None reported.",
    },
    photo: { region: "Dorsum" },
  },
  {
    id: "pp-1006",
    minutesAgo: 320,
    status: "reviewed",
    patient: { name: "Daisy", species: "dog", breed: "French Bulldog", age: "4 years", sex: "Female (spayed)", weight: "11 kg" },
    ownerName: "M. Rossi",
    chiefComplaint: "Smelly, red skin in face folds and around tail",
    symptoms: ["Odor", "Redness in skin folds", "Rubbing face"],
    ownerNotes: "Her face wrinkles smell bad and look red and damp. Same around her screw tail. She rubs her face on the carpet.",
    history: {
      diet: "Commercial dry food (kibble)",
      environment: "Indoor only",
      vaccines: "Up to date",
      lastVet: "Within 6 months",
      medicalHistory: "Brachycephalic airway surgery at 1 year.",
    },
    photo: { region: "Facial folds" },
  },
  {
    id: "pp-1007",
    minutesAgo: 12,
    status: "new",
    patient: { name: "Oliver", species: "cat", breed: "Maine Coon", age: "5 years", sex: "Male (neutered)", weight: "7.2 kg" },
    ownerName: "K. Patel",
    chiefComplaint: "Straining in litter box, no urine for 12 hours",
    symptoms: ["Straining to urinate", "Crying in litter box", "Licking genitals", "Lethargy", "Vomiting"],
    ownerNotes: "Keeps going in and out of the litter box and crying but nothing comes out. Hasn't peed since last night. Threw up once this morning and is hiding.",
    history: {
      diet: "Commercial dry food (kibble)",
      environment: "Indoor only",
      vaccines: "Up to date",
      lastVet: "6–12 months ago",
      medicalHistory: "One episode of bloody urine last year that resolved on its own.",
    },
    photo: null,
  },
  {
    id: "pp-1008",
    minutesAgo: 400,
    status: "new",
    patient: { name: "Charlie", species: "dog", breed: "Beagle", age: "11 months", sex: "Male (intact)", weight: "9 kg" },
    ownerName: "T. Nguyen",
    chiefComplaint: "Patchy hair loss around eyes and muzzle",
    symptoms: ["Hair loss", "Mild itching"],
    ownerNotes: "Adopted from a shelter 3 weeks ago. Has thin patches around both eyes and on his muzzle. Only scratches a little.",
    history: {
      diet: "Commercial dry food (kibble)",
      environment: "Indoor & outdoor",
      vaccines: "Partially vaccinated",
      lastVet: "Within 6 months",
      medicalHistory: "Shelter records note roundworm treatment.",
    },
    photo: { region: "Periocular area and muzzle" },
  },
];

const storedAssessments: Record<string, unknown> = stored.assessments;

export const CASES: VetCase[] = CASE_INTAKES.map((intake) => ({
  ...intake,
  assessment: VetAssessmentSchema.parse(storedAssessments[intake.id]),
}));
