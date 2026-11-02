-- Idioma Institute : schéma initial
-- Parcours : prospect -> client -> etudiant -> alumni (ou perdu)

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Types
-- ---------------------------------------------------------------------------
create type user_role as enum ('admin', 'conseiller', 'professeur', 'etudiant');
create type contact_stage as enum ('prospect', 'client', 'etudiant', 'alumni', 'perdu');
create type pipeline_step as enum (
  'nouveau', 'contacte', 'test_niveau', 'cours_essai', 'proposition', 'gagne', 'perdu'
);
create type language_code as enum ('fr', 'en', 'es');
create type cefr_level as enum ('A1', 'A2', 'B1', 'B2', 'C1', 'C2');
create type course_format as enum ('groupe', 'individuel');
create type payment_method as enum ('virement', 'versement');
create type payment_status as enum ('en_attente', 'valide', 'refuse');
create type enrollment_status as enum ('en_attente_paiement', 'actif', 'termine', 'abandonne');
create type attendance_status as enum ('present', 'absent', 'retard', 'excuse');

-- ---------------------------------------------------------------------------
-- Utilisateurs de l'app (lié à auth.users)
-- ---------------------------------------------------------------------------
create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role user_role not null default 'etudiant',
  full_name text not null default '',
  phone text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- CRM : contacts (un contact traverse tout le parcours)
-- ---------------------------------------------------------------------------
create table contacts (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text,
  phone text,
  stage contact_stage not null default 'prospect',
  pipeline pipeline_step not null default 'nouveau',
  language_interest language_code,
  format_interest course_format,
  source text not null default 'site',          -- site, whatsapp, facebook, instagram, parrainage...
  message text,
  test_level cefr_level,                         -- résultat du test de niveau en ligne
  test_score int,
  assigned_to uuid references profiles (id) on delete set null,
  profile_id uuid unique references profiles (id) on delete set null, -- compte étudiant une fois converti
  next_follow_up date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index contacts_pipeline_idx on contacts (pipeline);
create index contacts_stage_idx on contacts (stage);

create table contact_notes (
  id uuid primary key default gen_random_uuid(),
  contact_id uuid not null references contacts (id) on delete cascade,
  author_id uuid references profiles (id) on delete set null,
  body text not null,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Programme de l'institut : langue -> niveau -> module -> leçon
-- ---------------------------------------------------------------------------
create table programs (
  id uuid primary key default gen_random_uuid(),
  language language_code not null,
  level cefr_level not null,
  title text not null,
  description text,
  hours int not null default 0,
  price_group_mad int,          -- prix en dirhams, format groupe
  price_individual_mad int,     -- prix en dirhams, format individuel
  unique (language, level)
);

create table modules (
  id uuid primary key default gen_random_uuid(),
  program_id uuid not null references programs (id) on delete cascade,
  position int not null,
  title text not null
);

create table lessons (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references modules (id) on delete cascade,
  position int not null,
  title text not null,
  content text,                 -- contenu (markdown)
  resource_url text             -- support (PDF, audio...) dans Supabase Storage
);

-- ---------------------------------------------------------------------------
-- Classes (groupe ou individuel) et séances live
-- ---------------------------------------------------------------------------
create table classes (
  id uuid primary key default gen_random_uuid(),
  program_id uuid not null references programs (id),
  teacher_id uuid references profiles (id) on delete set null,
  format course_format not null,
  name text not null,
  capacity int not null default 10,
  starts_on date,
  ends_on date,
  created_at timestamptz not null default now()
);

create table class_sessions (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references classes (id) on delete cascade,
  lesson_id uuid references lessons (id) on delete set null,
  starts_at timestamptz not null,
  duration_minutes int not null default 90,
  room_name text not null default gen_random_uuid()::text, -- salle visio intégrée (LiveKit / Daily)
  recording_url text
);

-- ---------------------------------------------------------------------------
-- Inscriptions, paiements (virement / versement avec reçu), présence
-- ---------------------------------------------------------------------------
create table enrollments (
  id uuid primary key default gen_random_uuid(),
  contact_id uuid not null references contacts (id) on delete cascade,
  class_id uuid not null references classes (id),
  status enrollment_status not null default 'en_attente_paiement',
  price_mad int not null,
  created_at timestamptz not null default now(),
  unique (contact_id, class_id)
);

create table payments (
  id uuid primary key default gen_random_uuid(),
  enrollment_id uuid not null references enrollments (id) on delete cascade,
  amount_mad int not null,
  method payment_method not null,
  status payment_status not null default 'en_attente',
  receipt_path text,            -- reçu envoyé par l'étudiant (Storage)
  reference text,
  validated_by uuid references profiles (id) on delete set null,
  validated_at timestamptz,
  created_at timestamptz not null default now()
);

create table attendance (
  session_id uuid not null references class_sessions (id) on delete cascade,
  enrollment_id uuid not null references enrollments (id) on delete cascade,
  status attendance_status not null,
  primary key (session_id, enrollment_id)
);

create table certificates (
  id uuid primary key default gen_random_uuid(),
  enrollment_id uuid not null unique references enrollments (id) on delete cascade,
  final_grade numeric(5, 2),
  issued_at timestamptz not null default now(),
  verification_code text not null unique default encode(gen_random_bytes(6), 'hex')
);

-- ---------------------------------------------------------------------------
-- Déclencheurs
-- ---------------------------------------------------------------------------
create or replace function touch_updated_at() returns trigger language plpgsql as $$
begin new.updated_at := now(); return new; end $$;

create trigger contacts_touch before update on contacts
  for each row execute function touch_updated_at();

-- Un paiement validé active l'inscription et passe le contact en "etudiant"
create or replace function on_payment_validated() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if new.status = 'valide' and (old.status is distinct from 'valide') then
    update enrollments set status = 'actif'
      where id = new.enrollment_id and status = 'en_attente_paiement';
    update contacts set stage = 'etudiant', pipeline = 'gagne'
      where id = (select contact_id from enrollments where id = new.enrollment_id);
  end if;
  return new;
end $$;

create trigger payments_validated after update on payments
  for each row execute function on_payment_validated();

-- Création automatique du profil à l'inscription d'un utilisateur
create or replace function on_auth_user_created() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into profiles (id, full_name)
    values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''));
  return new;
