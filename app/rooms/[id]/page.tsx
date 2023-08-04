"use client";

import { Button } from "@/app/components/Button";
import { Room, User, VotingSession } from "@/lib/types";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import VotingView from "./components/VotingView";
import MemberList from "./components/MemberList";
import StartRoomView from "./components/StartRoomView";
import Image from "next/image";
import JoinRoomView from "./components/JoinRoomView";
import { collection, query, where, onSnapshot, getFirestore, doc } from "firebase/firestore";
import app from "@/lib/firebase";

const firestore = getFirestore(app);

type RoomParams = {
  params: {
    id: string;
  };
};

function LoadingSkeleton() {
  return (
    <div className="flex justify-center flex-wrap m-5">
      {[...Array(6)].map((_, index) => (
        <div key={index} className="m-3 rounded-lg h-56 w-40 font-semibold text-4xl bg-[#20282E] border-[#3C454D] skeleton-loading">
          <div className={`flex justify-center items-center h-full w-full text-[#515e6a]}`}></div>
        </div>
      ))}
    </div>
  );
}

export default function RoomView({ params }: RoomParams) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [room, setRoom] = useState<Room | null>(null);
  const [votingSession, setVotingSession] = useState<VotingSession | null>(null);

  useEffect(() => {
    const getRoom = async () => {
      const response = await fetch(`/api/firebase/rooms/${params.id}`);

      const room = (await response.json()) as Room;
      if (!room.id) return router.push("/");

      setRoom(room);
      setIsLoading(false);
      return room;
    };

    const listenVotingSessionStart = () => {
      const roomRef = doc(firestore, "rooms", params.id);

      const q = query(collection(firestore, "voting_sessions"), where("room", "==", roomRef));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            setVotingSession({ id: change.doc.id, ...change.doc.data() } as VotingSession);
          }
        });
      });
      return unsubscribe;
    };

    const listenMemberJoin = () => {
      const roomRef = doc(firestore, "rooms", params.id);
      const unsubscribe = onSnapshot(roomRef, async (newDoc) => {
        getRoom();
      });
      return unsubscribe;
    };

    getRoom();
    const unsubscribeListenVotingSessionStart = listenVotingSessionStart();
    const unsubscribeListenMemberJoin = listenMemberJoin();

    return () => {
      unsubscribeListenVotingSessionStart();
      unsubscribeListenMemberJoin();
    };
  }, [params.id, router]);

  if (isLoading) return <LoadingSkeleton></LoadingSkeleton>;
  if (!room) return "Empty room";

  const isOwner = room.owner.id == Cookies.get("u");

  const revealResult = async (sessionId: string) => {
    const response = await fetch(`/api/firebase/rooms/${room.id}/sessions/${sessionId}/reveal`, {
      method: "POST",
    });
  };

  if (votingSession) {
    if (votingSession.result) {
      return <div>Chart</div>;
    }

    return (
      <div>
        <VotingView session={votingSession} allowPoints={room.allowed_points}></VotingView>
        <div className="flex justify-center">
          <div className="p-5 rounded-md bg-[#111111] border border-[#333333] min-w-[20rem] w-1/2">
            <div className="flex items-start rounded-lg bg-black p-3 overflow-scroll w-full">
              {room.members.map((member, index) => {
                return (
                  <div
                    key={index}
                    className="flex flex-col justify-center text-center text-xs text-gray-500 first-of-type:ml-auto last-of-type:mr-auto"
                  >
                    <div className="rounded-full mx-3 mb-1 flex justify-center items-center h-10 w-10 flex-wrap relative overflow-hidden bg-[#EEEEFF] border border-[#333333]">
                      <Image width={24} height={24} src={`https://api.dicebear.com/6.x/identicon/png?seed=${member.name}`} alt={member.name} />
                    </div>
                    {member.name}
                  </div>
                );
              })}
            </div>
            {isOwner && (
              <Button
                className="mt-5"
                onClick={() => {
                  revealResult(votingSession.id);
                }}
              >
                Reveal
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="m-3">{<MemberList members={room.members}></MemberList>}</div>
      {isOwner ? <StartRoomView room={room}></StartRoomView> : <JoinRoomView room={room}></JoinRoomView>}
    </div>
  );
}
