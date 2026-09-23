import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

let client: NeonQueryFunction<false, false> | null = null;

// Created on first use so importing this module (e.g. during `next build`) never needs the env var.
export function sql() {
  if (!client) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("DATABASE_URL is not set");
    client = neon(url);
  }
  return client;
}

// Idempotent; run by scripts/db-setup.ts. One statement per entry (the HTTP driver runs one at a time).
export const SCHEMA_STATEMENTS = [
  `create sequence if not exists case_number_seq start 1009`,
  `create table if not exists cases (
    id                text primary key default 'pp-' || nextval('case_number_seq'),
    created_at        timestamptz not null default now(),
    status            text not null default 'new' check (status in ('new', 'reviewed')),
    pet_name          text not null,
    species           text not null check (species in ('dog', 'cat')),
    breed             text not null,
    age               text not null,
    sex               text not null,
    weight            text not null,
    owner_name        text not null,
    chief_complaint   text not null,
    symptoms          text[] not null default '{}',
    owner_notes       text not null default '',
    history           jsonb not null,
    photo_region      text,
    photo_pathname    text,
    photo_credit      text,
    assessment        jsonb,
    assessment_status text not null default 'pending' check (assessment_status in ('pending', 'done', 'failed')),
    assessment_error  text,
    assessment_model  text,
    assessed_at       timestamptz
  )`,
];
