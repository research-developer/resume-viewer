import React, { useReducer, useMemo, useEffect, useCallback } from "react";
import { Resume } from "../../ResumeModel";
import {
  visualizerReducer,
  createInitialState,
  VisualizerContext,
  VisualizerStatus,
  VisualizerTransition,
} from "./VisualizerHook";
import { buildVisualizerData } from "./VisualizerModel";

export const VisualizerProvider: React.FC<{
  resume: Resume;
  children: React.ReactNode;
}> = ({ resume: initialResume, children }) => {
  const svgRef = React.useRef<SVGSVGElement | null>(null);
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const initializeState = useMemo(
    () => ({ svgRef, containerRef }),
    [svgRef, containerRef]
  );
  const [state, dispatch] = useReducer(
    visualizerReducer,
    initializeState,
    createInitialState
  );
  const { data } = state;
  const { resume } = data || {};
  const resumeRef = React.useRef<Resume | null>(resume);
  const statusRef = React.useRef<VisualizerStatus | null>(state.status);

  // Set the resume in the state
  useEffect(() => {
    // We only want to dispatch if the resume has changed
    if (resumeRef.current === initialResume) return;
    resumeRef.current = initialResume;

    // Use setTimeout to ensure the state is updated after the render cycle
    if (resume !== initialResume) {
      setTimeout(() => {
        const data = buildVisualizerData(initialResume);
        console.log("Setting data in state", initialResume, data);
        dispatch({
          type: "SET_DATA",
          data,
        });
      }, 0);
    }
  }, [initialResume, data, resumeRef, dispatch]);

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

  // Memoize the context value to avoid unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      state,
      dispatch,
    }),
    [state, dispatch]
  );

  return (
    <VisualizerContext.Provider value={contextValue}>
      {children}
    </VisualizerContext.Provider>
  );
};
