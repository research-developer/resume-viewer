import { Resume } from "../../ResumeModel";
import { getGravatarUrl } from "./GravatarUtil";
import { buildTimeline, TimelineData } from "./TimelineModel";

export interface VisualizerData {
  resume: Resume;
  timeline: TimelineData;
  gravatarUrl: string | null;
}

export async function buildVisualizerData(
  resume: Resume | null
): Promise<VisualizerData | null> {
  console.time("buildVisualizerData");
  try {
    if (!resume) {
      console.warn("No resume data provided, returning null.");
      return null;
    }
    const timeline = buildTimeline(resume.work || []);
    const gravatarUrl = await getGravatarUrl(resume.basics?.email || "", 200);
    return { resume, timeline, gravatarUrl };
  } finally {
    console.timeEnd("buildVisualizerData");
  }
}
