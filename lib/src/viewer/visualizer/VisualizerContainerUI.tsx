import React, { FC, useCallback, useEffect } from "react";
import { useVisualizerContext } from "./VisualizerHook";
import { useFullscreen } from "./FullScreenHook";
import { useResize } from "./ResizeHook";

export const VisualizerContainerUI: FC<React.PropsWithChildren> = ({
  children,
}) => {
  const { state, dispatch } = useVisualizerContext();
  const { isFullscreen, containerRef, svgRef } = state;

  // Custom hook to handle fullscreen functionality
  useFullscreen(
    containerRef,
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

  // Custom hook to handle resize functionality
  useResize(containerRef);

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
        aspectRatio: "16/9",
        overflow: "hidden",
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
          height: isFullscreen ? "100vh" : "auto",
          maxWidth: "100%",
          maxHeight: "100%",
        }}
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
        viewBox="0 0 1024 768"
      ></svg>
      {children}
    </div>
  );
};
