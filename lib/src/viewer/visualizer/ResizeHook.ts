import { useEffect, RefObject, useState, useCallback } from "react";
import { useVisualizerContext } from "./VisualizerHook";

export function useResize(containerRef: RefObject<HTMLDivElement | null>) {
  const { dispatch } = useVisualizerContext();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const setDimensionsWhenDirty = useCallback(
    (newDimensions: { width: number; height: number }) => {
      if (
        dimensions.width !== newDimensions.width ||
        dimensions.height !== newDimensions.height
      ) {
        setDimensions(newDimensions);
      }
    },
    [dimensions]
  );

  useEffect(() => {
    if (!containerRef.current) return;

    // Create a debounced function to handle resize
    let resizeTimer: ReturnType<typeof setTimeout>;
    const handleResize = (entries: ResizeObserverEntry[]) => {
      clearTimeout(resizeTimer);

      resizeTimer = setTimeout(() => {
        if (!entries[0]) return;

        const { width, height } = entries[0].contentRect;

        // Only update if dimensions actually changed
        if (dimensions.width !== width || dimensions.height !== height) {
          setDimensionsWhenDirty({ width, height });

          // Dispatch the restart action to the reducer
          dispatch({ type: "RESTART" });
        }
      }, 250); // 250ms debounce timeout
    };

    // Create and setup the ResizeObserver
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(containerRef.current);

    // Initial size calculation
    if (containerRef.current) {
      setDimensionsWhenDirty({
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight,
      });
    }

    // Cleanup
    return () => {
      clearTimeout(resizeTimer);
      resizeObserver.disconnect();
    };
  }, [containerRef, dispatch, dimensions, setDimensionsWhenDirty]);

  return dimensions;
}
