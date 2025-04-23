import { FC } from "react";
import { useResume } from "./ResumeHook";
import { ResumeUI } from "./components/ResumeUI";
import { useResumeStats } from "./ResumeStatsHook";
import { ResumeStatsUI } from "./components/ResumeStatsUI";

type JsonResumeViewerProps = {
  jsonResumeUrl: string;
};

export const JsonResumeViewer: FC<JsonResumeViewerProps> = ({
  jsonResumeUrl,
}) => {
  const { data, loading, error } = useResume(jsonResumeUrl);
  const stats = useResumeStats(data);

  if (loading) {
    return (
      <div className="p-4 text-center text-gray-500">Loading resume...</div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500 border border-red-200 rounded-lg bg-red-50">
        Error loading resume: {error.message}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="mb-4">
        <a
          href={jsonResumeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline hover:text-blue-700 flex items-center gap-1 text-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
              clipRule="evenodd"
            />
          </svg>
          View JSON Resume Source
        </a>
      </div>
      {data && (
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-gray-800 border-b pb-2 border-gray-200">
            Resume Viewer
          </h1>
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="w-full lg:w-2/3">
              <ResumeUI resume={data} />
            </div>
            <div className="w-full lg:w-1/3">
              <ResumeStatsUI stats={stats} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
