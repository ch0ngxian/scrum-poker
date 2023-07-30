import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { arrayUnion, doc, getDoc, getFirestore, updateDoc } from "firebase/firestore";
import app from "@/lib/firebase";

const firestore = getFirestore(app);

export async function POST(request: Request, context: { params: { id: String } }) {
  const id = cookies().get("u")?.value;
  if (!id) return NextResponse.json({ error: "User ID is required" }, { status: 500 });

  const userDocRef = doc(firestore, `users/${id}`);
  const user = await getDoc(userDocRef);
  if (!user.exists()) return NextResponse.json({ error: "Invalid user ID" }, { status: 500 });

  const roomDocRef = doc(firestore, `rooms/${context.params.id}`);
  const room = await getDoc(roomDocRef);
  if (!room.exists()) return NextResponse.json({ error: "Room not found" }, { status: 500 });

  await updateDoc(roomDocRef, {
    members: arrayUnion(userDocRef),
  });

  return NextResponse.json({ success: true });
}
