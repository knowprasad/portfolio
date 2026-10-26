-- Only the owner, through the Supabase dashboard, can change moderation or pins.
-- Existing anonymous/authenticated insert/update privileges are not expanded.
alter table public.guestbook_messages add column pinned boolean not null default false;
grant select (pinned) on public.guestbook_messages to anon;
create index guestbook_pinned_created_idx
  on public.guestbook_messages (article_slug, pinned desc, created_at desc)
  where status = 'approved';
