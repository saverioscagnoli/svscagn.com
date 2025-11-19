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
          "backdrop-blur-[2px]",
          "overflow-y-auto overflow-x-hidden"
        )}
      >
        <div
          className={cn(
            "max-w-full w-full px-4 sm:px-6 sm:max-w-xl md:max-w-2xl lg:max-w-3xl",
            "pb-8",
            "rounded-lg p-6 sm:p-8"
          )}
        >
          <h1 className={cn("text-[32px] sm:text-[48px] wrap-break-words")}>
            Saverio Scagnoli
          </h1>
          <h2 className={cn("mt-4 sm:text-[32px] wrap-break-words")}>
            Fullstack developer, Open Source enthusiast, Computer lover
          </h2>
          <p className={cn("mt-7 wrap-break-words")}>
            I'm a {calculateAge(BIRTHDAY)} years old developer from Rome, Italy;
            passionate about systems' software.
          </p>
          <p className={cn("mt-7 wrap-break-words")}>
            I love doing system's programming, building developement tools,
            utility tools, but I also enjoy making user interfaces and desktop
            apps.
            <br />
            For backend, systems, etc, I love Go and Rust. <br />
            For frontend, I use React and TypeScript.
          </p>
          <p className={cn("mt-7 wrap-break-words")}>
            I'm currently pursuing a bachelor's degree in Computer Science at
            'La Sapienza' University of Rome.
          </p>
          <p className={cn("mt-7 wrap-break-words")}>
            Apart from nerd stuff, I enjoy other nerd stuff, such as movies,
            comics and photography. <br />
            Jazz is the only way!
          </p>
          <div
            className={cn(
              "w-full flex gap-4 sm:gap-16 justify-center items-center mt-8 text-left whitespace-pre",
              "text-[16px]"
            )}
          >
            <p>{TUX}</p>
            <p>{DEBIAN}</p>
          </div>
          <h2
            className={cn("mt-7 sm:text-[32px] text-center wrap-break-words")}
          >
            Projects
          </h2>

          <div
            className={cn(
              "w-full flex flex-col justify-between items-center",
              "mt-12"
            )}
          >
            <div className={cn("w-full flex justify-between items-center")}>
              <div className={cn("px-4")}>
                <a
                  href="https://github.com/saverioscagnoli/wwwidgets"
                  target="_blank"
                  className={cn("hover:underline")}
                >
                  <h3 className={cn("text-[24px] text-center")}>WWWidgets</h3>
                </a>
                <p className={cn("text-[16px]", "mt-4")}>
                  This is a widget framework for wayland compositor, built with
                  webview2gtk. All the power of the web on the desktop!
                </p>
              </div>
              <div className={cn("w-full flex justify-between items-center")}>
                <div className={cn("px-4")}>
                  <a
                    href="https://github.com/saverioscagnoli/pls"
                    target="_blank"
                    className={cn("hover:underline")}
                  >
                    <h3 className={cn("text-[24px] text-center")}>pls</h3>
                  </a>
                  <p className={cn("text-[16px]", "mt-4")}>
                    A modern version of ls, highly customizable, and various
                    file system utilities.
                  </p>
                </div>
              </div>
            </div>
            <div
              className={cn(
                "w-full flex justify-between items-center",
                "mt-12 pb-12"
              )}
            >
              <div className={cn("px-4")}>
                <a
                  href="https://github.com/saverioscagnoli/karna"
                  target="_blank"
                  className={cn("hover:underline")}
                >
                  <h3 className={cn("text-[24px] text-center")}>Karna</h3>
                </a>
                <p className={cn("text-[16px]", "mt-4")}>
                  2D and I hope soon to be 3D game engine based on wgpu
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { App };
