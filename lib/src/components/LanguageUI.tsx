import React from "react";
import { ResumeLanguage } from "../ResumeModel";

interface LanguageUIProps {
  language: ResumeLanguage;
}

export const LanguageUI: React.FC<LanguageUIProps> = ({ language }) => {
  return (
    <div className="language-item">
      <span className="language-name">{language.language}</span>
      {language.fluency && (
        <span className="language-fluency"> ({language.fluency})</span>
      )}
    </div>
  );
};

interface LanguageListUIProps {
  languageList: ResumeLanguage[];
}

export const LanguageListUI: React.FC<LanguageListUIProps> = ({
  languageList,
}) => {
  if (!languageList || languageList.length === 0) return null;

  return (
    <section className="resume-languages">
      <h2>Languages</h2>
      <div className="languages-container">
        {languageList.map((language, index) => (
          <LanguageUI key={index} language={language} />
        ))}
      </div>
    </section>
  );
};
