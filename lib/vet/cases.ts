import type { TriageLevel, VetCase } from "./schema";

// Photos live at public/cases/<case id>.jpg — replace a file with a real photo of the same name.
export function casePhotoPath(id: string) {
  return `/cases/${id}.jpg`;
}

export function formatAgo(minutes: number) {
  return minutes < 60 ? `${minutes} min ago` : `${Math.floor(minutes / 60)} h ago`;
}

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

export const CASES: VetCase[] = [
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
    assessment: {
      triage: { level: "routine", rationale: "Chronic, seasonal pruritus with no systemic signs. Comfort is affected but nothing suggests a need for same-day care." },
      clinicalSummary: "3-year-old spayed female Labrador with seasonal pedal and ventral pruritus, saliva staining of the interdigital spaces and a history of recurrent otitis externa. The pattern and distribution are typical of canine atopic dermatitis, likely with secondary bacterial or Malassezia overgrowth.",
      differentials: [
        { condition: "Canine atopic dermatitis", likelihood: "high", supporting: ["Seasonal worsening", "Pedal and ventral distribution", "Recurrent otitis", "Onset at a typical age"], against: [] },
        { condition: "Flea allergy dermatitis", likelihood: "moderate", supporting: ["Flea preventive occasionally missed", "Outdoor access"], against: ["Distribution is not caudal/dorsal lumbosacral"] },
        { condition: "Secondary Malassezia or bacterial pyoderma", likelihood: "moderate", supporting: ["Saliva staining", "Erythema", "Chronic licking"], against: [] },
        { condition: "Cutaneous adverse food reaction", likelihood: "low", supporting: ["Pedal pruritus and otitis can overlap"], against: ["Clear seasonal pattern"] },
      ],
      recommendedDiagnostics: [
        { test: "Skin and ear cytology (tape/impression)", purpose: "Identify secondary yeast or bacterial overgrowth to treat before assessing the underlying allergy", priority: "first-line" },
        { test: "Flea combing", purpose: "Rule out flea allergy as a contributor", priority: "first-line" },
        { test: "Superficial skin scrape", purpose: "Rule out Sarcoptes and Demodex", priority: "first-line" },
        { test: "Elimination diet trial (8 weeks)", purpose: "Rule out food allergy if pruritus becomes non-seasonal", priority: "if indicated" },
      ],
      imageFindings: "Diffuse erythema across the ventral abdomen and inguinal region with mild hyperpigmentation. No obvious pustules, collarettes or alopecic patches. Consistent with chronic allergic inflammation.",
      redFlags: [],
      clientCommunication: "Bella's itching fits a very common pattern of environmental allergies that flare seasonally. We'd like to check her skin and ears for secondary infections, which often make the itch worse, and confirm her flea prevention is consistent. Allergies are managed rather than cured, but there are very effective options to keep her comfortable.",
      confidence: { level: "high", limitations: ["No cytology results yet", "Photo shows only the abdomen, not the paws"] },
    },
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
    assessment: {
      triage: { level: "urgent", rationale: "Painful, rapidly expanding lesion. Should be seen within 24 hours to clip, clean and control pain and self-trauma." },
      clinicalSummary: "6-year-old neutered male Golden Retriever with an acute, painful, moist lesion on the left cheek after swimming, with concurrent head shaking. Most consistent with pyotraumatic dermatitis (hot spot). Head shaking suggests left otitis externa as the likely trigger.",
      differentials: [
        { condition: "Pyotraumatic dermatitis (acute moist dermatitis)", likelihood: "high", supporting: ["Overnight onset", "Moist, painful lesion", "Breed predisposition", "Recent swimming"], against: [] },
        { condition: "Otitis externa as the underlying trigger", likelihood: "high", supporting: ["Head shaking", "Lesion directly below the ear"], against: [] },
        { condition: "Pyotraumatic folliculitis (deep pyoderma)", likelihood: "moderate", supporting: ["Golden Retrievers and cheek location are over-represented"], against: ["Very acute onset"] },
      ],
      recommendedDiagnostics: [
        { test: "Otoscopic exam and ear cytology", purpose: "Confirm and characterize otitis as the trigger", priority: "first-line" },
        { test: "Impression cytology of the lesion after clipping", purpose: "Assess bacterial load and look for deeper infection", priority: "first-line" },
        { test: "Bacterial culture and sensitivity", purpose: "Only if satellite papules suggest deep pyoderma or it fails to respond", priority: "if indicated" },
      ],
      imageFindings: "Well-demarcated, moist, exudative, erythematous plaque roughly 4–5 cm across below the left ear, with matted surrounding hair. Several small papules at the margin may indicate folliculitis extending beyond the central lesion.",
      redFlags: ["Satellite papules around the margin can indicate deep pyoderma, which usually needs systemic antibiotics"],
      clientCommunication: "Max most likely has a 'hot spot', a painful skin infection that can spread quickly once a dog starts scratching. His head shaking suggests an ear problem may have started it. We'd like to see him today or tomorrow to clean the area, check his ears and make him comfortable.",
      confidence: { level: "high", limitations: ["Ear canal not visible in the photo"] },
    },
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
    assessment: {
      triage: { level: "urgent", rationale: "Likely contagious and zoonotic infection with a probable human case already in the household. Needs prompt diagnosis and environmental guidance." },
      clinicalSummary: "2-year-old spayed female DSH with focal circular alopecia and scaling on the face and pinnae. A recently introduced kitten has similar lesions and a household member has an annular skin lesion. Strongly suggests dermatophytosis (Microsporum canis).",
      differentials: [
        { condition: "Dermatophytosis (likely Microsporum canis)", likelihood: "high", supporting: ["Annular alopecia with scale", "Face and pinnae distribution", "New kitten in the home", "Suspected human lesion"], against: [] },
        { condition: "Demodicosis (D. gatoi or D. cati)", likelihood: "low", supporting: ["Focal alopecia"], against: ["Human lesion is not explained by Demodex"] },
        { condition: "Pemphigus foliaceus", likelihood: "low", supporting: ["Facial and pinnal scaling"], against: ["Young age", "Multiple animals and a human affected"] },
      ],
      recommendedDiagnostics: [
        { test: "Wood's lamp exam", purpose: "Quick screen; many M. canis strains fluoresce apple-green", priority: "first-line" },
        { test: "Trichogram", purpose: "Look for fungal hyphae and spores on hair shafts", priority: "first-line" },
        { test: "Dermatophyte PCR or fungal culture (toothbrush technique)", purpose: "Confirm the diagnosis and later confirm cure", priority: "first-line" },
        { test: "Examine and test the kitten", purpose: "Likely source; all in-contact animals need treatment", priority: "first-line" },
      ],
      imageFindings: "Two well-circumscribed, roughly circular areas of alopecia with fine grey scale on the dorsal muzzle and the margin of the left pinna. No obvious erythema or crusting.",
      redFlags: ["Zoonotic: a household member has a lesion consistent with ringworm and should see their physician", "New kitten is the likely source and needs examination"],
      clientCommunication: "Luna's patches look like ringworm, a fungal infection (not a worm) that spreads between pets and people. We'd like to test Luna and the new kitten, and your daughter should see her doctor about the spot on her arm. It's very treatable, but treating all pets and cleaning the home at the same time is key.",
      confidence: { level: "high", limitations: ["Diagnosis needs confirmation by PCR or culture", "Human lesion is owner-reported, not examined"] },
    },
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
    assessment: {
      triage: { level: "urgent", rationale: "Rapidly growing cutaneous mass that fluctuates in size in a predisposed breed. Needs fine-needle aspirate within days, not weeks." },
      clinicalSummary: "9-year-old neutered male Boxer with a cutaneous mass on the right lateral thorax that grew from about 5 mm to 15–20 mm over 3 weeks, with intermittent erythema and swelling. Size fluctuation and breed raise strong concern for a mast cell tumor. Prior lipomas should not lead to assuming this is benign.",
      differentials: [
        { condition: "Cutaneous mast cell tumor", likelihood: "high", supporting: ["Boxer predisposition", "Rapid growth", "Waxing and waning size and redness (possible degranulation)"], against: [] },
        { condition: "Soft tissue sarcoma", likelihood: "low", supporting: ["Age", "Growing mass"], against: ["Size fluctuation is atypical"] },
        { condition: "Lipoma", likelihood: "low", supporting: ["History of lipomas"], against: ["Rapid growth", "Erythema", "Size fluctuation"] },
        { condition: "Histiocytoma", likelihood: "low", supporting: ["Boxers over-represented", "Rapid growth"], against: ["Much more common under 3 years of age"] },
      ],
      recommendedDiagnostics: [
        { test: "Fine-needle aspirate with cytology", purpose: "Most mast cell tumors can be diagnosed on cytology", priority: "first-line" },
        { test: "Regional lymph node aspirate", purpose: "Staging if cytology confirms a mast cell tumor", priority: "if indicated" },
        { test: "Surgical excision with histopathology and grading", purpose: "Definitive diagnosis, grade and margin assessment", priority: "if indicated" },
        { test: "Abdominal ultrasound, CBC and chemistry", purpose: "Staging for high-grade or metastatic disease", priority: "if indicated" },
      ],
      imageFindings: "Single raised, dome-shaped, partially alopecic cutaneous nodule roughly 1.5–2 cm across with surrounding erythema and mild edema. No ulceration visible.",
      redFlags: ["Rapid growth with size fluctuation strongly suggests a mast cell tumor", "Advise the owner not to squeeze or manipulate the lump, which can trigger degranulation", "Consider antihistamine premedication before aspirate or surgery if MCT is suspected"],
      clientCommunication: "Because Rocky's lump grew quickly and changes size, we'd like to test it soon with a quick needle sample. Boxers are prone to a type of skin tumor called a mast cell tumor. Many are cured with surgery when caught early, so testing promptly gives him the best options. Please avoid squeezing or handling the lump until then.",
      confidence: { level: "moderate", limitations: ["Cannot distinguish tumor types without cytology", "Size is estimated from the photo"] },
    },
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
    assessment: {
      triage: { level: "urgent", rationale: "20% weight loss with polyuria/polydipsia in a senior cat points to significant systemic disease. Should be examined within 1–2 days." },
      clinicalSummary: "12-year-old neutered male Persian with about 20% weight loss despite a normal to increased appetite, PU/PD, intermittent vomiting and poor grooming with a greasy, matted dorsal coat. The coat changes most likely reflect systemic illness rather than primary skin disease. Main concerns are hyperthyroidism, chronic kidney disease and diabetes mellitus, which can occur together.",
      differentials: [
        { condition: "Hyperthyroidism", likelihood: "high", supporting: ["Weight loss with good or increased appetite", "Vomiting", "Unkempt coat", "Age"], against: [] },
        { condition: "Chronic kidney disease", likelihood: "high", supporting: ["PU/PD", "Weight loss", "Vomiting", "Persian breed (polycystic kidney disease risk)"], against: [] },
        { condition: "Diabetes mellitus", likelihood: "moderate", supporting: ["PU/PD", "Weight loss with good appetite", "Poor grooming"], against: [] },
        { condition: "Gastrointestinal lymphoma or chronic enteropathy", likelihood: "low", supporting: ["Weight loss", "Vomiting"], against: ["PU/PD better explained by the other differentials"] },
      ],
      recommendedDiagnostics: [
        { test: "CBC and serum chemistry (including SDMA)", purpose: "Assess kidney function, glucose and overall status", priority: "first-line" },
        { test: "Total T4", purpose: "Screen for hyperthyroidism", priority: "first-line" },
        { test: "Urinalysis with specific gravity (± culture)", purpose: "Assess concentrating ability, glucosuria and UTI", priority: "first-line" },
        { test: "Systolic blood pressure", purpose: "Hypertension is common with both CKD and hyperthyroidism", priority: "first-line" },
        { test: "Abdominal ultrasound", purpose: "Evaluate kidneys (PKD) and GI tract if bloodwork is unrevealing", priority: "if indicated" },
      ],
      imageFindings: "Greasy, clumped and matted coat along the dorsum with scale, consistent with reduced self-grooming. No focal alopecia or lesions suggesting primary skin disease. Visible prominence of the spine suggests reduced muscle condition.",
      redFlags: ["About 20% body weight loss in one year", "No veterinary exam in over 2 years", "Possible hypertension: check retinas and blood pressure"],
      clientCommunication: "Milo's weight loss, thirst and change in grooming are signs that something inside his body needs attention. His coat is likely a symptom, not the main problem. Common causes in older cats, such as an overactive thyroid or kidney changes, are very manageable once identified, so we'd like to see him soon for an exam and blood and urine tests.",
      confidence: { level: "moderate", limitations: ["Several conditions may coexist; bloodwork needed to separate them", "Weight is owner-reported"] },
    },
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
    assessment: {
      triage: { level: "routine", rationale: "Localized fold dermatitis without systemic signs. Uncomfortable but can be scheduled." },
      clinicalSummary: "4-year-old spayed female French Bulldog with malodorous, erythematous, moist facial and tail-fold dermatitis. Consistent with intertrigo (skin fold pyoderma), probably with Malassezia overgrowth. Conformation is the main predisposing factor, and underlying atopy should be considered if it recurs.",
      differentials: [
        { condition: "Intertrigo (skin fold pyoderma)", likelihood: "high", supporting: ["Fold-specific distribution", "Odor", "Moisture", "Brachycephalic breed with a screw tail"], against: [] },
        { condition: "Malassezia dermatitis", likelihood: "high", supporting: ["Rancid odor", "Greasy, moist folds"], against: [] },
        { condition: "Underlying atopic dermatitis", likelihood: "moderate", supporting: ["Face rubbing", "Breed predisposition"], against: ["Lesions confined to folds so far"] },
      ],
      recommendedDiagnostics: [
        { test: "Tape or impression cytology of the folds", purpose: "Quantify yeast and bacteria and guide topical therapy", priority: "first-line" },
        { test: "Examine the tail pocket closely", purpose: "Screw-tail pockets can harbor deep infection and may need surgical management", priority: "first-line" },
      ],
      imageFindings: "Erythematous, moist skin in the nasal fold with brown discoloration and waxy debris. No ulceration visible.",
      redFlags: [],
      clientCommunication: "Daisy's skin folds trap moisture, which lets yeast and bacteria overgrow. That causes the smell and redness. It's very common in Frenchies. With medicated wipes and a regular cleaning routine it's usually well controlled, and we'll check whether allergies are also playing a part.",
      confidence: { level: "high", limitations: ["Tail fold not shown in the photo"] },
    },
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
    assessment: {
      triage: { level: "emergency", rationale: "Male cat straining with no urine output for about 12 hours plus vomiting and lethargy: suspected urethral obstruction. Life-threatening. The owner should come in immediately." },
      clinicalSummary: "5-year-old neutered male Maine Coon with stranguria, vocalizing, anuria for about 12 hours, vomiting and lethargy, with a prior episode of hematuria. Highly suspicious for urethral obstruction, with risk of hyperkalemia, acute kidney injury and cardiac arrhythmia.",
      differentials: [
        { condition: "Urethral obstruction (urethral plug, urolith or idiopathic cystitis)", likelihood: "high", supporting: ["Male cat", "Straining with no output", "Vomiting and lethargy suggest metabolic effects", "Prior lower urinary tract episode", "Dry-food diet, indoor only"], against: [] },
        { condition: "Non-obstructive feline idiopathic cystitis", likelihood: "low", supporting: ["Stranguria", "Prior episode"], against: ["No urine produced at all", "Systemic signs"] },
      ],
      recommendedDiagnostics: [
        { test: "Immediate bladder palpation", purpose: "A large, firm, painful bladder confirms obstruction", priority: "first-line" },
        { test: "Electrolytes (especially potassium), venous blood gas, BUN and creatinine", purpose: "Assess hyperkalemia and azotemia before sedation", priority: "first-line" },
        { test: "ECG", purpose: "Check for arrhythmia from hyperkalemia", priority: "first-line" },
        { test: "Urinalysis and sediment (after decompression)", purpose: "Crystals, blood and infection", priority: "first-line" },
        { test: "Abdominal radiographs", purpose: "Look for radiopaque uroliths", priority: "if indicated" },
      ],
      imageFindings: null,
      redFlags: ["Possible complete urethral obstruction: can be fatal within 24–72 hours", "Risk of hyperkalemia and cardiac arrhythmia", "Vomiting and hiding suggest the cat is already metabolically affected"],
      clientCommunication: "Oliver's signs suggest his urethra may be blocked, which is an emergency in male cats. Please bring him in right away, or go to the nearest emergency clinic if we're closed. This is very treatable when handled quickly but can become life-threatening within hours.",
      confidence: { level: "high", limitations: ["No photo or physical exam; bladder size not yet confirmed"] },
    },
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
    assessment: {
      triage: { level: "routine", rationale: "Localized, minimally pruritic alopecia in a well young dog. Can be scheduled, ideally within 1–2 weeks alongside completing vaccinations." },
      clinicalSummary: "11-month-old intact male Beagle recently adopted from a shelter, with patchy periocular and muzzle alopecia and minimal pruritus. Most consistent with juvenile localized demodicosis. Dermatophytosis and sarcoptic mange should be ruled out given the shelter history.",
      differentials: [
        { condition: "Juvenile localized demodicosis", likelihood: "high", supporting: ["Age", "Periocular and facial distribution", "Minimal pruritus", "Recent stress (shelter, rehoming)"], against: [] },
        { condition: "Dermatophytosis", likelihood: "moderate", supporting: ["Shelter origin", "Focal alopecia"], against: [] },
        { condition: "Sarcoptic mange", likelihood: "low", supporting: ["Shelter origin"], against: ["Minimal itch", "Ear margins and elbows not mentioned"] },
      ],
      recommendedDiagnostics: [
        { test: "Deep skin scrapes (squeeze first) or trichogram", purpose: "Confirm Demodex mites", priority: "first-line" },
        { test: "Wood's lamp and dermatophyte PCR or culture", purpose: "Rule out ringworm given shelter origin", priority: "first-line" },
        { test: "Pinnal-pedal reflex and superficial scrape", purpose: "Screen for Sarcoptes", priority: "if indicated" },
      ],
      imageFindings: "Multifocal, patchy, non-inflamed alopecia around both eyes and on the dorsal muzzle, giving a 'spectacle' appearance. Minimal erythema, no crusting or pustules.",
      redFlags: ["Monitor for spread to generalized demodicosis, which needs treatment and a check for underlying disease"],
      clientCommunication: "Charlie's patches look like a common condition in young dogs caused by a skin mite that most dogs carry. Stress, like moving homes, can let it flare. It's not contagious to people or other pets, and localized cases often clear up on their own. We'd like to confirm it with a simple skin test and rule out ringworm since he came from a shelter.",
      confidence: { level: "moderate", limitations: ["Demodex and dermatophytes can look similar; testing is needed"] },
    },
  },
];
