-- Run this in your Supabase SQL Editor
-- https://supabase.com/dashboard → your project → SQL Editor

create table if not exists posts (
  id                 uuid primary key default gen_random_uuid(),
  created_at         timestamptz not null default now(),
  updated_at         timestamptz,
  type               text not null check (type in ('thought','photo','music','link')),
  content            text,
  media_url          text,
  discord_message_id text unique
);

-- Index for fast ordered fetches
create index posts_created_at_idx on posts (created_at desc);

-- Allow public read (no auth needed for the website)
alter table posts enable row level security;

create policy "Public read" on posts
  for select using (true);

-- Only service role can insert/update/delete (the bot uses service key)
create policy "Service insert" on posts
  for insert with check (true);

create policy "Service update" on posts
  for update using (true);

create policy "Service delete" on posts
  for delete using (true);
