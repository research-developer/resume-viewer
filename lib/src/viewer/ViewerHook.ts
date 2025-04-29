import React, { createContext, useContext } from "react";
import { ResumeHook } from "../ResumeHook";

export enum ViewerView {
  Infographic = "infographic",
  Text = "text",
  Json = "json",
}

export interface ViewerState {
  currentView: ViewerView;
  isFullscreen: boolean | null;
  data: ResumeHook | null;
}

export const initialState: ViewerState = {
  currentView: ViewerView.Infographic,
  isFullscreen: null,
  data: null,
};

type ViewerAction =
  | {
      type: "SET_VIEW";
      view: ViewerView;
    }
  | {
      type: "SET_RESUME";
      resume: ResumeHook;
    }
  | {
      type: "TOGGLE_FULLSCREEN";
    }
  | {
      type: "SET_FULLSCREEN";
      isFullscreen: boolean;
    };

export const ViewerContext = createContext<
  | {
      state: ViewerState;
      dispatch: React.Dispatch<ViewerAction>;
    }
  | undefined
>(undefined);

// This is a debug version of the reducer that logs the state and action to the console
const viewerReducerDebug = (
  state: ViewerState,
  action: ViewerAction
): ViewerState => {
  console.groupCollapsed(`viewerReducer: ${action.type}`, {
    state,
    action,
  });
  try {
    const result = viewerReducerProd(state, action);
    return result;
  } finally {
    console.groupEnd();
  }
};

// This is the production version of the reducer that does not log to the console
const viewerReducerProd = (
  state: ViewerState,
  action: ViewerAction
): ViewerState => {
  switch (action.type) {
    case "SET_VIEW":
      if (state.currentView === action.view) {
        console.warn("View is the same, no need to update viewer view.");
        return state;
      }
      return {
        ...state,
        currentView: action.view,
      };
    case "SET_RESUME":
      if (state.data === action.resume) {
        console.warn("Resume data is the same, no need to update viewer data.");
        return state;
      }
      return {
        ...state,
        data: action.resume,
      };
    case "TOGGLE_FULLSCREEN":
      return {
        ...state,
        isFullscreen: state.isFullscreen === null ? true : !state.isFullscreen,
      };
    case "SET_FULLSCREEN":
      return {
        ...state,
        isFullscreen: action.isFullscreen,
      };
    default:
      throw new Error(`Unhandled action type`);
  }
};

export const viewerReducer = import.meta.env.DEV
  ? viewerReducerDebug
  : viewerReducerProd;

export const useViewerContext = () => {
  const context = useContext(ViewerContext);
  if (context === undefined) {
    throw new Error("useViewerContext must be used within a ViewerProvider");
  }
  return context;
};

export type ViewerContextType = ReturnType<typeof useViewerContext>;
