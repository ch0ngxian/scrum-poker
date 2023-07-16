import { Ref, forwardRef } from "react";

type ReactInputProps = React.ComponentProps<"input">;

type TextfieldProps = ReactInputProps & {
  label?: string;
  className?: string;
};

export const Textfield = forwardRef(function Textfield({ label, className = "", value = "", ...props }: TextfieldProps, ref: Ref<HTMLInputElement>) {
  return (
    <div className={`my-3 flex flex-col ${className}`}>
      {label && <label className="ml-1 text-[#888888] text-sm">{label}</label>}
      <input
        className="bg-transparent p-2 mt-1 border border-[#333333] rounded-md focus:outline outline-2 outline-offset-2 outline-[#2897FF]"
        type="text"
        ref={ref}
        value={value}
        {...props}
      ></input>
    </div>
  );
});
