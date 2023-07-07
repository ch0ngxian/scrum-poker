"use client";

import { Room } from "@/lib/types";

type RoomParams = {
  params: {
    id: string;
  };
};

export default function Room({ params }: RoomParams) {
  return <div>Room</div>;
}
