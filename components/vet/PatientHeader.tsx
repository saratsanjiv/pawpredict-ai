import Link from "next/link";
import type { VetCase } from "@/lib/vet/schema";
import { formatAgo } from "@/lib/vet/format";
import TriageBadge, { ReviewedBadge, UnassessedBadge } from "./TriageBadge";
import ReviewToggle from "./ReviewToggle";

export default function PatientHeader({ c }: { c: VetCase }) {
  const { patient } = c;
  return (
    <div style={{ marginBottom: "1.4rem" }}>
      <Link href="/vet" style={{ fontSize: "0.8rem", color: "var(--text3)", textDecoration: "none" }}>
        ← Case queue
      </Link>

      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 14, margin: "0.9rem 0 0.4rem" }}>
        <span style={{ fontSize: "1.6rem" }}>{patient.species === "dog" ? "🐶" : "🐱"}</span>
        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "2rem", fontWeight: 400, lineHeight: 1.1 }}>
          {patient.name}
        </h1>
        {c.assessment
          ? <TriageBadge level={c.assessment.triage.level} large />
          : <UnassessedBadge failed={c.assessmentStatus === "failed"} large />}
        {c.status === "reviewed" && <ReviewedBadge large />}
      </div>

      <div style={{ fontSize: "0.9rem", color: "var(--text2)", marginBottom: "0.3rem" }}>
        {patient.breed} · {patient.age} · {patient.sex} · {patient.weight}
      </div>
      <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
        <span style={{ fontSize: "0.76rem", color: "var(--text3)" }}>
          {c.id.toUpperCase()} · Owner: {c.ownerName} · Submitted {formatAgo(c.minutesAgo)}
        </span>
        <ReviewToggle caseId={c.id} status={c.status} disabled={!c.assessment} />
      </div>
    </div>
  );
}
