-- Uruchom w Supabase SQL Editor (Dashboard → SQL Editor)
-- Tabela do przechowywania rotowanego refresh_token Allegro po stronie serwera

create table if not exists public.kv_store (
  key        text primary key,
  value      text not null,
  updated_at timestamptz not null default now()
);

-- Tylko service_role może czytać i pisać (anon/authenticated nie mają dostępu)
alter table public.kv_store enable row level security;

-- Brak polityk publicznych → tylko service_role (pomija RLS) ma dostęp
