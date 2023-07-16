import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(request: Request, context: { params: { id: String } }) {
  const supabase = createRouteHandlerClient({ cookies });

  const { point } = await request.json();

  const token = cookies().get("u")?.value;
  if (!token) return NextResponse.json({ error: "User token is require" }, { status: 500 });

  const { data: user } = await supabase.from("users").select("id").eq("token", token).limit(1).single();
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 500 });

  const { data: votingSession } = await supabase.from("voting_sessions").select("id").eq("id", context.params.id).limit(1).single();
  if (!votingSession) return NextResponse.json({ error: "Voting session not found" }, { status: 500 });

  const { data: vote } = await supabase.from("votes").select("id").eq("voting_session_id", votingSession.id).eq("user_id", user.id).limit(1).single();

  console.log(vote);
  if (vote) {
    await supabase.from("votes").update({ point: point }).eq("id", vote.id);
  } else {
    await supabase.from("votes").insert({
      voting_session_id: votingSession.id,
      user_id: user.id,
      point: point,
    });
  }

  return NextResponse.json({ success: true });
}

export async function GET(request: Request, context: { params: { id: String } }) {
  const supabase = createRouteHandlerClient({ cookies });

  const token = cookies().get("u")?.value;
  if (!token) return NextResponse.json({ error: "User token is require" }, { status: 500 });

  const { data: user } = await supabase.from("users").select("id").eq("token", token).limit(1).single();
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 500 });

  const { data: votingSession } = await supabase.from("voting_sessions").select("id").eq("id", context.params.id).limit(1).single();
  if (!votingSession) return NextResponse.json({ error: "Voting session not found" }, { status: 500 });

  const { data: vote } = await supabase
    .from("votes")
    .select("id, point")
    .eq("voting_session_id", votingSession.id)
    .eq("user_id", user.id)
    .limit(1)
    .single();
  return NextResponse.json(vote);
}
