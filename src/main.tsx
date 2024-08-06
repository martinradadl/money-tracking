import ReactDOM from "react-dom/client";
import "./index.css";
import { MainRouter } from "./pages/main-router.tsx";
import { StrictMode } from "react";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MainRouter />
  </StrictMode>
);
