import React, { useReducer, useMemo, useEffect } from "react";
import { Resume } from "../../ResumeModel";
import {
  visualizerReducer,
  createInitialState,
  VisualizerContext,
  VisualizerStatus,
  VisualizerTransition,
} from "./VisualizerHook";
import { VisualizerData } from "./VisualizerModel";
import { useVisualizerData } from "./VisualizerDataHook";

export const VisualizerProvider: React.FC<{
  resume: Resume;
  children: React.ReactNode;
}> = ({ resume: initialResume, children }) => {
  const svgRef = React.useRef<SVGSVGElement | null>(null);
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const { data: initialData } = useVisualizerData(initialResume);
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
  const dataRef = React.useRef<VisualizerData | null>(initialData);
  const statusRef = React.useRef<VisualizerStatus | null>(state.status);

  // Set the data in the state
  useEffect(() => {
    // We only want to dispatch if the data has changed
    if (dataRef.current === initialData) return;
    dataRef.current = initialData;

    dispatch({ type: "SET_DATA", data: initialData });
  }, [initialData, data, dataRef, dispatch]);

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
