import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { getInitials } from "../../GravatarUtil";
import {
  useVisualizerContext,
  VisualizerAnimationStartPosition,
  VisualizerD3State,
  VisualizerDispatch,
  VisualizerStatus,
  VisualizerView,
} from "./VisualizerHook";
import { VisualizerData } from "./VisualizerModel";
import { destoryVisualization, getScale } from "./VisualizationUtil";

export const ProfileUI: React.FC = () => {
  const { state } = useVisualizerContext();
  const { d3State } = state;

  // Trigger replay animation when isAnimating changes
  useEffect(() => {
    d3State.dispatch.on("DRAW_PROFILE", function () {
      if (!d3State.svgRef.current) return; // Ensure the SVG reference is available
      if (this.type === "DRAW_PROFILE") {
        drawProfileVisualization(d3State, this.data, this.origin);
      }
    });

    return () => {
      // Clean up the event listener when the component unmounts
      d3State.dispatch.on("DRAW_PROFILE", null);
    };
  }, [d3State]);

  return null; // Component doesn't render any HTML directly, uses D3 with the SVG ref
};

async function drawProfileVisualization(
  d3State: VisualizerD3State,
  data: VisualizerData,
  origin: VisualizerAnimationStartPosition
): Promise<void> {
  const { svgRef, rootRef, dispatch, zoom, width, height, minZoom, maxZoom } =
    d3State;
  if (!svgRef.current || !rootRef.current) return;
  const { resume, gravatarUrl } = data;
  const { basics } = resume;
  const name = basics?.name || "Unknown";

  const svg = d3.select(svgRef.current);
  const root = d3.select(rootRef.current);

  // Get dimensions
  const centerX = width / 2;
  const centerY = height / 2;
  const scaleFactor = getScale(svgRef.current, width, height);

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

  // Create a base group to contain the layers of the visualization
  const layers = root
    .append("g")
    .classed("profile-visualization", true)
    .attr("transform", `translate(${centerX}, ${centerY})`)
    .style("opacity", 0);

  // Add the layers (g) to the base group so that they can be visually stacked
  const connectingLinesLayer = layers
    .append("g")
    .classed("connecting-lines-layer", true);
  const segmentsLayer = layers.append("g").classed("segments-layer", true);
  const profileLayer = layers.append("g").classed("profile-layer", true);

  // Add subtle background glow
  connectingLinesLayer
    .append("circle")
    .attr("class", "background-glow")
    .attr("r", profileRadius * 1.15)
    .style("fill", "url(#glow-gradient)")
    .style("opacity", 0);

  // Create a radial gradient for the glow effect
  const defs = svg.append("defs").classed(".profile-visualization", true);

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
  profileLayer
    .append("circle")
    .attr("class", "profile-background")
    .attr("r", profileRadius)
    .style("fill", "white")
    .style("stroke", "#e0e0e0")
    .style("stroke-width", "2px");

  // Placeholder for profile image
  const imageGroup = profileLayer
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
  const initialsText = profileLayer
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
  const segmentGroup = segmentsLayer.append("g").attr("class", "segments");

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
      // Find the center of the segment
      const [x, y] = arc.centroid(d as any);

      // Translate the coordinates to the SVG coordinate system
      const originX = centerX + x;
      const originY = centerY + y;

      // Dispatch action to set the view and origin
      const selectedSegment = d.data;
      if (selectedSegment?.view === VisualizerView.Work) {
        dispatch.call("DRAW_TIMELINE", {
          type: "DRAW_TIMELINE",
          data: data.timeline,
          origin: {
            x: originX,
            y: originY,
            angle: 0,
          },
        });
      } else {
        console.warn(
          `No action defined for segment ${selectedSegment.name} with view ${selectedSegment.view}`
        );
      }
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
      return `translate(${x}, ${y})`;
    })
    .attr("text-anchor", "middle")
    .style("fill", "#fff")
    .style("font-size", "12px")
    .text((d) => (d.data.count > 0 ? d.data.count : ""));

  // Add name label beneath profile
  profileLayer
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
    profileLayer
      .append("text")
      .attr("class", "job-title")
      .attr("y", profileRadius + 60)
      .attr("text-anchor", "middle")
      .attr("font-size", "16px")
      .style("fill", "#666")
      .text(basics.label);
  }

  // Add connecting lines from center to segments
  const connectionLines = connectingLinesLayer
    .append("g")
    .attr("class", "connection-lines");

  segmentData.forEach((d) => {
    const angle = (d.startAngle + d.endAngle) / 2;

    // Calculate points using D3's arc centroid method for consistency
    const segmentCentroid = arc.centroid(d as any);
    const centroidAngle = Math.atan2(segmentCentroid[1], segmentCentroid[0]);

    // Calculate points on the outer edge of profile image and inner edge of segment
    const innerPointX = Math.cos(centroidAngle) * profileRadius;
    const innerPointY = Math.sin(centroidAngle) * profileRadius;

    // Calculate the point on the inner edge of the segment
    const outerPointX = Math.cos(centroidAngle) * innerRadius;
    const outerPointY = Math.sin(centroidAngle) * innerRadius;

    // Create a line from the profile edge to the segment inner edge

    // Create a line from the profile edge to the segment inner edge
    connectionLines
      .append("line")
      .attr("x1", innerPointX)
      .attr("y1", innerPointY)
      .attr("x2", outerPointX)
      .attr("y2", outerPointY)
      .style("stroke", d.data.color)
      .style("stroke-width", "2px")
      .style("stroke-dasharray", "3,3")
      .style("opacity", 0);
  });

  // Create animations for entrance
  layers.transition().duration(1000).style("opacity", 1);

  layers
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
