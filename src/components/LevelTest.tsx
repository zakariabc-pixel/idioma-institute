"use client";

import { useState } from "react";
import { LeadForm } from "@/components/LeadForm";
import type { Dictionary } from "@/lib/i18n";
import { questionBank, scoreToLevel } from "@/lib/level-test";

type Lang = keyof typeof questionBank;

export function LevelTest({ t }: { t: Dictionary }) {
  const [lang, setLang] = useState<Lang | null>(null);
  const [index, setIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [choice, setChoice] = useState<number | null>(null);

  if (!lang) {
    return (
      <div className="grid gap-3">
        <p className="text-sm font-medium">{t.test.language}</p>
        <div className="flex flex-wrap gap-3">
          {(Object.keys(questionBank) as Lang[]).map((l) => (
            <button key={l} className="btn-ghost" onClick={() => setLang(l)}>
              {t.courses.languages[l]}
            </button>
          ))}
        </div>
      </div>
    );
  }

  const questions = questionBank[lang];

  if (index >= questions.length) {
    const level = scoreToLevel(correct);
    return (
      <div className="grid gap-6">
        <div className="rounded-xl bg-brand-soft p-6">
          <p className="text-muted">{t.test.result}</p>
          <p className="mt-1 text-4xl font-bold text-brand">{level}</p>
          <p className="mt-1 text-sm text-muted">
            {correct} / {questions.length}
          </p>
        </div>
        <p className="font-medium">{t.test.leaveContact}</p>
        <LeadForm
          t={t.contact}
          languages={t.courses.languages}
          defaultLanguage={lang}
          hidden={{ test_level: level, test_score: String(correct), source: "test_niveau" }}
        />
      </div>
    );
  }

  const q = questions[index];
  const next = () => {
    if (choice === q.answer) setCorrect((c) => c + 1);
    setChoice(null);
    setIndex((i) => i + 1);
  };

  return (
    <div className="grid gap-5">
      <div className="h-2 overflow-hidden rounded bg-brand-soft">
        <div className="h-full bg-brand" style={{ width: `${(index / questions.length) * 100}%` }} />
      </div>
      <p className="text-xl font-medium">{q.q}</p>
      <div className="grid gap-2">
        {q.options.map((o, i) => (
          <button
            key={o}
            onClick={() => setChoice(i)}
            className={`rounded-lg border px-4 py-3 text-left ${
              choice === i ? "border-brand bg-brand-soft" : "border-border bg-card"
            }`}
          >
            {o}
          </button>
        ))}
      </div>
      <button className="btn justify-self-start" disabled={choice === null} onClick={next}>
        {t.test.next}
      </button>
    </div>
  );
}
