import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Panel } from "@/components/Panel";
import PatientHeader from "@/components/vet/PatientHeader";
import LiveAssessment from "@/components/vet/LiveAssessment";
import { ASSESSMENT_META, CASES, getCase } from "@/lib/vet/cases";
import { casePhotoPath } from "@/lib/vet/format";
import { MODEL } from "@/lib/anthropic";

const storedSource = ASSESSMENT_META.generatedAt
  ? `${ASSESSMENT_META.model}, generated ${new Date(ASSESSMENT_META.generatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
  : ASSESSMENT_META.model;

export function generateStaticParams() {
  return CASES.map((c) => ({ id: c.id }));
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const c = getCase(params.id);
  return { title: c ? `${c.patient.name} (${c.id.toUpperCase()}) — PawPredict Vet` : "Case not found — PawPredict Vet" };
}

const body = { fontSize: "0.86rem", color: "var(--text2)", lineHeight: 1.7 } as const;

export default function CasePage({ params }: { params: { id: string } }) {
  const c = getCase(params.id);
  if (!c) notFound();

  const history: [string, string][] = [
    ["Diet", c.history.diet],
    ["Environment", c.history.environment],
    ["Vaccinations", c.history.vaccines],
    ["Last vet visit", c.history.lastVet],
    ["Medical history", c.history.medicalHistory],
  ];

  return (
    <>
      <PatientHeader c={c} />

      <div className="vet-case-grid">
        <div>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.35rem", fontWeight: 400, marginBottom: "0.8rem" }}>
            Owner submission
          </h2>

          {c.photo ? (
            <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "var(--r)", overflow: "hidden", marginBottom: "0.8rem" }}>
              <Image
                src={casePhotoPath(c.id)} alt={`${c.patient.name}: ${c.photo.region}`}
                width={1200} height={900} priority
                style={{ width: "100%", height: "auto", display: "block" }}
              />
              <div style={{ padding: "0.6rem 1rem", fontSize: "0.75rem", color: "var(--text3)" }}>📷 {c.photo.region}</div>
            </div>
          ) : (
            <div style={{
              background: "var(--bg2)", border: "1px dashed var(--border2)", borderRadius: "var(--r)",
              padding: "1.4rem", textAlign: "center", fontSize: "0.8rem", color: "var(--text3)", marginBottom: "0.8rem"
            }}>
              No photo submitted
            </div>
          )}

          <Panel icon="🗣️" iconBg="var(--amber-dim)" title="Chief complaint">
            <p style={{ fontSize: "0.92rem", color: "var(--text)", fontWeight: 500, marginBottom: "0.6rem" }}>{c.chiefComplaint}</p>
            <p style={{ ...body, fontStyle: "italic" }}>“{c.ownerNotes}”</p>
          </Panel>

          <Panel icon="🩺" iconBg="var(--red-dim)" title="Reported symptoms">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {c.symptoms.map((s) => (
                <span key={s} style={{
                  fontSize: "0.76rem", padding: "4px 10px", borderRadius: 20,
                  background: "var(--bg4)", color: "var(--text2)", border: "1px solid var(--border)"
                }}>{s}</span>
              ))}
            </div>
          </Panel>

          <Panel icon="📁" iconBg="var(--bg4)" title="History">
            {history.map(([k, v]) => (
              <div key={k} style={{ display: "grid", gridTemplateColumns: "110px 1fr", gap: 10, marginBottom: "0.5rem" }}>
                <span style={{ fontSize: "0.75rem", color: "var(--text3)" }}>{k}</span>
                <span style={{ fontSize: "0.82rem", color: "var(--text2)", lineHeight: 1.55 }}>{v}</span>
              </div>
            ))}
          </Panel>
        </div>

        <LiveAssessment
          caseId={c.id}
          initial={c.assessment}
          hasPhoto={c.photo !== null}
          storedSource={storedSource}
          liveModel={MODEL}
        />
      </div>
    </>
  );
}
