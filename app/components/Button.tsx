type ReactButtonProps = React.ComponentProps<"button">;

type ButtonProps = ReactButtonProps & {
  className?: string;
};

export const Button = ({ className = "", ...props }: ButtonProps) => {
  return (
    <button className={`bg-white rounded-md w-full px-2 py-3 text-black ${className}`} {...props}>
      {props.children}
    </button>
  );
};
