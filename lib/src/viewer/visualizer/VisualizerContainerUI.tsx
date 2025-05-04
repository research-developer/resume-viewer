import React, { FC, useEffect } from "react";
import { useVisualizerContext } from "./VisualizerHook";
import { useResize } from "../ResizeHook";
import * as d3 from "d3";

export const VisualizerContainerUI: FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [state] = useVisualizerContext();
  const { isFullscreen, d3State } = state;

  // Custom hook to handle resize functionality
  useResize(d3State.containerRef);

  // Initialize the SVG element and set its dimensions
  useEffect(() => {
    if (!d3State.svgRef.current || !state.data) return;
    const svg = d3.select(d3State.svgRef.current);
    // Apply zoom to the SVG element
    svg.call(d3State.zoom as any);
    // Dispatch the draw timeline event
    d3State.dispatch.call("DRAW_PROFILE", {
      type: "DRAW_PROFILE",
      data: state.data,
      origin: {
        x: 0,
        y: 0,
        angle: 0,
      },
    });
  }, [d3State, state.data]);

  return (
    <div
      ref={d3State.containerRef}
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        flex: "1 0 auto",
        maxWidth: "100%",
        maxHeight: "100%",
        minWidth: "100%",
        minHeight: "100%",
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
        ref={d3State.svgRef}
        style={{
          width: isFullscreen ? "100vw" : "100%",
          height: isFullscreen ? "100vh" : "auto",
          maxWidth: "100%",
          maxHeight: "100%",
          flex: "1 0 auto",
          overflow: "hidden",
        }}
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
        viewBox={`0 0 ${d3State.width} ${d3State.height}`}
      >
        <defs ref={d3State.defsRef}></defs>
        <g ref={d3State.rootRef}></g>
      </svg>
      {children}
    </div>
  );
};
