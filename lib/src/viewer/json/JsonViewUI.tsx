import { FC, useMemo } from "react";
import { useViewerContext } from "../ViewerHook";

type JsonViewUIProps = {};

export const JsonViewUI: FC<JsonViewUIProps> = ({}: JsonViewUIProps) => {
  const { state, dispatch } = useViewerContext();
  const { data: viewerData } = state;
  const { data, isPending: resumeIsPending } = viewerData || {
    isPending: true,
    data: null,
  };

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
    <div className="p-4 text-secondary">
      <pre
        style={{
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          overflowY: "auto",
        }}
      >
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
};
