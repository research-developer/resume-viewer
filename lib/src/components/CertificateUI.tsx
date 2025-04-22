import React from "react";
import { ResumeCertificate } from "../ResumeModel";
import DateUI from "./DateUI";

interface CertificateUIProps {
  certificate: ResumeCertificate;
}

export const CertificateUI: React.FC<CertificateUIProps> = ({
  certificate,
}) => {
  return (
    <div className="certificate-item">
      <h3 className="certificate-name">
        {certificate.url ? (
          <a href={certificate.url} target="_blank" rel="noopener noreferrer">
            {certificate.name}
          </a>
        ) : (
          certificate.name
        )}
      </h3>

      <div className="certificate-details">
        {certificate.issuer && (
          <span className="certificate-issuer">
            Issued by {certificate.issuer}
          </span>
        )}
        {certificate.date && certificate.issuer && <span> • </span>}
        {certificate.date && (
          <span className="certificate-date">
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
    <section className="resume-certificates">
      <h2>Certificates</h2>
      {certificateList.map((certificate, index) => (
        <CertificateUI key={index} certificate={certificate} />
      ))}
    </section>
  );
};
