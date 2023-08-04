import { NextResponse } from "next/server";
import { doc, getDoc, getFirestore, updateDoc } from "firebase/firestore";
import app from "@/lib/firebase";
import { VotingSession } from "@/lib/types";

const firestore = getFirestore(app);

export async function POST(request: Request, context: { params: { id: string } }) {
  const sessionDocRef = doc(firestore, `voting_sessions/${context.params.id}`);
  const session = await getDoc(sessionDocRef);
  if (!session.exists()) return NextResponse.json({ error: "Session not found" }, { status: 404 });

  const { votes } = session.data() as VotingSession;
  if (!votes) return NextResponse.json({ error: "Votes not found" }, { status: 404 });

  const result = Object.values(votes).reduce((x: any, y: any) => ((x[y] = (x[y] || 0) + 1), x), {});
  await updateDoc(sessionDocRef, { result: result });

  return NextResponse.json({
    success: true,
  });
}
