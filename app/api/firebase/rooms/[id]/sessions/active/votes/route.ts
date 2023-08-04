import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { DocumentReference, doc, getDoc, getFirestore, updateDoc } from "firebase/firestore";
import app from "@/lib/firebase";

const firestore = getFirestore(app);

export async function POST(request: Request, context: { params: { id: string } }) {
  const { point } = await request.json();
  const id = cookies().get("u")?.value;
  if (!id) return NextResponse.json({ error: "User ID is required" }, { status: 500 });

  const userDocRef = doc(firestore, `users/${id}`);
  const user = await getDoc(userDocRef);
  if (!user.exists()) return NextResponse.json({ error: "Invalid user ID" }, { status: 500 });

  const roomDocRef = doc(firestore, `rooms/${context.params.id}`);
  const room = await getDoc(roomDocRef);
  if (!room.exists()) return NextResponse.json({ error: "Room not found" }, { status: 500 });

  const { active_voting_session } = room.data();
  await updateDoc(active_voting_session, {
    ["votes." + userDocRef.id]: point,
  });

  return NextResponse.json({ success: true });
}

export async function GET(request: Request, context: { params: { id: string } }) {
  const id = cookies().get("u")?.value;
  if (!id) return NextResponse.json({ error: "User ID is required" }, { status: 500 });

  const roomDocRef = doc(firestore, `rooms/${context.params.id}`);
  const room = await getDoc(roomDocRef);
  if (!room.exists()) return NextResponse.json({ error: "Room not found" }, { status: 500 });

  const { active_voting_session } = room.data() as { active_voting_session: DocumentReference };
  const session = await getDoc(active_voting_session);
  if (!session.exists()) return NextResponse.json({ error: "Session not found" }, { status: 500 });

  const { votes } = session.data();

  return NextResponse.json(votes[id]);
}
