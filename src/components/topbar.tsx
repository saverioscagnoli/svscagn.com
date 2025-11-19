import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { useEffect, useState } from "react";

const CAT_FRAMES = ["(=①ω①=)", "(=①ω①=)∫"];

const Topbar: React.FC<React.ComponentProps<"div">> = ({
  className,
  ...props
}) => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame(prevFrame => (prevFrame + 1) % CAT_FRAMES.length);
    }, 400);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={cn(
        "w-full h-12",
        "flex items-center justify-between",
        "border-b border-b-[#313131]",
        "px-4 sm:px-12",
        "backdrop-blur-sm",
        className
      )}
      {...props}
    >
      <a></a>
      <p className={cn("select-none whitespace-pre")}>{CAT_FRAMES[frame]}</p>
      <div className={cn("flex gap-2 sm:gap-4")}>
        <a
          href="https://github.com/saverioscagnoli/svscagn.com"
          target="_blank"
        >
          <Button className="text-sm sm:text-base">Source</Button>
        </a>
      </div>
    </div>
  );
};

export { Topbar };
