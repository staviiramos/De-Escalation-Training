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
    return NextResponse.json({ 
