import React from "react";
import { Resume } from "../../ResumeModel";
import { VisualizerProvider } from "./VisualizerProvider";
import { VisualizerControlsUI } from "./VisualizerControlsUI";
import { TimelineUI } from "./TimelineUI";
import { VisualizerContainerUI } from "./VisualizerContainerUI";

interface VisualizerUIProps {
  resume: Resume;
}

export const VisualizerUI: React.FC<VisualizerUIProps> = ({ resume }) => {
  return (
    <VisualizerProvider resume={resume}>
      <VisualizerContainerUI>
        <TimelineUI />
        <VisualizerControlsUI />
      </VisualizerContainerUI>
    </VisualizerProvider>
  );
};
