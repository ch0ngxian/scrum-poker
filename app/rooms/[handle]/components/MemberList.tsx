import { User } from "@/lib/types";

function MemberCell({ member }: { member: User }) {
  return <div className="rounded-full m-3 flex justify-center items-center h-20 w-20 bg-[#20282E] font-semibold flex-wrap">{member.name}</div>;
}

export default function MemberList({ members }: { members: User[] }) {
  if (members.length <= 0) {
    return "Empty members";
  }

  return (
    <div className="flex">
      {members.map((member, index) => (
        <MemberCell member={member} key={`${index}`}></MemberCell>
      ))}
    </div>
  );
}
