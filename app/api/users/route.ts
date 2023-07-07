import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });

  const token = cookies().get("u")?.value;
  if (!token) return NextResponse.error();

  const { data, error } = await supabase.from("users").select().eq("token", token);

  if (!data) return NextResponse.error();

  return NextResponse.json(data[0]);
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

  if (!data) return NextResponse.error();

  return NextResponse.json(data[0]);
}
