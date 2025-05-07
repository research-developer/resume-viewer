import React, { useReducer, useEffect, PropsWithChildren } from "react";
import { Resume } from "@schema/ResumeSchema";
import {
  visualizerReducer,
  createInitialState,
  VisualizerContext,
  VisualizerStatus,
  VisualizerTransition,
} from "./VisualizerHook";
import { buildTimeline } from "./TimelineModel";

interface VisualizerProviderProps {
  resume: Resume;
  gravatarUrl: string | null;
  isFullscreen: boolean | null;
}

export const VisualizerProvider: React.FC<
  PropsWithChildren<VisualizerProviderProps>
> = ({
  resume: initialResume,
  gravatarUrl: initialGravatar,
  children,
  isFullscreen,
}) => {
  const svgRef = React.useRef<SVGSVGElement | null>(null);
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const defsRef = React.useRef<SVGDefsElement | null>(null);
  const rootRef = React.useRef<SVGGraphicsElement | null>(null);
  const visualizer = useReducer(
    visualizerReducer,
    {
      svgRef,
      containerRef,
      rootRef,
      defsRef,
      isFullscreen,
    },
    createInitialState
  );
  const [state, dispatch] = visualizer;
  const { data } = state;
  const statusRef = React.useRef<VisualizerStatus | null>(state.status);

  // Set the data in the state
  useEffect(() => {
    if (!initialResume) {
      console.warn("No resume data provided, skipping data dispatch.");
      return;
    } else if (initialResume !== data?.resume) {
      dispatch({
        type: "SET_DATA",
        data: {
          resume: initialResume,
          gravatarUrl: initialGravatar,
          timeline: buildTimeline(initialResume.work || []),
        },
      });
    }
  }, [initialResume, initialGravatar]);

  // When the status changes, dispatch the next action
  useEffect(() => {
    // We only want to dispatch if the status has changed
    if (statusRef.current === state.status) return;
    statusRef.current = state.status;

    switch (state.status) {
      case VisualizerStatus.Starting:
        dispatch({ type: "STARTED" });
        break;
      case VisualizerStatus.Stopping:
        dispatch({ type: "STOPPED" });
        break;
      case VisualizerStatus.Stopped:
        if (state.transition === VisualizerTransition.Restart) {
          dispatch({ type: "START" });
        }
        break;
      default:
        break;
    }
  }, [state.status, state.transition, statusRef, dispatch]);

  return (
    <VisualizerContext.Provider value={visualizer}>
      {children}
    </VisualizerContext.Provider>
  );
};
