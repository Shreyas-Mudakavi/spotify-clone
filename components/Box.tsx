import { twMerge } from "tailwind-merge";

interface BoxProps {
  children: React.ReactNode;
  className?: string; // this means it will be an optinal field
}

const Box: React.FC<BoxProps> = ({ children, className }) => {
  return (
    <div
      className={twMerge(`bg-neutral-900 rounded-lg h-fit w-full`, className)}
    >
      {/* this enables us to add excess css outside the component and it merges them */}
      {children}
    </div>
  );
};

export default Box;
