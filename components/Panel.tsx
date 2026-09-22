export function Panel({ icon, iconBg, title, children }: {
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

export function AlertRow({ type, text }: { type: "warn" | "ok" | "danger"; text: string }) {
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
