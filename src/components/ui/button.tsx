import type React from "react";
import { cn } from "~/lib/utils";

const Button: React.FC<React.ComponentProps<"button">> = ({
  className,
  ...props
}) => {
  return (
    <button
      className={cn(
        "px-2 py-1",
        "outline outline-white",
        "hover:bg-white hover:text-black",
        "leading-none",
        className
      )}
      {...props}
    />
  );
};

export { Button };
