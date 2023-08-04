import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { doc, getDoc, getFirestore, updateDoc } from "firebase/firestore";
import app from "@/lib/firebase";

const firestore = getFirestore(app);

export async function POST(request: Request, context: { params: { id: string } }) {
  const { point } = await request.json();
  const id = cookies().get("u")?.value;
  if (!id) return NextResponse.json({ error: "User ID is required" }, { status: 422 });

  const userDocRef = doc(firestore, `users/${id}`);
  const user = await getDoc(userDocRef);
  if (!user.exists()) return NextResponse.json({ error: "Invalid user ID" }, { status: 422 });

  const roomDocRef = doc(firestore, `rooms/${context.params.id}`);
  const room = await getDoc(roomDocRef);
  if (!room.exists()) return NextResponse.json({ error: "Room not found" }, { status: 404 });

  const sessionDocRef = doc(firestore, `voting_sessions/${context.params.id}`);
  await updateDoc(sessionDocRef, {
    ["votes." + userDocRef.id]: point,
  });

  return NextResponse.json({ success: true });
}

export async function GET(request: Request, context: { params: { id: string } }) {
  const id = cookies().get("u")?.value;
  if (!id) return NextResponse.json({ error: "User ID is required" }, { status: 422 });

  const sessionDocRef = doc(firestore, `voting_sessions/${context.params.id}`);
  const session = await getDoc(sessionDocRef);
  if (!session.exists()) return NextResponse.json({ error: "Session not found" }, { status: 404 });

  const { votes } = session.data();
  return NextResponse.json({ point: votes[id] });
}
