import ReactDOM from "react-dom/client";
import { MainRouter } from "./pages/main-router.tsx";
import { StrictMode } from "react";
import { RecoilRoot } from "recoil";
import "./index.css";
import "toastify-js/src/toastify.css";
import "dotenv/config";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RecoilRoot>
      <MainRouter />
    </RecoilRoot>
  </StrictMode>
);
