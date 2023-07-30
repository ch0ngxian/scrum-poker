import { NextResponse } from "next/server";
import app from "@/lib/firebase";
import { DocumentReference, DocumentSnapshot, doc, getDoc, getFirestore } from "firebase/firestore";
import { User } from "@supabase/supabase-js";

const firestore = getFirestore(app);

export async function GET(request: Request, context: { params: { id: string } }) {
  const roomDocRef = doc(firestore, `rooms/${context.params.id}`);
  const room = await getDoc(roomDocRef);
  if (!room.exists()) return NextResponse.json({ error: "Room not found" }, { status: 500 });

  const { members, owner } = room.data();
  const memberDocs = await Promise.all(members.map((member: DocumentReference) => getDoc(member)));

  return NextResponse.json({
    ...room.data(),
    id: room.id,
    members: memberDocs.map((memberDoc: DocumentSnapshot) => memberDoc.data()),
    owner: (await getDoc(owner)).data(),
  });
}
