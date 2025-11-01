import { calcAge, cn } from "~/lib/utils";
import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Topbar } from "~/components/topbar";
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

const App = () => {
  return (
    <div className={cn("w-screen h-screen", "relative")}>
      <Canvas
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none"
        }}
        camera={{ position: [0, 0, 5], fov: 50 }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Suspense fallback={null}>
          <Space pixelSize={2} />
        </Suspense>
      </Canvas>

      <Topbar />
      <div className={cn("flex justify-center", "py-20", "relative z-1")}>
        <div
          className={cn(
            "max-w-full px-6 sm:max-w-xl md:max-w-2xl lg:max-w-3xl",
            "flex flex-col",
            "gap-5",
            "text-left"
          )}
        >
          <h1 className={cn("text-5xl font-bold")}>Saverio Scagnoli</h1>
          <p className={cn("text-xl")}>
            fullstack developer, free software enthusiast, computer lover.
          </p>
          <p className={cn("text-lg leading-relaxed")}>
            I'm a {calcAge(BIRTHDAY)}-year-old developer from Rome, Italy,
            passionate about building clean and efficient software.
          </p>
          <p className={cn("text-lg loading-relaxed")}>
            I love doing systems programming the most, but I also enjoy working
            on user interfaces. For backend stuff, I love working with Rust and
            Go, while for frontend development, I enjoy using React and
            TypeScript,
          </p>
          <p className={cn("text-lg leading-relaxed")}>
            Currently pursuing a Bachelor's degree in Computer Science at
            <strong> Sapienza University of Rome</strong>.
          </p>

          <div className={cn("mx-auto max-w-[48ch]")}>
            <pre className={cn("mt-8 font-mono text-left whitespace-pre")}>
              {TUX}
            </pre>
          </div>

          <h1 className={cn("text-4xl")}>Projects</h1>
          <p className={cn("text-lg loading-relaxed")}>Incredible projects</p>
        </div>
      </div>
    </div>
  );
};

export { App };
