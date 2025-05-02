import React from "react";
import { ResumeLanguage } from "../../ResumeModel";

interface LanguageUIProps {
  language: ResumeLanguage;
}

export const LanguageUI: React.FC<LanguageUIProps> = ({ language }) => {
  return (
    <div className="bg-accent px-3 py-2 rounded-md inline-block mr-2 mb-2">
      <span className="font-medium text-primary">{language.language}</span>
      {language.fluency && (
        <span className="text-muted text-sm ml-1">({language.fluency})</span>
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
    <section className="mb-6">
      <h2 className="text-xl font-bold text-primary mb-4 pb-2 border-b border-border">
        Languages
      </h2>
      <div className="flex flex-wrap">
        {languageList.map((language, index) => (
          <LanguageUI key={index} language={language} />
        ))}
      </div>
    </section>
  );
};
