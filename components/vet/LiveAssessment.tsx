"use client";

import { useState } from "react";
import type { VetAssessment } from "@/lib/vet/schema";
import { AlertRow } from "@/components/Panel";
import AssessmentView from "./AssessmentView";

interface Props {
  caseId: string;
  initial: VetAssessment;
  hasPhoto: boolean;
  storedSource: string;
  liveModel: string;
}

export default function LiveAssessment({ caseId, initial, hasPhoto, storedSource, liveModel }: Props) {
  const [assessment, setAssessment] = useState(initial);
  const [status, setStatus] = useState<"stored" | "loading" | "live">("stored");
  const [error, setError] = useState<string | null>(null);

  const rerun = async () => {
    const previous = status;
    setStatus("loading");
    setError(null);
    try {
      const res = await fetch("/api/vet/assess", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caseId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong. Please try again.");
      setAssessment(data);
      setStatus("live");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error. Please try again.");
      setStatus(previous);
    }
  };

  const loading = status === "loading";
  const sourceLine =
    status === "live" ? `Live result from ${liveModel}, generated just now (not saved)`
    : `Stored assessment · ${storedSource}`;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10, marginBottom: "0.3rem" }}>
        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.35rem", fontWeight: 400 }}>AI assessment</h2>
        <button
          onClick={rerun}
          disabled={loading}
          style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "7px 14px", borderRadius: 10, fontSize: "0.8rem", fontWeight: 500,
            fontFamily: "'DM Sans', sans-serif", cursor: loading ? "wait" : "pointer",
            color: "var(--teal)", background: "var(--teal-dim)", border: "1px solid rgba(20,184,166,0.3)",
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? (
            <span style={{
              width: 12, height: 12, borderRadius: "50%", border: "2px solid rgba(20,184,166,0.3)",
              borderTopColor: "var(--teal)", animation: "spin 0.8s linear infinite"
            }} />
          ) : "↻"}
          {loading ? "Assessing…" : "Re-run AI assessment"}
        </button>
      </div>
      <div style={{ fontSize: "0.72rem", color: status === "live" ? "var(--teal)" : "var(--text3)", marginBottom: "0.8rem" }}>
        {loading ? `Running a fresh assessment with ${liveModel}. This usually takes under a minute.` : sourceLine}
        {" · "}Decision support only. Confirm with a clinical exam.
      </div>

      {error && <AlertRow type="danger" text={error} />}

      <div style={{ opacity: loading ? 0.4 : 1, transition: "opacity 0.2s", pointerEvents: loading ? "none" : "auto" }}>
        <AssessmentView a={assessment} hasPhoto={hasPhoto} />
      </div>
    </div>
  );
}
