import ReactDOM from "react-dom/client";
import { MainRouter } from "./pages/main-router.tsx";
import { StrictMode } from "react";
import "./index.css";
import "toastify-js/src/toastify.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MainRouter />
  </StrictMode>
);
