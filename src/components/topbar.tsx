import { cn } from "~/lib/utils";
import GithubIcon from "./github.svg?react";

const Topbar = () => {
  return (
    <div
      className={cn(
        "w-full h-9",
        "fixed top-0 right-0 left-0",
        "flex items-center justify-end",
        "px-8 pt-2"
      )}
    >
      <div className={cn("flex items-center gap-2")}>
        <button>Source</button>
        <GithubIcon className={cn("w-6 h-6")} fill="currentColor" />
      </div>
    </div>
  );
};

export { Topbar };
