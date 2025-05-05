import { FC, useMemo } from "react";
import { CardUI } from "./common/CardUI";
import { useViewerContext } from "../ViewerHook";
import { KPIStatUI } from "./common/KPIStatUI";
import { convertMonthsToYears, formatYears } from "./DisplayUtil";
import { CardTitleUI } from "./common/CardTitleUI";

type KeyStatsUIProps = {};

export const KeyStatsUI: FC<KeyStatsUIProps> = ({}: KeyStatsUIProps) => {
  const [state] = useViewerContext();
  const { resume: viewerData } = state;
  const { data: resumeData, isPending: resumeIsPending } = viewerData || {};
  const { resume, keyStats, skillStats } = resumeData || {};

  const kpis = useMemo(() => {
    if (resumeIsPending || !resumeData || !resume || !keyStats || !skillStats) {
      return null;
    }

    const totalCompanies = new Set(
      resume.work?.map((w) => w.name?.toLocaleLowerCase())
    ).size;
    const totalSkills = skillStats.tree.size || 0;

    // Get longestTenure details
    const longestTenure = keyStats.stats?.longestTenure;
    const longestCompanyYears = longestTenure
      ? convertMonthsToYears(longestTenure.months)
      : 0;

    // Career progression stats
    const progressions = keyStats.stats?.careerProgressions || 0;

    // Current position details
    const currentPosition = keyStats.stats?.currentPosition;
    const currentTenureYears = currentPosition
      ? convertMonthsToYears(currentPosition.months)
      : 0;

    // Additional accomplishments
    const certifications = keyStats.stats?.totalCertifications || 0;
    const projects = keyStats.stats?.totalProjects || 0;
    const publications = keyStats.stats?.totalPublications || 0;

    return {
      totalYears: keyStats.stats?.careerDuration,
      totalCompanies,
      totalSkills,
      longestCompany: {
        name: longestTenure?.company || "",
        years: longestCompanyYears,
      },
      careerProgressions: progressions,
      currentPosition: currentPosition
        ? {
            title: currentPosition.title,
            company: currentPosition.company,
            years: currentTenureYears,
          }
        : null,
      certifications,
      projects,
      publications,
    };
  }, [resumeIsPending, resumeData, resume]);

  if (!kpis) {
    return null;
  }

  return (
    <CardUI size="flex-none">
      <div className="flex flex-col gap-6 w-full min-h-full justify-around justify-items-center">
        <CardTitleUI title="Career Snapshot" />

        <KPIStatUI
          label="Years of Experience"
          value={formatYears(convertMonthsToYears(kpis.totalYears))}
        />

        <KPIStatUI label="Companies" value={kpis.totalCompanies.toString()} />

        <KPIStatUI label="Skills" value={kpis.totalSkills.toString()} />

        {kpis.longestCompany.name && (
          <KPIStatUI
            label={`Longest at ${kpis.longestCompany.name}`}
            value={formatYears(kpis.longestCompany.years)}
          />
        )}

        {kpis.careerProgressions > 0 && (
          <KPIStatUI
            label="Career Progressions"
            value={kpis.careerProgressions.toString()}
          />
        )}

        {kpis.currentPosition && (
          <KPIStatUI
            label={`Current: ${kpis.currentPosition.title}`}
            value={formatYears(kpis.currentPosition.years)}
            trend={
              kpis.currentPosition.years > 1
                ? {
                    value: "Active",
                    direction: "up",
                  }
                : undefined
            }
          />
        )}

        {(kpis.certifications > 0 || kpis.projects > 0) && (
          <div className="flex gap-4 justify-around w-full">
            {kpis.certifications > 0 && (
              <KPIStatUI
                label="Certifications"
                value={kpis.certifications.toString()}
              />
            )}

            {kpis.projects > 0 && (
              <KPIStatUI label="Projects" value={kpis.projects.toString()} />
            )}
          </div>
        )}
      </div>
    </CardUI>
  );
};
