import { useState, useEffect } from "react";
import { Resume, ResumeSchema } from "./ResumeModel";

export function useResume(url: string) {
  const [data, setData] = useState<Resume | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [loadingUrl, setLoadingUrl] = useState<string | null>(null);

  const fetchResume = async () => {
    if (loading) {
      console.warn("Already loading resume, skipping fetch.");
      return;
    }

    if (!loadingUrl) {
      setLoading(false);
      setError(new Error("No URL provided"));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(loadingUrl);

      if (!response.ok) {
        // Do some friendly error handling for common HTTP errors
        if (response.status === 404) {
          throw new Error("Resume not found. Please check the URL.");
        } else if (response.status === 500) {
          throw new Error("Server error. Please try again later.");
        } else if (response.status === 403) {
          throw new Error("Access denied. Please check your permissions.");
        }

        // For other errors, just throw a generic error
        throw new Error(
          `Failed to fetch resume: ${response.status} ${response.statusText}`
        );
      }
      const jsonData = await response.json();
      const parsedData = await ResumeSchema.parseAsync(jsonData);
      setData(parsedData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (url && url !== loadingUrl) {
      setLoadingUrl(url);
    }
  }, [url, loadingUrl]);

  useEffect(() => {
    if (loadingUrl) {
      fetchResume();
    }
  }, [loadingUrl]);

  return {
    data,
    loading,
    error,
    refetch: fetchResume,
  };
}
