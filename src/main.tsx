/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

import { createRoot } from "react-dom/client";
import { App } from "~/App";

import "~/index.css";

createRoot(document.getElementById("root")!).render(<App />);
