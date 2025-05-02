import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { ResumeViewerUI } from "./viewer/ViewerUI";

const root = document.getElementById("resume-viewer") as HTMLElement;
if (!root) {
  throw new Error("Root element not found");
}

const jsonResumeUrl = root.getAttribute("data-json-resume-url") as string;

createRoot(root).render(
  <StrictMode>
    <ResumeViewerUI jsonResumeUrl={jsonResumeUrl} />
  </StrictMode>
);
