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
    <div className="mb-4 pb-3 border-b border-gray-200 last:border-0">
      <h3 className="text-lg font-semibold text-gray-800">
        {publication.url ? (
          <a
            href={publication.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline hover:text-blue-800"
          >
            {publication.name}
          </a>
        ) : (
          publication.name
        )}
      </h3>

      <div className="mt-1 text-sm text-gray-600">
        {publication.publisher && (
          <span className="font-medium">{publication.publisher}</span>
        )}
        {publication.releaseDate && publication.publisher && (
          <span className="mx-1 text-gray-400">•</span>
        )}
        {publication.releaseDate && (
          <span className="text-gray-500">
            <DateUI date={publication.releaseDate} />
          </span>
        )}
      </div>

      {publication.summary && (
        <p className="mt-2 text-gray-700">{publication.summary}</p>
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
      <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-300">
        Publications
      </h2>
      {publicationList.map((publication, index) => (
        <PublicationUI key={index} publication={publication} />
      ))}
    </section>
  );
};
