import { useEffect, RefObject } from "react";
import { useVisualizerContext } from "./VisualizerHook";

export function useFullscreen(containerRef: RefObject<HTMLDivElement | null>) {
  const { state, dispatch } = useVisualizerContext();
  const { isFullscreen } = state;

  useEffect(() => {
    const handleFullscreenChange = () => {
      const newIsFullscreen = !!document.fullscreenElement;
      // Only dispatch if the state has changed
      if (isFullscreen !== newIsFullscreen) {
        dispatch({
          type: "SET_FULLSCREEN",
          isFullscreen: newIsFullscreen,
        });
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [isFullscreen, dispatch]);

  useEffect(() => {
    if (!containerRef.current) return;
    if (isFullscreen == undefined || isFullscreen === null) return;
    if (isFullscreen) {
      containerRef.current?.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  }, [isFullscreen, containerRef]);
}
