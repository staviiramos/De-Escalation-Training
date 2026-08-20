import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { scoreQuiz, PASSING_SCORE, QUESTIONS } from "@/lib/content";
import { FACILITATOR_COOKIE, verifyFacilitatorSessionToken } from "@/lib/facilitatorSession";

const MAX_NAME_LENGTH = 200;
const MAX_EMAIL_LENGTH = 320;

function normalizeAnswers(raw: unknown): Record<number, number> {
  const out: Record<number, number> = {};
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return out;
  for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
    const qi = Number(k);
    if (Number.isInteger(qi) && typeof v === "number" && Number.isInteger(v)) out[qi] = v;
  }
  return out;
}

/**
 * Records a completion attempt. The client sends the learner's name/email,
 * language, and raw pre-test + post-test answers, never scores — both
 * scores are computed here, server-side, from the same QUESTIONS content
 * the client renders, so a tampered client can't fabricate a passing
 * record. Every submitted attempt is recorded (pass or fail), matching the
 * original prototype's facilitator report, which lists every attempt with
 * a Passed / Not Passed result rather than only successful ones.
 */
export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { name, email, language, preAnswers, postAnswers, startedAt } = (body ?? {}) as {
    name?: unknown;
    email?: unknown;
    language?: unknown;
    preAnswers?: unknown;
    postAnswers?: unknown;
    startedAt?: unknown;
  };

  if (typeof name !== "string" || !name.trim()) {
    return NextResponse.json({ error: "Name is required." }, { status: 400 });
  }
  if (typeof email !== "string" || !email.trim()) {
    return NextResponse.json({ error: "Email is required." }, { status: 400 });
  }

  const lang = language === "es" ? "es" : "en";
  const normalizedPre = normalizeAnswers(preAnswers);
  const normalizedPost = normalizeAnswers(postAnswers);

  let durationSeconds: number | null = null;
  if (typeof startedAt === "string") {
    const startedMs = Date.parse(startedAt);
    if (Number.isFinite(startedMs)) {
      const seconds = Math.round((Date.now() - startedMs) / 1000);
      if (seconds >= 0 && seconds <= 24 * 60 * 60) durationSeconds = seconds;
    }
  }

  const pre = scoreQuiz(normalizedPre);
  const post = scoreQuiz(normalizedPost);
  const passed = post.scorePct >= PASSING_SCORE;

  const { error } = await supabaseAdmin()
    .from("completions")
    .insert({
      learner_name: name.trim().slice(0, MAX_NAME_LENGTH),
      learner_email: email.trim().slice(0, MAX_EMAIL_LENGTH),
      language: lang,
      pre_score: pre.correctCount,
      post_score: post.correctCount,
      passed,
      duration_seconds: durationSeconds,
    });
  if (error) {
    console.error("[completions] insert failed:", error);
    return NextResponse.json({ error: "Could not save completion." }, { status: 500 });
  }

  return NextResponse.json({
    preCorrectCount: pre.correctCount,
    preTotal: QUESTIONS.length,
    postCorrectCount: post.correctCount,
    postTotal: QUESTIONS.length,
    passed,
  });
}

export async function GET() {
  const jar = await cookies();
  const token = jar.get(FACILITATOR_COOKIE)?.value;
  if (!verifyFacilitatorSessionToken(token)) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin()
    .from("completions")
    .select("id, learner_name, learner_email, pre_score, post_score, passed, completed_at")
    .order("completed_at", { ascending: false });

  if (error) {
    console.error("[completions] list failed:", error);
    return NextResponse.json({ error: "Could not load completions." }, { status: 500 });
  }

  return NextResponse.json({
    completions: (data ?? []).map((c) => ({
      id: c.id,
      name: c.learner_name,
      email: c.learner_email,
      preScore: c.pre_score,
      postScore: c.post_score,
      passed: c.passed,
      completedAt: c.completed_at,
    })),
  });
}
