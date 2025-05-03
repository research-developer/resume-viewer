import React from "react";
import { useVisualizerContext } from "./VisualizerHook";

export const VisualizerControlsUI: React.FC = () => {
  const [_, dispatch] = useVisualizerContext();
  const replayTimeline = () => {
    dispatch({ type: "RESTART" });
  };

  return (
    <div
      style={{
        position: "absolute",
        top: "10px",
        right: "10px",
        display: "flex",
        gap: "10px",
        zIndex: 10,
      }}
    >
      <button
        onClick={replayTimeline}
        style={{
          border: "none",
          background: "rgba(255, 255, 255, 0.7)",
          borderRadius: "4px",
          width: "32px",
          height: "32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
          transition: "background 0.2s",
        }}
        title="Replay Timeline"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"
            fill="#333"
          />
        </svg>
      </button>
    </div>
  );
};
