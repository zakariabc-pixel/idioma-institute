-- Formulaires publics (inscription, test de niveau) : création d'un prospect sans clé serveur.
create or replace function submit_lead(
  p_full_name text,
  p_email text default null,
  p_phone text default null,
  p_message text default null,
  p_language text default null,
  p_format text default null,
  p_test_level text default null,
  p_test_score int default null,
  p_source text default 'site'
) returns void
language plpgsql security definer set search_path = public as $$
begin
  if coalesce(trim(p_full_name), '') = '' or (coalesce(trim(p_email), '') = '' and coalesce(trim(p_phone), '') = '') then
    raise exception 'nom et (email ou téléphone) obligatoires';
  end if;
  insert into contacts (full_name, email, phone, message, language_interest, format_interest,
                        test_level, test_score, pipeline, source)
  values (
    left(trim(p_full_name), 200),
    nullif(left(trim(p_email), 200), ''),
    nullif(left(trim(p_phone), 40), ''),
    nullif(left(trim(p_message), 2000), ''),
    case when p_language in ('fr', 'en', 'es') then p_language::language_code end,
    case when p_format in ('groupe', 'individuel') then p_format::course_format end,
    case when p_test_level in ('A1', 'A2', 'B1', 'B2', 'C1', 'C2') then p_test_level::cefr_level end,
    case when p_test_score between 0 and 100 then p_test_score end,
    case when p_test_level in ('A1', 'A2', 'B1', 'B2', 'C1', 'C2') then 'test_niveau'::pipeline_step else 'nouveau'::pipeline_step end,
    coalesce(nullif(left(trim(p_source), 40), ''), 'site')
  );
end $$;
revoke execute on function submit_lead(text, text, text, text, text, text, text, int, text) from public;
grant execute on function submit_lead(text, text, text, text, text, text, text, int, text) to anon, authenticated;
