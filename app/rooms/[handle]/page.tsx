"use client";

import { Button } from "@/app/components/Button";
import { Textfield } from "@/app/components/Textfield";
import { useUserContext } from "@/app/user-provider";
import supabase from "@/lib/supabase";
import { Room, User } from "@/lib/types";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type RoomParams = {
  params: {
    handle: string;
  };
};

function MemberList({ members }: { members: User[] }) {
  if (members.length <= 0) {
    return "Empty members";
  }

  return (
    <div className="flex">
      {members.map((member, index) => (
        <div className="rounded-full m-3 flex justify-center items-center h-20 w-20 bg-slate-500" key={`${index}`}>
          {member.name}
        </div>
      ))}
    </div>
  );
}

function OwnerView() {
  return (
    <div>
      <div>Share your room</div>
      {`${window.location.href}`}
    </div>
  );
}

function MemberView({ room }: { room: Room }) {
  const [name, setName] = useState("");
  const [user, createUser] = useUserContext();

  useEffect(() => {
    setName(user?.name ?? "");
  }, [user]);

  async function joinRoom() {
    if (!name) return;
    if (!user) await createUser({ name: name });

    await fetch(`/api/rooms/${room.handle}/join`, { method: "POST" });
  }

  const isJoined = room.members.find((member) => member.token == user?.token) != null;

  if (isJoined) {
    return <div>Joined</div>;
  }

  return (
    <div>
      <div>Join room</div>

      <div className="my-10">
        <Textfield label="Name" value={name} onChange={(event) => setName(event.target.value)}></Textfield>
        <Button text="Join room" onClick={joinRoom}></Button>
      </div>
    </div>
  );
}

export default function RoomView({ params }: RoomParams) {
  const router = useRouter();
  const [room, setRoom] = useState<Room | null>(null);

  useEffect(() => {
    const getRoom = async () => {
      const response = await fetch(`/api/rooms/${params.handle}`);

      const room = (await response.json()) as Room;
      if (!room.id) return router.push("/");

      setRoom(room);
      return room;
    };

    getRoom();

    if (!room) return;

    const channel = supabase
      .channel(`${room.handle}`)
      .on(
        "postgres_changes",
        {
          schema: "public",
          table: "room_users",
          filter: `room_id=eq.${room.id}`,
          event: "INSERT",
        },
        () => {
          getRoom();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [params.handle, router, room]);

  if (!room) {
    return "Empty room";
  }

  const isOwner = room.owner.token == Cookies.get("u");

  return (
    <div className="flex flex-col items-center">
      <div className="m-3">{<MemberList members={room.members}></MemberList>}</div>
      <div>{isOwner ? <OwnerView></OwnerView> : <MemberView room={room}></MemberView>}</div>
    </div>
  );
}
