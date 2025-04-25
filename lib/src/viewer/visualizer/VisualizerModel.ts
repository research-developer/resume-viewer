import { Resume } from "../../ResumeModel";
import { buildTimeline, TimelineData } from "./TimelineModel";

export interface VisualizerData {
  resume: Resume;
  timeline: TimelineData;
}

export function buildVisualizerData(
  resume: Resume | null
): VisualizerData | null {
  console.time("buildVisualizerData");
  try {
    if (!resume) {
      console.warn("No resume data provided, returning null.");
      return null;
    }
    const timeline = buildTimeline(resume.work || []);
    return { resume, timeline };
  } finally {
    console.timeEnd("buildVisualizerData");
  }
}
