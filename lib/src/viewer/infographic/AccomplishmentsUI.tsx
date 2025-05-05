import { FC, useMemo } from "react";
import { CardUI } from "./common/CardUI";
import { useViewerContext } from "../ViewerHook";
import { KPIStatUI } from "./common/KPIStatUI";

type AccomplishmentsUIProps = {};

export const AccomplishmentsUI: FC<
  AccomplishmentsUIProps
> = ({}: AccomplishmentsUIProps) => {
  const [state] = useViewerContext();
  const { resume: viewerData } = state;
  const { data: resumeData, isPending: resumeIsPending } = viewerData || {};
  const { resume, keyStats, skillStats } = resumeData || {};

  const accomplishments = useMemo(() => {
    if (resumeIsPending || !resumeData || !resume || !keyStats || !skillStats) {
      return null;
    }

    const totalSkills = skillStats.tree.size || 0;

    // Additional accomplishments
    const certifications = keyStats.stats?.totalCertifications || 0;
    const projects = keyStats.stats?.totalProjects || 0;
    const publications = keyStats.stats?.totalPublications || 0;
    const languages = keyStats.stats?.languages || 0;

    return {
      totalSkills,
      certifications,
      projects,
      publications,
      languages,
    };
  }, [resumeIsPending, resumeData, resume, keyStats, skillStats]);

  if (!accomplishments) {
    return null;
  }

  return (
    <CardUI size="flex-none" title={"Accomplishments"}>
      <div className="flex flex-col gap-6 w-full min-h-full justify-around justify-items-center">
        <KPIStatUI
          label="Skills"
          value={accomplishments.totalSkills.toString()}
        />

        {accomplishments.certifications > 0 && (
          <KPIStatUI
            label="Certifications"
            value={accomplishments.certifications.toString()}
          />
        )}

        {accomplishments.projects > 0 && (
          <KPIStatUI
            label="Projects"
            value={accomplishments.projects.toString()}
          />
        )}

        {accomplishments.publications > 0 && (
          <KPIStatUI
            label="Publications"
            value={accomplishments.publications.toString()}
          />
        )}

        {accomplishments.languages > 0 && (
          <KPIStatUI
            label="Languages"
            value={accomplishments.languages.toString()}
          />
        )}
      </div>
    </CardUI>
  );
};
