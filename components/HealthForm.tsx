"use client";

import { useState, useRef } from "react";
import type { HealthReport } from "@/lib/validation";

const SYMPTOMS = [
  "Lethargy",
  "Loss of appetite",
  "Vomiting",
  "Diarrhea",
  "Excessive thirst",
  "Frequent urination",
  "Coughing / sneezing",
  "Limping / stiffness",
  "Itching / scratching",
  "Hair loss",
  "Bad breath",
  "Eye / nose discharge",
];

interface Props {
  onResult: (report: HealthReport, petName: string) => void;
}

export default function HealthForm({ onResult }: Props) {
  const [petType, setPetType] = useState<"dog" | "cat">("dog");
  const [selectedSymptoms, setSelectedSymptoms] = useState<Set<string>>(new Set());
  const [otherChecked, setOtherChecked] = useState(false);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const toggleSymptom = (s: string) => {
    setSelectedSymptoms((prev) => {
      const next = new Set(prev);
      next.has(s) ? next.delete(s) : next.add(s);
      return next;
    });
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 4_000_000) {
      setError("Image must be under 4MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setImagePreview(result);
      setImageBase64(result.split(",")[1]);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = e.currentTarget;
    const get = (id: string) => (form.elements.namedItem(id) as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement)?.value ?? "";

    const payload = {
      petType,
      name: get("name"),
      breed: get("breed"),
      age: get("age"),
      weight: get("weight"),
      sex: get("sex"),
      diet: get("diet"),
      exercise: get("exercise"),
      vaccines: get("vaccines"),
      lastVet: get("lastVet"),
      environment: get("environment"),
      medicalHistory: get("medicalHistory"),
      symptoms: Array.from(selectedSymptoms),
      otherSymptoms: otherChecked ? get("otherSymptoms") : "",
      imageBase64: imageBase64 ?? undefined,
    };

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }

      onResult(data, get("name") || "your pet");
    } catch {
      setError("Network error. Please check your connection and try again.");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ maxWidth: 460, margin: "0 auto", padding: "5rem 2rem", textAlign: "center" }}>
        <div style={{
          width: 72, height: 72, borderRadius: "50%",
          border: "2px solid var(--border2)", borderTopColor: "var(--amber)",
          animation: "spin 1s linear infinite", margin: "0 auto 2rem", position: "relative"
        }}>
          <span style={{
            position: "absolute", top: "50%", left: "50%",
            transform: "translate(-50%,-50%)", fontSize: "1.2rem",
            animation: "cspin 1s linear infinite"
          }}>🐾</span>
        </div>
        <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.5rem", marginBottom: "0.5rem" }}>
          Analyzing health data…
        </div>
        <div style={{ fontSize: "0.84rem", color: "var(--text3)" }}>Our AI is reviewing every detail</div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ position: "relative", zIndex: 1, maxWidth: 800, margin: "0 auto", padding: "0 2rem 5rem" }}>

      {error && (
        <div style={{
          background: "var(--red-dim)", border: "1px solid rgba(239,68,68,0.3)",
          borderRadius: "var(--rsm)", padding: "12px 16px", marginBottom: "1rem",
          fontSize: "0.85rem", color: "#fca5a5"
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* 01 Basic Info */}
      <SectionLabel num="01" title="Basic Information" />
      <Card>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Field label="Pet's Name"><input name="name" type="text" placeholder="e.g. Buddy" maxLength={50} /></Field>
          <Field label="Breed"><input name="breed" type="text" placeholder="e.g. Golden Retriever" maxLength={100} /></Field>
          <Field label="Age">
            <select name="age">
              <option value="">Select age</option>
              <option>Under 1 year (Puppy / Kitten)</option>
              <option>1–3 years (Young adult)</option>
              <option>4–7 years (Adult)</option>
              <option>8–10 years (Senior)</option>
              <option>11+ years (Geriatric)</option>
            </select>
          </Field>
          <Field label="Weight">
            <select name="weight">
              <option value="">Select weight</option>
              <option>Under 5 lbs</option>
              <option>5–15 lbs (small)</option>
              <option>15–40 lbs (medium)</option>
              <option>40–80 lbs (large)</option>
              <option>80+ lbs (extra large)</option>
            </select>
          </Field>
          <Field label="Sex">
            <select name="sex">
              <option value="">Select</option>
              <option>Male (intact)</option>
              <option>Male (neutered)</option>
              <option>Female (intact)</option>
              <option>Female (spayed)</option>
            </select>
          </Field>
          <Field label="Diet">
            <select name="diet">
              <option value="">Select diet</option>
              <option>Commercial dry food (kibble)</option>
              <option>Commercial wet food</option>
              <option>Raw / home-cooked</option>
              <option>Mixed diet</option>
              <option>Prescription / vet diet</option>
            </select>
          </Field>
        </div>
      </Card>

      {/* 02 Symptoms */}
      <SectionLabel num="02" title="Current Symptoms" />
      <Card>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 7 }}>
          {SYMPTOMS.map((s) => (
            <SymptomChip
              key={s}
              label={s}
              checked={selectedSymptoms.has(s)}
              onClick={() => toggleSymptom(s)}
            />
          ))}
          <SymptomChip
            label="Other…"
            checked={otherChecked}
            onClick={() => setOtherChecked((v) => !v)}
            style={{ gridColumn: "1 / -1" }}
          />
        </div>
        {otherChecked && (
          <input
            name="otherSymptoms"
            type="text"
            placeholder="Describe any other symptoms…"
            maxLength={300}
            style={{ marginTop: 10 }}
          />
        )}
      </Card>

      {/* 03 Lifestyle */}
      <SectionLabel num="03" title="Lifestyle & History" />
      <Card>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Field label="Exercise Level">
            <select name="exercise">
              <option value="">Select</option>
              <option>Very active (daily vigorous exercise)</option>
              <option>Moderately active (daily walks)</option>
              <option>Low activity (short walks only)</option>
              <option>Mostly sedentary</option>
            </select>
          </Field>
          <Field label="Vaccinations">
            <select name="vaccines">
              <option value="">Select</option>
              <option>Up to date</option>
              <option>Partially vaccinated</option>
              <option>Not vaccinated</option>
              <option>Unknown</option>
            </select>
          </Field>
          <Field label="Last Vet Visit">
            <select name="lastVet">
              <option value="">Select</option>
              <option>Within 6 months</option>
              <option>6–12 months ago</option>
              <option>1–2 years ago</option>
              <option>Over 2 years ago</option>
              <option>Never</option>
            </select>
          </Field>
          <Field label="Living Environment">
            <select name="environment">
              <option value="">Select</option>
              <option>Indoor only</option>
              <option>Mostly indoor</option>
              <option>Indoor & outdoor</option>
              <option>Mostly outdoor</option>
            </select>
          </Field>
          <Field label="Known conditions or medications" style={{ gridColumn: "1 / -1" }}>
            <textarea name="medicalHistory" placeholder="e.g. diabetes, allergies, current medications… or leave blank" maxLength={500} />
          </Field>
        </div>
      </Card>

      {/* 04 Photo */}
      <SectionLabel num="04" title="Coat & Skin Photo" />
      <Card>
        <div
          onClick={() => fileRef.current?.click()}
          style={{
            border: `1.5px dashed ${imagePreview ? "rgba(20,184,166,0.4)" : "var(--border2)"}`,
            background: imagePreview ? "var(--teal-dim)" : "transparent",
            borderRadius: "var(--r)", padding: "2.2rem", textAlign: "center",
            cursor: "pointer", transition: "all 0.2s"
          }}
        >
          <div style={{
            width: 48, height: 48, background: "var(--bg4)", border: "1px solid var(--border2)",
            borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.3rem", margin: "0 auto 0.9rem"
          }}>📷</div>
          <div style={{ fontSize: "0.9rem", fontWeight: 500, color: "var(--text)", marginBottom: 3 }}>
            {imagePreview ? "Photo uploaded ✓" : "Upload a photo of your pet's coat or skin"}
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--text3)" }}>
            Optional but improves accuracy · JPG or PNG · Max 4MB
          </div>
          {imagePreview && (
            <img src={imagePreview} alt="Preview" style={{
              maxWidth: 180, maxHeight: 150, borderRadius: "var(--rsm)",
              margin: "1rem auto 0", objectFit: "cover", display: "block",
              border: "1px solid rgba(20,184,166,0.3)"
            }} />
          )}
          <input ref={fileRef} type="file" accept="image/jpeg,image/png" onChange={handleImage} style={{ display: "none" }} />
        </div>
      </Card>

      <button
        type="submit"
        style={{
          width: "100%", background: "var(--amber)", color: "#000", border: "none",
          borderRadius: "var(--r)", padding: "16px 24px", fontFamily: "'DM Sans', sans-serif",
          fontSize: "0.95rem", fontWeight: 600, cursor: "pointer", display: "flex",
          alignItems: "center", justifyContent: "center", gap: 9, marginTop: "0.5rem",
          transition: "all 0.2s"
        }}
      >
        🔍 Analyze My Pet&apos;s Health
      </button>
    </form>
  );
}

