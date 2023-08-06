import { Button } from "@/app/components/Button";
import { Textfield } from "@/app/components/Textfield";
import { useUserContext } from "@/app/user-provider";
import { Room } from "@/lib/types";
import { useEffect, useState } from "react";

export default function JoinRoomView({ room, isJoined }: { room: Room; isJoined: boolean }) {
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [user, createUser] = useUserContext();

  useEffect(() => {
    setName(user?.name ?? "");
  }, [user]);

  async function joinRoom() {
    if (!name) return;

    setIsLoading(true);
    if (!user) await createUser({ name: name });

    await fetch(`/api/rooms/${room.id}/join`, { method: "POST" });
  }

  if (isJoined) {
    return <div>Waiting to start</div>;
  }

  return (
    <div className="absolute bottom-0 w-full z-10">
      <div className="flex justify-center m-10">
        <div className="p-5 rounded-md bg-[#111111] border border-[#333333] min-w-[20rem] w-1/2">
          <div className="text-center font-semibold">Join {`${room.owner.name}'s`} room</div>
          <div className="flex justify-between my-3">
            <Textfield className="w-full" label="Name" value={name} onChange={(event) => setName(event.target.value)}></Textfield>
          </div>

          <Button onClick={joinRoom} isLoading={isLoading}>
            {isLoading ? "Joining" : "Join room"}
          </Button>
        </div>
      </div>
    </div>
  );
}
