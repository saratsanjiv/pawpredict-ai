import { sql } from "@/lib/db";
import { VetAssessmentSchema, type AssessmentStatus, type CaseIntake, type VetAssessment, type VetCase } from "./schema";

interface CaseRow {
  id: string;
  minutes_ago: number;
  status: "new" | "reviewed";
  pet_name: string;
  species: "dog" | "cat";
  breed: string;
  age: string;
  sex: string;
  weight: string;
  owner_name: string;
  chief_complaint: string;
  symptoms: string[];
  owner_notes: string;
  history: CaseIntake["history"];
  photo_region: string | null;
  photo_pathname: string | null;
  photo_credit: string | null;
  assessment: unknown;
  assessment_status: AssessmentStatus;
  assessment_error: string | null;
  assessment_model: string | null;
  assessed_at: string | Date | null;
}

// A background assessment that never finished (e.g. the function was killed) can't record its own
// failure, so anything still pending after 5 minutes is reported as failed. maxDuration is 120s.
const SELECT_CASE = `
  select id, status, pet_name, species, breed, age, sex, weight, owner_name, chief_complaint,
         symptoms, owner_notes, history, photo_region, photo_pathname, photo_credit,
         assessment, assessment_error, assessment_model, assessed_at,
         floor(extract(epoch from (now() - created_at)) / 60)::int as minutes_ago,
         case when assessment_status = 'pending' and created_at < now() - interval '5 minutes'
              then 'failed' else assessment_status end as assessment_status
  from cases`;

function rowToCase(row: CaseRow): VetCase {
  const parsed = row.assessment == null ? null : VetAssessmentSchema.safeParse(row.assessment);
  const assessment = parsed?.success ? parsed.data : null;
  return {
    id: row.id,
    minutesAgo: Math.max(0, row.minutes_ago),
    status: row.status,
    patient: { name: row.pet_name, species: row.species, breed: row.breed, age: row.age, sex: row.sex, weight: row.weight },
    ownerName: row.owner_name,
    chiefComplaint: row.chief_complaint,
    symptoms: row.symptoms,
    ownerNotes: row.owner_notes,
    history: row.history,
    photo: row.photo_pathname ? { region: row.photo_region ?? "Not specified", credit: row.photo_credit } : null,
    assessment,
    // A stored assessment that no longer matches the schema is treated as missing so it can be re-run.
    assessmentStatus: parsed && !parsed.success ? "failed" : row.assessment_status,
    assessmentError: row.assessment_error,
    assessmentModel: row.assessment_model,
    assessedAt: row.assessed_at ? new Date(row.assessed_at).toISOString() : null,
  };
}

export async function getSortedCases(): Promise<VetCase[]> {
  const rows = (await sql().query(`${SELECT_CASE}
    order by (assessment is null) desc,
             (status = 'reviewed') asc,
             case assessment->'triage'->>'level' when 'emergency' then 0 when 'urgent' then 1 else 2 end,
             created_at desc`)) as CaseRow[];
  return rows.map(rowToCase);
}

export async function getCase(id: string): Promise<VetCase | undefined> {
  const rows = (await sql().query(`${SELECT_CASE} where id = $1`, [id])) as CaseRow[];
  return rows[0] ? rowToCase(rows[0]) : undefined;
}

export async function getCasePhotoPathname(id: string): Promise<string | null> {
  const rows = await sql()`select photo_pathname from cases where id = ${id}`;
  return (rows[0]?.photo_pathname as string | null | undefined) ?? null;
}

// Reserved before the photo upload because the Blob path includes the case ID.
export async function reserveCaseId(): Promise<string> {
  const rows = await sql()`select 'pp-' || nextval('case_number_seq') as id`;
  return rows[0].id as string;
}

export async function insertCase(id: string, intake: CaseIntake, photoPathname: string | null) {
  const p = intake.patient;
  await sql()`
    insert into cases (id, pet_name, species, breed, age, sex, weight, owner_name, chief_complaint,
                       symptoms, owner_notes, history, photo_region, photo_pathname)
    values (${id}, ${p.name}, ${p.species}, ${p.breed}, ${p.age}, ${p.sex}, ${p.weight}, ${intake.ownerName},
            ${intake.chiefComplaint}, ${intake.symptoms}, ${intake.ownerNotes}, ${JSON.stringify(intake.history)},
            ${intake.photo?.region ?? null}, ${photoPathname})`;
}

// Only fills in a missing assessment, so re-runs never overwrite a stored one. Returns whether it saved.
export async function saveAssessmentIfMissing(id: string, assessment: VetAssessment, model: string): Promise<boolean> {
  const rows = await sql()`
    update cases
    set assessment = ${JSON.stringify(assessment)}, assessment_status = 'done', assessment_error = null,
        assessment_model = ${model}, assessed_at = now()
    where id = ${id} and assessment is null
    returning id`;
  return rows.length > 0;
}

export async function updateCaseStatus(id: string, status: "new" | "reviewed"): Promise<void> {
  await sql()`update cases set status = ${status} where id = ${id}`;
}

export async function markAssessmentFailed(id: string, error: string) {
  await sql()`
    update cases set assessment_status = 'failed', assessment_error = ${error.slice(0, 500)}
    where id = ${id} and assessment is null`;
}
