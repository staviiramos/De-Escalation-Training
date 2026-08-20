import { NextResponse } from "next/server";
import { FACILITATOR_COOKIE } from "@/lib/facilitatorSession";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(FACILITATOR_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
