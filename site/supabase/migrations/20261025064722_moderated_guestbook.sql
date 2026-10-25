create schema if not exists private;
create table public.guestbook_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  display_name text not null check (char_length(btrim(display_name)) between 1 and 80),
  message text not null check (char_length(btrim(message)) between 1 and 1200),
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  created_at timestamptz not null default now()
);
alter table public.guestbook_messages enable row level security;
create index guestbook_public_created_idx on public.guestbook_messages (created_at desc) where status = 'approved';
create index guestbook_user_created_idx on public.guestbook_messages (user_id, created_at desc);
revoke all on public.guestbook_messages from anon, authenticated;
grant select (id,display_name,message,created_at) on public.guestbook_messages to anon;
grant select on public.guestbook_messages to authenticated;
grant insert (user_id,display_name,message) on public.guestbook_messages to authenticated;
create policy public_approved_messages on public.guestbook_messages for select to anon using (status = 'approved');
create policy authenticated_visible_messages on public.guestbook_messages for select to authenticated using (status = 'approved' or user_id = (select auth.uid()));
create policy own_pending_message on public.guestbook_messages for insert to authenticated with check (user_id = (select auth.uid()) and status = 'pending');
create function private.enforce_guestbook_limit() returns trigger language plpgsql security invoker set search_path = '' as $$
begin
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(new.user_id::text, 0));
  if (select count(*) from public.guestbook_messages where user_id = new.user_id and created_at > now() - interval '10 minutes') >= 3 then
    raise exception 'Please wait before posting another message.' using errcode = 'P0001';
  end if;
  new.created_at := now();
  return new;
end;
$$;
revoke all on function private.enforce_guestbook_limit() from public, anon, authenticated;
create trigger guestbook_rate_limit before insert on public.guestbook_messages for each row execute function private.enforce_guestbook_limit();
