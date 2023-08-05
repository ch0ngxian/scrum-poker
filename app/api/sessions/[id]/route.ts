import { NextResponse } from "next/server";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import app from "@/lib/firebase";

const firestore = getFirestore(app);

export async function GET(request: Request, context: { params: { id: string } }) {
  const sessionDocRef = doc(firestore, `voting_sessions/${context.params.id}`);
  const session = await getDoc(sessionDocRef);
  if (!session.exists()) return NextResponse.json({ error: "Session not found" }, { status: 404 });

  return NextResponse.json({ id: session.id, ...session.data() });
}
