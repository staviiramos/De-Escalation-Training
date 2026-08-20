-- Completion records for the CHCR De-Escalation training. Only ever
-- read/written by server-side API routes using the Supabase service role
-- key — RLS is enabled with no policies, so the anon/public key (if it
-- were ever exposed) grants zero access. The service role key bypasses
-- RLS entirely, which is what the API routes use.
--
-- Unlike a single-quiz training, this course has both a pre-test and a
-- post-test (10 questions each), so scores are stored as raw correct
-- counts out of 10 (matching how the facilitator report displays them,
-- e.g. "8/10") rather than as a percentage.

create table if not exists public.completions (
  id uuid primary key default gen_random_uuid(),
  learner_name text not null,
  learner_email text not null,
  language text not null default 'en' check (language in ('en', 'es')),
  pre_score integer not null check (pre_score >= 0 and pre_score <= 10),
  post_score integer not null check (post_score >= 0 and post_score <= 10),
  passed boolean not null,
  duration_seconds integer check (duration_seconds is null or duration_seconds >= 0),
  completed_at timestamptz not null default now()
);

create index if not exists completions_completed_at_idx
  on public.completions (completed_at desc);

alter table public.completions enable row level security;
-- No policies are defined on purpose: only the service role key (used
-- server-side only, never shipped to the browser) can read or write here.
