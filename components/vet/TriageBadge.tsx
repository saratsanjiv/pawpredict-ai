import type { TriageLevel } from "@/lib/vet/schema";

export const TRIAGE_STYLES: Record<TriageLevel, { label: string; color: string; bg: string; border: string; dot: string }> = {
  emergency: { label: "Emergency", color: "#fca5a5", bg: "rgba(239,68,68,0.12)", border: "rgba(239,68,68,0.35)", dot: "var(--red)" },
  urgent:    { label: "Urgent",    color: "#fdba74", bg: "rgba(249,115,22,0.12)", border: "rgba(249,115,22,0.3)", dot: "var(--orange)" },
  routine:   { label: "Routine",   color: "#5eead4", bg: "rgba(20,184,166,0.1)",  border: "rgba(20,184,166,0.25)", dot: "var(--teal)" },
};

// Shown in place of a triage level when a case has no assessment yet.
export function UnassessedBadge({ failed, large = false }: { failed: boolean; large?: boolean }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6, whiteSpace: "nowrap",
      padding: large ? "6px 14px" : "3px 10px", borderRadius: 20,
      fontSize: large ? "0.8rem" : "0.7rem", fontWeight: 600, letterSpacing: "0.03em",
      background: failed ? "rgba(239,68,68,0.06)" : "var(--bg4)",
      color: failed ? "#fca5a5" : "var(--text2)",
      border: failed ? "1px dashed rgba(239,68,68,0.45)" : "1px dashed var(--border3)"
    }}>
      {failed ? "Assessment failed" : "Assessing…"}
    </span>
  );
}

export default function TriageBadge({ level, large = false }: { level: TriageLevel; large?: boolean }) {
  const s = TRIAGE_STYLES[level];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6, whiteSpace: "nowrap",
      padding: large ? "6px 14px" : "3px 10px", borderRadius: 20,
      fontSize: large ? "0.8rem" : "0.7rem", fontWeight: 600, letterSpacing: "0.03em",
      background: s.bg, color: s.color, border: `1px solid ${s.border}`
    }}>
      <span style={{ width: 7, height: 7, borderRadius: "50%", background: s.dot }} />
      {s.label}
    </span>
  );
}
