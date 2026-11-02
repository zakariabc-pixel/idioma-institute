-- Le tout premier compte créé devient administrateur ; les suivants sont étudiants par défaut.
create or replace function on_auth_user_created() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into profiles (id, full_name, role)
    values (
      new.id,
      coalesce(new.raw_user_meta_data ->> 'full_name', ''),
      case when exists (select 1 from profiles) then 'etudiant'::user_role else 'admin'::user_role end
    );
  return new;
end $$;
revoke execute on function on_auth_user_created() from public, anon, authenticated;
