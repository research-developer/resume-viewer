import { FC, useState, useEffect } from "react";
import { useViewerContext, ViewerView } from "./ViewerHook";
import {
  ArrowsPointingInIcon,
  ArrowsPointingOutIcon,
  DocumentDuplicateIcon,
  ArrowDownTrayIcon,
  PrinterIcon,
  ChevronRightIcon,
  ChartBarIcon,
  DocumentTextIcon,
  CodeBracketIcon,
  EyeIcon,
  HomeIcon,
} from "@heroicons/react/20/solid";

export const ViewerNavUI: FC = () => {
  const [state, dispatch] = useViewerContext();
  const { currentView, isFullscreen, resume } = state;
  const { isPending, data: resumeData } = resume || {};
  const [showToast, setShowToast] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Hide toast after 3 seconds
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  if (isPending || !resumeData) return null;

  const handleViewChange = (view: ViewerView) => {
    dispatch({ type: "SET_VIEW", view });
  };

  const handleToggleFullscreen = () => {
    dispatch({ type: "TOGGLE_FULLSCREEN" });
  };

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(resumeData.resume, null, 2)], {
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
    const text = JSON.stringify(resumeData.resume, null, 2);
    navigator.clipboard.writeText(text).then(
      () => setShowToast("Copied to clipboard"),
      () => setShowToast("Failed to copy")
    );
  };

  const handlePrint = () => {
    window.print();
  };

  const handleGoToHome = () => {
    dispatch({ type: "SET_VIEW", view: ViewerView.Home });
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
          isCollapsed ? "" : ""
        } bottom-2 left-4 right-4 transition-all duration-500 ease-in-out z-40 max-w-[800px]`}
      >
        <div
          className={`p-2 rounded-full bg-accent-blue/25 backdrop-blur-sm border border-border shadow-lg flex items-center ${
            isCollapsed
              ? "items-start justify-start"
              : "items-center justify-between"
          } transition-all duration-2000 ease-in-out`}
          style={{
            animation: isCollapsed
              ? "collapse 0.5s ease forwards"
              : "expand 0.5s ease backwards",
          }}
        >
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="bg-accent-blue/75 active:bg-accent-blue text-accent-blue-light hover:text-primary hover:border-primary p-1 rounded-full focus:outline-none focus:ring-1 focus:ring-accent"
            title={isCollapsed ? "Expand toolbar" : "Collapse toolbar"}
          >
            <ChevronRightIcon
              className={`w-5 h-5 transition-transform duration-300 ${
                isCollapsed ? "rotate-180" : "rotate-0"
              }`}
            />
          </button>

          <div
            className={`overflow-hidden transition-all duration-500 ease-in-out ${
              isCollapsed ? "w-0 opacity-0" : "w-full opacity-100"
            }`}
          >
            <div
              className="flex flex-grow justify-between transition-transform duration-500 ease-in-out"
              style={{
                transform: isCollapsed ? "translateX(50px)" : "translateX(0px)",
              }}
            >
              {/* View Switcher */}
              <div className="flex-auto flex justify-center gap-2">
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-muted mr-2">View:</span>
                  <div className="flex overflow-hidden gap-2">
                    <button
                      onClick={() => handleViewChange(ViewerView.Infographic)}
                      className={`btn px-3 py-1 text-xs font-medium ${
                        currentView === ViewerView.Infographic ? "active" : ""
                      }`}
                      title="Infographic View (Alt+1)"
                    >
                      <span className="hidden sm:inline">Infographic</span>
                      <span className="sm:hidden">
                        <ChartBarIcon className="w-4 h-4" />
                      </span>
                    </button>
                    <button
                      onClick={() => handleViewChange(ViewerView.Visualizer)}
                      className={`btn px-3 py-1 text-xs font-medium ${
                        currentView === ViewerView.Visualizer ? "active" : ""
                      }`}
                      title="Visualizer View (Alt+1)"
                    >
                      <span className="hidden sm:inline">Visualizer</span>
                      <span className="sm:hidden">
                        <EyeIcon className="w-4 h-4" />
                      </span>
                    </button>
                    <button
                      onClick={() => handleViewChange(ViewerView.Text)}
                      className={`btn px-3 py-1 text-xs font-medium ${
                        currentView === ViewerView.Text ? "active" : ""
                      }`}
                      title="Text View (Alt+2)"
                    >
                      <span className="hidden sm:inline">Text</span>
                      <span className="sm:hidden">
                        <DocumentTextIcon className="w-4 h-4" />
                      </span>
                    </button>
                    <button
                      onClick={() => handleViewChange(ViewerView.Json)}
                      className={`btn px-3 py-1 text-xs font-medium ${
                        currentView === ViewerView.Json ? "active" : ""
                      }`}
                      title="JSON View (Alt+3)"
                    >
                      <span className="hidden sm:inline">JSON</span>
                      <span className="sm:hidden">
                        <CodeBracketIcon className="w-4 h-4" />
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Side Actions */}
              <div className="flex items-center gap-2">
                {/* Dynamic actions based on current view */}
                {currentView === ViewerView.Text && (
                  <button
                    onClick={handlePrint}
                    className="btn p-1.5 rounded-full"
                    title="Print resume (Ctrl+P)"
                  >
                    <PrinterIcon className="w-4 h-4" />
                  </button>
                )}

                <button
                  onClick={handleToggleFullscreen}
                  className="btn p-1.5 rounded-full"
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
                  className="btn p-1.5 rounded-full"
                  title="Copy resume data to clipboard"
                >
                  <DocumentDuplicateIcon className="w-4 h-4" />
                </button>

                <button
                  onClick={handleDownload}
                  className="btn p-1.5 rounded-full"
                  title="Download resume as JSON"
                >
                  <ArrowDownTrayIcon className="w-4 h-4" />
                </button>

                <div className="h-4 border-r border-border mx-1"></div>

                <button
                  onClick={handleGoToHome}
                  className="btn p-1.5 rounded-full"
                  title="Return to Home"
                >
                  <HomeIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes collapse {
          0% {
            max-height: 60px;
            width: 100%;
            left: 0;
            padding: 0 1rem 0 0;
          }
          100% {
            max-height: 48px;
            width: 48px;
            left: auto;
            padding: 0;
          }
        }
        
        @keyframes expand {
          0% {
            max-height: 48px;
            width: 48px;
            left: auto;
            padding: 0;
          }
          100% {
            max-height: 60px;
            width: 100%;
            left: 0;
            padding: 0 1rem 0 0;
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
