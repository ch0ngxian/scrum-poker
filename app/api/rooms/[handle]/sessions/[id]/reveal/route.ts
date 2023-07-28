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

  let { data: votes } = await supabase.from("votes").select("user_id, point").eq("voting_session_id", votingSession.id);
  if (!votes) votes = [];

  const counts: { [key: number]: number } = {};

  votes.forEach((vote) => {
    const point = vote.point as number;
    counts[point] = (counts[point] || 0) + 1;
  });

  const result = Object.entries(counts).map(([point, count]) => ({ point: parseInt(point), count }));

  const { error } = await supabase
    .from("voting_sessions")
    .update({
      result: result,
    })
    .eq("id", votingSession.id);
  if (error) return NextResponse.json({ error: "Fail to save result" }, { status: 500 });

  return NextResponse.json({
    success: true,
  });
}
