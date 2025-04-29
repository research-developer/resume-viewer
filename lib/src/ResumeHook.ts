import {
  startTransition,
  useActionState,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { Resume, ResumeSchema } from "./ResumeModel";
import { getGravatarUrl } from "./GravatarUtil";
import { getResumeSkillStats, ResumeSkillStats } from "./ResumeSkillStatsModel";

export interface ResumeStats {
  skills: ResumeSkillStats;
}

export interface ResumeData {
  resume: Resume;
  stats: ResumeStats;
  gravatarUrl: string | null;
}

export interface ResumeState {
  url: string | null;
  data: ResumeData | null;
  error: Error | null;
}

const initialState: ResumeState = {
  url: null,
  data: null,
  error: null,
};

/**
 * Custom hook to fetch and manage resume data.
 * @param url - The URL of the resume JSON file.
 * @returns An object containing the resume state, loading status, and a function to set the URL.
 */
export function useResume(url?: string | null) {
  const [state, dispatch, isPending] = useActionState(
    fetchResume,
    initialState
  );

  const setUrl = useCallback(
    (url: string | null) => {
      startTransition(() => {
        dispatch(url);
      });
    },
    [dispatch]
  );

  const newState = useMemo(() => {
    return {
      ...state,
      isPending,
      setUrl,
    };
  }, [state, isPending, setUrl]);

  // Effect to handle URL changes
  useEffect(() => {
    if (url !== undefined && url !== state.url) {
      setUrl(url);
    }
  }, [url, state.url, setUrl]);

  return newState;
}

export type ResumeHook = ReturnType<typeof useResume>;

async function fetchResume(
  prevState: ResumeState,
  url: string | null
): Promise<ResumeState> {
  // If the URL is empty, reset the state
  if (!url) {
    return {
      ...prevState,
      url: null,
      data: null,
      error: null,
    };
  }

  try {
    const response = await fetch(url);

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
    const data = await createResumeData(parsedData);

    return {
      ...prevState,
      url,
      data,
      error: null,
    };
  } catch (err) {
    return {
      ...prevState,
      url,
      data: null,
      error: err as Error,
    };
  }
}

export async function createResumeData(resume: Resume): Promise<ResumeData> {
  console.time("createResumeData");
  try {
    const stats = {
      skills: getResumeSkillStats(resume),
    };
    const gravatarUrl = await getGravatarUrl(resume.basics?.email || "", 200);
    return { resume, stats, gravatarUrl };
  } finally {
    console.timeEnd("createResumeData");
  }
}
