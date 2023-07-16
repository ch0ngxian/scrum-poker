import { Button } from "@/app/components/Button";
import { Room } from "@/lib/types";
import { useState } from "react";

export default function OwnerView({ room }: { room: Room }) {
  const [isCopied, setIsCopied] = useState(false);
  const startRoom = async () => {
    await fetch(`/api/rooms/${room.handle}/start`, {
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
    <div className="p-5 rounded-md bg-[#111111] border border-[#333333]">
      <div className="text-center font-semibold">Share your room</div>
      <div className="flex justify-between my-3">
        <div className="rounded bg-black p-3 text-sm text-[#888888]">{`${window.location.href}`}</div>
        <div
          className="ml-5 px-3 py-1 border border-[#333333] rounded-md flex justify-center items-center cursor-pointer"
          onClick={() => copyLink(window.location.href)}
        >
          {isCopied ? "Copied" : "Copy"}
        </div>
      </div>

      <Button className="mt-10" onClick={startRoom}>
        Start
      </Button>
    </div>
  );
}
