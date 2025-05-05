import { useReducer, PropsWithChildren, useEffect } from "react";
import {
  viewerReducer,
  initialState,
  ViewerContext,
  ViewerView,
} from "./ViewerHook";
import { useResume } from "../ResumeHook";

type ViewerProviderProps = PropsWithChildren<{
  url?: string | null;
}>;

export const ViewerProvider: React.FC<ViewerProviderProps> = ({
  url,
  children,
}: ViewerProviderProps) => {
  const resume = useResume(url);
  const viewer = useReducer(viewerReducer, {
    ...initialState,
    resume,
    currentView: !!resume.data ? ViewerView.Infographic : ViewerView.Welcome,
  });
  const [_, dispatch] = viewer;

  // Notify the viewer when the resume data changes
  useEffect(() => {
    if (!!resume) {
      dispatch({ type: "SET_RESUME", resume });
    }
  }, [resume, dispatch]);

  return (
    <ViewerContext.Provider value={viewer}>{children}</ViewerContext.Provider>
  );
};
