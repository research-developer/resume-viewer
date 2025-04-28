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

export function burstAt(element: SVGSVGElement, x: number, y: number) {
  const burst = d3
    .select(element)
    .append("g")
    .attr("class", "burst")
    .append("circle")
    .attr("cx", x)
    .attr("cy", y)
    .attr("r", 0)
    .style("fill", "steelblue")
    .style("opacity", 0.8);
  burst
    .transition()
    .duration(500)
    .attr("r", 24)
    .style("opacity", 0)
    .transition()
    .duration(500)
    .attr("r", 0)
    .on("end", function () {
      d3.select(this).interrupt().remove();
    });
}

export function getScale(
  element: SVGSVGElement,
  width: number,
  height: number
) {
  // Get the SVG dimensions from the element
  const svgRect = element.getBBox();

  // Calculate the scale factor based on the SVG dimensions to fit the view
  return 1 + Math.min(svgRect.width / width, svgRect.height / height);
}
