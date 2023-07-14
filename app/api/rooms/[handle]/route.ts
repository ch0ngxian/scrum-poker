import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function GET(request: Request, context: { params: { handle: String } }) {
  const supabase = createRouteHandlerClient({ cookies });

  const { data: room } = await supabase.from("rooms").select().eq("handle", context.params.handle).limit(1).single();
  if (!room) return NextResponse.json({ error: "Fail to retrieve room" }, { status: 500 });

  const { data: owner } = await supabase.from("users").select().eq("id", room.owner_id).limit(1).single();
  if (!owner) return NextResponse.json({ error: "Fail to retrieve owner" }, { status: 500 });

  const { data: members } = await supabase.from("room_users").select("users(*)").eq("room_id", room.id);
  if (!members) return NextResponse.json({ error: "Fail to retrieve members" }, { status: 500 });

  room.owner = owner;
  room.members = members;

  return NextResponse.json(room);
}
