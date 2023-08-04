import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(request: Request, context: { params: { handle: string } }) {
  const supabase = createRouteHandlerClient({ cookies });

  const token = cookies().get("u")?.value;
  if (!token) return NextResponse.json({ error: "User token is require" }, { status: 500 });

  const { data: owner } = await supabase.from("users").select("id").eq("token", token).limit(1).single();
  if (!owner) return NextResponse.json({ error: "User not found" }, { status: 500 });

  const { data: room } = await supabase.from("rooms").select("id, owner_id").eq("handle", context.params.handle).limit(1).single();
  if (!room) return NextResponse.json({ error: "Room not found" }, { status: 500 });

  if (owner.id !== room.owner_id) return NextResponse.json({ error: "Only owner can start planning" }, { status: 500 });

  const { data: votingSession } = await supabase
    .from("voting_sessions")
    .upsert({
      room_id: room.id,
    })
    .select()
    .limit(1)
    .single();
  if (!votingSession) return NextResponse.json({ error: "Fail to start a voting session" }, { status: 500 });

  const { error } = await supabase.from("rooms").update({ active_voting_session_id: votingSession.id }).eq("id", room.id);

  return NextResponse.json({ success: true });
}
