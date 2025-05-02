import { useEffect, RefObject } from "react";

export function useFullscreen(
  containerRef: RefObject<HTMLDivElement | null>,
  isFullscreen: boolean | null,
  onFullscreenChange?: (isFullscreen: boolean) => void
) {
  // Attach the event listener to the document to listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      const newIsFullscreen = !!document.fullscreenElement;
      // Only dispatch if the state has changed
      if (isFullscreen !== newIsFullscreen) {
        onFullscreenChange?.(newIsFullscreen);
      }
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    // Propigate the fullscreen state to the containerRef when its has a value
    if (
      containerRef.current &&
      isFullscreen !== undefined &&
      isFullscreen !== null
    ) {
      if (isFullscreen) {
        containerRef.current.requestFullscreen().catch((err) => {
          console.error(
            `Error attempting to enable fullscreen: ${err.message}`
          );
        });
      } else if (document.fullscreenElement) {
        document.exitFullscreen();
      }
    }

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [isFullscreen, onFullscreenChange]);
}
