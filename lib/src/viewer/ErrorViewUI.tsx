import { FC } from "react";
import { ZodError } from "zod";

interface ErrorViewUIProps {
  error: Error | ZodError | unknown;
  onRetry?: () => void;
}

export const ErrorViewUI: FC<ErrorViewUIProps> = ({ error, onRetry }) => {
  // Determine if it's a ZodError (validation error)
  const isZodError =
    error instanceof Object &&
    "issues" in error &&
    Array.isArray((error as ZodError).issues);

  const zodError = isZodError ? (error as ZodError) : null;
  const standardError = !isZodError ? (error as Error) : null;

  const errorTitle = zodError
    ? "Resume Validation Error"
    : "Error Loading Resume";

  const errorMessage = standardError?.message || "An unknown error occurred";

  return (
    <div className="mx-auto max-w-2xl w-full min-h-full flex flex-col items-center justify-center">
      <div className="rounded-[var(--radius-card)] shadow-[var(--shadow-card)] bg-surface border border-border">
        {/* Error header with gradient background */}
        <div className="bg-gradient-to-r from-accent-red to-accent-orange p-6 text-center">
          <div className="flex justify-center mb-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">{errorTitle}</h1>
        </div>

        <div className="p-[var(--spacing-card)] flex flex-col items-center gap-5 text-secondary">
          {/* Standard error display */}
          {!isZodError && (
            <div className="text-center max-w-lg">
              <p className="text-lg mb-2 text-primary">{errorMessage}</p>
              <p className="text-muted text-sm">
                Please check that your JSON Resume URL is correct and try again.
                The resume data might be inaccessible or not formatted
                correctly.
              </p>
            </div>
          )}

          {/* ZodError detailed validation errors */}
          {zodError && (
            <div className="w-full">
              <p className="text-center mb-4">
                Your resume data doesn't match the expected format. Please fix
                the following issues:
              </p>

              <div className="bg-background rounded-lg border border-border p-4">
                <ul className="divide-y divide-border">
                  {zodError.issues.map((issue, index) => (
                    <li key={index} className="py-3 first:pt-0 last:pb-0">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mt-1">
                          <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-accent-red-light text-accent-red-dark text-xs font-bold">
                            {index + 1}
                          </span>
                        </div>
                        <div className="ml-3">
                          <p className="text-primary font-medium">
                            {issue.path.length > 0
                              ? issue.path.join(".")
                              : "Root object"}
                          </p>
                          <p className="text-sm text-muted mt-1">
                            {issue.message}
                          </p>
                          {issue.code === "invalid_type" && (
                            <p className="text-xs text-accent-red mt-1">
                              Expected {issue.expected}, received{" "}
                              {issue.received}
                            </p>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Possible solutions */}
          <div className="w-full mt-2 border-t border-border pt-5">
            <h3 className="text-lg font-semibold text-primary mb-3">
              Possible Solutions
            </h3>
            <ul className="list-disc pl-5 space-y-2 text-sm">
              <li>Check that your JSON Resume URL is correct</li>
              <li>
                Ensure your resume follows the{" "}
                <a
                  href="https://jsonresume.org/schema/"
                  className="text-accent-blue hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  JSON Resume schema
                </a>
              </li>
              <li>
                Verify that CORS is enabled if you're loading from a third-party
                source
              </li>
              {isZodError && (
                <li>
                  Update your JSON data to match the validation requirements
                </li>
              )}
            </ul>
          </div>

          {/* Actions */}
          <div className="flex gap-4 mt-2">
            {onRetry && (
              <button
                onClick={onRetry}
                className="btn hover:bg-accent-blue-dark text-white"
              >
                Try Again
              </button>
            )}
            <button
              onClick={() => window.location.reload()}
              className="btn bg-accent hover:bg-primary hover:text-accent"
            >
              Reload Page
            </button>
          </div>

          {/* Technical details (collapsible) */}
          {!isZodError && standardError && (
            <details className="w-full mt-4 text-sm">
              <summary className="cursor-pointer text-muted hover:text-primary">
                Technical Details
              </summary>
              <div className="mt-2 p-3 bg-background rounded-lg border border-border overflow-x-auto">
                <pre className="text-xs text-secondary whitespace-pre-wrap">
                  {standardError.stack || standardError.toString()}
                </pre>
              </div>
            </details>
          )}
        </div>
      </div>
    </div>
  );
};
