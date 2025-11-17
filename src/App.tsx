import { Canvas } from "@react-three/fiber";
import { calculateAge, cn } from "~/lib/utils";
import { Topbar } from "~/components/topbar";
import { PixelatedCRTEffect } from "~/components/crt-effect";
import { Space } from "~/components/space";

const BIRTHDAY = new Date("2002-10-29");
const TUX = `
         _nnnn_
        dGGGGMMb
       @p~qp~~qMb
       M|@||@) M|
       @,----.JM|
      JS^\\__/  qKL
     dZP        qKRb
    dZP          qKKb
   fZP            SMMb
   HZM            MMMM
   FqM            MMMM
 __| ".        |\\dS"qML
 |    \`.       | \`' \\Zq
_)      \\.___.,|     .'
\\____   )MMMMMP|   .'
     \`-'       \`--'
`;

const DEBIAN = `
        _,met$$$$$gg.
     ,g$$$$$$$$$$$$$$$P.
   ,g$$P""       """Y$$.".
  ,$$P'              \`$$$.
',$$P       ,ggs.     \`$$b:
\`d$$'     ,$P"'   .    $$$
 $$P      d$'     ,    $$P
 $$:      $$.   -    ,d$$'
 $$;      Y$b._   _,d$P'
 Y$$.    \`.\`"Y$$$$P"'
 \`$$b      "-.__
  \`Y$$b
   \`Y$$.
     \`$$b.
       \`Y$$b.
         \`"Y$b._
             \`\`\`\`"
`;

const App = () => {
  return (
    <div className={cn("w-screen h-screen", "relative")}>
      <Canvas
        className={cn("w-full h-full absolute inset-0 z-0 pointer-none")}
        camera={{ position: [0, 0, 5], fov: 75 }}
      >
        <color attach="background" args={["#000000"]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Space />
        <PixelatedCRTEffect pixelSize={4} />
      </Canvas>
      <Topbar className={cn("fixed top-0 z-20")} />
      <div
        className={cn(
          "w-full h-full absolute inset-0 z-10",
          "pt-24 pb-8",
          "flex justify-center",
          "backdrop-blur-xs",
          "overflow-y-auto overflow-x-hidden"
        )}
      >
        <div
          className={cn(
            "max-w-full w-full px-4 sm:px-6 sm:max-w-xl md:max-w-2xl lg:max-w-3xl",
            "pb-8",
            "bg-black/30 rounded-lg p-6 sm:p-8"
          )}
        >
          <h1 className={cn("text-[32px] sm:text-[48px] break-words")}>
            Saverio Scagnoli
          </h1>
          <h2 className={cn("mt-4 text-[20px] sm:text-[32px] break-words")}>
            Fullstack developer, Open Source enthusiast, Computer lover
          </h2>
          <p className={cn("mt-7 break-words")}>
            I'm a {calculateAge(BIRTHDAY)} years old developer from Rome, Italy;
            passionate about systems' software.
          </p>
          <p className={cn("mt-7 break-words")}>
            I love doing system's programming, building developement tools,
            utility tools, but I also enjoy making user interfaces and desktop
            apps.
            <br />
            For backend, systems, etc, I love Go and Rust. <br />
            For frontend, I use React and TypeScript.
          </p>
          <p className={cn("mt-7 break-words")}>
            I'm currently pursuing a bachelor's degree in Computer Science at
            'La Sapienza' University of Rome.
          </p>
          <p className={cn("mt-7 break-words")}>
            Apart from nerd stuff, I enjoy other nerd stuff, such as movies,
            comics and photography. <br />
            Jazz is the only way!
          </p>
          <span
            className={cn(
              "w-full flex gap-4 sm:gap-16 justify-center mt-8 text-left whitespace-pre",
              "hidden sm:flex",
              "overflow-x-auto"
            )}
          >
            <p>{TUX}</p>
            <p>{DEBIAN}</p>
          </span>
        </div>
      </div>
    </div>
  );
};

export { App };
