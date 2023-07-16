"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "./components/Button";
import { Textfield } from "./components/Textfield";
import { useRouter } from "next/navigation";
import { useUserContext } from "./user-provider";
import { Room } from "@/lib/types";

export default function Home() {
  const [name, setName] = useState("");
  const router = useRouter();
  const [user, createUser] = useUserContext();

  const createRoom = async () => {
    if (!user) await createUser({ name: name });

    const response = await fetch("/api/rooms", {
      method: "POST",
    });
    const room = (await response.json()) as Room;
    if (!room) return;

    router.push(`/rooms/${room.handle}`);
  };

  useEffect(() => {
    setName(user?.name ?? "");
  }, [user]);

  return (
    <main className="h-screen w-screen">
      <div className="flex w-full h-full">
        <div className="w-2/3 flex flex-col justify-center m-14">
          <h1 className="font-black text-6xl">Estimate story point easily</h1>

          <div className="my-10">
            <Textfield label="Name" value={name} onChange={(event) => setName(event.target.value)}></Textfield>
            <Button onClick={createRoom}>Create room</Button>
          </div>
        </div>
        <div className="bg-[#333333] rounded-md w-full m-5"></div>
      </div>
    </main>
  );
}
