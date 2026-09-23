"use client";

import { useTransition } from "react";
import { setCaseReviewStatus } from "@/lib/vet/actions";

interface Props {
  caseId: string;
  status: "new" | "reviewed";
  disabled: boolean;
}

export default function ReviewToggle({ caseId, status, disabled }: Props) {
  const [isPending, startTransition] = useTransition();
  const reviewed = status === "reviewed";
  const isDisabled = disabled || isPending;

  const toggle = () => {
    startTransition(async () => {
      await setCaseReviewStatus(caseId, !reviewed);
    });
  };

  return (
    <button
      onClick={toggle}
      disabled={isDisabled}
      title={disabled ? "Available once the AI assessment completes" : undefined}
      style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        padding: "4px 12px", borderRadius: 20, fontSize: "0.72rem", fontWeight: 600,
        fontFamily: "'DM Sans', sans-serif", cursor: isDisabled ? "not-allowed" : "pointer",
        color: reviewed ? "var(--text3)" : "#86efac",
        background: reviewed ? "var(--bg4)" : "var(--green-dim)",
        border: reviewed ? "1px solid var(--border2)" : "1px solid rgba(34,197,94,0.18)",
        opacity: isDisabled ? 0.5 : 1,
        transition: "opacity 0.15s"
      }}
    >
      {isPending ? "Updating…" : reviewed ? "Mark as unreviewed" : "Mark as reviewed"}
    </button>
  );
}
