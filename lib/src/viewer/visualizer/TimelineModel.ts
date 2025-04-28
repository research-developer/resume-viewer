import { ResumeWork } from "../../ResumeModel";

export interface TimelineEvent {
  name: string;
  startDate: Date;
  endDate: Date;
}

export interface TimelineData {
  now: Date;
  events: TimelineEvent[];
}

export function buildTimeline(workExperience: ResumeWork[]): TimelineData {
  const now = new Date();
  if (!workExperience || workExperience.length === 0)
    return { events: [], now };

  // clone the work experience array to avoid mutating the original data
  const workItems = [...workExperience];

  // order the work experience by start date
  workItems.sort((a, b) => {
    const startA = new Date(a.startDate).getTime();
    const startB = new Date(b.startDate).getTime();
    return startA - startB;
  });

  // create a timeline event for each work experience however we want to combine them when its a role change at the same company (name)
  const events: TimelineEvent[] = workItems.reduce(
    (acc: TimelineEvent[], work) => {
      const startDate = new Date(work.startDate).getTime();
      const endDate = work.endDate
        ? new Date(work.endDate).getTime()
        : Date.now();

      // Look backward for any events matching the same company name and see if the time overlaps
      const sameWorkNameEvent = acc.find((event) => {
        if (event.name === work.name) {
          // Check if the start date of the current work experience is before the end date of the existing event
          return startDate < (event.endDate ?? now).getTime();
        }
        return false;
      });
      if (sameWorkNameEvent) {
        // If they overlap, update the end date of the existing event to the later end date
        sameWorkNameEvent.endDate = new Date(
          Math.max((sameWorkNameEvent.endDate ?? now).getTime(), endDate)
        );
      } else {
        // Create a new event for this work experience
        acc.push({
          name: work.name,
          startDate: new Date(startDate),
          endDate: new Date(endDate) ?? now,
        });
      }

      return acc;
    },
    []
  );

  return { events, now };
}
