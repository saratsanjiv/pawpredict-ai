import Link from "next/link";

export const metadata = {
  title: "PawPredict AI — Vet Dashboard",
};

export default function VetLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ position: "relative", zIndex: 1, minHeight: "100vh" }}>
      <nav style={{
        position: "sticky", top: 0, zIndex: 200,
        background: "rgba(9,9,11,0.85)", backdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--border)", padding: "0 1.5rem",
        height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12
      }}>
        <Link href="/vet" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{
            width: 34, height: 34, background: "var(--teal-dim)",
            border: "1px solid rgba(20,184,166,0.3)", borderRadius: 10,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem"
          }}>🩺</div>
          <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.3rem", color: "var(--text)" }}>
            Paw<span style={{ color: "var(--amber)" }}>Predict</span> <span style={{ color: "var(--teal)" }}>Vet</span>
          </span>
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: "0.8rem", whiteSpace: "nowrap" }}>
          <Link href="/vet" style={{ color: "var(--text2)", textDecoration: "none" }}>Case queue</Link>
          <Link href="/" style={{ color: "var(--text3)", textDecoration: "none" }}>Owner app ↗</Link>
        </div>
      </nav>

      <div style={{
        background: "var(--amber-dim)", borderBottom: "1px solid rgba(245,158,11,0.2)",
        color: "var(--amber2)", fontSize: "0.75rem", textAlign: "center", padding: "7px 1rem"
      }}>
        Demo environment · Sample patients only · AI assessments are decision support, not a diagnosis
      </div>

      <main style={{ maxWidth: 1180, margin: "0 auto", padding: "2rem 1.5rem 5rem" }}>
        {children}
      </main>
    </div>
  );
}
