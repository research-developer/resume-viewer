// This file is the entry point for the library. It is used to export the components and types for the library.

// In your main.tsx or index.ts
import "./index.css";

// Export the main component
export { ResumeViewerUI as ResumeViewer } from "./viewer/ViewerUI";

// Export the schema types
export * from "./schema";
export * from "./analyzer";
export * from "./FluentIterable";
export * from "./FluentSet";
export * from "./FluentMap";
