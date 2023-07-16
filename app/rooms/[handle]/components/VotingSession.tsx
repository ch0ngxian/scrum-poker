import { Room, Vote, VotingSession } from "@/lib/types";
import { useEffect, useState } from "react";

type ReactDivProps = React.ComponentProps<"div">;

type PointCardProps = ReactDivProps & {
  point: number;
  isSelected: boolean;
};

function PointCard({ point, isSelected, ...props }: PointCardProps) {
  return (
    <div
      className={`m-3 rounded-lg h-56 w-40 font-semibold text-4xl bg-[#20282E] hover:bg-[#2e3942] ${
        isSelected ? "border-[#2897FF] text-[#2897FF] border-4" : "border-[#3C454D] text-[#515e6a]"
      } flex justify-center items-center  cursor-pointer `}
      {...props}
    >
      {point}
    </div>
  );
}
export default function VotingSessionView({ session, allowPoints }: { session: VotingSession; allowPoints: number[] }) {
  const [selectedPoint, setSelectedPoint] = useState<number | null>();
  const vote = async (point: number) => {
    setSelectedPoint(point);

    await fetch(`/api/rooms/${session.room_id}/sessions/${session.id}/votes`, {
      method: "POST",
      body: JSON.stringify({ point: point }),
    });
  };

  useEffect(() => {
    const getSelectedPoint = async () => {
      const response = await fetch(`/api/rooms/${session.room_id}/sessions/${session.id}/votes`);
      const vote = (await response.json()) as Vote;
      if (!vote) return;

      setSelectedPoint(vote.point);
    };

    getSelectedPoint();
  }, [session]);

  return (
    <div className="flex justify-center flex-wrap m-5">
      {allowPoints.map((point, index) => (
        <PointCard key={index} point={point} isSelected={point == selectedPoint} onClick={() => vote(point)}></PointCard>
      ))}
    </div>
  );
}
