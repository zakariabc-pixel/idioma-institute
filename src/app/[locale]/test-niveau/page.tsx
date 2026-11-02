import { LevelTest } from "@/components/LevelTest";
import { dictionaries, type Locale } from "@/lib/i18n";

export default async function LevelTestPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = dictionaries[locale];

  return (
    <section className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-3xl font-bold">{t.test.title}</h1>
      <p className="mt-3 mb-8 text-muted">{t.test.intro}</p>
      <LevelTest t={t} />
    </section>
  );
}
