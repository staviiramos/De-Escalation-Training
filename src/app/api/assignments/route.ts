import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { sendAssignmentEmail } from "@/lib/resend";
import { FACILITATOR_COOKIE, verifyFacilitatorSessionToken } from "@/lib/facilitatorSession";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_ENTRIES_PER_REQUEST = 200;

interface ParsedEntry {
  name: string | null;
  email: string;
}

/** Each line is either a bare email, or "Name, email@example.com". Blank lines ignored. */
function parseEntries(raw: string): { entries: ParsedEntry[]; invalidLines: string[] } {
  const entries: ParsedEntry[] = [];
  const invalidLines: string[] = [];
  const seen = new Set<string>();

  for (const rawLine of raw.split("\n")) {
    const line = rawLine.trim();
    if (!line) continue;

    let name: string | null = null;
    let email: string;
    const commaIdx = line.lastIndexOf(",");
    if (commaIdx !== -1) {
      name = line.slice(0, commaIdx).trim() || null;
      email = line.slice(commaIdx + 1).trim();
    } else {
      email = line;
    }
    email = email.toLowerCase();

    if (!EMAIL_RE.test(email)) {
      invalidLines.push(rawLine);
      continue;
    }
    if (seen.has(email)) continue;
    seen.add(email);
    entries.push({ name, email });
  }

  return { entries, invalidLines };
}

async function requireFacilitator(): Promise<boolean> {
  const jar = await cookies();
  const token = jar.get(FACILITATOR_COOKIE)?.value;
  return verifyFacilitatorSessionToken(token);
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

  const { text } = (body ?? {}) as { text?: unknown };
  if (typeof text !== "string" || !text.trim()) {
    return NextResponse.json({ error: "Provide at least one name/email." }, { status: 400 });
  }

  const { entries, invalidLines } = parseEntries(text);
  if (entries.length === 0) {
    return NextResponse.json({ error: "No valid email addresses found.", invalidLines }, { status: 400 });
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
    invalidLines,
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
