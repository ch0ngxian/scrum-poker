
type ButtonProps = {
  text: string,
  className?: string
}

export const Button = ({
  text,
  className = ""
}: ButtonProps) => {
  return (
    <button className={`bg-white rounded-md w-full px-2 py-3 text-black ${className}`}>{text}</button>
  )
};