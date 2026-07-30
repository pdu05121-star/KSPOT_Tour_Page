
  import { createRoot } from "react-dom/client";
  import App from "./app/App.tsx";
  import { initAnalytics } from "./app/analytics.ts";
  import "./styles/index.css";

  initAnalytics();
  createRoot(document.getElementById("root")!).render(<App />);
