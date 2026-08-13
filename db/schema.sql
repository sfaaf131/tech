-- Kondax.tech · PostgreSQL
-- Equivalente SQL del esquema Prisma (leads, postulaciones, proyectos).

create extension if not exists "pgcrypto";

create table if not exists "Lead" (
  id text primary key,
  name text not null,
  email text not null,
  company text not null,
  role text,
  need text not null,
  message text not null,
  seal text not null,
  "createdAt" timestamptz not null default now()
);

create table if not exists "Application" (
  id text primary key,
  name text not null,
  email text not null,
  company text not null,
  idea text not null,
  market text,
  traction text,
  seal text not null,
  "createdAt" timestamptz not null default now()
);

create table if not exists "Project" (
  id text primary key,
  name text not null,
  kind text not null,
  status text not null,
  summary text,
  "createdAt" timestamptz not null default now()
);

create table if not exists "Sprint" (
  id text primary key,
  name text not null,
  status text not null,
  deliverable text not null,
  hours integer,
  "projectId" text not null references "Project"(id) on delete cascade
);
