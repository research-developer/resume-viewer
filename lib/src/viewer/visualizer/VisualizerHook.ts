import React, { act, createContext, useContext } from "react";
import { VisualizerData } from "./VisualizerModel";
import { TimelineData } from "./TimelineModel";
import * as d3 from "d3";

export enum VisualizerView {
  Home = "home",
  Timeline = "timeline",
  Skills = "skills",
  Work = "work",
  Education = "education",
  Projects = "projects",
  Certificates = "certificates",
  Languages = "languages",
}

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

export interface VisualizerAnimationStartPosition {
  x: number; // X coordinate of the start position
  y: number; // Y coordinate of the start position
  angle: number; // Direction of the animation in degrees
}

export interface VisualizerD3State {
  containerRef: React.RefObject<HTMLDivElement | null>;
  svgRef: React.RefObject<SVGSVGElement | null>;
  rootRef: React.RefObject<SVGGraphicsElement | null>;
  dispatch: d3.Dispatch<VisualizerDispatchAction>;
  zoom: d3.ZoomBehavior<Element, unknown>;
  width: number;
  height: number;
  minZoom: number;
  maxZoom: number;
}

export type VisualizerDispatch = d3.Dispatch<VisualizerDispatchAction>;

export type VisualizerDispatchAction =
  | {
      type: "DRAW_TIMELINE";
      origin: VisualizerAnimationStartPosition;
      data: TimelineData;
    }
  | {
      type: "DRAW_PROFILE";
      origin: VisualizerAnimationStartPosition;
      data: VisualizerData;
    };

export interface VisualizerState {
  currentView: VisualizerView;
  timelineViewOrigin: VisualizerAnimationStartPosition | null;
  status: VisualizerStatus;
  transition: VisualizerTransition;
  selectedEvent: string | null;
  isFullscreen: boolean | null;
  data: VisualizerData | null;
  d3State: VisualizerD3State;
}

const defaultState: Omit<VisualizerState, "d3State"> = {
  currentView: VisualizerView.Timeline,
  timelineViewOrigin: null,
  status: VisualizerStatus.Stopped,
  transition: VisualizerTransition.None,
  selectedEvent: null,
  isFullscreen: null,
  data: null,
};

const defaultD3State: Omit<
  VisualizerD3State,
  "svgRef" | "containerRef" | "rootRef" | "dispatch" | "zoom"
> = {
  minZoom: 1,
  maxZoom: 40,
  width: 1024,
  height: 768,
};

export const createInitialState = ({
  svgRef,
  containerRef,
  rootRef,
}: {
  svgRef: React.RefObject<SVGSVGElement | null>;
  containerRef: React.RefObject<HTMLDivElement | null>;
  rootRef: React.RefObject<SVGGraphicsElement | null>;
}): VisualizerState => ({
  ...defaultState,
  d3State: {
    ...defaultD3State,
    svgRef,
    containerRef,
    rootRef,
    dispatch: d3.dispatch<VisualizerDispatchAction>(
      "DRAW_TIMELINE",
      "DRAW_PROFILE"
    ),
    zoom: d3
      .zoom()
      .scaleExtent([defaultD3State.minZoom, defaultD3State.maxZoom])
      .translateExtent([
        // Use width and height of the SVG element to set the translation extent
        [-defaultD3State.width, -defaultD3State.height],
        [defaultD3State.width * 2, defaultD3State.height * 2],
      ])
      .on("zoom", (event) => {
        if (!rootRef.current) return;
        d3.select(rootRef.current).attr("transform", event.transform);
      }),
  },
});

type VisualizerAction =
  | {
      type: "SET_VIEW";
      view: VisualizerView;
      origin: VisualizerAnimationStartPosition | null;
    }
  | { type: "RESTART" }
  | { type: "SELECT_EVENT"; eventId: string | null }
  | { type: "TOGGLE_FULLSCREEN" }
  | { type: "SET_FULLSCREEN"; isFullscreen: boolean }
  | { type: "SET_DATA"; data: VisualizerData | null }
  | { type: "START" }
  | { type: "STARTED" }
  | { type: "STOP" }
  | { type: "STOPPED" };

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
  console.groupCollapsed(`visualizerReducer: ${action.type}`, {
    state,
    action,
  });
  try {
    const result = visualizerReducerProd(state, action);
    console.log(`New State:`, result);
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
      if (state.currentView === action.view) {
        console.warn("View is the same, no need to update visualizer view.");
        return state;
      }
      if (action.view === VisualizerView.Timeline) {
        return {
          ...state,
          currentView: action.view,
          timelineViewOrigin: action.origin,
        };
      }
      return {
        ...state,
        currentView: action.view,
      };
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
          transition: VisualizerTransition.Restart,
          // Reset to default state for key properties
          currentView: defaultState.currentView,
          timelineViewOrigin: defaultState.timelineViewOrigin,
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

export type VisualizerContextType = ReturnType<typeof useVisualizerContext>;
