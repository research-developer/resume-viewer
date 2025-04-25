import { useState, useEffect } from "react";
import { Resume } from "../../ResumeModel";
import { VisualizerData } from "./VisualizerModel";

export function useVisualizerData(resume: Resume | null) {
  const [data, setData] = useState<VisualizerData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Don't start worker if no data
    if (!resume) {
      setData(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    // Create a new worker
    const worker = new Worker(
      new URL("./VisualizerWorker.ts", import.meta.url),
      { type: "module" }
    );

    // Set up message handler
    worker.onmessage = (event) => {
      const { result } = event.data;
      setData(result);
      setIsLoading(false);
    };

    // Set up error handler
    worker.onerror = (err) => {
      console.error("Worker error:", err);
      setError(new Error("Failed to process resume data"));
      setIsLoading(false);
    };

    // Send data to the worker
    worker.postMessage({ resume });

    // Clean up when component unmounts or resume changes
    return () => {
      worker.terminate();
    };
  }, [resume]);

  return { data, isLoading, error };
}
