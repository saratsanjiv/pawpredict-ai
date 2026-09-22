import Link from "next/link";
import type { VetCase } from "@/lib/vet/schema";
import { formatAgo } from "@/lib/vet/cases";
import TriageBadge from "./TriageBadge";

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
        <TriageBadge level={c.assessment.triage.level} large />
      </div>

      <div style={{ fontSize: "0.9rem", color: "var(--text2)", marginBottom: "0.3rem" }}>
        {patient.breed} · {patient.age} · {patient.sex} · {patient.weight}
      </div>
      <div style={{ fontSize: "0.76rem", color: "var(--text3)" }}>
        {c.id.toUpperCase()} · Owner: {c.ownerName} · Submitted {formatAgo(c.minutesAgo)} · {c.status === "new" ? "New" : "Reviewed"}
      </div>
    </div>
  );
}
