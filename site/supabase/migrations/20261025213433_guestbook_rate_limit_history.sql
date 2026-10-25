-- Message deletion must not reset the authenticated account's posting quota.
-- Store only the latest three posting times, separately from public message rows.
create table private.guestbook_rate_limits (
  user_id uuid primary key references auth.users(id) on delete cascade,
  posted_at timestamptz[] not null default '{}'::timestamptz[],
  constraint guestbook_rate_history_bound check (cardinality(posted_at) <= 3)
);
alter table private.guestbook_rate_limits enable row level security;
revoke all on private.guestbook_rate_limits from public, anon, authenticated;

-- Preserve the current window for accounts that already submitted messages.
insert into private.guestbook_rate_limits(user_id,posted_at)
select user_id,(array_agg(created_at order by created_at desc))[1:3]
from public.guestbook_messages
where created_at > now() - interval '10 minutes'
group by user_id;

create or replace function private.enforce_guestbook_limit()
returns trigger language plpgsql security definer set search_path = '' as $$
declare
  window_time timestamptz := clock_timestamp();
  recent_posts timestamptz[];
begin
  if (select auth.uid()) is null or new.user_id <> (select auth.uid()) then
    raise exception 'Authenticated author required.' using errcode = '42501';
  end if;
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(new.user_id::text,0));
  insert into private.guestbook_rate_limits(user_id) values(new.user_id) on conflict do nothing;
  select coalesce(array_agg(post_time), '{}'::timestamptz[]) into recent_posts
  from private.guestbook_rate_limits r, unnest(r.posted_at) as post_time
  where r.user_id=new.user_id and post_time > window_time - interval '10 minutes';
  if cardinality(recent_posts) >= 3 then
    raise exception 'Please wait before posting another message.' using errcode = 'P0001';
  end if;
  update private.guestbook_rate_limits set posted_at=array_append(recent_posts,window_time) where user_id=new.user_id;
  new.created_at := window_time;
  return new;
end;
$$;
-- Trigger execution only: no new callable public RPC or client table grants.
revoke all on function private.enforce_guestbook_limit() from public, anon, authenticated;
