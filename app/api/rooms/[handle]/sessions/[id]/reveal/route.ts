import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(request: Request, context: { params: { handle: string; id: number } }) {
  const supabase = createRouteHandlerClient({ cookies });

  const { data: room } = await supabase.from("rooms").select().eq("handle", context.params.handle).limit(1).single();
  if (!room) return NextResponse.json({ error: "Fail to retrieve room" }, { status: 500 });

  const { data: votingSession } = await supabase
    .from("voting_sessions")
    .select()
    .eq("room_id", room.id)
    .eq("id", context.params.id)
    .limit(1)
    .single();
  if (!votingSession) return NextResponse.json({ error: "Fail to retrieve voting session" }, { status: 500 });

  const { data: votes } = await supabase.from("votes").select("user_id, point").eq("voting_session_id", votingSession.id);

  return NextResponse.json({
    average_point: votes ? votes.map((vote) => vote.point).reduce((x, y) => x + y) : null,
    votes: votes,
  });
}
