create extension if not exists pgcrypto with schema extensions;
create table private.site_visitors (
  visitor_hash text primary key check (visitor_hash ~ '^[a-f0-9]{64}$'),
  first_seen timestamptz not null default now()
);
alter table private.site_visitors enable row level security;
create table private.visitor_config (
  singleton boolean primary key default true check (singleton),
  write_key_hash text not null
);
alter table private.visitor_config enable row level security;
insert into private.visitor_config (write_key_hash) values ('7dcf3dd0723a1586648b11fd4847b39c8c95b7e28a09f2190990eabda16f413d');
revoke all on private.site_visitors, private.visitor_config from public, anon, authenticated;
create function public.site_visitor_total() returns bigint language sql security definer set search_path='' as $$ select count(*) from private.site_visitors; $$;
revoke all on function public.site_visitor_total() from public;
grant execute on function public.site_visitor_total() to anon;
create function public.record_site_visit(visitor_hash text, write_key text) returns bigint language plpgsql security definer set search_path='' as $$
begin
  if not exists (select 1 from private.visitor_config where singleton and write_key_hash = pg_catalog.encode(extensions.digest(write_key,'sha256'),'hex')) then
    raise exception 'Visit recording is not authorized' using errcode='42501';
  end if;
  if visitor_hash !~ '^[a-f0-9]{64}$' then raise exception 'Invalid visit identifier' using errcode='22023'; end if;
  insert into private.site_visitors (visitor_hash) values (visitor_hash) on conflict do nothing;
  return (select count(*) from private.site_visitors);
end;
$$;
revoke all on function public.record_site_visit(text,text) from public;
grant execute on function public.record_site_visit(text,text) to anon;
