import { NextResponse } from "next/server";
import { getFirestore, getDoc, doc, addDoc, collection } from "firebase/firestore";
import app from "@/lib/firebase";
import { cookies } from "next/headers";

const firestore = getFirestore(app);

export async function GET(request: Request) {
  const id = cookies().get("u")?.value;

  const snapshot = await getDoc(doc(firestore, `users/${id}`));
  if (!snapshot.exists()) return NextResponse.json({ error: "Invalid user ID" }, { status: 422 });

  return NextResponse.json({ id: snapshot.id, ...snapshot.data() });
}

export async function POST(request: Request) {
  const { name } = await request.json();

  const docRef = await addDoc(collection(firestore, "users"), {
    name: name,
  });

  return NextResponse.json({ id: docRef.id });
}
