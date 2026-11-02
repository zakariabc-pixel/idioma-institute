"use client";

import { useActionState } from "react";
import { signIn } from "@/lib/actions/admin";

export default function LoginPage() {
  const [error, action, pending] = useActionState(signIn, null);

  return (
    <form action={action} className="mx-auto mt-20 grid max-w-sm gap-4 px-4">
      <h1 className="text-2xl font-bold">Connexion</h1>
      <input name="email" type="email" placeholder="E-mail" required className="input" />
      <input name="password" type="password" placeholder="Mot de passe" required className="input" />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button className="btn" disabled={pending}>
        Se connecter
      </button>
    </form>
  );
}
