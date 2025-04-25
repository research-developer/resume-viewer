import React from "react";
import { useVisualizerContext } from "./VisualizerHook";
import { useFullscreen } from "./FullScreenHook";
import { useResize } from "./ResizeHook";

export const VisualizerContainerUI: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const { state, dispatch } = useVisualizerContext();
  const { isFullscreen, containerRef, svgRef } = state;

  // Custom hook to handle fullscreen functionality
  useFullscreen(containerRef);

  // Custom hook to handle resize functionality
  const dimensions = useResize(containerRef);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        backgroundColor: "#ffffff",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        ...(isFullscreen && {
          width: "100vw",
          height: "100vh",
          overflow: "hidden",
        }),
      }}
    >
      <svg
        className="container"
        ref={svgRef}
        style={{
          width: isFullscreen ? "100vw" : "100%",
          height: isFullscreen ? "100vh" : "100%",
          maxWidth: "100%",
          maxHeight: "100%",
        }}
        preserveAspectRatio="xMidYMid meet"
      ></svg>
      {children}
    </div>
  );
};
