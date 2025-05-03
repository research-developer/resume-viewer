import React, { useState, FC } from "react";
import { useViewerContext } from "./ViewerHook";

interface WelcomeViewUIProps {}

export const WelcomeViewUI: FC<WelcomeViewUIProps> = ({}) => {
  const [state] = useViewerContext();
  const { resume } = state;
  const [urlState, setUrlState] = useState<string>("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (urlState?.length > 0) {
      if (resume?.setUrl) {
        resume.setUrl(urlState);
      } else {
        console.error("setUrl function is not available in viewerData");
      }
    } else {
      console.warn("URL state is empty");
    }
  };

  const handleExampleClick = (exampleUrl: string) => {
    resume?.setUrl?.(exampleUrl);
  };

  return (
    <div className="flex-auto max-w-2xl mx-auto p-6 flex flex-col items-center justify-center">
      <div className="rounded-[var(--radius-card)] shadow-[var(--shadow-card)] bg-surface border border-border overflow-hidden">
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-accent-blue-dark to-accent-purple-dark p-6 text-center">
          <h1 className="text-3xl font-bold text-white">Resume Viewer</h1>
          <p className="text-base mt-2 text-secondary opacity-90">
            Interactive visualization for JSON Resume data
          </p>
        </div>

        <div className="p-[var(--spacing-card)] flex flex-col items-center gap-6">
          {/* Description */}
          <div className="text-secondary max-w-xl text-center">
            <p className="mb-3">
              Transform your standard JSON Resume into an interactive, visually
              engaging presentation that highlights your professional
              experience.
            </p>
            <p>
              Built with React and Tailwind CSS by{" "}
              <span className="text-accent-cyan">Richard Adleta</span> to
              showcase modern web development practices.
            </p>
          </div>

          {/* URL Input Form */}
          <form onSubmit={handleSubmit} className="w-full max-w-md mt-2">
            <div className="flex flex-col gap-4">
              <label
                htmlFor="resume-url"
                className="text-left text-primary font-medium"
              >
                Enter a JSON Resume URL
              </label>
              <div className="relative">
                <input
                  id="resume-url"
                  type="url"
                  value={urlState}
                  onChange={(e) => setUrlState(e.target.value)}
                  placeholder="https://example.com/resume.json"
                  className="px-4 py-3 bg-background border border-border rounded-[var(--radius-input)] text-primary w-full focus:border-accent-blue focus:outline-none transition-colors"
                  required
                />
              </div>
              <button
                type="submit"
                className="btn bg-accent-blue hover:bg-accent-blue-dark text-white font-semibold py-3 px-6 rounded-[var(--radius-button)] transition-colors mt-2"
              >
                Load Resume
              </button>
            </div>
          </form>

          {/* Examples Section */}
          <div className="w-full">
            <h3 className="text-lg font-semibold text-primary mb-3 text-center">
              Example Resumes
            </h3>
            <div className="flex flex-wrap gap-3 justify-center">
              <button
                onClick={() =>
                  handleExampleClick(
                    "https://www.richardadleta.com/assets/downloads/adleta_richard_resume_full.json"
                  )
                }
                className="btn text-sm border border-accent-blue text-accent-blue hover:bg-accent-blue hover:text-white"
              >
                Richard Adleta
              </button>
              <button
                onClick={() =>
                  handleExampleClick(
                    "https://registry.jsonresume.org/thomasdavis.json"
                  )
                }
                className="btn text-sm border border-accent-green text-accent-green hover:bg-accent-green hover:text-white"
              >
                Thomas Davis
              </button>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mt-4">
            <div className="text-center p-3">
              <div className="text-accent-cyan-light text-xl mb-2">🎨</div>
              <h4 className="font-semibold text-primary">Beautiful Design</h4>
              <p className="text-muted text-sm">
                Clean, modern UI with customizable themes
              </p>
            </div>
            <div className="text-center p-3">
              <div className="text-accent-green-light text-xl mb-2">📊</div>
              <h4 className="font-semibold text-primary">Data Visualization</h4>
              <p className="text-muted text-sm">
                Skills and experience brought to life
              </p>
            </div>
            <div className="text-center p-3">
              <div className="text-accent-purple-light text-xl mb-2">🔄</div>
              <h4 className="font-semibold text-primary">Multiple Views</h4>
              <p className="text-muted text-sm">
                Switch between presentation styles
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-4 text-xs text-muted text-center border-t border-border pt-4 w-full">
            <p>
              Based on the{" "}
              <a
                href="https://jsonresume.org/schema/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-blue hover:underline"
              >
                JSON Resume schema
              </a>
            </p>
            <p className="mt-1">
              © 2025 Resume Viewer by{" "}
              <span className="text-accent-cyan">Richard Adleta</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
