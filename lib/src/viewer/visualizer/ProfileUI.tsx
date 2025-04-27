import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { getInitials } from "./GravatarUtil";
import {
  useVisualizerContext,
  VisualizerStatus,
  VisualizerView,
} from "./VisualizerHook";
import { VisualizerData } from "./VisualizerModel";
import { destoryVisualization } from "./VisualizationUtil";

export const ProfileUI: React.FC = () => {
  const { state, dispatch } = useVisualizerContext();
  const { svgRef, status, data, currentView } = state;
  const centerImageRef = useRef<SVGImageElement>(null);

  useEffect(() => {
    // Only render when visualization is starting or started
    if (
      status === VisualizerStatus.Starting &&
      currentView === VisualizerView.Home
    ) {
      if (svgRef.current && data) {
        drawProfileVisualization(svgRef.current, dispatch, data);
      }
    } else if (status === VisualizerStatus.Stopping) {
      // If the status is not started, we can clear the SVG
      if (svgRef.current) {
        destoryVisualization(svgRef.current, ".profile-visualization");
      }
    }
  }, [data, svgRef, status, currentView, dispatch]);

  return null; // Component doesn't render any HTML directly, uses D3 with the SVG ref
};

async function drawProfileVisualization(
  svg: SVGSVGElement,
  dispatch: ReturnType<typeof useVisualizerContext>["dispatch"],
  data: VisualizerData
): Promise<void> {
  const { resume, gravatarUrl } = data;
  const { basics } = resume;
  const name = basics?.name || "Unknown";

  // Clear existing content
  destoryVisualization(svg, ".profile-visualization");

  // Get dimensions
  const width = 1024;
  const height = 768;
  const centerX = width / 2;
  const centerY = height / 2;

  // Define parameters
  const profileRadius = Math.min(width, height) * 0.15; // Size of central profile
  const segments = [
    {
      id: "skills",
      name: "Skills",
      color: "#3498db",
      count: resume.skills?.length || 0,
      view: VisualizerView.Skills,
    },
    {
      id: "work",
      name: "Experience",
      color: "#2ecc71",
      count: resume.work?.length || 0,
      view: VisualizerView.Work,
    },
    {
      id: "education",
      name: "Education",
      color: "#9b59b6",
      count: resume.education?.length || 0,
      view: VisualizerView.Education,
    },
    {
      id: "projects",
      name: "Projects",
      color: "#f1c40f",
      count: resume.projects?.length || 0,
      view: VisualizerView.Projects,
    },
    {
      id: "certificates",
      name: "Certificates",
      color: "#e74c3c",
      count: resume.certificates?.length || 0,
      view: VisualizerView.Certificates,
    },
    {
      id: "languages",
      name: "Languages",
      color: "#1abc9c",
      count: resume.languages?.length || 0,
      view: VisualizerView.Languages,
    },
  ];

  const innerRadius = profileRadius * 1.2;
  const outerRadius = profileRadius * 2;
  const textRadius = (innerRadius + outerRadius) / 2;

  // Create main container with transform
  const container = d3
    .select(svg)
    .append("g")
    .attr("class", "profile-visualization")
    .attr("transform", `translate(${centerX}, ${centerY})`)
    .style("opacity", 0);

  // Add subtle background glow
  container
    .append("circle")
    .attr("class", "background-glow")
    .attr("r", profileRadius * 1.15)
    .style("fill", "url(#glow-gradient)")
    .style("opacity", 0);

  // Create a radial gradient for the glow effect
  const defs = d3.select(svg).append("defs");

  const glowGradient = defs
    .append("radialGradient")
    .attr("id", "glow-gradient")
    .attr("gradientUnits", "userSpaceOnUse")
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("r", profileRadius * 1.2);

  glowGradient
    .append("stop")
    .attr("offset", "70%")
    .attr("stop-color", "#ffffff")
    .attr("stop-opacity", 0.6);

  glowGradient
    .append("stop")
    .attr("offset", "100%")
    .attr("stop-color", "#f0f0f0")
    .attr("stop-opacity", 0);

  // Create a clipping path for the profile image
  defs
    .append("clipPath")
    .attr("id", "profile-clip")
    .append("circle")
    .attr("r", profileRadius);

  // Profile background (white circle)
  container
    .append("circle")
    .attr("class", "profile-background")
    .attr("r", profileRadius)
    .style("fill", "white")
    .style("stroke", "#e0e0e0")
    .style("stroke-width", "2px");

  // Placeholder for profile image
  const imageGroup = container
    .append("g")
    .attr("clip-path", "url(#profile-clip)");

  // Gravatar image (conditionally rendered)
  const profileImage = imageGroup
    .append("image")
    .attr("class", "profile-image")
    .attr("xlink:href", gravatarUrl)
    .attr("x", -profileRadius)
    .attr("y", -profileRadius)
    .attr("width", profileRadius * 2)
    .attr("height", profileRadius * 2)
    .style("opacity", 0);

  // Fallback text with initials (shown if image fails to load)
  const initials = getInitials(name);
  const initialsText = container
    .append("text")
    .attr("class", "profile-initials")
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "middle")
    .attr("font-size", profileRadius * 0.6)
    .attr("font-weight", "bold")
    .style("fill", "#555")
    .style("opacity", 1)
    .text(initials);

  // Handle image load success
  profileImage.on("load", function () {
    // Hide initials and show image when loaded
    initialsText.transition().duration(500).style("opacity", 0);
    profileImage.transition().duration(800).style("opacity", 1);
  });

  // Handle image load error
  profileImage.on("error", function () {
    // Keep showing initials if image fails
    initialsText.transition().duration(500).style("opacity", 1);
  });

  // Create an arc generator for segments
  const arc = d3
    .arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius)
    .padAngle(0.02)
    .cornerRadius(5);

  // Create a pie layout for segments
  const pie = d3
    .pie<(typeof segments)[0]>()
    .sort(null)
    .value((d) => Math.max(5, d.count)); // Ensure minimum size for empty segments

  const segmentData = pie(segments);

  // Create segment group
  const segmentGroup = container.append("g").attr("class", "segments");

  // Add segments with labels
  const segment = segmentGroup
    .selectAll(".segment")
    .data(segmentData)
    .enter()
    .append("g")
    .attr("class", "segment")
    .style("cursor", "pointer");

  // Add segment paths
  segment
    .append("path")
    .attr("d", arc as any)
    .style("fill", (d) => d.data.color)
    .style("opacity", 0.7)
    .style("stroke", "#fff")
    .style("stroke-width", "1px")
    // .on("mouseover", function () {
    //   d3.select(this)
    //     .transition()
    //     .duration(200)
    //     .style("opacity", 1)
    //     .attr("transform", "scale(1.05)");
    // })
    // .on("mouseout", function () {
    //   d3.select(this)
    //     .transition()
    //     .duration(200)
    //     .style("opacity", 0.7)
    //     .attr("transform", "scale(1)");
    // })
    .on("click", function (event, d) {
      // TODO: find the center of the segment clicked
      const [x, y] = arc.centroid(d as any);

      // do a debug burst at the center of the segment clicked
      const burst = container
        .append("circle")
        .attr("class", "burst")
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", 0)
        .style("fill", d.data.color)
        .style("opacity", 0.8);
      burst
        .transition()
        .duration(500)
        .attr("r", 20)
        .style("opacity", 0)
        .remove();

      const angle = (d.startAngle + d.endAngle) / 2;

      // Adjust the outermost point based on the angle of the segment to the end of the current segment that is furthest from the center
      const outerMostPoint = {
        x: Math.cos(angle) * outerRadius,
        y: Math.sin(angle) * outerRadius,
        angleFromCenter: angle,
      };

      const selectedSegment = d.data;

      // Dispatch action to set the view and origin
      dispatch({
        type: "SET_VIEW",
        view: selectedSegment.view,
        origin: {
          x: outerMostPoint.x,
          y: outerMostPoint.y,
          angle: outerMostPoint.angleFromCenter,
        },
      });
    });

  // Add segment labels
  segment
    .append("text")
    .attr("transform", function (d) {
      const centroid = arc.centroid(d as any);
      const x = centroid[0];
      const y = centroid[1];
      const angle = (Math.atan2(y, x) * 180) / Math.PI;
      return `translate(${centroid}) rotate(${angle})`;
    })
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "middle")
    .attr("transform", function (d) {
      const [x, y] = arc.centroid(d as any);
      const angle = (((d.startAngle + d.endAngle) / 2) * 180) / Math.PI;
      const rotate = angle > 90 && angle < 270 ? angle + 180 : angle;
      return `translate(${x}, ${y}) rotate(${rotate})`;
    })
    .style("fill", "#fff")
    .style("font-weight", "bold")
    .style("font-size", "14px")
    .style("text-shadow", "0px 0px 2px rgba(0,0,0,0.5)")
    .text((d) => d.data.name);

  // Add count indicators
  segment
    .append("text")
    .attr("transform", function (d) {
      const [x, y] = arc.centroid(d as any);
      // Position slightly below the main label
      return `translate(${x}, ${y + 15})`;
    })
    .attr("text-anchor", "middle")
    .style("fill", "#fff")
    .style("font-size", "12px")
    .text((d) => (d.data.count > 0 ? d.data.count : ""));

  // Add name label beneath profile
  container
    .append("text")
    .attr("class", "name-label")
    .attr("y", profileRadius + 30)
    .attr("text-anchor", "middle")
    .attr("font-size", "24px")
    .attr("font-weight", "bold")
    .style("fill", "#333")
    .text(name);

  // Add job title/label if available
  if (basics?.label) {
    container
      .append("text")
      .attr("class", "job-title")
      .attr("y", profileRadius + 60)
      .attr("text-anchor", "middle")
      .attr("font-size", "16px")
      .style("fill", "#666")
      .text(basics.label);
  }

  // Add connecting lines from center to segments
  const connectionLines = container
    .append("g")
    .attr("class", "connection-lines");

  segmentData.forEach((d) => {
    const angle = (d.startAngle + d.endAngle) / 2;
    const innerPoint = [
      Math.cos(angle) * profileRadius,
      Math.sin(angle) * profileRadius,
    ];
    const outerPoint = [
      Math.cos(angle) * innerRadius,
      Math.sin(angle) * innerRadius,
    ];

    connectionLines
      .append("line")
      .attr("x1", innerPoint[0])
      .attr("y1", innerPoint[1])
      .attr("x2", outerPoint[0])
      .attr("y2", outerPoint[1])
      .style("stroke", d.data.color)
      .style("stroke-width", "2px")
      .style("stroke-dasharray", "3,3")
      .style("opacity", 0);
  });

  // Create animations for entrance
  container.transition().duration(1000).style("opacity", 1);

  container
    .select(".background-glow")
    .transition()
    .delay(200)
    .duration(1000)
    .style("opacity", 0.7);

  // Animate segments appearing one by one
  segment
    .selectAll("path")
    .style("transform", "scale(0)")
    .transition()
    .delay((_, i) => 500 + i * 100)
    .duration(800)
    .style("transform", "scale(1)")
    .ease(d3.easeBounce);

  // Animate connection lines
  connectionLines
    .selectAll("line")
    .transition()
    .delay((_, i) => 1000 + i * 100)
    .duration(500)
    .style("opacity", 0.5);
}
