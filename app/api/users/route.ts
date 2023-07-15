import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });

  const token = cookies().get("u")?.value;
  if (!token) return NextResponse.json({ error: "User token is require" }, { status: 500 });

  const { data: user, error } = await supabase.from("users").select().eq("token", token).limit(1).single();
  if (!user) return NextResponse.json({ error: error }, { status: 500 });

  return NextResponse.json(user);
}

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });

  const { name } = await request.json();
  const { data, error } = await supabase
    .from("users")
    .insert({
      name: name,
      token: crypto.randomUUID(),
    })
    .select();

  if (!data) return NextResponse.json({ error: "Fail to create user" }, { status: 500 });

  return NextResponse.json(data[0]);
}
