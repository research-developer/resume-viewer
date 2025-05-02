import { FC } from "react";
import { useViewerContext } from "../ViewerHook";
import JsonViewerUI from "./JsonViewerUI";

type JsonViewUIProps = {};

export const JsonViewUI: FC<JsonViewUIProps> = ({}: JsonViewUIProps) => {
  const [state] = useViewerContext();
  const { resume: viewerData } = state;
  const { data, isPending: resumeIsPending } = viewerData || {};

  if (resumeIsPending) {
    return (
      <div className="p-4 text-center text-secondary">Loading resume...</div>
    );
  }

  if (!data) {
    return (
      <div className="p-4 text-center text-secondary">
        No resume data available.
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full h-full overflow-hidden gap-4 p-6 self-start">
      <div className="text-lg font-semibold text-primary">JSON</div>
      <div className="text-sm text-secondary mb-4">
        The below is the JSON representation of the resume.
      </div>
      <JsonViewerUI data={data.resume} />
    </div>
  );
};
