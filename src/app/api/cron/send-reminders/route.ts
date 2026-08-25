import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { sendReminderEmail } from "@/lib/resend";

// Reminder cadence. Vercel Cron (Hobby plan) fires this at most once/day, so
// checking "has it been >= N days" on every run is enough — no need for the
// cron schedule itself to match the cadence exactly.
const REMINDER_INTERVAL_DAYS = 3;
const MAX_REMINDERS = 5;

function daysSince(iso: string): number {
  return (Date.now() - new Date(iso).getTime()) / (1000 * 60 * 60 * 24);
}

function isAuthorized(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  return req.headers.get("authorization") === `Bearer ${secret}`;
}

/**
 * Runs on a schedule (see vercel.json). For every open assignment:
 *   1. If a passing completion now exists for that email, mark it complete
 *      and stop reminding.
 *   2. Otherwise, if enough time has passed since the last nudge (or since
 *      assignment, if never reminded) and the reminder cap hasn't been hit,
 *      send another reminder.
 */
async function runReminders() {
  const db = supabaseAdmin();

  const { data: openAssignments, error: assignmentsErr } = await db
    .from("assignments")
    .select("id, learner_name, learner_email, assigned_at, last_reminded_at, reminder_count")
    .is("completed_at", null);
  if (assignmentsErr) throw assignmentsErr;
  if (!openAssignments || openAssignments.length === 0) {
    return { checked: 0, completed: 0, reminded: 0, emailFailures: [] as string[] };
  }

  const { data: passedCompletions, error: completionsErr } = await db
    .from("completions")
    .select("learner_email")
    .eq("passed", true);
  if (completionsErr) throw completionsErr;
  const passedEmails = new Set((passedCompletions ?? []).map((c) => c.learner_email.toLowerCase()));

  let completed = 0;
  let reminded = 0;
  const emailFailures: string[] = [];

  for (const a of openAssignments) {
    if (passedEmails.has(a.learner_email.toLowerCase())) {
      const { error } = await db.from("assignments").update({ completed_at: new Date().toISOString() }).eq("id", a.id);
      if (!error) completed++;
      continue;
    }

    if (a.reminder_count >= MAX_REMINDERS) continue;
    const sinceLast = daysSince(a.last_reminded_at ?? a.assigned_at);
    if (sinceLast < REMINDER_INTERVAL_DAYS) continue;

    try {
      await sendReminderEmail(a.learner_email, a.learner_name);
      await db
        .from("assignments")
        .update({ last_reminded_at: new Date().toISOString(), reminder_count: a.reminder_count + 1 })
        .eq("id", a.id);
      reminded++;
    } catch (e) {
      console.error("[cron/send-reminders] email failed for", a.learner_email, e);
      emailFailures.push(a.learner_email);
    }
  }

  return { checked: openAssignments.length, completed, reminded, emailFailures };
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }
  try {
    const result = await runReminders();
    return NextResponse.json(result);
  } catch (e) {
    console.error("[cron/send-reminders] failed:", e);
    return NextResponse.json({ error: "Reminder run failed." }, { status: 500 });
  }
}
