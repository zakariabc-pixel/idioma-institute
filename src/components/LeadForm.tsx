"use client";

import { useActionState } from "react";
import { createLead, type LeadState } from "@/lib/actions/leads";
import type { Dictionary } from "@/lib/i18n";

type Props = {
  t: Dictionary["contact"];
  languages: Dictionary["courses"]["languages"];
  defaultLanguage?: string;
  hidden?: Record<string, string>;
};

export function LeadForm({ t, languages, defaultLanguage, hidden }: Props) {
  const [state, action, pending] = useActionState<LeadState, FormData>(createLead, null);

  if (state?.ok) {
    return <p className="rounded-lg bg-brand-soft p-4 font-medium">{t.success}</p>;
  }

  return (
    <form action={action} className="grid gap-4">
      {Object.entries(hidden ?? {}).map(([k, v]) => (
        <input key={k} type="hidden" name={k} value={v} />
      ))}
      <label className="grid gap-1 text-sm">
        {t.name}
        <input name="full_name" required className="input" />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1 text-sm">
          {t.email}
          <input name="email" type="email" className="input" />
        </label>
        <label className="grid gap-1 text-sm">
          {t.phone}
          <input name="phone" type="tel" className="input" />
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1 text-sm">
          {t.language}
          <select name="language" defaultValue={defaultLanguage ?? "fr"} className="input">
            {Object.entries(languages).map(([code, label]) => (
              <option key={code} value={code}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-sm">
          {t.format}
          <select name="format" className="input">
            <option value="groupe">{t.group}</option>
            <option value="individuel">{t.individual}</option>
          </select>
        </label>
      </div>
      <label className="grid gap-1 text-sm">
        {t.message}
        <textarea name="message" rows={4} className="input" />
      </label>
      {state?.error && <p className="text-sm text-red-600">{t.error}</p>}
      <button type="submit" disabled={pending} className="btn justify-self-start">
        {t.submit}
      </button>
    </form>
  );
}
