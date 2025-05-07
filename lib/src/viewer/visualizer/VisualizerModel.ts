import { Resume } from "@schema/ResumeSchema";
import { buildTimeline, TimelineData } from "./TimelineModel";

export interface VisualizerData {
  resume: Resume;
  timeline: TimelineData;
  gravatarUrl: string | null;
}

export async function buildVisualizerData(
  resume: Resume | null,
  gravatarUrl: string | null
): Promise<VisualizerData | null> {
  console.time("buildVisualizerData");
  try {
    if (!resume) {
      console.warn("No resume data provided, returning null.");
      return null;
    }
    const timeline = buildTimeline(resume.work || []);
    return { resume, timeline, gravatarUrl };
  } finally {
    console.timeEnd("buildVisualizerData");
  }
}
