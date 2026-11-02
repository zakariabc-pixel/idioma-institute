import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Idioma Institute",
  description: "Cours de français, d'anglais et d'espagnol en ligne pour adultes.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body className="antialiased">{children}</body>
    </html>
  );
}
