import { Room } from "@/lib/types";
import { useState } from "react";

export default function VotingSessionView({ room }: { room: Room }) {
  const [selectedPoint, setSelectedPoint] = useState<number | null>();
  const vote = (point: number) => {
    setSelectedPoint(point);
  };

  return (
    <div className="flex justify-center">
      {room.allowed_points.map((point, index) => (
        <div
          className={`m-3 rounded h-28 w-20 ${
            selectedPoint == point ? "bg-slate-700" : "bg-slate-500"
          } flex justify-center items-center hover:bg-slate-400 cursor-pointer `}
          key={index}
          onClick={() => vote(point)}
        >
          {point}
        </div>
      ))}
    </div>
  );
}
