"use client";

import { useRef } from "react";
import { Button } from "./components/Button";
import { Textfield } from "./components/Textfield";
import { api } from "./lib/api";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useUserContext } from "./user-provider";

type IUser = {
  id: string;
  name: string;
};

export default function Home() {
  const router = useRouter();
  const nameRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useUserContext();

  const createRoom = async () => {
    if (!nameRef.current?.value) return;

    if (!user) {
      const [user, error] = await api.users.create({ name: nameRef.current.value });
      if (!user) return;

      setUser(user);
      Cookies.set("u", user.id, { expires: 7 });
    }

    if (!user) return;

    const [room, error] = await api.rooms.create({
      ownerId: user.id,
    });

    router.push(`/rooms/${room?.id}`);
  };

  return (
    <main className="h-screen w-screen">
      <div className="flex w-full h-full">
        <div className="w-2/3 flex flex-col justify-center m-14">
          <h1 className="font-black text-6xl">Estimate story point easily</h1>

          <div className="my-10">
            <Textfield label="Name" value={user?.name} ref={nameRef}></Textfield>
            <Button text="Create room" onClick={createRoom}></Button>
          </div>
        </div>
        <div className="bg-slate-700 rounded-md w-full m-5"></div>
      </div>
    </main>
  );
}
