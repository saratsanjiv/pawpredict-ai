// Creates the schema (if needed), uploads the sample photos to private Blob and upserts the 8 sample cases.
// Usage: npm run db:setup              safe to re-run; resets sample cases' "submitted X ago" times
//        npm run db:setup -- --reset   first deletes every non-sample case and its Blob photo
import fs from "fs";
import path from "path";
import { neon } from "@neondatabase/serverless";
import { del, list } from "@vercel/blob";
import { SCHEMA_STATEMENTS } from "@/lib/db";
import { casePhotoBlobPath, uploadCasePhoto } from "@/lib/vet/photos";
import { VetAssessmentSchema } from "@/lib/vet/schema";
import { SAMPLE_CASES } from "./seed/sample-cases";
import stored from "./seed/assessments.json";

const url = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL_UNPOOLED / DATABASE_URL is not set");
const sql = neon(url);

const SAMPLE_IDS = SAMPLE_CASES.map((c) => c.id);

async function resetSubmissions() {
  const deleted = await sql`delete from cases where not (id = any(${SAMPLE_IDS})) returning id`;

  // Lists the store rather than trusting the table, so photos orphaned by a failed submission go too.
  const keep = new Set(SAMPLE_CASES.filter((c) => c.photo).map((c) => casePhotoBlobPath(c.id)));
  const stale: string[] = [];
  let cursor: string | undefined;
  do {
    const page = await list({ prefix: "cases/", cursor });
    for (const blob of page.blobs) if (!keep.has(blob.pathname)) stale.push(blob.pathname);
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
  if (stale.length) await del(stale);

  await sql`alter sequence case_number_seq restart with 1009`;
  console.log(`Reset: deleted ${deleted.length} submitted case(s) and ${stale.length} Blob photo(s); next case is pp-1009`);
}

async function seedSamples(forceUnreviewed: boolean) {
  const assessments = stored.assessments as Record<string, unknown>;

  for (const c of SAMPLE_CASES) {
    const assessment = VetAssessmentSchema.parse(assessments[c.id]);
    const status = forceUnreviewed ? "new" : c.status;

    let photoPathname: string | null = null;
    if (c.photo) {
      const file = fs.readFileSync(path.join(process.cwd(), "scripts", "seed", "photos", `${c.id}.jpg`));
      photoPathname = await uploadCasePhoto(c.id, file, { allowOverwrite: true });
    }

    const p = c.patient;
    await sql`
      insert into cases (id, created_at, status, pet_name, species, breed, age, sex, weight, owner_name,
                         chief_complaint, symptoms, owner_notes, history, photo_region, photo_pathname,
                         photo_credit, assessment, assessment_status, assessment_error, assessment_model, assessed_at)
      values (${c.id}, now() - make_interval(mins => ${c.minutesAgo}), ${status}, ${p.name}, ${p.species},
              ${p.breed}, ${p.age}, ${p.sex}, ${p.weight}, ${c.ownerName}, ${c.chiefComplaint}, ${c.symptoms},
              ${c.ownerNotes}, ${JSON.stringify(c.history)}, ${c.photo?.region ?? null}, ${photoPathname},
              ${c.photoCredit ?? null}, ${JSON.stringify(assessment)}, 'done', null, ${stored.model},
              ${stored.generatedAt})
      on conflict (id) do update set
        created_at = excluded.created_at, status = excluded.status, pet_name = excluded.pet_name,
        species = excluded.species, breed = excluded.breed, age = excluded.age, sex = excluded.sex,
        weight = excluded.weight, owner_name = excluded.owner_name, chief_complaint = excluded.chief_complaint,
        symptoms = excluded.symptoms, owner_notes = excluded.owner_notes, history = excluded.history,
        photo_region = excluded.photo_region, photo_pathname = excluded.photo_pathname,
        photo_credit = excluded.photo_credit, assessment = excluded.assessment,
        assessment_status = excluded.assessment_status, assessment_error = excluded.assessment_error,
        assessment_model = excluded.assessment_model, assessed_at = excluded.assessed_at`;
    console.log(`  ${c.id} ${p.name.padEnd(8)} ${photoPathname ? "with photo" : "no photo"}`);
  }
}

async function main() {
  for (const statement of SCHEMA_STATEMENTS) await sql.query(statement);
  console.log("Schema ready");

  const reset = process.argv.includes("--reset");
  if (reset) await resetSubmissions();

  console.log(`Seeding ${SAMPLE_CASES.length} sample cases${reset ? " (all unreviewed)" : ""}...`);
  await seedSamples(reset);

  const [{ count }] = await sql`select count(*)::int as count from cases`;
  console.log(`Done. ${count} case(s) in the database.`);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
