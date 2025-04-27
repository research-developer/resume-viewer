import * as d3 from "d3";

export function destoryVisualization(element: SVGSVGElement, selector: string) {
  if (!element) return; // No element to destroy
  // Clear any existing elements first
  const viz = d3.select(element).selectAll(selector);
  // Check if the visualization exists before trying to destroy it
  if (viz.empty()) return; // No timeline to destroy
  // Interrupt any ongoing animations and remove all elements
  viz.interrupt().selectAll("*").interrupt().remove();
  // Remove the timeline group itself
  viz.remove();
  console.log("Visualization destroyed.");
}
