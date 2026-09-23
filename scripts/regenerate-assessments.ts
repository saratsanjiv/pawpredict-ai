// Regenerates the sample assessments in scripts/seed/assessments.json with the live model.
// Run `npm run db:setup` afterwards to push them to the database.
// Usage: npm run regen:assessments            (all cases)
//        npm run regen:assessments -- pp-1003 (specific cases)
import fs from "fs";
import path from "path";
import { MODEL } from "@/lib/anthropic";
import { assessCase } from "@/lib/vet/assess";
import { SAMPLE_CASES } from "./seed/sample-cases";

// USD per million tokens for claude-sonnet-5; check current pricing before relying on the estimate.
const PRICE_PER_MTOK = { input: 2, output: 10 };

const SEED_DIR = path.join(process.cwd(), "scripts", "seed");
const FILE = path.join(SEED_DIR, "assessments.json");

async function main() {
  const requested = process.argv.slice(2);
  const unknown = requested.filter((id) => !SAMPLE_CASES.some((c) => c.id === id));
  if (unknown.length) throw new Error(`Unknown case id(s): ${unknown.join(", ")}`);
  const targets = requested.length ? SAMPLE_CASES.filter((c) => requested.includes(c.id)) : SAMPLE_CASES;

  const stored = JSON.parse(fs.readFileSync(FILE, "utf8"));
  const totals = { input: 0, output: 0 };
  const failures: string[] = [];
  const started = Date.now();

  console.log(`Regenerating ${targets.length} assessment(s) with ${MODEL}...\n`);

  for (const c of targets) {
    const t0 = Date.now();
    try {
      const photo = c.photo ? fs.readFileSync(path.join(SEED_DIR, "photos", `${c.id}.jpg`)) : null;
      const { assessment, usage } = await assessCase(c, photo);
      stored.assessments[c.id] = assessment;
      totals.input += usage.input_tokens;
      totals.output += usage.output_tokens;
      console.log(
        `  ${c.id} ${c.patient.name.padEnd(8)} ${assessment.triage.level.padEnd(9)} ` +
          `${((Date.now() - t0) / 1000).toFixed(1)}s  in ${usage.input_tokens}  out ${usage.output_tokens}`
      );
    } catch (err) {
      failures.push(c.id);
      console.error(`  ${c.id} FAILED: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  const cost = (totals.input * PRICE_PER_MTOK.input + totals.output * PRICE_PER_MTOK.output) / 1_000_000;
  console.log(
    `\nTokens: ${totals.input} in, ${totals.output} out · est. cost $${cost.toFixed(3)} · ` +
      `${((Date.now() - started) / 1000).toFixed(0)}s total`
  );

  if (failures.length) {
    console.error(`\n${failures.length} case(s) failed (${failures.join(", ")}); nothing was written. Re-run to retry.`);
    process.exit(1);
  }

  stored.model = MODEL;
  stored.generatedAt = new Date().toISOString();
  fs.writeFileSync(FILE, JSON.stringify(stored, null, 2) + "\n");
  console.log(`Saved to ${path.relative(process.cwd(), FILE)}. Run \`npm run db:setup\` to push to the database.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
