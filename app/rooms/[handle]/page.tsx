"use client";

import { Button } from "@/app/components/Button";
import { Textfield } from "@/app/components/Textfield";
import { useUserContext } from "@/app/user-provider";
import { Room, User } from "@/lib/types";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

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
    <div>
      {members.map((member) => (
        <div key={`${member.id}`}>{member.name}</div>
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
    if (!user) return;

    const response = await fetch(`/api/rooms/${room.handle}/join`, { method: "POST" });
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
    };

    getRoom();
  }, [params.handle, router]);

  if (!room) {
    return "Empty room";
  }

  const isOwner = room.owner.token == Cookies.get("u");

  return (
    <div>
      <div>{<MemberList members={room.members}></MemberList>}</div>
      <div>{isOwner ? <OwnerView></OwnerView> : <MemberView room={room}></MemberView>}</div>
    </div>
  );
}
