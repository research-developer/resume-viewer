import { useReducer, useMemo, PropsWithChildren, useEffect } from "react";
import { viewerReducer, initialState, ViewerContext } from "./ViewerHook";
import { useResume } from "../ResumeHook";

type ViewerProviderProps = PropsWithChildren<{
  url?: string;
}>;

export const ViewerProvider: React.FC<ViewerProviderProps> = ({
  url,
  children,
}: ViewerProviderProps) => {
  const resume = useResume(url);
  const [state, dispatch] = useReducer(viewerReducer, initialState);

  // Notify the reducer of the resume data
  useEffect(() => {
    if (resume) {
      dispatch({ type: "SET_RESUME", resume });
    }
  }, [resume]);

  // Memoize the context value to avoid unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      state,
      dispatch,
    }),
    [state, dispatch]
  );

  return (
    <ViewerContext.Provider value={contextValue}>
      {children}
    </ViewerContext.Provider>
  );
};
