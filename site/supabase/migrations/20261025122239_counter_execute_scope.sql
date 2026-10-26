-- The server uses the anon publishable key plus a private write key.
-- Supabase default privileges must not leave a second role grant behind.
revoke execute on function public.site_visitor_total() from authenticated;
revoke execute on function public.record_site_visit(text,text) from authenticated;
