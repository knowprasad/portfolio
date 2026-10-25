-- Share the existing moderation/rate-limit boundary with article discussions.
alter table public.guestbook_messages add column article_slug text
  check (article_slug is null or (char_length(article_slug) <= 100 and article_slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'));
grant select (article_slug) on public.guestbook_messages to anon;
grant insert (article_slug) on public.guestbook_messages to authenticated;
grant delete on public.guestbook_messages to authenticated;
create policy authors_delete_own_messages on public.guestbook_messages for delete to authenticated
  using (user_id = (select auth.uid()));
create index guestbook_article_public_idx on public.guestbook_messages (article_slug,created_at desc) where status = 'approved';
