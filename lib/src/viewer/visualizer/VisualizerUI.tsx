import { FC } from "react";
import { Resume } from "../../ResumeModel";
import { VisualizerProvider } from "./VisualizerProvider";
import { VisualizerControlsUI } from "./VisualizerControlsUI";
import { VisualizerContainerUI } from "./VisualizerContainerUI";
import { TimelineUI } from "./TimelineUI";
import { ProfileUI } from "./ProfileUI";

interface VisualizerUIProps {
  resume: Resume;
}

export const VisualizerUI: FC<VisualizerUIProps> = ({ resume }) => {
  return (
    <VisualizerProvider resume={resume}>
      <VisualizerContainerUI>
        <TimelineUI />
        <ProfileUI />
        <VisualizerControlsUI />
      </VisualizerContainerUI>
    </VisualizerProvider>
  );
};
