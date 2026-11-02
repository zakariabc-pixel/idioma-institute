import Link from "next/link";
import { dictionaries, type Locale } from "@/lib/i18n";

const levels = ["A1", "A2", "B1", "B2", "C1"];

export default async function Home({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = dictionaries[locale];

  return (
    <>
      <section className="mx-auto max-w-6xl px-4 py-20">
        <h1 className="max-w-3xl text-4xl font-bold leading-tight sm:text-5xl">{t.hero.title}</h1>
        <p className="mt-6 max-w-2xl text-lg text-muted">{t.hero.subtitle}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href={`/${locale}/contact`} className="btn">
            {t.hero.cta}
          </Link>
          <Link href={`/${locale}/test-niveau`} className="btn-ghost">
            {t.hero.ctaTest}
          </Link>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-4 pb-16 sm:grid-cols-2 lg:grid-cols-4">
        {t.features.map((f) => (
          <div key={f.title} className="rounded-xl border border-border bg-card p-5">
            <h3 className="font-semibold">{f.title}</h3>
            <p className="mt-2 text-sm text-muted">{f.text}</p>
          </div>
        ))}
      </section>

      <section id="cours" className="bg-brand-soft py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-3xl font-bold">{t.courses.title}</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {(["fr", "en", "es"] as const).map((lang) => (
              <div key={lang} className="rounded-xl bg-card p-6">
                <h3 className="text-xl font-semibold">{t.courses.languages[lang]}</h3>
                <p className="mt-2 text-sm text-muted">{t.courses.levels}</p>
                <div className="mt-4 flex gap-2">
                  {levels.map((lv) => (
                    <span key={lv} className="rounded bg-brand-soft px-2 py-1 text-xs font-medium">
                      {lv}
                    </span>
                  ))}
                </div>
                <Link href={`/${locale}/contact?langue=${lang}`} className="mt-5 inline-block text-sm font-medium text-brand">
                  {t.hero.cta} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
