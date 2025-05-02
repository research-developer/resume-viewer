import { FC, useState, useEffect } from "react";
import { useViewerContext, ViewerView } from "./ViewerHook";
import {
  ArrowsPointingInIcon,
  ArrowsPointingOutIcon,
  DocumentDuplicateIcon,
  ArrowDownTrayIcon,
  PrinterIcon,
  ChevronRightIcon,
} from "@heroicons/react/20/solid";

export const ViewerNavUI: FC = () => {
  const { state, dispatch } = useViewerContext();
  const { currentView, isFullscreen, data: viewerData } = state;
  const { data, isPending } = viewerData || { isPending: true, data: null };
  const [showToast, setShowToast] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Hide toast after 3 seconds
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  if (isPending || !data) return null;

  const handleViewChange = (view: ViewerView) => {
    dispatch({ type: "SET_VIEW", view });
  };

  const handleToggleFullscreen = () => {
    dispatch({ type: "TOGGLE_FULLSCREEN" });
  };

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "resume.json";
    a.click();
    URL.revokeObjectURL(url);
    setShowToast("Resume downloaded");
  };

  const handleCopy = () => {
    const text = JSON.stringify(data, null, 2);
    navigator.clipboard.writeText(text).then(
      () => setShowToast("Copied to clipboard"),
      (err) => setShowToast("Failed to copy")
    );
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 right-4 bg-surface border border-border rounded-lg shadow-lg px-4 py-2 text-primary z-50 animate-fade-in">
          {showToast}
        </div>
      )}

      {/* Navigation Bar */}
      <div
        className={`fixed ${
          isCollapsed ? "bottom-8 pl-8" : "bottom-2 right-4"
        } left-4 transition-all duration-300 ease-in-out z-40 max-w-[800px]`}
      >
        <div
          className={`${
            isCollapsed
              ? "w-0 h-0 transform translate-y-0"
              : "transform translate-y-0"
          } rounded-full bg-surface/25 backdrop-blur-sm border border-border shadow-lg flex ${
            isCollapsed
              ? "items-center justify-center"
              : "items-center justify-between px-4 py-2"
          } transition-all duration-500 ease-in-out`}
          style={{
            animation: isCollapsed
              ? "collapse 0.5s ease forwards"
              : "expand 0.5s ease forwards",
          }}
        >
          {/* Collapse Toggle - Fixed arrow direction */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="!p-1 !bg-accent/50 !active:bg-accent text-muted hover:text-primary p-1 rounded-full focus:outline-none focus:ring-1 focus:ring-accent transition-transform duration-300"
            title={isCollapsed ? "Expand toolbar" : "Collapse toolbar"}
          >
            <ChevronRightIcon
              className={`w-5 h-5 transition-transform duration-300 ${
                isCollapsed ? "rotate-180" : ""
              }`}
            />
          </button>

          {!isCollapsed && (
            <div className="flex flex-grow justify-between animate-fade-in transition-opacity duration-300">
              {/* View Switcher */}
              <div className="flex-auto flex justify-center gap-2">
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-muted mr-2">View:</span>
                  <div className="flex overflow-hidden gap-2">
                    <button
                      onClick={() => handleViewChange(ViewerView.Infographic)}
                      className={`px-3 py-1 text-xs font-medium ${
                        currentView === ViewerView.Infographic
                          ? "bg-accent-blue text-white"
                          : "text-secondary hover:bg-background"
                      }`}
                      title="Infographic View (Alt+1)"
                    >
                      <span className="hidden sm:inline">Infographic</span>
                      <span className="sm:hidden">📊</span>
                    </button>
                    <button
                      onClick={() => handleViewChange(ViewerView.Visualizer)}
                      className={`px-3 py-1 text-xs font-medium ${
                        currentView === ViewerView.Visualizer
                          ? "bg-accent-blue text-white"
                          : "text-secondary hover:bg-background"
                      }`}
                      title="Visualizer View (Alt+1)"
                    >
                      <span className="hidden sm:inline">Visualizer</span>
                      <span className="sm:hidden"></span>
                    </button>
                    <button
                      onClick={() => handleViewChange(ViewerView.Text)}
                      className={`px-3 py-1 text-xs font-medium ${
                        currentView === ViewerView.Text
                          ? "bg-accent-blue text-white"
                          : "text-secondary hover:bg-background"
                      }`}
                      title="Text View (Alt+2)"
                    >
                      <span className="hidden sm:inline">Text</span>
                      <span className="sm:hidden">📝</span>
                    </button>
                    <button
                      onClick={() => handleViewChange(ViewerView.Json)}
                      className={`px-3 py-1 text-xs font-medium ${
                        currentView === ViewerView.Json
                          ? "bg-accent-blue text-white"
                          : "text-secondary hover:bg-background"
                      }`}
                      title="JSON View (Alt+3)"
                    >
                      <span className="hidden sm:inline">JSON</span>
                      <span className="sm:hidden">{}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Side Actions */}
              <div className="flex items-center space-x-2">
                {/* Dynamic actions based on current view */}
                {currentView === ViewerView.Text && (
                  <button
                    onClick={handlePrint}
                    className="p-1.5 rounded-full"
                    title="Print resume (Ctrl+P)"
                  >
                    <PrinterIcon className="w-4 h-4" />
                  </button>
                )}

                <button
                  onClick={handleToggleFullscreen}
                  className="p-1.5 rounded-full"
                  title="Toggle fullscreen (F11)"
                >
                  {isFullscreen ? (
                    <ArrowsPointingInIcon className="w-4 h-4" />
                  ) : (
                    <ArrowsPointingOutIcon className="w-4 h-4" />
                  )}
                </button>

                <div className="h-4 border-r border-border mx-1"></div>

                <button
                  onClick={handleCopy}
                  className="p-1.5 rounded-full"
                  title="Copy resume data to clipboard"
                >
                  <DocumentDuplicateIcon className="w-4 h-4" />
                </button>

                <button
                  onClick={handleDownload}
                  className="p-1.5 rounded-full"
                  title="Download resume as JSON"
                >
                  <ArrowDownTrayIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes collapse {
          0% {
            max-height: 60px;
            width: 100%;
            right: 4px;
            left: 0;
          }
          50% {
            max-height: 40px;
            width: 70%;
            right: 0;
            left: auto;
          }
          100% {
            max-height: 48px;
            width: 0;
            right: 0;
            left: auto;
          }
        }
        
        @keyframes expand {
          0% {
            max-height: 48px;
            width: 0;
            right: 0;
            left: auto;
          }
          50% {
            max-height: 40px;
            width: 70%;
            right: 0;
            left: auto;
          }
          100% {
            max-height: 60px;
            width: 100%;
            right: 0;
            left: 0;
          }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>

      {/* Keyboard Shortcut Handler */}
      <KeyboardShortcuts
        handleFullscreen={handleToggleFullscreen}
        handleViewChange={handleViewChange}
      />
    </>
  );
};

// Helper component for keyboard shortcuts
const KeyboardShortcuts: FC<{
  handleFullscreen: () => void;
  handleViewChange: (view: ViewerView) => void;
}> = ({ handleFullscreen, handleViewChange }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt+1/2/3 for view switching
      if (e.altKey) {
        if (e.key === "1") handleViewChange(ViewerView.Infographic);
        if (e.key === "2") handleViewChange(ViewerView.Text);
        if (e.key === "3") handleViewChange(ViewerView.Json);
      }

      // F11 for fullscreen
      if (e.key === "F11") {
        e.preventDefault();
        handleFullscreen();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleFullscreen, handleViewChange]);

  return null;
};
