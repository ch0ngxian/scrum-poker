import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(request: Request, context: { params: { handle: String } }) {
  const supabase = createRouteHandlerClient({ cookies });

  const token = cookies().get("u")?.value;
  if (!token) return NextResponse.json({ error: "User token is require" }, { status: 500 });

  const { data: user } = await supabase.from("users").select("id").eq("token", token).limit(1).single();
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 500 });

  const { data: room } = await supabase.from("rooms").select("id").eq("handle", context.params.handle).limit(1).single();
  if (!room) return NextResponse.json({ error: "Room not found" }, { status: 500 });

  const { data: existingRoomUser } = await supabase.from("room_users").select().eq("room_id", room.id).eq("user_id", user.id).limit(1).single();
  if (existingRoomUser) return NextResponse.json({ error: "User already in the room" }, { status: 200 });

  await supabase
    .from("room_users")
    .upsert({
      room_id: room.id,
      user_id: user.id,
    })
    .select()
    .limit(1)
    .single();

  return NextResponse.json({ success: true });
}
