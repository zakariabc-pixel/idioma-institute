import { LeadForm } from "@/components/LeadForm";
import { dictionaries, type Locale } from "@/lib/i18n";

export default async function ContactPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ langue?: string }>;
}) {
  const { locale } = await params;
  const { langue } = await searchParams;
  const t = dictionaries[locale];

  return (
    <section className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-3xl font-bold">{t.contact.title}</h1>
      <p className="mt-3 text-muted">{t.contact.intro}</p>
      <div className="mt-8">
        <LeadForm t={t.contact} languages={t.courses.languages} defaultLanguage={langue} />
      </div>
    </section>
  );
}
