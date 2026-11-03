-- Optional, manual cloud snapshots. Never modifies browser records or accounts.
-- Ten insert-only slots bound source storage to 30 MiB per account, including direct API writes.
create table public.gradient_study_backups (
  user_id uuid not null references auth.users(id) on delete cascade,
  slot smallint not null check (slot between 1 and 10),
  id uuid not null default gen_random_uuid() unique,
  created_at timestamptz not null default now(),
  source text not null check (octet_length(source) between 2 and 3145728),
  byte_length integer generated always as (octet_length(source)) stored,
  primary key (user_id,slot),
  check (coalesce(jsonb_typeof(source::jsonb) = 'object'
    and source::jsonb ->> 'format_version' = '1'
    and source::jsonb ->> 'storage_mode' = 'local', false))
);
alter table public.gradient_study_backups enable row level security;
revoke all on public.gradient_study_backups from public, anon, authenticated;
grant select, insert, delete on public.gradient_study_backups to authenticated;
create policy study_backups_read_own on public.gradient_study_backups
  for select to authenticated using ((select auth.uid()) = user_id);
create policy study_backups_insert_own on public.gradient_study_backups
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy study_backups_delete_own on public.gradient_study_backups
  for delete to authenticated using ((select auth.uid()) = user_id);
-- No UPDATE privilege/policy: existing snapshots are immutable.
create index study_backups_owner_created on public.gradient_study_backups (user_id,created_at desc);
