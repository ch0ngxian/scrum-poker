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
import { onSnapshot, getFirestore, doc } from "firebase/firestore";
import app from "@/lib/firebase";
import { useUserContext } from "@/app/user-provider";
import Chart from "react-google-charts";
import StopIcon from "@/app/images/StopIcon";
import CheckIcon from "@/app/images/CheckIcon";

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

function Avatar({ name }: { name: string }) {
  return (
    <div className="flex flex-col justify-center">
      <div className="rounded-full mx-3 mb-1 flex justify-center items-center h-10 w-10 flex-wrap relative overflow-hidden bg-[#EEEEFF] ring ring-[#333333]">
        <Image width={24} height={24} src={`https://api.dicebear.com/6.x/identicon/png?seed=${name}`} alt={name} />
      </div>
      {name}
    </div>
  );
}

export default function RoomView({ params }: RoomParams) {
  const router = useRouter();
  const [isReady, setIsReady] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [room, setRoom] = useState<Room | null>(null);
  const [votingSession, setVotingSession] = useState<VotingSession | null>(null);
  const [user, createUser] = useUserContext();

  useEffect(() => {
    const getRoom = async () => {
      const response = await fetch(`/api/rooms/${params.id}`);

      const room = (await response.json()) as Room;
      if (!room.id) return router.push("/");

      setRoom(room);
      setIsReady(false);
    };

    const getActiveVotingSession = async () => {
      const response = await fetch(`/api/rooms/${params.id}/sessions/active`);
      const session = (await response.json()) as VotingSession;
      if (!session.id) return;

      setVotingSession(session);
    };

    const listenRoomUpdate = () => {
      const roomRef = doc(firestore, "rooms", params.id);
      const unsubscribe = onSnapshot(roomRef, async (newDoc) => {
        getRoom();
        getActiveVotingSession();
      });
      return unsubscribe;
    };

    const unsubscribeListenRoomUpdate = listenRoomUpdate();

    return () => {
      unsubscribeListenRoomUpdate();
    };
  }, [params.id, router]);

  useEffect(() => {
    const listenVotingSession = () => {
      if (!room?.active_voting_session?.id) return () => {};
      const sessionRef = doc(firestore, "voting_sessions", room.active_voting_session.id);
      const unsubscribe = onSnapshot(sessionRef, async (newDoc) => {
        setIsLoading(false);
        setVotingSession({ id: newDoc.id, ...newDoc.data() } as VotingSession);
      });
      return unsubscribe;
    };
    const unsubscribeListenVotingSession = listenVotingSession();

    return () => {
      unsubscribeListenVotingSession();
    };
  }, [room?.active_voting_session?.id]);

  if (isReady) return <LoadingSkeleton></LoadingSkeleton>;
  if (!room) return "Empty room";

  const isOwner = room.owner.id == Cookies.get("u");

  const revealResult = async (sessionId: string) => {
    setIsLoading(true);
    await fetch(`/api/sessions/${sessionId}/reveal`, {
      method: "POST",
    });
  };

  const newSession = async () => {
    setIsLoading(true);
    await fetch(`/api/rooms/${room.id}/start`, {
      method: "POST",
    });
  };

  const isJoined = user ? room.members.find((member) => member.id == user.id) != null : false;

  if (user && isJoined && votingSession) {
    if (votingSession.result) {
      const header = ["Point", "Count"];
      const data = Object.entries(votingSession.result).map(([point, count]) => {
        return [point, count];
      });

      return (
        <div>
          {data.length > 0 ? (
            <Chart
              chartType="PieChart"
              data={[header, ...data]}
              options={{
                is3D: true,
                backgroundColor: "transparent",
                legend: "none",
                pieSliceText: "label",
                pieSliceTextStyle: {
                  fontName: "__Inter_0ec1f4",
                  fontSize: "20",
                },
                colors: ["#c256d6", "#7a79fe", "#5b97f2", "#64d39b", "#fac83b", "#ff9c48", "#fb7b4a"],
                tooltip: {
                  trigger: "none",
                },
              }}
              width={"100%"}
              height={"500px"}
            />
          ) : (
            <div className="h-96 flex justify-center items-center">No votes</div>
          )}
          <div className="absolute bottom-0 w-full">
            <div className="flex justify-center m-10">
              <div className="p-5 rounded-md bg-[#111111] border border-[#333333] min-w-[20rem] w-1/2">
                <div className="flex items-start rounded-lg bg-black p-3 overflow-scroll w-full">
                  {room.members.map((member, index) => {
                    const selectedPoint = votingSession.votes?.[member.id];
                    return (
                      <div
                        key={index}
                        className="flex flex-col justify-center items-center text-center text-xs text-gray-500 first-of-type:ml-auto last-of-type:mr-auto"
                      >
                        {selectedPoint === undefined ? (
                          <div className="h-10 w-8 flex justify-center items-center bg-transparent border border-dashed border-[#20282E] rounded-md font-semibold mb-3 text-[#525E6A] text-lg">
                            <StopIcon></StopIcon>
                          </div>
                        ) : (
                          <div className="h-10 w-8 flex justify-center items-center bg-[#20282E] rounded-md font-semibold mb-3 text-[#525E6A] text-lg">
                            {selectedPoint}
                          </div>
                        )}
                        <Avatar name={member.name} />
                      </div>
                    );
                  })}
                </div>
                {isOwner && (
                  <Button className="mt-5" onClick={newSession} isLoading={isLoading}>
                    {isLoading ? "Starting new session" : "Next"}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div>
        <VotingView session={votingSession} allowPoints={room.allowed_points}></VotingView>
        <div className="absolute bottom-0 w-full z-10">
          <div className="flex justify-center m-10">
            <div className="p-5 rounded-md bg-[#111111] border border-[#333333] min-w-[20rem] w-1/2">
              <div className="flex items-start rounded-lg bg-black p-3 overflow-scroll w-full">
                {room.members.map((member, index) => {
                  const isVoted = votingSession.votes && votingSession.votes[member.id] !== undefined ? true : false;
                  return (
                    <div
                      key={index}
                      className="flex flex-col justify-center items-center text-center text-xs text-gray-500 first-of-type:ml-auto last-of-type:mr-auto"
                    >
                      {isVoted ? (
                        <div className="h-10 w-8 flex justify-center items-center bg-[#20282E] rounded-md font-semibold mb-3 text-[#525E6A] text-lg">
                          <CheckIcon></CheckIcon>
                        </div>
                      ) : (
                        <div className="h-10 w-8 flex justify-center items-center bg-transparent border border-dashed border-[#20282E] rounded-md font-semibold mb-3 text-[#525E6A] text-lg">
                          ?
                        </div>
                      )}
                      <Avatar name={member.name} />
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
                  isLoading={isLoading}
                >
                  {isLoading ? "Getting result" : "Reveal"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="m-3">{<MemberList members={room.members}></MemberList>}</div>
      {isOwner ? <StartRoomView room={room}></StartRoomView> : <JoinRoomView room={room} isJoined={isJoined}></JoinRoomView>}
    </div>
  );
}
