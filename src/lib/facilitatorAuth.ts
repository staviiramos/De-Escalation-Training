import "server-only";
import { cookies } from "next/headers";
import { FACILITATOR_COOKIE, verifyFacilitatorSessionToken } from "@/lib/facilitatorSession";

/** Shared by every facilitator-gated API route. */
export async function requireFacilitator(): Promise<boolean> {
  const jar = await cookies();
  const token = jar.get(FACILITATOR_COOKIE)?.value;
  return verifyFacilitatorSessionToken(token);
}
