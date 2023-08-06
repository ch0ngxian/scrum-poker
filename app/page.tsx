"use client";

import { useEffect, useState } from "react";
import { Button } from "./components/Button";
import { Textfield } from "./components/Textfield";
import { useRouter } from "next/navigation";
import { useUserContext } from "./user-provider";
import { Room, User } from "@/lib/types";
import Image from "next/image";
import background from "./images/background.svg";
import logo from "./images/logo.png";
import Spline from "@splinetool/react-spline";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import app from "@/lib/firebase";
import Cookies from "js-cookie";

const firestore = getFirestore(app);

export default function Home() {
  const [name, setName] = useState<string>("");
  const [isIllustrationLoaded, setIsIllustrationLoaded] = useState<boolean>(false);
  const router = useRouter();
  const [user, createUser] = useUserContext();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const createRoom = async () => {
    if (!name) return;
    setIsLoading(true);

    if (!user) await createUser({ name: name });

    const response = await fetch("/api/rooms", {
      method: "POST",
    });
    const room = (await response.json()) as Room;
    if (!room) return;

    router.push(`/rooms/${room.id}`);
  };

  useEffect(() => {
    setName(user?.name ?? "");
  }, [user]);

  const onIllustrationLoaded = () => {
    setIsIllustrationLoaded(true);
  };
  return (
    <main className="h-screen w-screen">
      <div className="w-screen h-screen absolute">
        <Image className="object-cover w-screen md:h-screen overflow-hidden fade-in" src={background} alt="" />
      </div>
      <div className="flex w-full h-full glassmorphism">
        <div className="w-full flex flex-col justify-center items-center px-10 md:px-36">
          <div className="glassmorphism bg-[#111111] bg-opacity-20 w-full px-10 py-20 rounded-xl border border-[#d5d5d5] border-opacity-30 shadow">
            <Image className="h-16 w-16 mb-5" src={logo} alt="" />
            <h1 className="font-bold text-5xl">Scrum Poker</h1>

            <div className="my-10">
              <Textfield label="Name" value={name} onChange={(event) => setName(event.target.value)}></Textfield>
              <Button onClick={createRoom} isLoading={isLoading}>
                {isLoading ? "Creating room" : "Create room"}
              </Button>
            </div>
          </div>
        </div>
        <div className={`hidden md:block rounded-md w-full bg-transparent opacity-0 ${isIllustrationLoaded ? "fade-in" : ""}`}>
          <Spline onLoad={onIllustrationLoaded} scene="https://draft.spline.design/da7yHzCYeQv732d6/scene.splinecode" />
        </div>
      </div>
      <div className="absolute bottom-0 w-full z-10">
        <div className="flex justify-center m-3 text-white md:text-black text-sm opacity-40">
          built by
          <a className="ml-1 underline" href="https://www.chongxian.dev/" target="_blank">
            Chong Xian
          </a>
        </div>
      </div>
    </main>
  );
}
