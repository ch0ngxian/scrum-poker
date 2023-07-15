import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });

  const token = cookies().get("u")?.value;
  if (!token) return NextResponse.json({ error: "User token is require" }, { status: 500 });

  const { data: user } = await supabase.from("users").select("id").eq("token", token).limit(1).single();
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 500 });

  const { data: room, error } = await supabase
    .from("rooms")
    .insert({
      owner_id: user.id,
    })
    .select()
    .limit(1)
    .single();

  if (!room) return NextResponse.json({ error: error }, { status: 500 });

  return NextResponse.json(room);
}
