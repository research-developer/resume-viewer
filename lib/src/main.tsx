import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { JsonResumeViewer } from "./JsonResumeViewerUI";

const root = document.getElementById("root") as HTMLElement;
if (!root) {
  throw new Error("Root element not found");
}

const jsonResumeUrl = root.getAttribute("data-json-resume-url") as string;

createRoot(root).render(
  <StrictMode>
    <JsonResumeViewer jsonResumeUrl={jsonResumeUrl} />
  </StrictMode>
);
