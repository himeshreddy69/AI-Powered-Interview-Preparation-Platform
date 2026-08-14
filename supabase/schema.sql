-- ===================================================================
-- AI-Powered Interview Preparation Platform — Supabase schema
-- ===================================================================
-- Run this once in: Supabase Dashboard > SQL Editor > New query > Run.
-- It is safe to re-run: every statement is idempotent.
--
-- IMPORTANT: users log in with Firebase, not Supabase Auth. So `user_id`
-- is a Firebase UID (a text string), NOT a uuid referencing auth.users.
-- Row level security matches it against `auth.jwt() ->> 'sub'`, which is
-- the `sub` claim of the Firebase ID token.
--
-- For that to work you MUST register Firebase as a Third-Party Auth
-- provider in your Supabase dashboard first. See SUPABASE_SETUP.md.
-- ===================================================================


-- -------------------------------------------------------------------
-- Helper: the Firebase UID of the caller, taken from the verified JWT.
-- Returns NULL for anonymous requests, which makes every policy below
-- fail closed.
-- -------------------------------------------------------------------
create or replace function public.firebase_uid()
returns text
language sql
stable
as $$
  select nullif(auth.jwt() ->> 'sub', '')
$$;


-- -------------------------------------------------------------------
-- profiles — one row per user
-- -------------------------------------------------------------------
create table if not exists public.profiles (
  user_id                 text primary key,
  name                    text        not null default '',
  email                   text        not null default '',
  photo_url               text,
  role                    text        not null default 'user',
  default_target_role     text        not null default 'Software Engineer',
  default_question_count  integer     not null default 5,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);


-- -------------------------------------------------------------------
-- resumes — one row per user (the latest uploaded resume)
-- -------------------------------------------------------------------
create table if not exists public.resumes (
  user_id           text primary key,
  file_name         text,
  file_path         text,          -- path inside the `resumes` storage bucket
  job_title         text,
  experience_level  text,
  skills            jsonb not null default '[]'::jsonb,
  summary           text,
  raw_text          text,
  updated_at        timestamptz not null default now()
);


-- -------------------------------------------------------------------
-- interview_results — many rows per user
-- -------------------------------------------------------------------
create table if not exists public.interview_results (
  id                     uuid primary key default gen_random_uuid(),
  user_id                text not null,
  category               text not null default '',
  role                   text not null default '',
  questions_count        integer not null default 0,
  overall_score          integer not null default 0,
  technical_score        integer not null default 0,
  communication_score    integer not null default 0,
  problem_solving_score  integer not null default 0,
  verdict                text not null default '',
  summary                text not null default '',
  strengths              jsonb not null default '[]'::jsonb,
  improvements           jsonb not null default '[]'::jsonb,
  question_feedback      jsonb not null default '[]'::jsonb,
  qna_list               jsonb not null default '[]'::jsonb,
  created_at             timestamptz not null default now()
);

-- The dashboard always reads "my results, newest first".
create index if not exists interview_results_user_created_idx
  on public.interview_results (user_id, created_at desc);


-- ===================================================================
-- Row level security
-- ===================================================================
-- Without these, anyone holding the publishable key (which ships in your
-- JavaScript bundle and is therefore public) could read every user's
-- resume and interview transcripts.
-- ===================================================================

alter table public.profiles           enable row level security;
alter table public.resumes            enable row level security;
alter table public.interview_results  enable row level security;

-- profiles
drop policy if exists "own profile: select" on public.profiles;
create policy "own profile: select" on public.profiles
  for select using (user_id = public.firebase_uid());

drop policy if exists "own profile: insert" on public.profiles;
create policy "own profile: insert" on public.profiles
  for insert with check (user_id = public.firebase_uid());

drop policy if exists "own profile: update" on public.profiles;
create policy "own profile: update" on public.profiles
  for update using (user_id = public.firebase_uid())
          with check (user_id = public.firebase_uid());

-- resumes
drop policy if exists "own resume: select" on public.resumes;
create policy "own resume: select" on public.resumes
  for select using (user_id = public.firebase_uid());

drop policy if exists "own resume: insert" on public.resumes;
create policy "own resume: insert" on public.resumes
  for insert with check (user_id = public.firebase_uid());

drop policy if exists "own resume: update" on public.resumes;
create policy "own resume: update" on public.resumes
  for update using (user_id = public.firebase_uid())
          with check (user_id = public.firebase_uid());

drop policy if exists "own resume: delete" on public.resumes;
create policy "own resume: delete" on public.resumes
  for delete using (user_id = public.firebase_uid());

-- interview_results
drop policy if exists "own results: select" on public.interview_results;
create policy "own results: select" on public.interview_results
  for select using (user_id = public.firebase_uid());

drop policy if exists "own results: insert" on public.interview_results;
create policy "own results: insert" on public.interview_results
  for insert with check (user_id = public.firebase_uid());

drop policy if exists "own results: delete" on public.interview_results;
create policy "own results: delete" on public.interview_results
  for delete using (user_id = public.firebase_uid());


-- ===================================================================
-- Storage buckets
-- ===================================================================
-- Files are stored under a folder named after the Firebase UID, e.g.
--   resumes/<firebase-uid>/1699999999.pdf
-- so the policies below can check the first path segment.
-- ===================================================================

insert into storage.buckets (id, name, public)
values ('resumes', 'resumes', false)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('profile-images', 'profile-images', true)
on conflict (id) do nothing;

-- resumes bucket: fully private, owner-only.
drop policy if exists "own resume files: select" on storage.objects;
create policy "own resume files: select" on storage.objects
  for select using (
    bucket_id = 'resumes'
    and (storage.foldername(name))[1] = public.firebase_uid()
  );

drop policy if exists "own resume files: insert" on storage.objects;
create policy "own resume files: insert" on storage.objects
  for insert with check (
    bucket_id = 'resumes'
    and (storage.foldername(name))[1] = public.firebase_uid()
  );

drop policy if exists "own resume files: delete" on storage.objects;
create policy "own resume files: delete" on storage.objects
  for delete using (
    bucket_id = 'resumes'
    and (storage.foldername(name))[1] = public.firebase_uid()
  );

-- profile-images bucket: public to read (so <img src> works), owner-only write.
drop policy if exists "profile images: public read" on storage.objects;
create policy "profile images: public read" on storage.objects
  for select using (bucket_id = 'profile-images');

drop policy if exists "own profile image: insert" on storage.objects;
create policy "own profile image: insert" on storage.objects
  for insert with check (
    bucket_id = 'profile-images'
    and (storage.foldername(name))[1] = public.firebase_uid()
  );

drop policy if exists "own profile image: update" on storage.objects;
create policy "own profile image: update" on storage.objects
  for update using (
    bucket_id = 'profile-images'
    and (storage.foldername(name))[1] = public.firebase_uid()
  );

drop policy if exists "own profile image: delete" on storage.objects;
create policy "own profile image: delete" on storage.objects
  for delete using (
    bucket_id = 'profile-images'
    and (storage.foldername(name))[1] = public.firebase_uid()
  );
