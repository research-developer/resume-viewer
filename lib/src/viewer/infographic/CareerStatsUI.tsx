import { FC, useMemo } from "react";
import { CardUI } from "./common/CardUI";
import { useViewerContext } from "../ViewerHook";
import { KPIStatUI } from "./common/KPIStatUI";
import { convertMonthsToYears, formatYears } from "./DisplayUtil";

type CareerStatsUIProps = {};

export const CareerStatsUI: FC<
  CareerStatsUIProps
> = ({}: CareerStatsUIProps) => {
  const [state] = useViewerContext();
  const { resume: viewerData } = state;
  const { data: resumeData, isPending: resumeIsPending } = viewerData || {};
  const { resume, keyStats } = resumeData || {};

  const careerStats = useMemo(() => {
    if (resumeIsPending || !resumeData || !resume || !keyStats) {
      return null;
    }

    const totalCompanies = new Set(
      resume.work?.map((w) => w.name?.toLocaleLowerCase())
    ).size;

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

    return {
      totalYears: keyStats.stats?.careerDuration,
      totalCompanies,
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
    };
  }, [resumeIsPending, resumeData, resume, keyStats]);

  if (!careerStats) {
    return null;
  }

  return (
    <CardUI title="Career">
      <div className="flex flex-col gap-6 w-full min-h-full justify-around justify-items-center">
        <KPIStatUI
          label="Years of Experience"
          value={formatYears(convertMonthsToYears(careerStats.totalYears))}
        />

        <KPIStatUI
          label="Companies"
          value={careerStats.totalCompanies.toString()}
        />

        {/* {careerStats.longestCompany.name && (
          <KPIStatUI
            label={`Longest at ${careerStats.longestCompany.name}`}
            value={formatYears(careerStats.longestCompany.years)}
          />
        )} */}

        {careerStats.careerProgressions > 0 && (
          <KPIStatUI
            label="Career Progressions"
            value={careerStats.careerProgressions.toString()}
          />
        )}
        {/* 
        {careerStats.currentPosition && (
          <KPIStatUI
            label={`Current: ${careerStats.currentPosition.title}`}
            value={formatYears(careerStats.currentPosition.years)}
            trend={
              careerStats.currentPosition.years > 1
                ? {
                    value: "Active",
                    direction: "up",
                  }
                : undefined
            }
          />
        )} */}
      </div>
    </CardUI>
  );
};
