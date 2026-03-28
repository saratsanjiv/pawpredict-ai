"use client";

import { useState } from "react";
import HealthForm from "@/components/HealthForm";
import HealthReportView from "@/components/HealthReport";
import type { HealthReport } from "@/lib/validation";

type Pet = "dog" | "cat";

export default function Home() {
  const [petType, setPetType] = useState<Pet>("dog");
  const [report, setReport] = useState<HealthReport | null>(null);
  const [petName, setPetName] = useState("your pet");

  const handleResult = (r: HealthReport, name: string) => {
    setReport(r);
    setPetName(name);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleReset = () => {
    setReport(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* Ambient orbs */}
      <div style={{ position: "fixed", borderRadius: "50%", pointerEvents: "none", zIndex: 0, filter: "blur(100px)", width: 500, height: 500, background: "rgba(245,158,11,0.05)", top: -180, right: -100 }} />
      <div style={{ position: "fixed", borderRadius: "50%", pointerEvents: "none", zIndex: 0, filter: "blur(100px)", width: 400, height: 400, background: "rgba(20,184,166,0.04)", bottom: -120, left: -80 }} />

      {/* Nav */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 200,
        background: "rgba(9,9,11,0.85)", backdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--border)", padding: "0 2.5rem",
        height: 64, display: "flex", alignItems: "center", justifyContent: "space-between"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 34, height: 34, background: "var(--amber-dim)",
            border: "1px solid rgba(245,158,11,0.25)", borderRadius: 10,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem"
          }}>🐾</div>
          <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.3rem", color: "var(--text)" }}>
            Paw<span style={{ color: "var(--amber)" }}>Predict</span> AI
          </span>
        </div>
        <div style={{
          display: "flex", alignItems: "center", gap: 6, background: "var(--bg3)",
          border: "1px solid var(--border2)", borderRadius: 20, padding: "5px 12px 5px 8px",
          fontSize: "0.7rem", fontWeight: 500, color: "var(--text3)"
        }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--teal)", flexShrink: 0 }} />
          Pet Health Intelligence
        </div>
      </nav>

      {!report && (
        <>
          {/* Hero */}
          <div style={{ position: "relative", zIndex: 1, maxWidth: 800, margin: "0 auto", padding: "4.5rem 2rem 2.5rem", textAlign: "center" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 7,
              background: "var(--amber-dim)", border: "1px solid rgba(245,158,11,0.2)",
              borderRadius: 30, padding: "6px 14px", fontSize: "0.72rem", fontWeight: 600,
              letterSpacing: "0.08em", color: "var(--amber)", textTransform: "uppercase", marginBottom: "1.8rem"
            }}>🩺 Dogs & Cats · AI Health Assessment</div>

            <h1 style={{
              fontFamily: "'DM Serif Display', serif", fontSize: "clamp(2.2rem, 5vw, 3.4rem)",
              fontWeight: 400, lineHeight: 1.18, letterSpacing: "-0.02em", marginBottom: "1rem", color: "var(--text)"
            }}>
              Preventive health intelligence<br />
              for{" "}
              <em style={{ fontStyle: "italic", color: "var(--amber)" }}>your pet</em>
            </h1>

            <p style={{ fontSize: "0.97rem", color: "var(--text2)", lineHeight: 1.75, maxWidth: 500, margin: "0 auto 2.5rem", fontWeight: 300 }}>
              Clinical-grade AI that predicts health risks, flags early warning signs, and analyzes skin & coat — before your next vet visit.
            </p>

            {/* Pet toggle */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "2.8rem" }}>
              <div style={{ display: "inline-flex", background: "var(--bg3)", border: "1px solid var(--border2)", borderRadius: 14, padding: 4, gap: 4 }}>
                {(["dog", "cat"] as Pet[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPetType(p)}
                    style={{
                      padding: "9px 26px", borderRadius: 10, fontSize: "0.88rem", fontWeight: 500,
                      color: petType === p ? "var(--text)" : "var(--text3)",
                      cursor: "pointer", display: "flex", alignItems: "center", gap: 7,
                      border: petType === p ? "1px solid var(--border2)" : "none",
                      background: petType === p ? "var(--bg5)" : "transparent",
                      fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s"
                    }}
                  >
                    <span style={{ fontSize: "1.1rem", lineHeight: 1 }}>{p === "dog" ? "🐶" : "🐱"}</span>
                    {p === "dog" ? "Dog" : "Cat"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <HealthForm onResult={handleResult} />
        </>
      )}

      {report && (
        <HealthReportView report={report} petName={petName} onReset={handleReset} />
      )}

      <div style={{
        textAlign: "center", fontSize: "0.7rem", color: "var(--text3)",
        padding: "1.4rem 2rem", borderTop: "1px solid var(--border)",
        lineHeight: 1.7, maxWidth: 560, margin: "0 auto"
      }}>
        ⚠️ PawPredict AI is for informational purposes only and does not replace professional veterinary diagnosis or treatment. Always consult a licensed veterinarian.
      </div>
    </>
  );
}
