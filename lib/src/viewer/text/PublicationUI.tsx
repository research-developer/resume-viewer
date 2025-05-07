import React from "react";
import { ResumePublication } from "@schema/ResumeSchema";
import DateUI from "./DateUI";

interface PublicationUIProps {
  publication: ResumePublication;
}

export const PublicationUI: React.FC<PublicationUIProps> = ({
  publication,
}) => {
  return (
    <div className="mb-4 pb-3 border-b border-border last:border-0">
      <h3 className="text-lg font-semibold text-primary">
        {publication.url ? (
          <a
            href={publication.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent-blue hover:text-accent-blue-light hover:underline"
          >
            {publication.name}
          </a>
        ) : (
          publication.name
        )}
      </h3>

      <div className="mt-1 text-sm text-muted">
        {publication.publisher && (
          <span className="font-medium text-secondary">
            {publication.publisher}
          </span>
        )}
        {publication.releaseDate && publication.publisher && (
          <span className="mx-1 text-muted">•</span>
        )}
        {publication.releaseDate && (
          <span className="text-muted">
            <DateUI date={publication.releaseDate} />
          </span>
        )}
      </div>

      {publication.summary && (
        <p className="mt-2 text-secondary">{publication.summary}</p>
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
    <section className="mb-6">
      <h2 className="text-xl font-bold text-primary mb-4 pb-2 border-b border-border">
        Publications
      </h2>
      {publicationList.map((publication, index) => (
        <PublicationUI key={index} publication={publication} />
      ))}
    </section>
  );
};
