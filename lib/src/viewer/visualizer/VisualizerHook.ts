import React, { act, createContext, useContext } from "react";
import { Resume } from "../../ResumeModel";
import { buildVisualizerData, VisualizerData } from "./VisualizerModel";

export type VisualizerView = "career" | "skills" | "education";

export enum VisualizerStatus {
  Starting = "starting",
  Started = "started",
  Stopping = "stopping",
  Stopped = "stopped",
}

export enum VisualizerTransition {
  None = "none",
  Restart = "restart",
}

export interface VisualizerState {
  currentView: VisualizerView;
  status: VisualizerStatus;
  transition: VisualizerTransition;
  selectedEvent: string | null;
  isFullscreen: boolean | null;
  svgRef: React.RefObject<SVGSVGElement | null>;
  containerRef: React.RefObject<HTMLDivElement | null>;
  data: VisualizerData | null;
}

type VisualizerAction =
  | { type: "SET_VIEW"; view: VisualizerView }
  | { type: "RESTART" }
  | { type: "SELECT_EVENT"; eventId: string | null }
  | { type: "TOGGLE_FULLSCREEN" }
  | { type: "SET_FULLSCREEN"; isFullscreen: boolean }
  | { type: "SET_DATA"; data: VisualizerData | null }
  | { type: "START" }
  | { type: "STARTED" }
  | { type: "STOP" }
  | { type: "STOPPED" };

export const createInitialState = ({
  svgRef,
  containerRef,
}: {
  svgRef: React.RefObject<SVGSVGElement | null>;
  containerRef: React.RefObject<HTMLDivElement | null>;
}): VisualizerState => ({
  currentView: "career",
  status: VisualizerStatus.Stopped,
  transition: VisualizerTransition.None,
  selectedEvent: null,
  isFullscreen: null,
  svgRef,
  containerRef,
  data: null,
});

export const VisualizerContext = createContext<
  | {
      state: VisualizerState;
      dispatch: React.Dispatch<VisualizerAction>;
    }
  | undefined
>(undefined);

// This is a debug version of the reducer that logs the state and action to the console
const visualizerReducerDebug = (
  state: VisualizerState,
  action: VisualizerAction
): VisualizerState => {
  console.group(`visualizerReducer: ${action.type}`, { state, action });
  try {
    const result = visualizerReducerProd(state, action);
    console.log("New state:", result);
    return result;
  } finally {
    console.groupEnd();
  }
};

// This is the production version of the reducer that does not log to the console
const visualizerReducerProd = (
  state: VisualizerState,
  action: VisualizerAction
): VisualizerState => {
  switch (action.type) {
    case "SET_VIEW":
      return { ...state, currentView: action.view };
    case "SELECT_EVENT":
      return { ...state, selectedEvent: action.eventId };
    case "TOGGLE_FULLSCREEN":
      return { ...state, isFullscreen: !state.isFullscreen };
    case "SET_FULLSCREEN":
      return { ...state, isFullscreen: action.isFullscreen };
    case "SET_DATA":
      if (state.data === action.data) {
        console.warn("Data is the same, no need to update visualizer data.");
        return state;
      }
      return visualizerReducer(
        {
          ...state,
          data: action.data,
        },
        { type: "RESTART" }
      );
    case "RESTART":
      let nextRestartAction: VisualizerAction;
      if (state.status !== VisualizerStatus.Stopped) {
        nextRestartAction = { type: "STOP" };
      } else {
        nextRestartAction = { type: "START" };
      }
      return visualizerReducer(
        {
          ...state,
          currentView: "career",
          transition: VisualizerTransition.Restart,
        },
        nextRestartAction
      );
    case "START":
      return {
        ...state,
        status: VisualizerStatus.Starting,
        transition:
          state.transition === VisualizerTransition.Restart
            ? VisualizerTransition.None
            : state.transition,
      };
    case "STARTED":
      return {
        ...state,
        status: VisualizerStatus.Started,
      };
    case "STOP":
      return {
        ...state,
        status: VisualizerStatus.Stopping,
      };
    case "STOPPED":
      return {
        ...state,
        status: VisualizerStatus.Stopped,
      };
    default:
      throw new Error(`Unhandled action type`);
  }
};

export const visualizerReducer = import.meta.env.DEV
  ? visualizerReducerDebug
  : visualizerReducerProd;

export const useVisualizerContext = () => {
  const context = useContext(VisualizerContext);
  if (context === undefined) {
    throw new Error(
      "useVisualizerContext must be used within a VisualizerProvider"
    );
  }
  return context;
};
