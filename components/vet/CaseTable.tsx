"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { TriageLevel, VetCase } from "@/lib/vet/schema";
import { casePhotoPath, formatAgo } from "@/lib/vet/format";
import TriageBadge, { ReviewedBadge, UnassessedBadge } from "./TriageBadge";

const COLUMNS = "130px minmax(230px, 1.2fr) minmax(240px, 2fr) 100px 96px";

type TriageFilter = "all" | TriageLevel;
type SpeciesFilter = "all" | "dog" | "cat";

export default function CaseTable({ cases }: { cases: VetCase[] }) {
  const [triage, setTriage] = useState<TriageFilter>("all");
  const [species, setSpecies] = useState<SpeciesFilter>("all");

  const visible = cases.filter(
    (c) =>
      (triage === "all" || c.assessment?.triage.level === triage) &&
      (species === "all" || c.patient.species === species)
  );

  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center", marginBottom: "0.9rem" }}>
        <FilterGroup
          value={triage}
          onChange={setTriage}
          options={[["all", "All"], ["emergency", "Emergency"], ["urgent", "Urgent"], ["routine", "Routine"]]}
        />
        <FilterGroup
          value={species}
          onChange={setSpecies}
          options={[["all", "All species"], ["dog", "🐶 Dogs"], ["cat", "🐱 Cats"]]}
        />
        <span style={{ fontSize: "0.75rem", color: "var(--text3)", marginLeft: "auto" }}>
          {visible.length} of {cases.length} cases
        </span>
      </div>

      <div style={{ overflowX: "auto", background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "var(--r)" }}>
        <div style={{ minWidth: 820 }}>
          <div style={{
            display: "grid", gridTemplateColumns: COLUMNS, gap: 16, padding: "0.8rem 1.2rem",
            borderBottom: "1px solid var(--border)", fontSize: "0.65rem", fontWeight: 600,
            letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text3)"
          }}>
            <span>Triage</span><span>Patient</span><span>Chief complaint</span><span>Submitted</span><span>Status</span>
          </div>

          {visible.length === 0 && (
            <div style={{ padding: "2rem", textAlign: "center", fontSize: "0.85rem", color: "var(--text3)" }}>
              No cases match these filters.
            </div>
          )}

          {visible.map((c) => (
            <Link
              key={c.id}
              href={`/vet/case/${c.id}`}
              className="vet-row"
              style={{
                display: "grid", gridTemplateColumns: COLUMNS, gap: 16, alignItems: "center",
                padding: "0.85rem 1.2rem", borderBottom: "1px solid var(--border)",
                textDecoration: "none", color: "inherit"
              }}
            >
              <span>
                {c.assessment
                  ? <TriageBadge level={c.assessment.triage.level} />
                  : <UnassessedBadge failed={c.assessmentStatus === "failed"} />}
              </span>

              <span style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
                {c.photo ? (
                  // unoptimized: the optimizer would keep its own cached copy of a private photo
                  <Image
                    src={casePhotoPath(c.id)} alt={`${c.patient.name}: ${c.photo.region}`}
                    width={44} height={44} unoptimized
                    style={{ borderRadius: 10, objectFit: "cover", flexShrink: 0, border: "1px solid var(--border2)" }}
                  />
                ) : (
                  <span style={{
                    width: 44, height: 44, borderRadius: 10, flexShrink: 0, background: "var(--bg4)",
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem"
                  }}>{c.patient.species === "dog" ? "🐶" : "🐱"}</span>
                )}
                <span style={{ minWidth: 0 }}>
                  <span style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, color: "var(--text)" }}>{c.patient.name}</span>
                  <span style={{ display: "block", fontSize: "0.74rem", color: "var(--text2)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {c.patient.breed} · {c.patient.age}
                  </span>
                </span>
              </span>

              <span style={{ minWidth: 0 }}>
                <span style={{ display: "block", fontSize: "0.84rem", color: "var(--text)" }}>{c.chiefComplaint}</span>
                <span style={{ display: "block", fontSize: "0.72rem", color: "var(--text3)" }}>{c.id.toUpperCase()} · Owner: {c.ownerName}</span>
              </span>

              <span style={{ fontSize: "0.78rem", color: "var(--text2)" }}>{formatAgo(c.minutesAgo)}</span>

              <span>
                {c.status === "reviewed" ? <ReviewedBadge /> : (
                  <span style={{
                    fontSize: "0.7rem", fontWeight: 600, padding: "3px 9px", borderRadius: 20,
                    background: "var(--amber-dim)", color: "var(--amber2)"
                  }}>New</span>
                )}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function FilterGroup<T extends string>({ value, onChange, options }: {
  value: T; onChange: (v: T) => void; options: [T, string][];
}) {
  return (
    <div style={{ display: "inline-flex", background: "var(--bg3)", border: "1px solid var(--border2)", borderRadius: 12, padding: 3, gap: 3 }}>
      {options.map(([v, label]) => (
        <button
          key={v}
          onClick={() => onChange(v)}
          style={{
            padding: "6px 14px", borderRadius: 9, fontSize: "0.78rem", fontWeight: 500, cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif",
            color: value === v ? "var(--text)" : "var(--text3)",
            background: value === v ? "var(--bg5)" : "transparent",
            border: value === v ? "1px solid var(--border2)" : "1px solid transparent",
          }}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
