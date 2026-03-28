"use client";

import type { HealthReport } from "@/lib/validation";

interface Props {
  report: HealthReport;
  petName: string;
  onReset: () => void;
}

const CAT_META: Record<string, { icon: string; label: string }> = {
  nutrition:     { icon: "🥗", label: "Nutrition" },
  activity:      { icon: "🏃", label: "Activity" },
  preventiveCare:{ icon: "💉", label: "Preventive" },
  symptoms:      { icon: "🩺", label: "Symptoms" },
  skinCoat:      { icon: "✨", label: "Skin & Coat" },
};

function barColor(s: number) {
  if (s >= 80) return "#22c55e";
  if (s >= 65) return "#14b8a6";
  if (s >= 50) return "#f59e0b";
  if (s >= 35) return "#f97316";
  return "#ef4444";
}

function gradeInfo(s: number) {
  if (s >= 80) return { label: "Excellent health", bg: "rgba(34,197,94,0.12)", color: "#86efac", border: "rgba(34,197,94,0.2)" };
  if (s >= 65) return { label: "Good health",      bg: "rgba(20,184,166,0.12)", color: "#5eead4", border: "rgba(20,184,166,0.2)" };
  if (s >= 50) return { label: "Fair — monitor closely", bg: "rgba(245,158,11,0.12)", color: "#fcd34d", border: "rgba(245,158,11,0.2)" };
  return { label: "Needs attention", bg: "rgba(239,68,68,0.12)", color: "#fca5a5", border: "rgba(239,68,68,0.2)" };
}

export default function HealthReportView({ report, petName, onReset }: Props) {
  const score = report.overallScore;
  const circ  = 2 * Math.PI * 52;
  const offset = circ - (score / 100) * circ;
  const color  = barColor(score);
  const grade  = gradeInfo(score);

  const urgClass = report.urgency === "high" ? { fill: "#ef4444", width: "94%", text: "#fca5a5" }
    : report.urgency === "moderate"          ? { fill: "#f59e0b", width: "58%", text: "#fcd34d" }
    :                                          { fill: "#22c55e", width: "22%", text: "#86efac" };

  return (
    <div className="animate-fade-up" style={{ maxWidth: 800, margin: "0 auto", padding: "2rem 2rem 5rem" }}>

      {/* Score Banner */}
      <div style={{
        background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 20,
        padding: "2.4rem", marginBottom: "1rem",
        display: "grid", gridTemplateColumns: "1fr 130px", gap: "2rem", alignItems: "center",
        position: "relative", overflow: "hidden"
      }}>
        <div style={{
          position: "absolute", top: -60, right: -60, width: 220, height: 220,
          background: "radial-gradient(circle, rgba(245,158,11,0.15) 0%, transparent 65%)",
          pointerEvents: "none"
        }} />
        <div>
          <div style={{ fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text3)", marginBottom: "0.4rem" }}>
            Health report for {petName}
          </div>
          <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.7rem", lineHeight: 1.2, marginBottom: "0.8rem" }}>
            {grade.label}
          </div>
          <div style={{ fontSize: "0.85rem", color: "var(--text2)", lineHeight: 1.7, marginBottom: "0.8rem" }}>
            {report.summary}
          </div>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            padding: "4px 12px", borderRadius: 20, fontSize: "0.72rem", fontWeight: 600,
            background: grade.bg, color: grade.color, border: `1px solid ${grade.border}`
          }}>{grade.label}</span>
        </div>
        <div style={{ position: "relative", width: 120, height: 120, flexShrink: 0 }}>
          <svg width="120" height="120" viewBox="0 0 120 120" style={{ transform: "rotate(-90deg)" }}>
            <circle cx="60" cy="60" r="52" fill="none" stroke="var(--bg4)" strokeWidth="7" />
            <circle cx="60" cy="60" r="52" fill="none" stroke={color} strokeWidth="7"
              strokeLinecap="round" strokeDasharray={circ.toFixed(2)} strokeDashoffset={offset.toFixed(2)} />
          </svg>
          <div style={{
            position: "absolute", top: "50%", left: "50%",
            transform: "translate(-50%,-50%)", textAlign: "center", lineHeight: 1
          }}>
            <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: "2rem", display: "block", color: "var(--text)" }}>
              {score}
            </span>
            <span style={{ fontSize: "0.62rem", color: "var(--text3)", display: "block", marginTop: 3 }}>out of 100</span>
          </div>
        </div>
      </div>

      {/* Category Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 8, marginBottom: "1rem" }}>
        {Object.entries(report.categories).map(([key, val]) => (
          <div key={key} style={{
            background: "var(--bg2)", border: "1px solid var(--border)",
            borderRadius: 14, padding: "1.1rem 0.8rem", textAlign: "center"
          }}>
            <span style={{ fontSize: "1.2rem", display: "block", lineHeight: 1, marginBottom: "0.5rem" }}>{CAT_META[key].icon}</span>
            <div style={{ fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text3)", marginBottom: "0.4rem" }}>
              {CAT_META[key].label}
            </div>
            <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.75rem", lineHeight: 1, marginBottom: "0.5rem", color: "var(--text)" }}>
              {val.score}
            </div>
            <div style={{ height: 3, background: "var(--bg4)", borderRadius: 3, overflow: "hidden", marginBottom: "0.5rem" }}>
              <div style={{ height: "100%", width: `${val.score}%`, borderRadius: 3, background: barColor(val.score) }} />
            </div>
            <div style={{ fontSize: "0.65rem", color: "var(--text3)", lineHeight: 1.45 }}>{val.detail}</div>
          </div>
        ))}
      </div>

      {/* Urgency */}
      <Panel icon="🚦" iconBg="var(--red-dim)" title="Urgency Level">
        <p style={{ fontSize: "0.86rem", color: "var(--text2)", lineHeight: 1.75, marginBottom: "1rem" }}>{report.urgencyNote}</p>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text3)", minWidth: 56 }}>Urgency</span>
          <div style={{ flex: 1, height: 5, background: "var(--bg4)", borderRadius: 5, overflow: "hidden" }}>
            <div style={{ height: "100%", width: urgClass.width, borderRadius: 5, background: urgClass.fill }} />
          </div>
          <span style={{ fontSize: "0.72rem", fontWeight: 600, color: urgClass.text, textTransform: "capitalize" }}>{report.urgency}</span>
        </div>
      </Panel>

      {/* Breed Risks */}
      <Panel icon="🧬" iconBg="var(--amber-dim)" title="Breed-Specific Risks">
        <p style={{ fontSize: "0.86rem", color: "var(--text2)", lineHeight: 1.75 }}>{report.breedRisks}</p>
      </Panel>

      {/* Skin & Coat */}
      <Panel icon="✨" iconBg="var(--teal-dim)" title="Skin & Coat Analysis">
        <p style={{ fontSize: "0.86rem", color: "var(--text2)", lineHeight: 1.75 }}>{report.skinCoatFindings}</p>
      </Panel>

      {/* Risk Flags */}
      <Panel icon="⚠️" iconBg="var(--red-dim)" title="Risk Flags">
        {report.riskFlags.length > 0
          ? report.riskFlags.map((f, i) => <AlertRow key={i} type="warn" text={f} />)
          : <AlertRow type="ok" text="No significant risk flags identified." />}
      </Panel>

      {/* Recommendations */}
      <Panel icon="💡" iconBg="var(--green-dim)" title="Recommendations">
        <ul style={{ paddingLeft: "1.1rem" }}>
          {report.recommendations.map((r, i) => (
            <li key={i} style={{ fontSize: "0.86rem", color: "var(--text2)", lineHeight: 1.75, marginBottom: 4 }}>{r}</li>
          ))}
        </ul>
      </Panel>

      <button
        onClick={onReset}
        style={{
          width: "100%", background: "transparent", color: "var(--text3)",
          border: "1px solid var(--border2)", borderRadius: "var(--r)", padding: 13,
          fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", fontWeight: 500,
          cursor: "pointer", marginTop: "0.4rem", transition: "all 0.2s"
        }}
      >
        ↩ Analyze another pet
      </button>
    </div>
  );
}

