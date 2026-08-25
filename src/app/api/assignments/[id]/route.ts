import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { requireFacilitator } from "@/lib/facilitatorAuth";

/** Removes an assignment — also stops any future reminders for it, since the cron only looks at rows that still exist. */
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireFacilitator())) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }

  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "Missing assignment id." }, { status: 400 });
  }

  const { error } = await supabaseAdmin().from("assignments").delete().eq("id", id);
  if (error) {
    console.error("[assignments] delete failed:", error);
    return NextResponse.json({ error: "Could not delete assignment." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
