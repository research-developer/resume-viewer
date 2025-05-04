import { FC } from "react";
import { useViewerContext, ViewerView } from "./ViewerHook";
import { ProfileUI } from "./infographic/ProfileUI";
import {
  ChartBarIcon,
  EyeIcon,
  DocumentTextIcon,
  CodeBracketIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

export const ProfileCardViewUI: FC = () => {
  const [state, dispatch] = useViewerContext();
  const { resume } = state;
  const { data: resumeData } = resume || {};

  if (!resumeData) return null;

  const handleNavigate = (view: ViewerView) => {
    dispatch({ type: "SET_VIEW", view });
  };

  const navItems = [
    {
      label: "Infographic View",
      description: "A visual representation of the resume.",
      icon: <ChartBarIcon className="w-6 h-6 text-accent-blue" />,
      view: ViewerView.Infographic,
    },
    {
      label: "Visualizer View",
      description: "Interactive exploration of the resume.",
      icon: <EyeIcon className="w-6 h-6 text-accent-green" />,
      view: ViewerView.Visualizer,
    },
    {
      label: "Text View",
      description: "A clean, readable text format.",
      icon: <DocumentTextIcon className="w-6 h-6 text-accent-orange" />,
      view: ViewerView.Text,
    },
    {
      label: "JSON View",
      description: "The raw JSON data of the resume.",
      icon: <CodeBracketIcon className="w-6 h-6 text-accent-purple" />,
      view: ViewerView.Json,
    },
  ];

  const handleReturnToWelcome = () => {
    dispatch({ type: "SET_VIEW", view: ViewerView.Welcome });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-full w-full p-4">
      <div className="w-full max-w-4xl rounded-[var(--radius-card)] bg-[var(--glass-bg)] backdrop-blur-[var(--glass-blur)] border border-[var(--glass-border)] shadow-[var(--shadow-card)] p-8">
        {/* Profile Section */}
        <ProfileUI resume={resumeData.resume} />

        {/* Navigation Section */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {navItems.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleNavigate(item.view)}
              className="flex items-center gap-4 p-4 rounded-[var(--radius-card)] bg-[var(--color-surface)] border border-[var(--color-border)] shadow-md hover:shadow-lg hover:bg-accent-blue/10 transition-all"
            >
              <div>{item.icon}</div>
              <div className="text-left">
                <h3 className="text-primary text-lg font-semibold">
                  {item.label}
                </h3>
                <p className="text-secondary text-sm">{item.description}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Footer Note */}
        <div className="mt-10 flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-muted border-t border-border pt-4">
          <button
            onClick={handleReturnToWelcome}
            className="flex items-center gap-2 text-muted hover:text-primary transition"
          >
            <ArrowPathIcon className="w-4 h-4" />
            <span>Choose a different resume</span>
          </button>

          <p className="mt-4 sm:mt-0 text-center sm:text-right">
            Hand-crafted with ❤️ by{" "}
            <a
              href="https://www.richardadleta.com"
              className="text-accent-cyan"
              target="_blank"
              title="Richard Adleta"
            >
              Richard Adleta
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
