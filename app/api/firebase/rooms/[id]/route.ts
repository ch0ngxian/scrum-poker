import { NextResponse } from "next/server";
import app from "@/lib/firebase";
import { DocumentReference, DocumentSnapshot, doc, getDoc, getFirestore } from "firebase/firestore";

const firestore = getFirestore(app);

export async function GET(request: Request, context: { params: { id: string } }) {
  const roomDocRef = doc(firestore, `rooms/${context.params.id}`);
  const room = await getDoc(roomDocRef);
  if (!room.exists()) return NextResponse.json({ error: "Room not found" }, { status: 500 });

  const { members, owner } = room.data();
  const memberDocs = await Promise.all(members.map((member: DocumentReference) => getDoc(member)));
  const ownerDoc = await getDoc(owner);

  return NextResponse.json({
    ...room.data(),
    id: room.id,
    members: memberDocs.map((memberDoc: DocumentSnapshot) => {
      return { id: memberDoc.id, ...(memberDoc.data() as { name: string }) };
    }),
    owner: {
      id: ownerDoc.id,
      ...(ownerDoc.data() as { name: string }),
    },
  });
}
