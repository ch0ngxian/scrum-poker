"use client";
import { Button } from "@/app/components/Button";
import { Textfield } from "@/app/components/Textfield";
import { api } from "@/app/lib/api";
import { IRoom } from "@/app/lib/api/rooms";
import { IUser } from "@/app/lib/api/users";
import firebase from "@/app/lib/firebase";
import { useUserContext } from "@/app/user-provider";
import { DocumentReference, doc, getDoc, getFirestore, onSnapshot } from "firebase/firestore";
import Cookies from "js-cookie";
import { useEffect, useRef, useState } from "react";

const firestore = getFirestore(firebase);

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

const MemberView = ({ room }: { room: IRoom }) => {
  const nameRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useUserContext();

  const joinRoom = async () => {
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

  const isInsideRoom = () => {
    if (!user) return false;

    return room.members.find((member) => {
      return member.user.id == user.id;
    })
      ? true
      : false;
  };

  return (
    <div>
      {!isInsideRoom() && (
        <div className="my-10">
          <Textfield label="Name" value={user?.name} ref={nameRef}></Textfield>
          <Button text="Join room" onClick={joinRoom}></Button>
        </div>
      )}
    </div>
  );
};

const MemberList = ({ room }: { room: IRoom }) => {
  return (
    <div className="flex">
      {room.members.map((member, index) => (
        <div key={index} className="rounded-full bg-slate-700 m-5 h-36 w-36 flex justify-center items-center text-center">
          {member.user.name}
        </div>
      ))}
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

      onSnapshot(doc(firestore, "rooms", room.id), async (document) => {
        const data = document.data();

        if (!data) return;
        const [owner] = await api.users.get(data.owner.id);

        const members = data.members.map(async ({ user, is_moderator }: { user: DocumentReference; is_moderator: boolean }) => {
          return {
            user: { id: user.id, ...(await getDoc(doc(firestore, `users/${user.id}`))).data() } as IUser,
            is_moderator: is_moderator,
          };
        });

        setRoom({
          id: document.id,
          owner: owner,
          members: await Promise.all(members),
        } as IRoom);
      });
    };

    getRoom();
  }, [params.id]);

  return (
    <div>
      {room && (
        <div>
          <MemberList room={room}></MemberList>
          {user?.id == room.owner.id ? <OwnerView></OwnerView> : <MemberView room={room}></MemberView>}
        </div>
      )}
    </div>
  );
}
