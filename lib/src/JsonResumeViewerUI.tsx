import { useState, FC } from "react";
import { useResume } from "./ResumeHook";
import { ResumeUI } from "./components/ResumeUI";

type JsonResumeViewerProps = {
  jsonResumeUrl: string;
};

export const JsonResumeViewer: FC<JsonResumeViewerProps> = ({
  jsonResumeUrl,
}) => {
  const { data, loading, error } = useResume(jsonResumeUrl);

  if (loading) {
    return <div className="text-gray-500">Loading resume...</div>;
  }

  if (error) {
    return (
      <div className="text-red-500">Error loading resume: {error.message}</div>
    );
  }

  return (
    <>
      <div className="mt-4">
        <a
          href={jsonResumeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline hover:text-blue-700"
        >
          View JSON Resume Source
        </a>
      </div>
      {data && <ResumeUI resume={data} />}
    </>
  );
};
