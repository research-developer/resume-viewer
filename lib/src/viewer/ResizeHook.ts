import { useEffect, RefObject, useState } from "react";

export interface Dimensions {
  width: number;
  height: number;
}

export function useResize(containerRef: RefObject<HTMLDivElement | null>) {
  const [dimensions, setDimensions] = useState<Dimensions | null>(null);

  // This effect runs only once when the component mounts to get the initial dimensions
  useEffect(() => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    setDimensions(rect);
  }, []);

  //
  useEffect(() => {
    if (!containerRef.current) return;

    // Function to set dimensions only when they are dirty
    // This prevents unnecessary re-renders and state updates
    const setDimensionsWhenDirty = (newDimensions: Dimensions) => {
      if (
        !dimensions ||
        dimensions.width !== newDimensions.width ||
        dimensions.height !== newDimensions.height
      ) {
        // Update the state only if the dimensions have changed
        setDimensions(newDimensions);
      }
    };

    // Create a debounced function to handle resize
    let resizeTimer: ReturnType<typeof setTimeout>;
    const handleResize = (entries: ResizeObserverEntry[]) => {
      clearTimeout(resizeTimer);

      resizeTimer = setTimeout(() => {
        if (!entries[0]) return;

        setDimensionsWhenDirty(entries[0].contentRect);
      }, 250);
    };

    // Create and setup the ResizeObserver
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(containerRef.current);

    // Cleanup
    return () => {
      clearTimeout(resizeTimer);
      resizeObserver.disconnect();
    };
  }, [dimensions]);

  return dimensions;
}

export type ResizeHookType = ReturnType<typeof useResize>;
