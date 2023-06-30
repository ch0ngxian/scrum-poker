
type ReactButtonProps = React.ComponentProps<"button">;

type ButtonProps = ReactButtonProps & {
  text: string,
  className?: string
}

export const Button = ({
  text,
  className = "",
  ...props
}: ButtonProps) => {
  return (
    <button className={`bg-white rounded-md w-full px-2 py-3 text-black ${className}`} {...props}>{text}</button>
  )
};