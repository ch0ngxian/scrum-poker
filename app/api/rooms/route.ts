import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });

  const { ownerId } = await request.json();
  const { data } = await supabase
    .from("rooms")
    .insert({
      owner_id: ownerId,
    })
    .select();

  return NextResponse.json(data);
}
