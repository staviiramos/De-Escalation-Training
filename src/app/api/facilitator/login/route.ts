import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import {
  FACILITATOR_COOKIE,
  FACILITATOR_COOKIE_MAX_AGE_SECONDS,
  createFacilitatorSessionToken,
} from "@/lib/facilitatorSession";

export async function POST(req: NextRequest) {
  let password: unknown;
  try {
    const body = await req.json();
    password = body?.password;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (typeof password !== "string" || !password) {
    return NextResponse.json({ error: "Password is required." }, { status: 400 });
  }

  // Stored base64-encoded, not raw: a raw bcrypt hash is full of literal
  // "$" characters, and Next.js's .env loader (and some hosting dashboards)
  // treat "$NAME" as variable-expansion syntax, silently mangling it.
  const encodedHash = process.env.FACILITATOR_PASSWORD_HASH_B64;
  if (!encodedHash) {
    return NextResponse.json(
      { error: "Facilitator login is not configured on the server." },
      { status: 500 }
    );
  }
  const hash = Buffer.from(encodedHash, "base64").toString("utf8");

  const ok = await bcrypt.compare(password, hash);
  if (!ok) {
    return NextResponse.json({ error: "Incorrect passcode." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(FACILITATOR_COOKIE, createFacilitatorSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: FACILITATOR_COOKIE_MAX_AGE_SECONDS,
  });
  return res;
}
