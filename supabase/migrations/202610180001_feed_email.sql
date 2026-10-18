alter table public.posts add column if not exists source_event_id text;
create unique index if not exists posts_source_event_id_idx on public.posts (source_event_id);

drop policy if exists "Service insert" on public.posts;
drop policy if exists "Service update" on public.posts;
drop policy if exists "Service delete" on public.posts;

insert into storage.buckets (id, name, public)
values ('feed', 'feed', true)
on conflict (id) do update set public = excluded.public;
