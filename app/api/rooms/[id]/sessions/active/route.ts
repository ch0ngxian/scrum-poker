import { NextResponse } from "next/server";
import { doc, getDoc, getFirestore, DocumentReference } from "firebase/firestore";
import app from "@/lib/firebase";

const firestore = getFirestore(app);

export async function GET(request: Request, context: { params: { id: string } }) {
  const roomDocRef = doc(firestore, `rooms/${context.params.id}`);
  const room = await getDoc(roomDocRef);
  if (!room.exists()) return NextResponse.json({ error: "Room not found" }, { status: 404 });

  const { active_voting_session } = room.data() as { active_voting_session: DocumentReference };

  const session = await getDoc(active_voting_session);
  return NextResponse.json({ id: session.id, ...session.data() });
}
