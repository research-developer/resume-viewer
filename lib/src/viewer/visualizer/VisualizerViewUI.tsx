import { FC, useEffect } from "react";
import { VisualizerProvider } from "./VisualizerProvider";
import { VisualizerControlsUI } from "./VisualizerControlsUI";
import { VisualizerContainerUI } from "./VisualizerContainerUI";
import { TimelineUI } from "./TimelineUI";
import { ProfileUI } from "./ProfileUI";
import { useViewerContext } from "../ViewerHook";

interface VisualizerViewUIProps {}

export const VisualizerViewUI: FC<VisualizerViewUIProps> = ({}) => {
  const [state] = useViewerContext();
  const { resume: viewerData, isFullscreen } = state;
  const { data, isPending: resumeIsPending } = viewerData || {};

  if (resumeIsPending) {
    return (
      <div className="p-4 text-center text-secondary">Loading resume...</div>
    );
  }

  if (!data?.resume) {
    return (
      <div className="p-4 text-center text-secondary">
        No resume data available.
      </div>
    );
  }

  return (
    <VisualizerProvider resume={data.resume} isFullscreen={isFullscreen}>
      <VisualizerContainerUI>
        <TimelineUI />
        <VisualizerControlsUI />
      </VisualizerContainerUI>
    </VisualizerProvider>
  );
};
