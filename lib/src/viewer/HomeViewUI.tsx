import { FC, useEffect, useState } from "react";
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
  const [isLoaded, setIsLoaded] = useState(false);
  const [visibleButtons, setVisibleButtons] = useState<boolean[]>([]);

  // Animation on mount - initial component appearance
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Create separate state to track which buttons are visible
  useEffect(() => {
    if (!isLoaded) return;

    // Start with all buttons invisible
    const buttonCount = navItems.length;
    setVisibleButtons(new Array(buttonCount).fill(false));

    // Show each button after its delay
    navItems.forEach((item, index) => {
      setTimeout(() => {
        setVisibleButtons((prev) => {
          const updated = [...prev];
          updated[index] = true;
          return updated;
        });
      }, item.delay);
    });
  }, [isLoaded]);

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

  const initialDelay = 500; // Initial delay for the first button
  const buttonDelay = 300; // Delay between each button's appearance
  const navItems = [
    {
      label: "Infographic View",
      description: "A visual representation of the resume.",
      icon: <ChartBarIcon className="w-6 h-6 text-white" />,
      view: ViewerView.Infographic,
      color: "from-accent-blue-dark to-accent-blue",
      glow: "shadow-md hover:shadow-lg hover:shadow-accent-blue/20",
      delay: initialDelay,
    },
    {
      label: "Visualizer View",
      description: "Interactive exploration of the resume.",
      icon: <EyeIcon className="w-6 h-6 text-white" />,
      view: ViewerView.Visualizer,
      color: "from-accent-green-dark to-accent-green",
      glow: "shadow-md hover:shadow-lg hover:shadow-accent-green/20",
      delay: initialDelay + buttonDelay,
    },
    {
      label: "Text View",
      description: "A clean, readable text format.",
      icon: <DocumentTextIcon className="w-6 h-6 text-white" />,
      view: ViewerView.Text,
      color: "from-accent-orange-dark to-accent-orange",
      glow: "shadow-md hover:shadow-lg hover:shadow-accent-orange/20",
      delay: initialDelay + buttonDelay * 2,
    },
    {
      label: "JSON View",
      description: "The raw JSON data of the resume.",
      icon: <CodeBracketIcon className="w-6 h-6 text-white" />,
      view: ViewerView.Json,
      color: "from-accent-purple-dark to-accent-purple",
      glow: "shadow-md hover:shadow-lg hover:shadow-accent-purple/20",
      delay: initialDelay + buttonDelay * 3,
    },
  ];

  const handleReturnToWelcome = () => {
    dispatch({ type: "SET_VIEW", view: ViewerView.Welcome });
  };

  return (
    <div className="p-6 flex flex-col items-center justify-center m-auto min-h-screen from-background via-background to-surface">
      <div
        className={`w-full max-w-4xl rounded-[var(--radius-card)] bg-[var(--glass-bg)] backdrop-blur-[var(--glass-blur)] border border-[var(--glass-border)] shadow-[var(--shadow-card)] gap-6 flex flex-col transform transition-all duration-700 ease-out ${
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        {/* Profile Section */}
        <div
          className={`flex flex-col items-center pt-8 pb-6 text-secondary relative transition-all duration-${initialDelay} delay-250 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Avatar with glow effect */}
          <div className="w-48 h-48 mb-6 rounded-full p-1 bg-gradient-to-br from-accent-blue via-accent-cyan to-accent-purple shadow-[var(--neon-glow)]">
            <div className="w-full h-full overflow-hidden rounded-full border-2 border-[var(--glass-border)]">
              <GravatarUI
                email={email}
                name={name}
                size={180}
                className="rounded-avatar"
                style={{
                  width: "100%",
                  height: "100%",
                }}
                defaultImage={gravatarUrl || undefined}
              />
            </div>
          </div>

          {/* Name & Title */}
          <h2 className="text-primary text-4xl font-bold text-center bg-gradient-to-r from-accent-blue to-accent-purple bg-clip-text text-transparent">
            {name}
          </h2>
          <p className="text-2xl text-secondary text-center mt-1 mb-4">
            {label}
          </p>

          {/* Summary */}
          <div className="max-w-xl p-4">
            <p className="text-md text-secondary text-center leading-relaxed italic">
              "{summary}"
            </p>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="px-6 pb-6 grid grid-cols-1 md:grid-cols-2 gap-5">
          {navItems.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleNavigate(item.view)}
              className={`group flex items-start gap-4 p-5 rounded-[var(--radius-card)] bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-accent-blue/50 ${
                item.glow
              } transition-transform duration-200 ease-out hover:-translate-y-1 transform ${
                visibleButtons[idx]
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <div
                className={`flex-none p-2.5 bg-gradient-to-br ${item.color} rounded-lg flex items-center justify-center border border-white/10 group-hover:scale-105 transition-transform duration-200 ease-out`}
              >
                {item.icon}
              </div>
              <div className="text-left">
                <h3 className="text-primary text-lg font-bold">{item.label}</h3>
                <p className="text-secondary text-sm mt-1">
                  {item.description}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Footer Note */}
        <div className="p-4 flex flex-col sm:flex-row gap-2 sm:items-center text-xs text-muted border-t border-border pt-4 bg-gradient-to-r from-surface to-background/50 rounded-b-[var(--radius-card)]">
          <div className="flex-auto flex items-center justify-center sm:justify-start gap-2">
            <button
              onClick={handleReturnToWelcome}
              className="flex-none flex items-center gap-2 text-muted hover:text-primary transition group"
            >
              <ArrowPathIcon className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
              <span>Choose a different resume</span>
            </button>
          </div>

          <div className="flex-none flex flex-col gap-2 items-center justify-center">
            <div className="flex-none text-muted text-xs">
              Hand-crafted with ❤️ by{" "}
              <a
                href="https://www.richardadleta.com"
                className="text-accent-cyan hover:text-accent-cyan-light transition-colors"
                target="_blank"
                title="Richard Adleta"
              >
                Richard Adleta
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Ambient background elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-1/4 h-1/3 bg-accent-blue/5 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-accent-purple/5 rounded-full filter blur-3xl"></div>
      </div>
    </div>
  );
};
