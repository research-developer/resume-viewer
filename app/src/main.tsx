import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { ResumeViewer } from "resume-viewer";

const root = document.getElementById("resume-viewer") as HTMLElement;
if (!root) {
  throw new Error("Root element not found");
}

const jsonResumeUrl = root.getAttribute("data-json-resume-url") as string;

createRoot(root).render(
  <StrictMode>
    <ResumeViewer jsonResumeUrl={jsonResumeUrl} />
  </StrictMode>
);