function Panel({ icon, iconBg, title, children }: {
  icon: string; iconBg: string; title: string; children: React.ReactNode;
}) {
  return (
    <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "var(--r)", overflow: "hidden", marginBottom: "0.8rem" }}>
      <div style={{ padding: "1rem 1.4rem", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 9 }}>
        <div style={{ width: 28, height: 28, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.85rem", background: iconBg, flexShrink: 0 }}>{icon}</div>
        <span style={{ fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text2)" }}>{title}</span>
      </div>
      <div style={{ padding: "1.2rem 1.4rem" }}>{children}</div>
    </div>
  );
}

function AlertRow({ type, text }: { type: "warn" | "ok" | "danger"; text: string }) {
  const styles = {
    warn:   { bg: "rgba(245,158,11,0.08)",  border: "rgba(245,158,11,0.18)",  color: "#fcd34d", icon: "⚠️" },
    ok:     { bg: "var(--green-dim)",        border: "rgba(34,197,94,0.18)",   color: "#86efac", icon: "✅" },
    danger: { bg: "var(--red-dim)",          border: "rgba(239,68,68,0.18)",   color: "#fca5a5", icon: "🚨" },
  }[type];
  return (
    <div style={{
      display: "flex", alignItems: "flex-start", gap: 9, padding: "9px 13px",
      borderRadius: 8, fontSize: "0.81rem", lineHeight: 1.6, marginBottom: 7,
      background: styles.bg, border: `1px solid ${styles.border}`, color: styles.color
    }}>
      <span style={{ flexShrink: 0, marginTop: 1 }}>{styles.icon}</span>
      {text}
    </div>
  );
}
