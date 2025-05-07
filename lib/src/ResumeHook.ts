import { useState, useEffect, useCallback, useMemo } from "react";
import { ResumeSchema } from "@schema/ResumeSchema";
import { ResumeAnalyzer } from "./analyzer/ResumeAnalyzer";

export interface ResumeState {
  url: string | null;
  data: ResumeAnalyzer | null;
  error: Error | null;
  isPending: boolean;
}

/**
 * Custom hook to fetch and manage resume data.
 * @param initialUrl - The initial URL of the resume JSON file.
 * @returns An object containing the resume state, loading status, and a function to set the URL.
 */
export function useResume(initialUrl?: string | null) {
  const [url, setUrl] = useState<string | null>(initialUrl || null);
  const [state, setState] = useState<ResumeState>({
    url: null,
    data: null,
    error: null,
    isPending: !!url ? true : false,
  });

  const fetchResume = useCallback(async (url: string | null) => {
    if (!url) {
      setState((prev) => ({
        ...prev,
        url: null,
        data: null,
        error: null,
        isPending: false,
      }));
      return;
    }

    setState((prev) => ({ ...prev, isPending: true, error: null }));

    try {
      const response = await fetch(url);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Resume not found. Please check the URL.");
        } else if (response.status === 500) {
          throw new Error("Server error. Please try again later.");
        } else if (response.status === 403) {
          throw new Error("Access denied. Please check your permissions.");
        }
        throw new Error(
          `Failed to fetch resume: ${response.status} ${response.statusText}`
        );
      }

      const jsonData = await response.json();
      const parsedData = await ResumeSchema.parseAsync(jsonData);
      const data = await ResumeAnalyzer.analyzeAsync(parsedData);

      setState({
        url,
        data,
        error: null,
        isPending: false,
      });
    } catch (err) {
      console.error("Error fetching resume:", err);
      setState({
        url,
        data: null,
        error: err as Error,
        isPending: false,
      });
    }
  }, []);

  useEffect(() => {
    if (url !== state.url) {
      fetchResume(url);
    }
  }, [url, state.url, fetchResume]);

  const refresh = useCallback(() => {
    if (state.url) {
      fetchResume(state.url);
    }
  }, [state.url, fetchResume]);
  console.log("Resume state:", state);

  return useMemo(() => {
    return {
      ...state,
      setUrl,
      refresh,
    };
  }, [state, setUrl, refresh]);
}

export type ResumeHook = ReturnType<typeof useResume>;
