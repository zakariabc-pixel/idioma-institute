import { addNote, moveContact } from "@/lib/actions/admin";
import { PIPELINE } from "@/lib/pipeline";
import { createSupabaseServer } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type Contact = {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  pipeline: string;
  language_interest: string | null;
  format_interest: string | null;
  test_level: string | null;
  source: string;
  message: string | null;
  created_at: string;
  contact_notes: { id: string; body: string; created_at: string }[];
};

const LANG = { fr: "Français", en: "Anglais", es: "Espagnol" } as Record<string, string>;

function whatsapp(phone: string) {
  const digits = phone.replace(/\D/g, "").replace(/^0/, "212");
  return `https://wa.me/${digits}`;
}

export default async function CrmPage() {
  const supabase = await createSupabaseServer();
  const { data, error } = await supabase
    .from("contacts")
    .select(
      "id, full_name, email, phone, pipeline, language_interest, format_interest, test_level, source, message, created_at, contact_notes(id, body, created_at)",
    )
    .in("stage", ["prospect", "client", "perdu"])
    .order("created_at", { ascending: false });

  if (error) {
    return <p className="p-6 text-red-600">Accès refusé ou erreur : {error.message}</p>;
  }
  const contacts = (data ?? []) as Contact[];

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">Pipeline des prospects</h1>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {PIPELINE.map((col) => {
          const items = contacts.filter((c) => c.pipeline === col.key);
          return (
            <section key={col.key} className="w-72 shrink-0 rounded-xl bg-brand-soft p-3">
              <h2 className="mb-3 flex justify-between text-sm font-semibold">
                {col.label}
                <span className="text-muted">{items.length}</span>
              </h2>
              <div className="grid gap-3">
                {items.map((c) => (
                  <article key={c.id} className="rounded-lg bg-card p-3 text-sm shadow-sm">
                    <p className="font-semibold">{c.full_name}</p>
                    <p className="text-muted">
                      {[c.language_interest && LANG[c.language_interest], c.format_interest, c.test_level]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                    <p className="mt-1 text-xs text-muted">
                      {c.source} · {new Date(c.created_at).toLocaleDateString("fr-MA")}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-3 text-xs">
                      {c.phone && (
                        <a href={whatsapp(c.phone)} target="_blank" className="text-brand">
                          WhatsApp
                        </a>
                      )}
                      {c.email && (
                        <a href={`mailto:${c.email}`} className="text-brand">
                          E-mail
                        </a>
                      )}
                    </div>
                    {c.message && <p className="mt-2 text-xs italic">{c.message}</p>}
                    {c.contact_notes.length > 0 && (
                      <ul className="mt-2 grid gap-1 border-t border-border pt-2 text-xs">
                        {c.contact_notes.map((n) => (
                          <li key={n.id}>{n.body}</li>
                        ))}
                      </ul>
                    )}
                    <form action={addNote} className="mt-2 flex gap-1">
                      <input type="hidden" name="contact_id" value={c.id} />
                      <input name="body" placeholder="Ajouter une note" className="input py-1 text-xs" />
                    </form>
                    <form action={moveContact} className="mt-2 flex gap-1">
                      <input type="hidden" name="id" value={c.id} />
                      <select name="pipeline" defaultValue={c.pipeline} className="input py-1 text-xs">
                        {PIPELINE.map((p) => (
                          <option key={p.key} value={p.key}>
                            {p.label}
                          </option>
                        ))}
                      </select>
                      <button className="rounded bg-brand px-2 text-xs text-white">OK</button>
                    </form>
                  </article>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
