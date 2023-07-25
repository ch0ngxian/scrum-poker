"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "./components/Button";
import { Textfield } from "./components/Textfield";
import { useRouter } from "next/navigation";
import { useUserContext } from "./user-provider";
import { Room } from "@/lib/types";
import Image from "next/image";
import background from "./images/background.svg";
import Spline from "@splinetool/react-spline";

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
      <div className="w-screen h-screen absolute">
        <Image className="object-cover w-screen md:h-screen overflow-hidden" src={background} alt="" />
      </div>
      <div className="flex w-full h-full glassmorphism">
        <div className="w-full flex flex-col justify-center items-center px-10 md:px-36">
          <div className="glassmorphism bg-black bg-opacity-20 w-full px-10 py-32 rounded-xl border border-white border-opacity-30 shadow">
            <h1 className="font-bold text-6xl">Scrum Poker</h1>

            <div className="my-10">
              <Textfield label="Name" value={name} onChange={(event) => setName(event.target.value)}></Textfield>
              <Button onClick={createRoom}>Create room</Button>
            </div>
          </div>
        </div>
        <div className="rounded-md w-full">
          <Spline scene="https://draft.spline.design/hSccR-9otCVi1lvG/scene.splinecode" />
        </div>
      </div>
    </main>
  );
}
