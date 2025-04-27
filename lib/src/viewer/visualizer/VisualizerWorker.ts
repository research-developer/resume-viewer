import { buildVisualizerData } from "./VisualizerModel";

// Set up worker context
const ctx: Worker = self as any;

// Listen for messages from the main thread
ctx.addEventListener("message", async (event) => {
  const { resume } = event.data;

  // Process the data using the existing function
  const result = await buildVisualizerData(resume);

  // Send the result back to the main thread
  ctx.postMessage({ result });
});
