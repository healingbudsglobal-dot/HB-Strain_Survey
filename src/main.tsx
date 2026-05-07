import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { markFirstPaint } from "./lib/perf";

createRoot(document.getElementById("root")!).render(<App />);
markFirstPaint();
