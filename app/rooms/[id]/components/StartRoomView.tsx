import { Button } from "@/app/components/Button";
import { Room } from "@/lib/types";
import { useState } from "react";

export default function StartRoomView({ room }: { room: Room }) {
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const startRoom = async () => {
    setIsLoading(true);
    await fetch(`/api/rooms/${room.id}/start`, {
      method: "POST",
    });
  };

  const copyLink = (link: string) => {
    navigator.clipboard.writeText(link);
    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 5000);
  };

  return (
    <div className="absolute bottom-0 w-full z-10">
      <div className="flex justify-center m-10">
        <div className="p-5 rounded-md bg-[#111111] border border-[#333333] min-w-[20rem] w-1/2">
          <div className="text-center font-semibold">Share your room</div>
          <div className="flex justify-between my-3">
            <div className="rounded bg-black p-3 text-sm text-[#888888] w-full break-words">{`${window.location.href}`}</div>
            <button
              className="hidden lg:flex text-base w-24 ml-5 px-3 py-1 border border-[#333333] rounded-md justify-center items-center cursor-pointer"
              onClick={() => copyLink(window.location.href)}
            >
              {isCopied ? "Copied" : "Copy"}
            </button>
          </div>

          <Button className="mt-5 secondary lg:hidden" onClick={() => copyLink(window.location.href)}>
            {isCopied ? "Copied" : "Copy"}
          </Button>

          <Button className="mt-5" onClick={startRoom} isLoading={isLoading}>
            {isLoading ? "Starting" : "Start"}
          </Button>
        </div>
      </div>
    </div>
  );
}
