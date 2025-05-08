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

      // Apply or remove fullscreen styles
      if (containerRef.current) {
        if (newIsFullscreen) {
          containerRef.current.style.width = "100vw";
          containerRef.current.style.height = "100vh";
          containerRef.current.style.overflow = "auto";
        } else {
          containerRef.current.style.width = "";
          containerRef.current.style.height = "";
          containerRef.current.style.overflow = "";
        }
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    // Propagate the fullscreen state to the containerRef when it has a value
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
