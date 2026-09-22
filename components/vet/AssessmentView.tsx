import type { VetAssessment } from "@/lib/vet/schema";
import { Panel, AlertRow } from "@/components/Panel";
import TriageBadge, { TRIAGE_STYLES } from "./TriageBadge";

const LIKELIHOOD_STYLES = {
  high:     { bg: "rgba(245,158,11,0.12)", color: "#fcd34d" },
  moderate: { bg: "rgba(20,184,166,0.1)",  color: "#5eead4" },
  low:      { bg: "var(--bg4)",            color: "var(--text2)" },
};

const body = { fontSize: "0.86rem", color: "var(--text2)", lineHeight: 1.75 } as const;
const label = { fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text3)" } as const;

function Pill({ text, bg, color, width }: { text: string; bg: string; color: string; width?: number }) {
  return (
    <span style={{
      fontSize: "0.68rem", fontWeight: 600, padding: "2px 9px", borderRadius: 20, background: bg, color, whiteSpace: "nowrap",
      ...(width && { width, flexShrink: 0, textAlign: "center" })
    }}>
      {text}
    </span>
  );
}

export default function AssessmentView({ a, hasPhoto }: { a: VetAssessment; hasPhoto: boolean }) {
  const triage = TRIAGE_STYLES[a.triage.level];

  return (
    <div>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: "0.8rem" }}>
        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.35rem", fontWeight: 400 }}>AI assessment</h2>
        <span style={{ fontSize: "0.72rem", color: "var(--text3)" }}>Decision support only. Confirm with a clinical exam.</span>
      </div>

      <div style={{
        background: triage.bg, border: `1px solid ${triage.border}`, borderRadius: "var(--r)",
        padding: "1.1rem 1.4rem", marginBottom: "0.8rem"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "0.5rem" }}>
          <span style={label}>Suggested triage</span>
          <TriageBadge level={a.triage.level} />
        </div>
        <p style={{ fontSize: "0.9rem", color: "var(--text)", lineHeight: 1.65 }}>{a.triage.rationale}</p>
      </div>

      {a.redFlags.length > 0 && (
        <Panel icon="🚨" iconBg="var(--red-dim)" title="Red flags">
          {a.redFlags.map((f, i) => <AlertRow key={i} type="danger" text={f} />)}
        </Panel>
      )}

      <Panel icon="📋" iconBg="var(--bg4)" title="Clinical summary">
        <p style={body}>{a.clinicalSummary}</p>
      </Panel>

      <Panel icon="🧠" iconBg="var(--amber-dim)" title="Differential diagnoses">
        {a.differentials.map((d, i) => {
          const s = LIKELIHOOD_STYLES[d.likelihood];
          return (
            <div key={i} style={{
              paddingBottom: "0.9rem", marginBottom: "0.9rem",
              borderBottom: i < a.differentials.length - 1 ? "1px solid var(--border)" : "none"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: "0.5rem" }}>
                <span style={{ fontSize: "0.72rem", color: "var(--text3)", minWidth: 16 }}>{i + 1}.</span>
                <span style={{ fontSize: "0.92rem", fontWeight: 600, color: "var(--text)" }}>{d.condition}</span>
                <Pill text={`${d.likelihood} likelihood`} bg={s.bg} color={s.color} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, paddingLeft: 26 }}>
                <EvidenceList title="Supporting" items={d.supporting} marker="+" color="#86efac" />
                {d.against.length > 0 && <EvidenceList title="Against" items={d.against} marker="−" color="#fca5a5" />}
              </div>
            </div>
          );
        })}
      </Panel>

      <Panel icon="🔬" iconBg="var(--teal-dim)" title="Recommended diagnostics">
        {a.recommendedDiagnostics.map((t, i) => (
          <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: i < a.recommendedDiagnostics.length - 1 ? "0.8rem" : 0 }}>
            <Pill
              text={t.priority === "first-line" ? "First-line" : "If indicated"}
              bg={t.priority === "first-line" ? "var(--teal-dim)" : "var(--bg4)"}
              color={t.priority === "first-line" ? "#5eead4" : "var(--text2)"}
              width={88}
            />
            <div>
              <div style={{ fontSize: "0.87rem", fontWeight: 600, color: "var(--text)" }}>{t.test}</div>
              <div style={{ fontSize: "0.8rem", color: "var(--text2)", lineHeight: 1.6 }}>{t.purpose}</div>
            </div>
          </div>
        ))}
      </Panel>

      <Panel icon="📷" iconBg="var(--bg4)" title="Photo findings">
        <p style={body}>{a.imageFindings ?? (hasPhoto ? "No findings reported for the photo." : "No photo was submitted with this case.")}</p>
      </Panel>

      <Panel icon="💬" iconBg="var(--green-dim)" title="Draft message to owner">
        <p style={{ ...body, borderLeft: "2px solid var(--border3)", paddingLeft: "1rem", fontStyle: "italic" }}>
          {a.clientCommunication}
        </p>
      </Panel>

      <Panel icon="⚖️" iconBg="var(--bg4)" title="Confidence & limitations">
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "0.6rem" }}>
          <span style={label}>Confidence</span>
          <Pill text={a.confidence.level} {...LIKELIHOOD_STYLES[a.confidence.level]} />
        </div>
        <ul style={{ paddingLeft: "1.1rem" }}>
          {a.confidence.limitations.map((l, i) => (
            <li key={i} style={{ ...body, fontSize: "0.82rem" }}>{l}</li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}

function EvidenceList({ title, items, marker, color }: { title: string; items: string[]; marker: string; color: string }) {
  return (
    <div>
      <div style={{ ...label, marginBottom: "0.3rem" }}>{title}</div>
      {items.map((item, i) => (
        <div key={i} style={{ display: "flex", gap: 7, fontSize: "0.8rem", color: "var(--text2)", lineHeight: 1.6 }}>
          <span style={{ color, fontWeight: 600, flexShrink: 0 }}>{marker}</span>
          {item}
        </div>
      ))}
    </div>
  );
}
