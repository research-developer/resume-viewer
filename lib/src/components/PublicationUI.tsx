import React from "react";
import { ResumePublication } from "../ResumeModel";
import DateUI from "./DateUI";

interface PublicationUIProps {
  publication: ResumePublication;
}

export const PublicationUI: React.FC<PublicationUIProps> = ({
  publication,
}) => {
  return (
    <div className="publication-item">
      <h3 className="publication-name">
        {publication.url ? (
          <a href={publication.url} target="_blank" rel="noopener noreferrer">
            {publication.name}
          </a>
        ) : (
          publication.name
        )}
      </h3>

      <div className="publication-details">
        {publication.publisher && (
          <span className="publication-publisher">{publication.publisher}</span>
        )}
        {publication.releaseDate && publication.publisher && <span> • </span>}
        {publication.releaseDate && (
          <span className="publication-date">
            <DateUI date={publication.releaseDate} />
          </span>
        )}
      </div>

      {publication.summary && (
        <p className="publication-summary">{publication.summary}</p>
      )}
    </div>
  );
};

interface PublicationListUIProps {
  publicationList: ResumePublication[];
}

export const PublicationListUI: React.FC<PublicationListUIProps> = ({
  publicationList,
}) => {
  if (!publicationList || publicationList.length === 0) return null;

  return (
    <section className="resume-publications">
      <h2>Publications</h2>
      {publicationList.map((publication, index) => (
        <PublicationUI key={index} publication={publication} />
      ))}
    </section>
  );
};
