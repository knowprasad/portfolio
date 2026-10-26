-- Owner-selected public guestbook: authenticated submissions publish immediately.
-- Column grants still prevent visitors from setting status, pins or other identities.
alter table public.guestbook_messages alter column status set default 'approved';
drop policy own_pending_message on public.guestbook_messages;
create policy own_public_message on public.guestbook_messages
  for insert to authenticated
  with check (user_id = (select auth.uid()) and status = 'approved');
