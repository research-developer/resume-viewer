import { FC, useCallback, useRef } from "react";
import { TextViewUI } from "./text/TextViewUI";
import { useViewerContext } from "./ViewerHook";
import { InfographicViewUI } from "./infographic/InfographicViewUI";
import { ViewerProvider } from "./ViewerProvider";
import { WelcomeViewUI } from "./WelcomeViewUI";
import { ErrorViewUI } from "./ErrorViewUI";
import { JsonViewUI } from "./json/JsonViewUI";
import { ViewerNavUI } from "./ViewerNavUI";
import { VisualizerViewUI } from "./visualizer/VisualizerViewUI";
import { useFullscreen } from "./FullScreenHook";
import { ProfileCardViewUI } from "./ProfileCardViewUI";

type ResumeViewerUIProps = {
  jsonResumeUrl?: string | null;
};

/**
 * The main component for the Resume Viewer UI.
 * It provides the context and renders the appropriate view based on the current state.
 *
 * @param {string} jsonResumeUrl - The URL of the JSON resume to be displayed.
 * @returns {JSX.Element} The rendered component.
 */
export const ResumeViewerUI: FC<ResumeViewerUIProps> = ({ jsonResumeUrl }) => {
  return (
    <ViewerProvider url={jsonResumeUrl}>
      <div className="fill-screen bg-background items-center justify-center">
        <ViewerUI />
      </div>
    </ViewerProvider>
  );
};

type ViewerUIProps = {};

const ViewerUI: FC<ViewerUIProps> = () => {
  const [state, dispatch] = useViewerContext();
  const { resume, currentView, isFullscreen } = state;
  const { isPending, error, refresh } = resume || {};
  const viewerRef = useRef<HTMLDivElement>(null);
  const showNav = currentView !== "welcome" && currentView !== "profileCard";

  // Custom hook to handle fullscreen functionality
  useFullscreen(
    viewerRef,
    isFullscreen,
    useCallback(
      (change: boolean) => {
        if (change !== isFullscreen) {
          dispatch({ type: "SET_FULLSCREEN", isFullscreen: change });
        }
      },
      [isFullscreen]
    )
  );

  if (isPending) {
    return (
      <div className="p-4 text-center text-secondary">Loading resume...</div>
    );
  }

  if (error) {
    return <ErrorViewUI error={error} onRetry={refresh} />;
  }

  const renderView = () => {
    switch (currentView) {
      case "welcome":
        return <WelcomeViewUI />;
      case "profileCard":
        return <ProfileCardViewUI />;
      case "infographic":
        return <InfographicViewUI />;
      case "text":
        return <TextViewUI />;
      case "json":
        return <JsonViewUI />;
      case "visualizer":
        return <VisualizerViewUI />;
      default:
        // Show an error message if the view is not recognized
        return (
          <div className="p-4 text-center text-red-500 border border-red-200 rounded-lg bg-red-50">
            Error: Unknown view type.
          </div>
        );
    }
  };

  return (
    <div ref={viewerRef} className="flex-auto h-full bg-background flex">
      {renderView()}
      {showNav && <ViewerNavUI />}
    </div>
  );
};
