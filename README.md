# CHCR De-Escalation Training

Real implementation of the Claude Design prototype (`De-Escalation Training.dc.html`, see the
`design_handoff_deescalation_training/` bundle at the repo root) — a single-page interactive
training covering CHCR's de-escalation program: a scored 10-question pre-test, 21 lesson sections,
13 "Try It" branching scenarios, a drag-and-drop "Say This, Not That" practice game, a matching
post-test with pass/fail scoring, and a facilitator dashboard for viewing completion records
across everyone who's taken the course. Chrome, quizzes, scenarios, and the game are available in
English and Spanish; the long-form lesson prose is English-only (matching the prototype's final
state).

Stack: **Next.js (App Router, TypeScript) + Supabase (Postgres) + Vercel**, matching the pattern
used for CHCR's other training (`Workplace-Safety-Environment-of-Care-Training`). All lesson/quiz
copy is ported verbatim from the design file (`src/lib/content.ts`); layout, colors, and type are
recreated pixel-close using the CHCR brand tokens from the prototype's `<style>` block
(`src/app/globals.css`).

## What's real now (vs. the prototype)

1. **Persistent shared backend.** Completion records (learner name, email, pre/post scores,
   pass/fail) are written to a Supabase Postgres table (`supabase/schema.sql`) via a server-only
   API route (`src/app/api/completions/route.ts`), not `localStorage`. Both quiz scores are
   **computed server-side** from the submitted answers (`scoreQuiz` in `src/lib/content.ts`)
   rather than trusted from the client, so a tampered client can't fabricate a passing record.
   Every attempt is recorded, not just passing ones — matching the original prototype's
   facilitator report, which lists every attempt with a Passed / Not Passed result.
2. **Real hosting.** Ordinary Next.js app, deployable to Vercel.
3. **Real facilitator authentication.** The shared facilitator passcode is no longer compared in
   client JS. It's checked server-side against a bcrypt hash
   (`src/app/api/facilitator/login/route.ts`), and a successful login sets a signed, httpOnly,
   expiring session cookie (`src/lib/facilitatorSession.ts`) that gates the completions-list
   endpoint. The passcode itself is never sent to the browser.

The six section photos and the welcome hero image are the ones dropped into the prototype's image
slots (`public/photos/`); swap them for updated CHCR photos any time by replacing those files.

## Setup

### 1. Supabase

Create a project, then run `supabase/schema.sql` in the SQL editor (or via the CLI). It creates the
`completions` table with row-level security enabled and **no policies** — on purpose. Only the
service role key (server-only, see below) can read or write it; the anon/public key gets zero
access even if it were ever exposed.

### 2. Environment variables

Copy `.env.example` to `.env.local` (and set the same values in your Vercel project settings) and
fill in:

- `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` — from Supabase's Settings → API.
- `FACILITATOR_PASSWORD_HASH_B64` — a bcrypt hash of the facilitator passcode, **base64-encoded**.
  Generate it with:
  ```bash
  node -e "require('bcryptjs').hash(process.argv[1],10).then(h=>console.log(Buffer.from(h).toString('base64')))" "your-passcode-here"
  ```
  It's stored base64-encoded rather than as the raw hash because a raw bcrypt hash is full of
  literal `$` characters, and both Next.js's own `.env` loader and some hosting dashboards treat
  `$NAME` as variable-expansion syntax — pasting a raw hash in silently corrupts it. Base64
  sidesteps the whole class of problem.
- `SESSION_SECRET` — random string used to sign the facilitator session cookie. Generate with
  `openssl rand -base64 32`.

### 3. Run it

```bash
npm install
npm run dev
```

## Changing the facilitator passcode

Regenerate `FACILITATOR_PASSWORD_HASH_B64` with a new passcode using the command above, and update
it in your environment (redeploy on Vercel to pick it up). There's no in-app passcode-change flow —
this is a single shared credential, same as the original prototype's passcode gate; move to
individual facilitator accounts if that stops being sufficient.

## Deploying

Push to a Git repo and import it into Vercel, or run `vercel` from this directory. Set the same
three environment variables in the Vercel project settings (Production and Preview). No other
config needed — the API routes are ordinary Next.js route handlers.

## Project structure

- `src/lib/content.ts` — all lesson/scenario/quiz/game copy (English + Spanish), ported verbatim
  from the design file, plus the `STEPS` array that drives the lesson flow and `scoreQuiz`.
- `src/components/TrainingApp.tsx` — the state machine and all screens (welcome, About the
  Facilitator / About CHCR / References sub-pages, pre-test, lesson, "Try It" scenarios, the
  "Say This, Not That" game, post-test, results, facilitator login, facilitator dashboard).
- `src/components/LessonSections.tsx` — the 21 lesson section bodies.
- `src/app/api/completions/route.ts` — POST scores a submitted pre-test + post-test server-side
  and records the attempt; GET lists all attempts (facilitator-session gated).
- `src/app/api/facilitator/{login,logout}/route.ts` — facilitator session endpoints.
- `src/lib/facilitatorSession.ts` — signed session cookie helper.
- `src/lib/supabaseAdmin.ts` — server-only Supabase client (service role key).
- `supabase/schema.sql` — the `completions` table.
- `design_handoff_deescalation_training/` — the original Claude Design handoff bundle (chat
  transcripts + the `.dc.html` prototype) this app was built from.
