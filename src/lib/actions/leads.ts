"use server";

import { createSupabaseServer } from "@/lib/supabase/server";

export type LeadState = { ok: boolean; error?: boolean } | null;

function field(form: FormData, key: string) {
  const v = form.get(key);
  return typeof v === "string" ? v.trim() : "";
}

/**
 * Formulaire public : crée un prospect dans le CRM via la fonction SQL `submit_lead`
 * (validation côté base, aucune clé serveur nécessaire).
 */
export async function createLead(_prev: LeadState, form: FormData): Promise<LeadState> {
  const full_name = field(form, "full_name");
  if (!full_name || (!field(form, "email") && !field(form, "phone"))) return { ok: false, error: true };

  const score = Number.parseInt(field(form, "test_score"), 10);
  const supabase = await createSupabaseServer();
  const { error } = await supabase.rpc("submit_lead", {
    p_full_name: full_name,
    p_email: field(form, "email") || null,
    p_phone: field(form, "phone") || null,
    p_message: field(form, "message") || null,
    p_language: field(form, "language") || null,
    p_format: field(form, "format") || null,
    p_test_level: field(form, "test_level") || null,
    p_test_score: Number.isFinite(score) ? score : null,
    p_source: field(form, "source") || "site",
  });

  if (error) {
    console.error("createLead", error);
    return { ok: false, error: true };
  }
  return { ok: true };
}
