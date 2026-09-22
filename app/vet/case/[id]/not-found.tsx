import Link from "next/link";

export default function CaseNotFound() {
  return (
    <div style={{ textAlign: "center", padding: "4rem 1rem" }}>
      <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>🔍</div>
      <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.6rem", fontWeight: 400, marginBottom: "0.5rem" }}>
        Case not found
      </h1>
      <p style={{ fontSize: "0.88rem", color: "var(--text2)", marginBottom: "1.4rem" }}>
        This case ID doesn&apos;t exist in the queue.
      </p>
      <Link href="/vet" style={{ fontSize: "0.85rem", color: "var(--teal)", textDecoration: "none" }}>← Back to case queue</Link>
    </div>
  );
}
