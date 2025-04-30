import { FC } from "react";
import { ResumeUI } from "./text/ResumeUI";
import { useViewerContext } from "./ViewerHook";
import { InfographicUI } from "./infographic/InfographicUI";
import { ViewerProvider } from "./ViewerProvider";

type JsonResumeViewerProps = {
  jsonResumeUrl: string;
};

export const JsonResumeViewer: FC<JsonResumeViewerProps> = ({
  jsonResumeUrl,
}) => {
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
  const { state } = viewer;
  const { data, currentView } = state;
  const { isPending } = data || { isPending: true };

  if (isPending) {
    return (
      <div className="p-4 text-center text-secondary">Loading resume...</div>
    );
  }

  switch (currentView) {
    case "infographic":
      return <InfographicUI />;
    case "text":
      return <ResumeUI />;
    default:
      // Show an error message if the view is not recognized
      return (
        <div className="p-4 text-center text-red-500 border border-red-200 rounded-lg bg-red-50">
          Error: Unknown view type.
        </div>
      );
  }
};
