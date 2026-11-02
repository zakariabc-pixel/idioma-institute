"use server";

import { createSupabaseService } from "@/lib/supabase/server";

export type LeadState = { ok: boolean; error?: boolean } | null;

const LANGS = ["fr", "en", "es"];
const FORMATS = ["groupe", "individuel"];
const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];

function field(form: FormData, key: string, max = 200) {
  const v = form.get(key);
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

/** Formulaire public : crée un prospect dans le CRM (étape "nouveau"). */
export async function createLead(_prev: LeadState, form: FormData): Promise<LeadState> {
  const full_name = field(form, "full_name");
  const email = field(form, "email");
  const phone = field(form, "phone", 40);
  if (!full_name || (!email && !phone)) return { ok: false, error: true };

  const language = field(form, "language");
  const format = field(form, "format");
  const level = field(form, "test_level");
  const score = Number.parseInt(field(form, "test_score"), 10);

  const { error } = await createSupabaseService()
    .from("contacts")
    .insert({
      full_name,
      email: email || null,
      phone: phone || null,
      message: field(form, "message", 2000) || null,
      language_interest: LANGS.includes(language) ? language : null,
      format_interest: FORMATS.includes(format) ? format : null,
      test_level: LEVELS.includes(level) ? level : null,
      test_score: Number.isFinite(score) ? score : null,
      pipeline: LEVELS.includes(level) ? "test_niveau" : "nouveau",
      source: field(form, "source", 40) || "site",
    });

  if (error) {
    console.error("createLead", error);
    return { ok: false, error: true };
  }
  return { ok: true };
}
