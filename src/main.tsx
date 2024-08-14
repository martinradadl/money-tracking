import ReactDOM from "react-dom/client";
import "./index.css";
import { MainRouter } from "./pages/main-router.tsx";
import { StrictMode } from "react";
import { RecoilRoot } from "recoil";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RecoilRoot>
      <MainRouter />
    </RecoilRoot>
  </StrictMode>
);