// ── Small reusable pieces ────────────────────────────────────────────────────

function SectionLabel({ num, title }: { num: string; title: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1rem", marginTop: "1.2rem" }}>
      <span style={{
        fontSize: "0.68rem", fontWeight: 600, color: "var(--amber)",
        background: "var(--amber-dim)", border: "1px solid rgba(245,158,11,0.2)",
        borderRadius: 6, padding: "3px 8px", flexShrink: 0
      }}>{num}</span>
      <span style={{ fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text3)" }}>{title}</span>
      <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      background: "var(--bg2)", border: "1px solid var(--border)",
      borderRadius: "var(--r)", padding: "1.6rem", marginBottom: "1rem", position: "relative"
    }}>
      {children}
    </div>
  );
}

function Field({ label, children, style }: { label: string; children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5, ...style }}>
      <label style={{ fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.09em", textTransform: "uppercase", color: "var(--text3)" }}>
        {label}
      </label>
      {children}
    </div>
  );
}

function SymptomChip({ label, checked, onClick, style }: {
  label: string; checked: boolean; onClick: () => void; style?: React.CSSProperties;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        display: "flex", alignItems: "center", gap: 8,
        background: checked ? "var(--amber-dim)" : "var(--bg3)",
        border: `1px solid ${checked ? "rgba(245,158,11,0.3)" : "var(--border)"}`,
        borderRadius: "var(--rsm)", padding: "9px 12px", cursor: "pointer",
        transition: "all 0.18s", fontSize: "0.8rem", color: checked ? "var(--amber2)" : "var(--text2)",
        userSelect: "none", ...style
      }}
    >
      <div style={{
        width: 14, height: 14, flexShrink: 0,
        border: `1.5px solid ${checked ? "var(--amber)" : "var(--border2)"}`,
        borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "0.5rem", background: checked ? "var(--amber)" : "transparent",
        color: checked ? "#000" : "transparent", transition: "all 0.18s"
      }}>✓</div>
      {label}
    </div>
  );
}
