import { FC } from "react";
import { useViewerContext, ViewerView } from "./ViewerHook";
import {
  ChartBarIcon,
  EyeIcon,
  DocumentTextIcon,
  CodeBracketIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { GravatarUI } from "../GravatarUI";

export const HomeViewUI: FC = () => {
  const [state, dispatch] = useViewerContext();
  const { resume: resumeState } = state;
  const { data: analyzer } = resumeState || {};

  if (!analyzer) return null;

  const { resume, gravatarUrl } = analyzer;
  const { basics } = resume;
  const summary = basics.summary || "No summary available.";
  const name = basics.name || "Unknown";
  const label = basics.label || "Unknown";
  const email = basics.email || "Unknown";

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
    <div className="flex flex-col items-center justify-center min-h-full w-full">
      <div className="pt-6 w-full max-w-4xl rounded-[var(--radius-card)] bg-[var(--glass-bg)] backdrop-blur-[var(--glass-blur)] border border-[var(--glass-border)] shadow-[var(--shadow-card)] gap-6 flex flex-col">
        {/* Profile Section */}
        <div className="flex flex-col items-center p-spacing-card text-secondary">
          {/* Avatar */}
          <div className="w-28 h-28 mb-4">
            <GravatarUI
              email={email}
              name={name}
              size={128}
              className="rounded-avatar border border-border shadow-md"
              style={{
                width: "100%",
                height: "100%",
              }}
              defaultImage={gravatarUrl || undefined}
            />
          </div>

          {/* Name & Title */}
          <h2 className="text-primary text-2xl font-bold text-center">
            {name}
          </h2>
          <p className="text-secondary text-sm text-center mt-1">{label}</p>

          {/* Summary */}
          <p className="text-secondary text-sm text-center mt-3 px-4 leading-relaxed">
            {summary}
          </p>
        </div>

        {/* Navigation Section */}
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
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
        <div className="p-4 flex flex-col sm:flex-row gap-2 sm:items-center  text-xs text-muted border-t border-border pt-4">
          <div className="flex-auto flex items-center justify-center sm:justify-start gap-2">
            <button
              onClick={handleReturnToWelcome}
              className="flex-none flex items-center gap-2 text-muted hover:text-primary transition"
            >
              <ArrowPathIcon className="w-4 h-4" />
              <span>Choose a different resume</span>
            </button>
          </div>

          <div className="flex-none flex flex-col gap-2 items-center justify-center">
            <div className="flex-none text-muted text-xs">
              Hand-crafted with ❤️ by{" "}
              <a
                href="https://www.richardadleta.com"
                className="text-accent-cyan"
                target="_blank"
                title="Richard Adleta"
              >
                Richard Adleta
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