end $$;

create trigger auth_user_created after insert on auth.users
  for each row execute function on_auth_user_created();

-- ---------------------------------------------------------------------------
-- Sécurité (RLS)
-- ---------------------------------------------------------------------------
create or replace function current_role_is(roles user_role[]) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from profiles where id = auth.uid() and role = any (roles));
$$;

alter table profiles enable row level security;
alter table contacts enable row level security;
alter table contact_notes enable row level security;
alter table programs enable row level security;
alter table modules enable row level security;
alter table lessons enable row level security;
alter table classes enable row level security;
alter table class_sessions enable row level security;
alter table enrollments enable row level security;
alter table payments enable row level security;
alter table attendance enable row level security;
alter table certificates enable row level security;

-- Profils : chacun lit le sien, l'équipe lit tout, l'admin gère
create policy profiles_self on profiles for select using (id = auth.uid());
create policy profiles_staff on profiles for select
  using (current_role_is(array['admin', 'conseiller', 'professeur']::user_role[]));
create policy profiles_admin on profiles for all
  using (current_role_is(array['admin']::user_role[]));

-- CRM : réservé à l'admin et aux conseillers.
-- Les formulaires publics passent par le serveur (clé service), pas par le client.
create policy contacts_staff on contacts for all
  using (current_role_is(array['admin', 'conseiller']::user_role[]));
create policy contacts_self on contacts for select using (profile_id = auth.uid());
create policy notes_staff on contact_notes for all
  using (current_role_is(array['admin', 'conseiller']::user_role[]));

-- Programme : lecture publique (pages offres), écriture admin
create policy programs_read on programs for select using (true);
create policy programs_admin on programs for all using (current_role_is(array['admin']::user_role[]));
create policy modules_read on modules for select using (auth.uid() is not null);
create policy modules_admin on modules for all using (current_role_is(array['admin']::user_role[]));
create policy lessons_read on lessons for select using (auth.uid() is not null);
create policy lessons_admin on lessons for all using (current_role_is(array['admin']::user_role[]));

-- Classes et séances : équipe + étudiants inscrits
create policy classes_staff on classes for all
  using (current_role_is(array['admin', 'conseiller']::user_role[]));
create policy classes_teacher on classes for select using (teacher_id = auth.uid());
create policy classes_student on classes for select using (exists (
  select 1 from enrollments e join contacts c on c.id = e.contact_id
  where e.class_id = classes.id and c.profile_id = auth.uid() and e.status in ('actif', 'termine')));

create policy sessions_staff on class_sessions for all
  using (current_role_is(array['admin', 'conseiller']::user_role[]));
create policy sessions_teacher on class_sessions for all using (exists (
  select 1 from classes k where k.id = class_sessions.class_id and k.teacher_id = auth.uid()));
create policy sessions_student on class_sessions for select using (exists (
  select 1 from enrollments e join contacts c on c.id = e.contact_id
  where e.class_id = class_sessions.class_id and c.profile_id = auth.uid() and e.status = 'actif'));

-- Inscriptions et paiements : équipe ; l'étudiant voit les siens et dépose son reçu
create policy enrollments_staff on enrollments for all
  using (current_role_is(array['admin', 'conseiller']::user_role[]));
create policy enrollments_student on enrollments for select using (exists (
  select 1 from contacts c where c.id = enrollments.contact_id and c.profile_id = auth.uid()));

create policy payments_staff on payments for all
  using (current_role_is(array['admin', 'conseiller']::user_role[]));
create policy payments_student_read on payments for select using (exists (
  select 1 from enrollments e join contacts c on c.id = e.contact_id
  where e.id = payments.enrollment_id and c.profile_id = auth.uid()));
create policy payments_student_insert on payments for insert with check (
  status = 'en_attente' and exists (
    select 1 from enrollments e join contacts c on c.id = e.contact_id
    where e.id = payments.enrollment_id and c.profile_id = auth.uid()));

-- Présence : le prof de la classe et l'équipe
create policy attendance_staff on attendance for all
  using (current_role_is(array['admin', 'conseiller']::user_role[]));
create policy attendance_teacher on attendance for all using (exists (
  select 1 from class_sessions s join classes k on k.id = s.class_id
  where s.id = attendance.session_id and k.teacher_id = auth.uid()));

-- Certificats : équipe ; l'étudiant voit le sien
create policy certificates_staff on certificates for all
  using (current_role_is(array['admin']::user_role[]));
create policy certificates_student on certificates for select using (exists (
  select 1 from enrollments e join contacts c on c.id = e.contact_id
  where e.id = certificates.enrollment_id and c.profile_id = auth.uid()));
