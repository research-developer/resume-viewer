import React from "react";
import { ResumeProject } from "../ResumeModel";
import DateRangeUI from "./DateRangeUI";

interface ProjectUIProps {
  project: ResumeProject;
}

export const ProjectUI: React.FC<ProjectUIProps> = ({ project }) => {
  return (
    <div className="project-item">
      <div className="project-header">
        <h3 className="project-name">
          {project.url ? (
            <a href={project.url} target="_blank" rel="noopener noreferrer">
              {project.name}
            </a>
          ) : (
            project.name
          )}
        </h3>
      </div>

      {(project.startDate || project.endDate) && (
        <div className="project-date">
          <DateRangeUI
            startDate={project.startDate}
            endDate={project.endDate}
          />
        </div>
      )}

      {project.description && (
        <p className="project-description">{project.description}</p>
      )}

      {project.highlights && project.highlights.length > 0 && (
        <ul className="project-highlights">
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
    <section className="resume-projects">
      <h2>Projects</h2>
      {projectList.map((project, index) => (
        <ProjectUI key={index} project={project} />
      ))}
    </section>
  );
};
