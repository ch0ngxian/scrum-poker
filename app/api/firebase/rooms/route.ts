import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { addDoc, collection, doc, getDoc, getFirestore } from "firebase/firestore";
import app from "@/lib/firebase";

const firestore = getFirestore(app);
const DEFAULT_ALLOWED_POINTS = [1, 2, 3, 5, 8, 13];

export async function POST(request: Request) {
  const id = cookies().get("u")?.value;
  if (!id) return NextResponse.json({ error: "User ID is required" }, { status: 500 });

  const userDocRef = doc(firestore, `users/${id}`);
  const user = await getDoc(userDocRef);
  if (!user.exists()) return NextResponse.json({ error: "Invalid user ID" }, { status: 500 });

  const roomDocRef = await addDoc(collection(firestore, "rooms"), {
    owner: userDocRef,
    allowed_points: DEFAULT_ALLOWED_POINTS,
    members: [userDocRef],
  });
  if (!roomDocRef) return NextResponse.json({ error: "Fail to create room" }, { status: 500 });

  return NextResponse.json({ id: roomDocRef.id });
}
