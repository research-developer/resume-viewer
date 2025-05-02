import { FC, useCallback, useRef, useState } from "react";
import { TextViewUI } from "./text/TextUI";
import { useViewerContext } from "./ViewerHook";
import { InfographicViewUI } from "./infographic/InfographicViewUI";
import { ViewerProvider } from "./ViewerProvider";
import { WelcomeUI } from "./WelcomeUI";
import { ErrorViewUI } from "./ErrorViewUI";
import { JsonViewUI } from "./json/JsonViewUI";
import { ViewerNavUI } from "./ViewerNavUI";
import { VisualizerViewUI } from "./visualizer/VisualizerViewUI";
import { useFullscreen } from "./FullScreenHook";

type ResumeViewerUIProps = {
  jsonResumeUrl?: string;
};

/**
 * The main component for the Resume Viewer UI.
 * It provides the context and renders the appropriate view based on the current state.
 *
 * @param {string} jsonResumeUrl - The URL of the JSON resume to be displayed.
 * @returns {JSX.Element} The rendered component.
 */
export const ResumeViewerUI: FC<ResumeViewerUIProps> = ({
  jsonResumeUrl: initialUrl,
}) => {
  const [jsonResumeUrl, setJsonResumeUrl] = useState<string | undefined>(
    initialUrl
  );

  const handleUrlSubmit = (url: string) => {
    setJsonResumeUrl(url);
  };

  if (!jsonResumeUrl) {
    return (
      <div className="fill-screen bg-background flex items-center justify-center">
        <WelcomeUI onUrlSubmit={handleUrlSubmit} />
      </div>
    );
  }

  return (
    <ViewerProvider url={jsonResumeUrl}>
      <div className="fill-screen bg-background items-center justify-center">
        <ViewerUI />
      </div>
    </ViewerProvider>
  );
};

const ViewerUI: FC = () => {
  const viewer = useViewerContext();
  const { state, dispatch } = viewer;
  const { data, currentView, isFullscreen } = state;
  const { isPending, error, refresh } = data || {
    isPending: true,
    error: null,
  };
  const viewerRef = useRef<HTMLDivElement>(null);

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
    return (
      <div className="fill-screen flex items-center justify-center p-4">
        <ErrorViewUI error={error} onRetry={refresh} />
      </div>
    );
  }

  const renderView = () => {
    switch (currentView) {
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
    <div
      ref={viewerRef}
      className="fill-screen bg-background flex flex-col items-center justify-start"
    >
      {renderView()}
      <ViewerNavUI />
    </div>
  );
};
