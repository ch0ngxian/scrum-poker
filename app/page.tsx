"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "./components/Button";
import { Textfield } from "./components/Textfield";
import { api } from "./lib/api";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function Home() {
  const router = useRouter();
  const nameRef = useRef<HTMLInputElement>(null);
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    const id = Cookies.get("u");

    if (!id) return;

    const [user, error] = await api.users.get(id);

    if (!user?.id) {
      Cookies.remove("u");
      return;
    }

    setUserId(user.id);
    Cookies.set("u", user.id, { expires: 7 });

    return user;
  };

  const createRoom = async () => {
    if (!nameRef.current?.value) return;

    if (!userId) {
      const [user, error] = await api.users.create({ name: nameRef.current.value });
      if (!user?.id) return;

      setUserId(user.id);
      Cookies.set("u", user.id, { expires: 7 });
    }

    if (!userId) return;

    const [room, error] = await api.rooms.create({
      ownerId: userId,
    });

    router.push(`/rooms/${room?.id}`);
  };

  return (
    <main className="h-screen w-screen">
      <div className="flex w-full h-full">
        <div className="w-2/3 flex flex-col justify-center m-14">
          <h1 className="font-black text-6xl">Estimate story point easily</h1>

          <div className="my-10">
            <Textfield label="Name" ref={nameRef}></Textfield>
            <Button text="Create room" onClick={createRoom}></Button>
          </div>
        </div>
        <div className="bg-slate-700 rounded-md w-full m-5"></div>
      </div>
    </main>
  );
}
