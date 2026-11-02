"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase/server";
import { PIPELINE } from "@/lib/pipeline";

export async function signIn(_prev: string | null, form: FormData): Promise<string | null> {
  const supabase = await createSupabaseServer();
  const { error } = await supabase.auth.signInWithPassword({
    email: String(form.get("email") ?? ""),
    password: String(form.get("password") ?? ""),
  });
  if (error) return "Identifiants incorrects.";
  redirect("/admin/crm");
}

export async function signOut() {
  const supabase = await createSupabaseServer();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

/** Déplace un prospect dans le pipeline (RLS : admin / conseiller uniquement). */
export async function moveContact(form: FormData) {
  const id = String(form.get("id") ?? "");
  const step = String(form.get("pipeline") ?? "");
  if (!PIPELINE.some((p) => p.key === step)) return;

  const supabase = await createSupabaseServer();
  const update: Record<string, string> = { pipeline: step };
  if (step === "perdu") update.stage = "perdu";
  else if (step === "gagne") update.stage = "client";
  else update.stage = "prospect";

  await supabase.from("contacts").update(update).eq("id", id).in("stage", ["prospect", "client", "perdu"]);
  revalidatePath("/admin/crm");
}

export async function addNote(form: FormData) {
  const contact_id = String(form.get("contact_id") ?? "");
  const body = String(form.get("body") ?? "").trim().slice(0, 2000);
  if (!body) return;
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  await supabase.from("contact_notes").insert({ contact_id, body, author_id: user?.id });
  revalidatePath("/admin/crm");
}
