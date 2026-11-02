# Idioma Institute

Site vitrine + application de gestion de l'école (CRM prospects → clients → étudiants → alumni, cours live, programme, paiements par virement/versement).

Stack : Next.js 15 (App Router) · Supabase (Postgres, Auth, Storage) · Tailwind CSS.

## Ce qui est en place (lot 1)

- **Site vitrine** en français, anglais et espagnol : `/fr`, `/en`, `/es`
- **Formulaire d'inscription** : chaque envoi crée un prospect dans le CRM
- **Test de niveau** en ligne (10 questions par langue, résultat A1 → C1), qui crée aussi un prospect
- **Back-office** `/admin` : connexion, pipeline des prospects (Nouveau → Contacté → Test de niveau → Cours d'essai → Proposition → Gagné / Perdu), notes, lien WhatsApp
- **Base de données complète** (`supabase/migrations/0001_init.sql`) : contacts, programme (langue → niveau → module → leçon), classes en groupe ou individuelles, séances live, inscriptions, paiements avec reçu, présence, certificats, rôles et règles de sécurité (RLS)

## Démarrer

1. Créer un projet sur [supabase.com](https://supabase.com).
2. Dans l'éditeur SQL de Supabase, exécuter `supabase/migrations/0001_init.sql` puis `supabase/seed.sql`.
3. Copier `.env.example` en `.env.local` et remplir les clés (Project settings → API).
4. `npm install` puis `npm run dev`, ouvrir http://localhost:3000.
5. Créer le premier compte admin : Authentication → Users → Add user, puis dans l'éditeur SQL :
   `update profiles set role = 'admin' where id = '<id de l'utilisateur>';`

## Prochains lots

- Conversion prospect → étudiant (création du compte, inscription à une classe)
- Paiement : dépôt du reçu par l'étudiant, validation par l'admin
- Espace étudiant et espace professeur, salle de cours live intégrée (LiveKit ou Daily)
- Éditeur du programme, présence, certificats PDF
