import React from "react";
import { ResumeProject } from "../ResumeModel";
import DateRangeUI from "./DateRangeUI";

interface ProjectUIProps {
  project: ResumeProject;
}

export const ProjectUI: React.FC<ProjectUIProps> = ({ project }) => {
  return (
    <div className="mb-5 pb-4 border-b border-gray-200 last:border-0">
      <div className="mb-2">
        <h3 className="text-lg font-semibold text-gray-800">
          {project.url ? (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline hover:text-blue-800"
            >
              {project.name}
            </a>
          ) : (
            project.name
          )}
        </h3>
      </div>

      {(project.startDate || project.endDate) && (
        <div className="mb-2">
          <DateRangeUI
            startDate={project.startDate}
            endDate={project.endDate}
          />
        </div>
      )}

      {project.description && (
        <p className="text-gray-700 mb-3">{project.description}</p>
      )}

      {project.highlights && project.highlights.length > 0 && (
        <ul className="list-disc pl-5 space-y-1 text-gray-700">
          {project.highlights.map((highlight, index) => (
            <li key={index}>{highlight}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

interface ProjectListUIProps {
  projectList: ResumeProject[];
}

export const ProjectListUI: React.FC<ProjectListUIProps> = ({
  projectList,
}) => {
  if (!projectList || projectList.length === 0) return null;

  return (
    <section className="mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-300">
        Projects
      </h2>
      {projectList.map((project, index) => (
        <ProjectUI key={index} project={project} />
      ))}
    </section>
  );
};
