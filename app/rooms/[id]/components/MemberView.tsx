import { Button } from "@/app/components/Button";
import { Textfield } from "@/app/components/Textfield";
import { useUserContext } from "@/app/user-provider";
import { Room } from "@/lib/types";
import { useEffect, useState } from "react";

export default function MemberView({ room }: { room: Room }) {
  const [name, setName] = useState("");
  const [user, createUser] = useUserContext();

  useEffect(() => {
    setName(user?.name ?? "");
  }, [user]);

  async function joinRoom() {
    if (!name) return;
    if (!user) await createUser({ name: name });

    await fetch(`/api/firebase/rooms/${room.id}/join`, { method: "POST" });
  }

  const isJoined = room.members.find((member) => member.id == user?.id) != null;

  if (isJoined) {
    return <div>Waiting to start</div>;
  }

  return (
    <div className="p-5 rounded-md bg-[#111111] border border-[#333333]">
      <div className="text-center font-semibold">Join {`${room.owner.name}'s`} room</div>
      <div className="flex justify-between my-3">
        <Textfield label="Name" value={name} onChange={(event) => setName(event.target.value)}></Textfield>
      </div>

      <Button onClick={joinRoom}>Join room</Button>
    </div>
  );
}
