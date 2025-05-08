import React, { useState, FC } from "react";
import { useViewerContext } from "./ViewerHook";

interface WelcomeViewUIProps {}

export const WelcomeViewUI: FC<WelcomeViewUIProps> = ({}) => {
  const [state] = useViewerContext();
  const { resume } = state;
  const [urlState, setUrlState] = useState<string>("");

  const submit = (newUrl: string) => {
    if (!resume) {
      console.error("Resume object is not available in viewerData");
      return;
    }
    if (resume.url === newUrl) {
      resume.refresh();
      return;
    }
    resume.setUrl(newUrl);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    submit(urlState);
  };

  const handleExampleClick = (url: string) => {
    setUrlState(url);
    submit(url);
  };

  return (
    <div className="min-h-full max-w-2xl m-auto p-6 flex flex-col items-center justify-center">
      <div className="rounded-[var(--radius-card)] shadow-[var(--shadow-card)] bg-surface border border-border">
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-accent-blue-dark to-accent-purple-dark p-6 text-center rounded-t-[var(--radius-card)]">
          <h1 className="text-3xl font-bold text-white">Resume Viewer</h1>
          <p className="text-base mt-2 text-secondary opacity-90">
            Interactive visualization for JSON Resume data
          </p>
        </div>

        <div className="p-[var(--spacing-card)] flex flex-col items-center gap-6">
          {/* Description */}
          <div className="text-secondary max-w-xl text-center">
            <p className="mb-3">
              Transform your standard{" "}
              <a
                href="https://jsonresume.org/getting-started"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-blue hover:underline"
              >
                JSON Resume
              </a>{" "}
              into an interactive, visually engaging presentation that
              highlights your professional experience.
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

          {/* OR */}
          <div className="text-muted text-md mt-4">OR</div>

          {/* Examples Section */}
          <div className="w-full">
            <h3 className="text-lg font-semibold text-primary mb-3 text-center">
              Try an Example Resume
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
            {/* Search other JSON Resumes via jsonresume.org */}
            <div className="text-muted text-sm mt-4 text-center">
              Search other JSON Resumes via{" "}
              <a
                href="https://registry.jsonresume.org/explore"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-blue hover:underline"
              >
                jsonresume.org/explore
              </a>
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
            <p className="mt-1">
              © 2025{" "}
              <a
                href="https://github.com/radleta/resume-viewer"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-blue hover:underline"
              >
                Resume Viewer
              </a>{" "}
              by <span className="text-accent-cyan">Richard Adleta</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
