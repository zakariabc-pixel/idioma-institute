-- Recommandations de sécurité Supabase (advisors)
alter function touch_updated_at() set search_path = public;
revoke execute on function on_auth_user_created() from public, anon, authenticated;
revoke execute on function on_payment_validated() from public, anon, authenticated;
