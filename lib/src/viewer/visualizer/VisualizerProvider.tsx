import React, {
  useReducer,
  useMemo,
  useEffect,
  PropsWithChildren,
} from "react";
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

interface VisualizerProviderProps {
  resume: Resume;
  isFullscreen: boolean | null;
}

export const VisualizerProvider: React.FC<
  PropsWithChildren<VisualizerProviderProps>
> = ({ resume: initialResume, children, isFullscreen }) => {
  const svgRef = React.useRef<SVGSVGElement | null>(null);
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const defsRef = React.useRef<SVGDefsElement | null>(null);
  const rootRef = React.useRef<SVGGraphicsElement | null>(null);
  const visualizerData = useVisualizerData(initialResume);
  const { data: initialData } = visualizerData;
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

  return (
    <VisualizerContext.Provider value={visualizer}>
      {children}
    </VisualizerContext.Provider>
  );
};
