import { FC, ReactNode, useEffect, useState } from "react";

interface LoadingUIProps {
  isLoading?: boolean;
  children?: ReactNode;
  minDisplayTime?: number;
  fadeTransitionDuration?: number;
  initialEaseInDuration?: number;
  exitDuration?: number; // Added new prop for exit animation
}

export const LoadingUI: FC<LoadingUIProps> = ({
  isLoading = true,
  children,
  minDisplayTime = 1000,
  fadeTransitionDuration = 500,
  initialEaseInDuration = 500,
  exitDuration = 800, // Longer exit duration
}) => {
  const [showSpinner, setShowSpinner] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [loadStartTime, setLoadStartTime] = useState<number | null>(null);
  const [initialMount, setInitialMount] = useState(true);
  const [isExiting, setIsExiting] = useState(false); // New state to control exit animation

  // Handle initial animation on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialMount(false);
    }, 10); // Small delay to ensure DOM is ready for animation
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let spinnerTimer: number;
    let contentTimer: number;
    let exitingTimer: number;

    if (isLoading) {
      // Loading has started
      setShowSpinner(true);
      setShowContent(false);
      setIsExiting(false);
      setLoadStartTime(Date.now());
    } else if (loadStartTime) {
      // Loading has finished - ensure minimum display time
      const elapsedTime = Date.now() - loadStartTime;
      const remainingTime = Math.max(0, minDisplayTime - elapsedTime);

      spinnerTimer = setTimeout(() => {
        // Start exit animation
        setIsExiting(true);

        // After exit animation completes, hide spinner and show content
        exitingTimer = setTimeout(() => {
          setShowSpinner(false);

          // Add slight delay before showing content for smoother transition
          contentTimer = setTimeout(() => {
            setShowContent(true);
          }, fadeTransitionDuration / 2);
        }, exitDuration);
      }, remainingTime);
    }

    return () => {
      clearTimeout(spinnerTimer);
      clearTimeout(contentTimer);
      clearTimeout(exitingTimer);
    };
  }, [
    isLoading,
    loadStartTime,
    minDisplayTime,
    fadeTransitionDuration,
    exitDuration,
  ]);

  return (
    <div className="relative w-full h-full min-h-screen">
      {/* Content layer */}
      <div
        className="w-full h-full"
        style={{
          opacity: showContent ? 1 : 0,
          transition: `opacity ${fadeTransitionDuration}ms ease-in-out`,
          visibility: showContent ? "visible" : "hidden",
        }}
      >
        {children}
      </div>

      {/* Loading spinner layer */}
      <div
        className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50"
        style={{
          opacity: showSpinner ? 1 : 0,
          transition: `opacity ${exitDuration}ms ease-in-out`,
          pointerEvents: showSpinner ? "auto" : "none",
          visibility: showSpinner ? "visible" : "hidden",
        }}
      >
        <div
          className="relative w-16 h-16"
          style={{
            opacity: initialMount ? 0 : isExiting ? 0 : 1,
            transform: initialMount
              ? "scale(0.8)"
              : isExiting
              ? "scale(1.2)"
              : "scale(1)",
            transition: isExiting
              ? `opacity ${exitDuration}ms ease-in-out, transform ${exitDuration}ms cubic-bezier(0.34, 1.56, 0.64, 1)`
              : `opacity ${initialEaseInDuration}ms ease-out, transform ${initialEaseInDuration}ms cubic-bezier(0.34, 1.56, 0.64, 1)`,
          }}
        >
          {/* Outer glowing ring */}
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-accent-blue animate-spin-fast"></div>

          {/* Inner glowing ring */}
          <div className="absolute inset-2 rounded-full border-4 border-transparent border-t-accent-cyan animate-spin-slow"></div>

          {/* Center dot */}
          <div
            className="absolute inset-5 bg-accent-blue rounded-full shadow-[var(--neon-glow-blue)]"
            style={{
              opacity: initialMount ? 0.5 : isExiting ? 0 : 1,
              transition: isExiting
                ? `opacity ${exitDuration * 0.7}ms ease-out`
                : `opacity ${initialEaseInDuration}ms ease-out`,
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};
