import Link from "next/link";
import { signOut } from "@/lib/actions/admin";
import { createSupabaseServer } from "@/lib/supabase/server";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen">
      <header className="border-b border-border bg-card">
        <div className="flex items-center gap-6 px-4 py-3">
          <span className="font-bold text-brand">Idioma · Back-office</span>
          {user && (
            <>
              <Link href="/admin/crm" className="text-sm">
                CRM
              </Link>
              <form action={signOut} className="ml-auto">
                <button className="text-sm text-muted">Déconnexion</button>
              </form>
            </>
          )}
        </div>
      </header>
      {children}
    </div>
  );
}
