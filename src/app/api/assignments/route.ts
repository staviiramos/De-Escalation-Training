import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { sendAssignmentEmail } from "@/lib/resend";
import { requireFacilitator } from "@/lib/facilitatorAuth";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_ENTRIES_PER_REQUEST = 200;
const MAX_NAME_LENGTH = 200;
const MAX_EMAIL_LENGTH = 320;

interface RawEntry {
  name?: unknown;
  email?: unknown;
}

interface CleanEntry {
  name: string | null;
  email: string;
}

/** Never trust the client's parsing — re-validate every entry server-side regardless of what the form already checked. */
function cleanEntries(raw: unknown): { entries: CleanEntry[]; skipped: number } {
  if (!Array.isArray(raw)) return { entries: [], skipped: 0 };

  const entries: CleanEntry[] = [];
  const seen = new Set<string>();
  let skipped = 0;

  for (const item of raw as RawEntry[]) {
    const emailRaw = typeof item?.email === "string" ? item.email.trim().toLowerCase() : "";
    if (!EMAIL_RE.test(emailRaw)) {
      skipped++;
      continue;
    }
    const email = emailRaw.slice(0, MAX_EMAIL_LENGTH);
    if (seen.has(email)) continue;
    seen.add(email);

    const nameRaw = typeof item?.name === "string" ? item.name.trim() : "";
    entries.push({ name: nameRaw ? nameRaw.slice(0, MAX_NAME_LENGTH) : null, email });
  }

  return { entries, skipped };
}

/** Creates assignment records and emails each person their training link. */
export async function POST(req: NextRequest) {
  if (!(await requireFacilitator())) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { entries: rawEntries } = (body ?? {}) as { entries?: unknown };
  const { entries, skipped } = cleanEntries(rawEntries);

  if (entries.length === 0) {
    return NextResponse.json({ error: "No valid people to assign." }, { status: 400 });
  }
  if (entries.length > MAX_ENTRIES_PER_REQUEST) {
    return NextResponse.json({ error: `Assign at most ${MAX_ENTRIES_PER_REQUEST} people at a time.` }, { status: 400 });
  }

  const { data: inserted, error } = await supabaseAdmin()
    .from("assignments")
    .insert(entries.map((e) => ({ learner_name: e.name, learner_email: e.email })))
    .select("id, learner_name, learner_email");

  if (error) {
    console.error("[assignments] insert failed:", error);
    return NextResponse.json({ error: "Could not save assignments." }, { status: 500 });
  }

  const emailFailures: string[] = [];
  await Promise.all(
    (inserted ?? []).map(async (row) => {
      try {
        await sendAssignmentEmail(row.learner_email, row.learner_name);
      } catch (e) {
        console.error("[assignments] email failed for", row.learner_email, e);
        emailFailures.push(row.learner_email);
      }
    })
  );

  return NextResponse.json({
    assigned: inserted?.length ?? 0,
    skipped,
    emailFailures,
  });
}

export async function GET() {
  if (!(await requireFacilitator())) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin()
    .from("assignments")
    .select("id, learner_name, learner_email, assigned_at, last_reminded_at, reminder_count, completed_at")
    .order("assigned_at", { ascending: false });

  if (error) {
    console.error("[assignments] list failed:", error);
    return NextResponse.json({ error: "Could not load assignments." }, { status: 500 });
  }

  return NextResponse.json({
    assignments: (data ?? []).map((a) => ({
      id: a.id,
      name: a.learner_name,
      email: a.learner_email,
      assignedAt: a.assigned_at,
      lastRemindedAt: a.last_reminded_at,
      reminderCount: a.reminder_count,
      completedAt: a.completed_at,
    })),
  });
}
