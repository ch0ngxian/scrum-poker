import { VotingSession } from "@/lib/types";
import { useEffect, useState } from "react";

type ReactDivProps = React.ComponentProps<"div">;

type PointCardProps = ReactDivProps & {
  point: number;
  isSelected: boolean;
};

type VotingViewProps = ReactDivProps & {
  session: VotingSession;
  allowPoints: number[];
  className?: string;
};

function PointCard({ point, isSelected, ...props }: PointCardProps) {
  return (
    <div className="glow-rainbow hover:scale-105 transition">
      <div
        className={`m-3 rounded-lg h-44 w-32 sm:h-56 sm:w-40 font-semibold text-4xl bg-[#20282E] ${
          isSelected ? "border-rainbow" : "border-[#3C454D]"
        } cursor-pointer `}
        {...props}
      >
        <div className={`flex justify-center items-center h-full w-full ${isSelected ? "text-rainbow" : "text-[#515e6a]"}`}>{point}</div>
      </div>
    </div>
  );
}

export default function VotingView({ session, allowPoints, className = "" }: VotingViewProps) {
  const [selectedPoint, setSelectedPoint] = useState<number | null>();
  const vote = async (point: number) => {
    setSelectedPoint(point);

    await fetch(`/api/sessions/${session.id}/votes`, {
      method: "POST",
      body: JSON.stringify({ point: point }),
    });
  };

  useEffect(() => {
    const getSelectedPoint = async () => {
      const response = await fetch(`/api/sessions/${session.id}/votes`);
      const vote = await response.json();
      if (!vote) return;

      setSelectedPoint(vote.point);
    };

    getSelectedPoint();
  }, [session.id]);

  return (
    <div className={`${className} flex justify-center flex-wrap m-5 xl:mt-20`}>
      {allowPoints.map((point, index) => (
        <PointCard key={index} point={point} isSelected={point == selectedPoint} onClick={() => vote(point)}></PointCard>
      ))}
    </div>
  );
}
