"use client";

import { Button } from "@/app/components/Button";
import { Textfield } from "@/app/components/Textfield";
import { useUserContext } from "@/app/user-provider";
import supabase from "@/lib/supabase";
import { Room, User, VotingSession } from "@/lib/types";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import VotingCards from "./components/VotingCards";
import MemberList from "./components/MemberList";
import OwnerView from "./components/OwnerView";
import { Chart } from "react-google-charts";
import ChevronDown from "@/app/images/ChevronDown";
import Image from "next/image";

type RoomParams = {
  params: {
    id: string;
  };
};

function MemberView({ room }: { room: Room }) {
  const [name, setName] = useState("");
  const [user, createUser] = useUserContext();

  useEffect(() => {
    setName(user?.name ?? "");
  }, [user]);

  async function joinRoom() {
    if (!name) return;
    if (!user) await createUser({ name: name });

    await fetch(`/api/firebase/rooms/${room.id}/join`, { method: "POST" });
  }

  const isJoined = room.members.find((member) => member.id == user?.id) != null;

  if (isJoined) {
    return <div>Waiting to start</div>;
  }

  return (
    <div className="p-5 rounded-md bg-[#111111] border border-[#333333]">
      <div className="text-center font-semibold">Join {`${room.owner.name}'s`} room</div>
      <div className="flex justify-between my-3">
        <Textfield label="Name" value={name} onChange={(event) => setName(event.target.value)}></Textfield>
      </div>

      <Button onClick={joinRoom}>Join room</Button>
    </div>
  );
}

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

    getRoom();
  }, [params.id, router]);

  if (isLoading) return <LoadingSkeleton></LoadingSkeleton>;
  if (!room) return "Empty room";

  const isOwner = room.owner.id == Cookies.get("u");

  const revealResult = async (sessionId: number) => {
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
        <VotingCards session={votingSession} allowPoints={room.allowed_points}></VotingCards>
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
      {isOwner ? <OwnerView room={room}></OwnerView> : <MemberView room={room}></MemberView>}
    </div>
  );
}
