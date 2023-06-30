"use client";
import { api } from "@/app/lib/api";
import { useEffect, useState } from "react";

type RoomParams = {
  params: {
    id: string;
  };
};

type IRoom = {
  id: string;
  ownerId: string;
};

export default function Room({ params }: RoomParams) {
  const [room, setRoom] = useState<IRoom>();

  useEffect(() => {
    const getRoom = async () => {
      const [room, error] = await api.rooms.get(params.id);

      setRoom(room as IRoom);
    };

    getRoom();
  }, [params.id]);

  return (
    <div>
      {room && (
        <div>
          <h1>ID: {params.id}</h1>
          <h1>Owner ID: {room.ownerId}</h1>
        </div>
      )}
    </div>
  );
}
