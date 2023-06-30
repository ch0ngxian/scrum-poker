"use client";
import { Button } from "@/app/components/Button";
import { Textfield } from "@/app/components/Textfield";
import { api } from "@/app/lib/api";
import Cookies from "js-cookie";
import { useEffect, useRef, useState } from "react";

type RoomParams = {
  params: {
    id: string;
  };
};

type IRoom = {
  id: string;
  ownerId: string;
};

type IUser = {
  id: string;
  name: string;
};

const OwnerView = () => {
  return (
    <div>
      <h1>Invite teamates</h1>
      <div>Share the link {window.location.href}</div>
    </div>
  );
};

const MemberView = (user: IUser) => {
  const nameRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <div className="my-10">
        <Textfield label="Name" value={user?.name} ref={nameRef}></Textfield>
        <Button text="Join room"></Button>
      </div>
    </div>
  );
};

export default function Room({ params }: RoomParams) {
  const [room, setRoom] = useState<IRoom>();
  const [user, setUser] = useState<IUser>();

  useEffect(() => {
    const getRoom = async () => {
      const [room, error] = await api.rooms.get(params.id);
      if (!room) return;

      setRoom(room as IRoom);
    };

    getRoom();
    getUser();
  }, [params.id]);

  const getUser = async () => {
    const id = Cookies.get("u");
    if (!id) return;

    const [user, error] = await api.users.get(id);
    if (!user) {
      Cookies.remove("u");
      return;
    }

    setUser(user);
    Cookies.set("u", user.id, { expires: 7 });

    return user;
  };

  return <div>{room && user?.id == room.ownerId ? <OwnerView></OwnerView> : <MemberView user={user}></MemberView>}</div>;
}
