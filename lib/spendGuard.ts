import { sql } from "@/lib/db";

// The site is public with no auth, so these are the only backstop against runaway Anthropic API
// cost. Change the numbers here; the windows (24h / hourly) are fixed by what they mean.
export const DAILY_ASSESSMENT_LIMIT = 50; // max AI assessments (owner submissions + vet re-runs) per rolling 24h
export const SUBMISSION_LIMIT_PER_HOUR = 5; // max owner form submissions per IP per rolling hour

export class SpendLimitError extends Error {}

// Throws SpendLimitError if the daily assessment budget is used up; otherwise records this attempt
// and returns. Call once per AI assessment attempt (success or failure both cost money).
export async function consumeAssessmentBudget(): Promise<void> {
  const [{ count }] = await sql()`
    select count(*)::int as count from spend_events
    where kind = 'assessment_run' and created_at > now() - interval '24 hours'`;
  if (count >= DAILY_ASSESSMENT_LIMIT) {
    throw new SpendLimitError(`Daily AI assessment limit reached (${DAILY_ASSESSMENT_LIMIT} per 24h). Try again tomorrow.`);
  }
  await sql()`insert into spend_events (kind) values ('assessment_run')`;
}

// Returns false (and records nothing) once this IP has hit its hourly submission limit. Fails open
// (allows the submission) on a database error, so a Neon hiccup doesn't take down the owner flow —
// the same trade-off saveSubmission already makes elsewhere in the analyze route.
export async function checkSubmissionLimit(ip: string): Promise<boolean> {
  try {
    const [{ count }] = await sql()`
      select count(*)::int as count from spend_events
      where kind = 'submission' and ip = ${ip} and created_at > now() - interval '1 hour'`;
    if (count >= SUBMISSION_LIMIT_PER_HOUR) return false;
    await sql()`insert into spend_events (kind, ip) values ('submission', ${ip})`;
    return true;
  } catch (err) {
    console.error("[PawPredict] submission limit check failed; allowing the request", err);
    return true;
  }
}
