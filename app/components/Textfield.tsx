import { Ref, forwardRef } from 'react';

type ReactInputProps = React.ComponentProps<"input">;

type TextfieldProps = ReactInputProps & {
  label?: string
  className?: string,
}

export const Textfield = forwardRef(function Textfield({
  label,
  className = "",
  ...props
}: TextfieldProps, ref: Ref<HTMLInputElement>) {
  return (
    <div className={`my-3 flex flex-col ${className}`}>
      {label && <label className="ml-1 text-slate-400 text-sm">{label}</label>}
      <input className="bg-transparent p-2 mt-1 border border-slate-500 rounded-md" type="text" ref={ref} {...props}></input>
    </div>
  )
});