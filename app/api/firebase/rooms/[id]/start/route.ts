import { NextResponse } from "next/server";
import { addDoc, collection, doc, getDoc, getFirestore, updateDoc } from "firebase/firestore";
import app from "@/lib/firebase";

const firestore = getFirestore(app);

export async function POST(request: Request, context: { params: { id: string } }) {
  const roomDocRef = doc(firestore, `rooms/${context.params.id}`);
  const room = await getDoc(roomDocRef);
  if (!room.exists()) return NextResponse.json({ error: "Room not found" }, { status: 500 });

  const sessionDocRef = await addDoc(collection(firestore, "voting_sessions"), {
    room: roomDocRef,
  });

  await updateDoc(roomDocRef, {
    active_voting_session: sessionDocRef,
  });

  return NextResponse.json({ success: true });
}
