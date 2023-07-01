"use client";
import { Button } from "@/app/components/Button";
import { Textfield } from "@/app/components/Textfield";
import { api } from "@/app/lib/api";
import { IRoom } from "@/app/lib/api/rooms";
import { useUserContext } from "@/app/user-provider";
import Cookies from "js-cookie";
import { useEffect, useRef, useState } from "react";

type RoomParams = {
  params: {
    id: string;
  };
};

const OwnerView = () => {
  return (
    <div>
      <h1>Invite teamates</h1>
      <div>Share the link {window.location.href}</div>
    </div>
  );
};

const MemberView = ({ room }: { room: IRoom | null }) => {
  const nameRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useUserContext();

  const joinRoom = async () => {
    if (!room) return;
    if (!nameRef.current?.value) return;

    if (!user) {
      const [user, error] = await api.users.create({ name: nameRef.current.value });
      if (!user) return;

      setUser(user);
      Cookies.set("u", user.id, { expires: 7 });
    }

    if (!user) return;

    const [isSuccess, error] = await api.rooms.join(room.id, {
      member: user,
    });

    if (!isSuccess) return;
  };

  return (
    <div>
      <div className="my-10">
        <Textfield label="Name" value={user?.name} ref={nameRef}></Textfield>
        <Button text="Join room" onClick={joinRoom}></Button>
      </div>
    </div>
  );
};

export default function Room({ params }: RoomParams) {
  const [room, setRoom] = useState<IRoom | null>(null);
  const [user] = useUserContext();

  useEffect(() => {
    const getRoom = async () => {
      const [room, error] = await api.rooms.get(params.id);
      if (!room) return;

      setRoom(room);
    };

    getRoom();
  }, [params.id]);

  return <div>{room && user?.id == room.owner.id ? <OwnerView></OwnerView> : <MemberView room={room}></MemberView>}</div>;
}
