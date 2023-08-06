import { User } from "@/lib/types";
import Image from "next/image";

function MemberCell({ member }: { member: User }) {
  return (
    <div className="text-center m-2">
      <div className="rounded-full m-3 flex justify-center items-center p-5 ring-4 ring-[#454545] bg-white font-semibold flex-wrap text-center">
        <Image width={60} height={60} src={`https://api.dicebear.com/6.x/identicon/png?seed=${member.name}`} alt={member.name} />
      </div>
      <div className="text-[#6B7280]">{member.name}</div>
    </div>
  );
}

export default function MemberList({ members }: { members: User[] }) {
  if (members.length <= 0) {
    return "Empty members";
  }

  return (
    <div className="flex flex-wrap justify-center items-center mt-10">
      {members.map((member, index) => (
        <MemberCell member={member} key={`${index}`}></MemberCell>
      ))}
    </div>
  );
}
