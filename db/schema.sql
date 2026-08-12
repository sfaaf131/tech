-- Kondax.tech · PostgreSQL schema
-- Cifrado en reposo: AES-256 (disco / proveedor). Tránsito: TLS 1.3.
-- Los hashes de auditoría son SHA-256 encadenados.

create extension if not exists "pgcrypto";

create table if not exists identities (
  id uuid primary key default gen_random_uuid(),
  email text unique,
  name text,
  role text not null check (role in ('programador', 'fundador', 'inversor', 'corporativo')),
  validation text not null default 'pending'
    check (validation in ('pending', 'technical', 'commercial', 'both')),
  created_at timestamptz not null default now()
);

create table if not exists oauth_accounts (
  id uuid primary key default gen_random_uuid(),
  identity_id uuid not null references identities(id) on delete cascade,
  provider text not null check (provider in ('github', 'gitlab', 'linkedin')),
  provider_account_id text not null,
  unique (provider, provider_account_id)
);

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  kind text not null check (kind in ('incubacion', 'fabrica', 'enterprise', 'cocreacion')),
  status text not null default 'discovery',
  created_at timestamptz not null default now()
);

create table if not exists cells (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  focus text,
  hourly_rate_usd numeric(10, 2) not null
);

create table if not exists quotes (
  id uuid primary key default gen_random_uuid(),
  identity_id uuid references identities(id),
  payload jsonb not null,
  hours integer not null,
  low_usd integer not null,
  high_usd integer not null,
  seal_sha256 text not null,
  created_at timestamptz not null default now()
);

create table if not exists equity_grants (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  holder text not null,
  share numeric(6, 4) not null check (share > 0 and share <= 1)
);

create table if not exists audit_log (
  id uuid primary key default gen_random_uuid(),
  at timestamptz not null default now(),
  type text not null,
  payload jsonb not null,
  prev_hash text not null,
  hash text not null unique
);

create index if not exists audit_log_at_idx on audit_log (at);
