import { FC } from "react";
import { Resume } from "../../ResumeModel";
import { VisualizerProvider } from "./VisualizerProvider";
import { VisualizerControlsUI } from "./VisualizerControlsUI";
import { VisualizerContainerUI } from "./VisualizerContainerUI";
import { TimelineUI } from "./TimelineUI";

interface VisualizerUIProps {
  resume: Resume;
}

export const VisualizerUI: FC<VisualizerUIProps> = ({ resume }) => {
  return (
    <VisualizerProvider resume={resume}>
      <VisualizerContainerUI>
        <TimelineUI />
        <VisualizerControlsUI />
      </VisualizerContainerUI>
    </VisualizerProvider>
  );
};
