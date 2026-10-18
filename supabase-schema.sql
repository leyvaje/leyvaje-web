-- Run this in your Supabase SQL Editor
-- https://supabase.com/dashboard → your project → SQL Editor

create table if not exists posts (
  id                 uuid primary key default gen_random_uuid(),
  created_at         timestamptz not null default now(),
  updated_at         timestamptz,
  type               text not null check (type in ('thought','photo','music','link')),
  content            text,
  media_url          text,
  discord_message_id text unique,
  source_event_id    text
);

alter table posts add column if not exists source_event_id text;
create unique index if not exists posts_source_event_id_idx on posts (source_event_id);

-- Index for fast ordered fetches
create index posts_created_at_idx on posts (created_at desc);

-- Allow public read (no auth needed for the website)
alter table posts enable row level security;

create policy "Public read" on posts
  for select using (true);

-- The bot and inbound-email function use the service role, which bypasses RLS.
drop policy if exists "Service insert" on posts;
drop policy if exists "Service update" on posts;
drop policy if exists "Service delete" on posts;

insert into storage.buckets (id, name, public)
values ('feed', 'feed', true)
on conflict (id) do update set public = excluded.public;
