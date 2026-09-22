import CaseTable from "@/components/vet/CaseTable";
import { TRIAGE_STYLES } from "@/components/vet/TriageBadge";
import { getSortedCases } from "@/lib/vet/cases";

export default function VetDashboard() {
  const cases = getSortedCases();
  const count = (level: "emergency" | "urgent" | "routine") =>
    cases.filter((c) => c.assessment.triage.level === level).length;

  const newCount = cases.filter((c) => c.status === "new").length;

  const stats: { label: string; value: number; color: string; sub?: string }[] = [
    { label: "Cases in queue", value: cases.length, color: "var(--text)", sub: `${newCount} new · ${cases.length - newCount} reviewed` },
    { label: "Emergency", value: count("emergency"), color: TRIAGE_STYLES.emergency.color },
    { label: "Urgent", value: count("urgent"), color: TRIAGE_STYLES.urgent.color },
    { label: "Routine", value: count("routine"), color: TRIAGE_STYLES.routine.color },
  ];

  return (
    <>
      <div style={{ marginBottom: "1.6rem" }}>
        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "2rem", fontWeight: 400, marginBottom: "0.3rem" }}>
          Case queue
        </h1>
        <p style={{ fontSize: "0.88rem", color: "var(--text2)" }}>
          Owner-submitted cases, pre-triaged by AI and sorted by urgency.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10, marginBottom: "1.6rem" }}>
        {stats.map((s) => (
          <div key={s.label} style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 14, padding: "1rem 1.2rem" }}>
            <div style={{ fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text3)", marginBottom: "0.4rem" }}>
              {s.label}
            </div>
            <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "2rem", lineHeight: 1, color: s.color }}>{s.value}</div>
            {s.sub && <div style={{ fontSize: "0.72rem", color: "var(--amber2)", marginTop: "0.4rem" }}>{s.sub}</div>}
          </div>
        ))}
      </div>

      <CaseTable cases={cases} />
    </>
  );
}
