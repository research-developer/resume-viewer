import React from "react";
import { ResumeCertificate } from "../../ResumeModel";
import DateUI from "./DateUI";

interface CertificateUIProps {
  certificate: ResumeCertificate;
}

export const CertificateUI: React.FC<CertificateUIProps> = ({
  certificate,
}) => {
  return (
    <div className="mb-4 pb-3 border-b border-gray-200 last:border-0">
      <h3 className="text-lg font-semibold text-gray-800">
        {certificate.url ? (
          <a
            href={certificate.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline hover:text-blue-800"
          >
            {certificate.name}
          </a>
        ) : (
          certificate.name
        )}
      </h3>

      <div className="mt-1 text-sm text-gray-600">
        {certificate.issuer && (
          <span className="mr-1">Issued by {certificate.issuer}</span>
        )}
        {certificate.date && certificate.issuer && (
          <span className="mx-1 text-gray-400">•</span>
        )}
        {certificate.date && (
          <span className="text-gray-500">
            <DateUI date={certificate.date} />
          </span>
        )}
      </div>
    </div>
  );
};

interface CertificateListUIProps {
  certificateList: ResumeCertificate[];
}

export const CertificateListUI: React.FC<CertificateListUIProps> = ({
  certificateList,
}) => {
  if (!certificateList || certificateList.length === 0) return null;

  return (
    <section className="mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-300">
        Certificates
      </h2>
      {certificateList.map((certificate, index) => (
        <CertificateUI key={index} certificate={certificate} />
      ))}
    </section>
  );
};
