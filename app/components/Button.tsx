import Loading from "../images/Loading";

type ReactButtonProps = React.ComponentProps<"button">;

type ButtonProps = ReactButtonProps & {
  isLoading?: boolean;
  className?: string;
};

export const Button = ({ className = "", isLoading = false, ...props }: ButtonProps) => {
  return (
    <button
      disabled={isLoading}
      className={`${
        isLoading ? "bg-[#1A1A1A] border border-[#333333] text-[#8F8F8F]" : "bg-white hover:bg-[#CCCCCC] border border-white  text-black "
      } transition flex justify-center items-center rounded-md w-full mt-3 px-2 py-3 ${className}`}
      {...props}
    >
      {isLoading && <Loading></Loading>}
      {props.children}
    </button>
  );
};
