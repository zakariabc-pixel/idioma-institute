import Link from "next/link";
import { notFound } from "next/navigation";
import { dictionaries, isLocale, locales } from "@/lib/i18n";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = dictionaries[locale];

  return (
    <div lang={locale} className="flex min-h-screen flex-col">
      <header className="border-b border-border">
        <nav className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-4">
          <Link href={`/${locale}`} className="text-xl font-bold text-brand">
            Idioma Institute
          </Link>
          <div className="flex flex-1 flex-wrap gap-4 text-sm">
            <Link href={`/${locale}#cours`}>{t.nav.courses}</Link>
            <Link href={`/${locale}/test-niveau`}>{t.nav.test}</Link>
            <Link href={`/${locale}/contact`}>{t.nav.contact}</Link>
          </div>
          <div className="flex gap-2 text-sm uppercase">
            {locales.map((l) => (
              <Link
                key={l}
                href={`/${l}`}
                className={l === locale ? "font-bold text-brand" : "text-muted"}
              >
                {l}
              </Link>
            ))}
          </div>
        </nav>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-border py-6 text-center text-sm text-muted">{t.footer}</footer>
    </div>
  );
}
