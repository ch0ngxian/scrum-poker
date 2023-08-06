import Image from "next/image";

export default function Avatar({ name }: { name: string }) {
  return (
    <div className="flex flex-col justify-center">
      <div className="rounded-full mx-3 mb-1 flex justify-center items-center h-10 w-10 flex-wrap relative overflow-hidden bg-[#EEEEFF] ring ring-[#454545]">
        <Image width={24} height={24} src={`https://api.dicebear.com/6.x/identicon/png?seed=${name}`} alt={name} />
      </div>
      {name}
    </div>
  );
}
