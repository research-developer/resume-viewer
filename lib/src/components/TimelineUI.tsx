import * as d3 from "d3";
import React, { useEffect, useMemo, useRef, useState } from "react";

import { ResumeWork } from "../ResumeModel";

interface TimelineUIProps {
  workExperience: ResumeWork[];
}

export const TimelineUI: React.FC<TimelineUIProps> = ({ workExperience }) => {
  const ref = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const timelineEvents = useMemo(
    () => buildTimeline(workExperience),
    [workExperience]
  );

  // Handler for fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen().catch((err) => {
          console.error(
            `Error attempting to enable fullscreen: ${err.message}`
          );
        });
      }
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  };

  // Replay timeline animation
  const replayTimeline = () => {
    if (ref.current) {
      // Clear and redraw the timeline
      d3.select(ref.current).selectAll("*").remove();
      drawTimeline(timelineEvents, ref.current);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (ref.current) {
        drawTimeline(timelineEvents, ref.current);
      }
    };

    if (ref.current) {
      drawTimeline(timelineEvents, ref.current);
    }

    // Add resize listener
    window.addEventListener("resize", handleResize);

    // Clean up
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [timelineEvents]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        backgroundColor: "#ffffff",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        ...(isFullscreen && {
          width: "100vw",
          height: "100vh",
          overflow: "hidden",
        }),
      }}
    >
      <svg
        className="container"
        ref={ref}
        style={{
          width: isFullscreen ? "100vw" : "100%",
          height: isFullscreen ? "100vh" : "100%",
          maxWidth: "100%",
          maxHeight: "100%",
        }}
        preserveAspectRatio="xMidYMid meet"
      ></svg>
      <div
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          display: "flex",
          gap: "10px",
          zIndex: 10,
        }}
      >
        <button
          onClick={replayTimeline}
          style={{
            border: "none",
            background: "rgba(255, 255, 255, 0.7)",
            borderRadius: "4px",
            width: "32px",
            height: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
            transition: "background 0.2s",
          }}
          title="Replay Timeline"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"
              fill="#333"
            />
          </svg>
        </button>
        <button
          onClick={toggleFullscreen}
          style={{
            border: "none",
            background: "rgba(255, 255, 255, 0.7)",
            borderRadius: "4px",
            width: "32px",
            height: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
            transition: "background 0.2s",
          }}
          title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isFullscreen ? (
              <path
                d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"
                fill="#333"
              />
            ) : (
              <path
                d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"
                fill="#333"
              />
            )}
          </svg>
        </button>
      </div>
    </div>
  );
};

interface TimelineEvent {
  name: string;
  startDate: number;
  endDate: number;
}

interface TimelineData {
  events: TimelineEvent[];
}

function buildTimeline(workExperience: ResumeWork[]): TimelineData {
  if (!workExperience || workExperience.length === 0) return { events: [] };

  // order the work experience by start date
  workExperience.sort((a, b) => {
    const startA = new Date(a.startDate).getTime();
    const startB = new Date(b.startDate).getTime();
    return startA - startB;
  });

  // create a timeline event for each work experience however we want to combine them when its a role change at the same company (name)
  const events: TimelineEvent[] = workExperience.reduce(
    (acc: TimelineEvent[], work) => {
      const startDate = new Date(work.startDate).getTime();
      const endDate = work.endDate
        ? new Date(work.endDate).getTime()
        : Date.now();

      // Look backward for any events matching the same company name and see if the time overlaps
      const sameWorkNameEvent = acc.find((event) => {
        if (event.name === work.name) {
          // Check if the start date of the current work experience is before the end date of the existing event
          return startDate < event.endDate;
        }
        return false;
      });
      if (sameWorkNameEvent) {
        // If they overlap, update the end date of the existing event to the later end date
        sameWorkNameEvent.endDate = Math.max(
          sameWorkNameEvent.endDate,
          endDate
        );
      } else {
        // Create a new event for this work experience
        acc.push({
          name: work.name,
          startDate: startDate,
          endDate: endDate,
        });
      }

      return acc;
    },
    []
  );

  return { events };
}

function drawTimeline(timeline: TimelineData, element: SVGSVGElement | null) {
  if (!element) return;

  const { events } = timeline;
  if (!events || events.length === 0) return;

  // Clear any existing elements first
  d3.select(element).selectAll("*").remove();

  const svg = d3.select(element);
  const width = element.clientWidth;
  const height = element.clientHeight;

  const margin = { top: 70, right: 50, bottom: 60, left: 50 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const yMid = innerHeight / 2; // Middle of the timeline

  // Find min and max dates for the domain
  const minDate = new Date(
    d3.min(events, (d: TimelineEvent) => d.startDate) || Date.now()
  );
  const maxDate = new Date(
    d3.max(events, (d: TimelineEvent) => d.endDate) || Date.now()
  );

  // Add padding to domain (3 months on each side)
  const domainPadding = 90 * 24 * 60 * 60 * 1000; // 90 days in milliseconds
  const paddedMinDate = new Date(minDate.getTime() - domainPadding);
  const paddedMaxDate = new Date(maxDate.getTime() + domainPadding);

  // Use scaleTime for the horizontal timeline
  const xScale = d3
    .scaleTime()
    .domain([paddedMinDate, paddedMaxDate])
    .range([0, innerWidth])
    .nice(); // rounds the domain to nice round values

  // Create a group for the visualization with proper margins
  const g = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Calculate positions for labels with improved staggering
  const dotRadius = 6;
  const baseLineLength = 40;
  const minLabelDistance = 150; // Increased minimum distance between labels
  const labelHeight = 14;
  const labelPadding = 15; // Increased padding for better spacing
  const maxLabelLength = 25; // Maximum characters for label before truncating

  // Assign levels to events based on their proximity
  const eventPositions = timeline.events
    .map((event) => {
      return {
        x: xScale(new Date(event.startDate)),
        event: event,
        level: 0, // Default level, will be updated
        direction: 0, // Direction for label placement
      };
    })
    .sort((a, b) => a.x - b.x); // Sort by x position

  // Assign vertical levels to avoid overlaps
  for (let i = 1; i < eventPositions.length; i++) {
    const curr = eventPositions[i];

    // Check previous events to see if they would overlap
    for (let j = 0; j < i; j++) {
      const prev = eventPositions[j];

      // If events are too close horizontally and on same level
      if (curr.x - prev.x < minLabelDistance && curr.level === prev.level) {
        // Move current event up a level
        curr.level = prev.level + 1;
        // Start checking again against previous events
        j = -1;
      }
    }
  }

  // Calculate max levels above and below timeline
  let maxUpLevel = 0;
  let maxDownLevel = 0;

  eventPositions.forEach((pos, i) => {
    // Even indexed levels go up, odd go down
    if (i % 2 === 0) {
      pos.direction = -1; // Up
      maxUpLevel = Math.max(maxUpLevel, pos.level);
    } else {
      pos.direction = 1; // Down
      maxDownLevel = Math.max(maxDownLevel, pos.level);
    }
  });

  // Add an arrow marker definition for ongoing events
  const defs = svg.append("defs");

  defs
    .append("marker")
    .attr("id", "arrow")
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 8)
    .attr("refY", 0)
    .attr("markerWidth", 3) // Reduced to be 2x smaller (was 6)
    .attr("markerHeight", 3) // Reduced to be 2x smaller (was 6)
    .attr("orient", "auto")
    .append("path")
    .attr("d", "M0,-5L10,0L0,5")
    .attr("fill", "steelblue");

  // Create a main group that will be transformed during zoom - needs to be created early
  const mainGroup = g
    .append("g")
    .attr("class", "main-group")
    .style("opacity", 0); // Start with opacity 0 for entrance animation

  // Add entrance animation for the main group
  mainGroup.transition().duration(800).style("opacity", 1);

  // Add the timeline baseline with left-to-right animation that triggers dots to appear
  const baselineAnimation = mainGroup
    .append("line")
    .attr("class", "timeline-baseline")
    .attr("x1", 0)
    .attr("y1", yMid)
    .attr("x2", innerWidth)
    .attr("y2", yMid)
    .attr("stroke", "#adb5bd")
    .attr("stroke-width", 2)
    .attr("stroke-dasharray", innerWidth) // Set dash array to line length
    .attr("stroke-dashoffset", innerWidth) // Initially offset by full length (invisible)
    .attr("opacity", 0.5) // Slightly transparent
    .attr("stroke-opacity", 0.8) // Slightly transparent
    .transition()
    .duration(15000) // Increased duration for slower animation
    .delay(300) // Start slightly before other animations
    .ease(d3.easeLinear) // Use linear easing for constant drawing speed
    .attr("stroke-dashoffset", 0) // Animate to 0 offset (fully visible)
    .on("end", function () {
      // Remove dash array after animation completes
      d3.select(this)
        .attr("stroke-dasharray", null)
        .attr("stroke-dashoffset", null);

      // Call the animateJobArcs function to clean up arcs
      animateJobArcs();
    });

  // Create a group for events but don't animate them yet - they'll be triggered by the baseline
  const eventsGroup = mainGroup
    .selectAll(".event")
    .data(eventPositions)
    .enter()
    .append("g")
    .attr("class", "event")
    .attr("transform", (d: any) => `translate(${d.x}, ${yMid})`)
    .style("opacity", 1);

  // Add circles with 0 radius - they'll be revealed when the baseline passes them
  const startEvents = eventsGroup
    .append("circle")
    .attr("r", 0)
    .attr("fill", "steelblue")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 1.5)
    .attr("transform", "scale(0.5)") // Scale down to 50%
    .attr("z-index", 2);

  // Add lines that grow after their respective dots appear
  const eventLines = eventsGroup
    .append("line")
    .attr("x1", 0)
    .attr("y1", 0)
    .attr("x2", 0)
    .attr("y2", 0) // Start with zero length
    .attr("stroke", "#999")
    .attr("stroke-width", 1)
    .attr("opacity", 0.5) // Slightly transparent
    .attr("z-index", 1); // Ensure it's on top of the arc

  // Draw curved arcs between start and end dates for each job with animated path drawing
  const arcHeight = 30; // Height of the arc bow from the timeline

  const jobArcs = mainGroup
    .selectAll(".job-duration")
    .data(timeline.events)
    .enter()
    .append("path")
    .attr("class", "job-duration")
    .attr("d", (d: TimelineEvent) => {
      const startX = xScale(new Date(d.startDate));
      const endX = xScale(new Date(d.endDate));
      const isOngoing = d.endDate >= Date.now() - 86400000; // Within a day of current date
      const todayX = xScale(new Date());

      // Calculate time difference in milliseconds
      const timeDiff = d.endDate - d.startDate;
      const isShortTimespan = timeDiff < 180 * 24 * 60 * 60 * 1000; // Less than ~6 months

      // Calculate how high the arc should go based on duration
      // Shorter timespans get proportionally smaller arcs
      const effectiveArcHeight = isShortTimespan
        ? arcHeight * (timeDiff / (365 * 24 * 60 * 60 * 1000)) * 2
        : arcHeight;

      const controlY = yMid - Math.max(15, effectiveArcHeight); // Ensure minimum height of 15px

      if (isOngoing) {
        // For ongoing events, create a path that rises to meet today's line at the middle
        // Adjust the path to meet today's vertical line at its midpoint
        const todayMidpointY = yMid - arcHeight + 5; // Mid-point of today's vertical line

        if (isShortTimespan && startX > todayX - innerWidth * 0.2) {
          // Very recent start - create a gradual rise to today's line
          return `M ${startX} ${yMid}
                  C ${startX + (todayX - startX) * 0.3} ${yMid - 10},
                    ${todayX - 20} ${todayMidpointY + 10},
                    ${todayX} ${todayMidpointY}`;
        } else {
          // Regular ongoing event - arch up and then to today's line
          return `M ${startX} ${yMid}
                  C ${startX + (todayX - startX) * 0.3} ${controlY},
                    ${todayX - (todayX - startX) * 0.3} ${controlY},
                    ${todayX} ${todayMidpointY}`;
        }
      } else {
        // Regular completed events return to the timeline
        return `M ${startX} ${yMid}
                C ${startX} ${controlY},
                  ${endX} ${controlY},
                  ${endX} ${yMid}`;
      }
    })
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 2)
    .attr("opacity", 0.7)
    .attr("marker-end", "") // Start with no arrow markers
    .attr("stroke-dasharray", function () {
      return (this as SVGPathElement).getTotalLength();
    })
    .attr("stroke-dashoffset", function () {
      return (this as SVGPathElement).getTotalLength();
    });

  // Replace the end-dot circles with diamond shapes
  const endEvents = mainGroup
    .selectAll(".end-dot")
    .data(timeline.events.filter((e) => e.endDate < Date.now()))
    .enter()
    .append("path")
    .attr("class", "end-dot")
    .attr(
      "transform",
      (d: TimelineEvent) =>
        `translate(${xScale(new Date(d.endDate))}, ${yMid}) scale(0.75)`
    )
    .attr("d", d3.symbol().type(d3.symbolX).size(0)) // Start with size 0
    .attr("fill", "steelblue")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 3)
    .attr("opacity", 0.25) // Slightly transparent
    .attr("z-index", 1); // Ensure it's on top of the arc

  // Track pinned event state
  let pinnedEventName: string | null = null;

  // Function to handle hover highlighting
  const highlightEvent = (eventName: string | null, isHighlighted: boolean) => {
    // Skip if no event name is provided (this happens on mouseout with no target)
    if (eventName === null && !isHighlighted) {
      // If nothing is pinned, reset all highlighting when mouseleave
      if (!pinnedEventName) {
        resetAllHighlighting();
        return;
      }
      return; // If something is pinned, don't reset on general mouseout
    }

    // If an event is pinned, only allow highlighting that event or unpinning it
    if (pinnedEventName && eventName !== pinnedEventName && !isHighlighted)
      return;

    // Transition duration for smooth effects
    const duration = 200;

    // Handle job arcs highlighting
    jobArcs
      .transition()
      .duration(duration)
      .attr("stroke-width", (d: TimelineEvent) =>
        isHighlighted && d.name === eventName ? 3 : 2
      )
      .attr("opacity", (d: TimelineEvent) => {
        if (!isHighlighted) return 0.7; // Reset to default
        return d.name === eventName ? 0.9 : 0.2; // Highlight target, dim others
      });

    // Handle event groups (dots, lines, labels)
    eventsGroup
      .transition()
      .duration(duration)
      .style("opacity", (d: any) => {
        if (!isHighlighted) return 1; // Reset to default
        return d.event.name === eventName ? 1 : 0.3; // Highlight target, dim others
      });

    // Handle end markers for completed events
    endEvents
      .transition()
      .duration(duration)
      .attr("opacity", (d: TimelineEvent) => {
        if (!isHighlighted) return 0.25; // Reset to default
        return d.name === eventName ? 0.7 : 0.1; // Highlight target, dim others
      });

    // Handle text labels specifically to make them more readable when highlighted
    eventsGroup
      .selectAll("text.event-label")
      .transition()
      .duration(duration)
      .style("font-weight", (d: any) => {
        return isHighlighted && d.event.name === eventName ? "700" : "500";
      })
      .style("font-size", (d: any) => {
        return isHighlighted && d.event.name === eventName ? "13px" : "12px";
      });
  };

  // New function to reset all highlighting to default state
  const resetAllHighlighting = () => {
    const duration = 200;

    // Reset job arcs
    jobArcs
      .transition()
      .duration(duration)
      .attr("stroke-width", 2)
      .attr("opacity", 0.7);

    // Reset event groups
    eventsGroup.transition().duration(duration).style("opacity", 1);

    // Reset end markers
    endEvents.transition().duration(duration).attr("opacity", 0.25);

    // Reset text labels
    eventsGroup
      .selectAll("text.event-label")
      .transition()
      .duration(duration)
      .style("font-weight", "500")
      .style("font-size", "12px");
  };

  // Function to handle clicking on timeline elements
  const handleEventClick = (eventName: string) => {
    if (pinnedEventName === eventName) {
      // If clicking on already pinned event, unpin it
      pinnedEventName = null;
      resetAllHighlighting(); // Clean reset
    } else {
      // Pin the new event
      pinnedEventName = eventName;
      highlightEvent(eventName, true);
    }
  };

  // Function to handle clicking on background (unpin any pinned event)
  const handleBackgroundClick = () => {
    if (pinnedEventName) {
      pinnedEventName = null;
      resetAllHighlighting(); // Clean reset
    }
  };

  // Add background click handler to unpin events
  mainGroup.on("click", function (event) {
    // Only handle clicks directly on the background
    if (event.target === this) {
      handleBackgroundClick();
    }
  });

  // Apply hover and click handlers to job arcs
  jobArcs
    .on("mouseenter", (event, d: TimelineEvent) => {
      if (!pinnedEventName) {
        highlightEvent(d.name, true);
      }
    })
    .on("mouseleave", () => {
      if (!pinnedEventName) {
        highlightEvent(null, false);
      }
    })
    .on("click", (event, d: TimelineEvent) => {
      event.stopPropagation(); // Prevent triggering background click
      handleEventClick(d.name);
    })
    .style("cursor", "pointer"); // Change cursor to indicate interactivity

  // Apply hover and click handlers to event groups (dots, lines, labels)
  eventsGroup
    .on("mouseenter", (event, d: any) => {
      if (!pinnedEventName) {
        highlightEvent(d.event.name, true);
      }
    })
    .on("mouseleave", () => {
      if (!pinnedEventName) {
        highlightEvent(null, false);
      }
    })
    .on("click", (event, d: any) => {
      event.stopPropagation(); // Prevent triggering background click
      handleEventClick(d.event.name);
    })
    .style("cursor", "pointer"); // Change cursor to indicate interactivity

  // Apply hover and click handlers to end events
  endEvents
    .on("mouseenter", (event, d: TimelineEvent) => {
      if (!pinnedEventName) {
        highlightEvent(d.name, true);
      }
    })
    .on("mouseleave", () => {
      if (!pinnedEventName) {
        highlightEvent(null, false);
      }
    })
    .on("click", (event, d: TimelineEvent) => {
      event.stopPropagation(); // Prevent triggering background click
      handleEventClick(d.name);
    })
    .style("cursor", "pointer"); // Change cursor to indicate interactivity

  // Add event detection for baseline animation progress
  let baselineDrawingProgress = 0;

  // Create year markers along the baseline
  const yearStart = minDate.getFullYear();
  const yearEnd = maxDate.getFullYear();
  const totalYears = yearEnd - yearStart + 1;

  // Calculate appropriate year interval based on total years
  // If we have many years, show fewer markers to prevent overlap
  const yearInterval = totalYears > 10 ? Math.ceil(totalYears / 10) : 1;

  const yearMarkers = [];
  for (let year = yearStart; year <= yearEnd; year++) {
    // Only include years based on the calculated interval
    if ((year - yearStart) % yearInterval === 0 || year === yearEnd) {
      const yearDate = new Date(year, 0, 1); // January 1st of the year
      if (yearDate >= paddedMinDate && yearDate <= paddedMaxDate) {
        yearMarkers.push({
          year,
          x: xScale(yearDate),
          // Alternate positions for consecutive markers (above/below line)
          position: yearMarkers.length % 2 === 0 ? 1 : -1,
        });
      }
    }
  }

  // Add the year markers to the timeline
  const yearMarkersGroup = mainGroup
    .selectAll(".year-marker")
    .data(yearMarkers)
    .enter()
    .append("g")
    .attr("class", "year-marker")
    .attr("transform", (d) => `translate(${d.x}, ${yMid})`)
    .style("opacity", 0);

  // Add small tick marks for years
  yearMarkersGroup
    .append("line")
    .attr("x1", 0)
    .attr("y1", (d) => d.position * 1) // Start slightly away from center
    .attr("x2", 0)
    .attr("y2", (d) => d.position * 30) // Extend up or down based on position
    .attr("stroke", "#adb5bd")
    .attr("stroke-width", 1)
    .attr("stroke-opacity", 0.8) // Slightly transparent
    .attr("stroke-dasharray", "2,2"); // Dashed line for year markers

  // Add year labels with alternating positions above or below the timeline
  yearMarkersGroup
    .append("text")
    .attr("x", 0)
    .attr("y", (d) => d.position * 30) // Position above or below based on alternating pattern
    .attr("text-anchor", "middle")
    .style("font-weight", "500")
    .style("opacity", 0.4)
    .style("font-family", "Arial, sans-serif")
    .style("font-size", "12px")
    .text((d) => d.year);

  // Add current year indicator at the end with clearer positioning
  const currentYearIndicatorY1 = yMid + innerHeight * -0.25; // Position above the timeline
  const currentYearIndicator = mainGroup
    .append("line")
    .attr("class", "current-year-indicator")
    .attr("x1", xScale(new Date()))
    .attr("y1", currentYearIndicatorY1) // Position above the timeline
    .attr("x2", xScale(new Date()))
    .attr("y2", yMid + innerHeight * 0.25) // Position below the timeline
    .attr("stroke", "#e74c3c")
    .attr("stroke-width", 1)
    .attr("stroke-dasharray", "5,5") // Dashed line
    .attr("stroke-opacity", 0.8) // Slightly transparent
    .style("opacity", 0); // Start hidden

  // Add a label for the current year indicator to the top of the line
  const currentYearLabel = mainGroup
    .append("text")
    .attr("class", "current-year-label")
    .attr("x", xScale(new Date()))
    .attr("y", currentYearIndicatorY1 - 5) // Position above the timeline
    .attr("text-anchor", "middle")
    .attr("dy", "-0.35em") // Adjust vertical alignment
    .attr("fill", "#e74c3c")
    .style("font-family", "Arial, sans-serif")
    .style("font-size", "12px")
    .style("font-weight", "bold")
    .style("opacity", 0.0)
    .text("Today"); // Label for the current year indicator

  // Add a flying year indicator that moves with the baseline
  const flyingYearTextXOffset = 28; // Offset for the flying year text
  const flyingYearText = mainGroup
    .append("text")
    .attr("class", "flying-year")
    .attr("x", 0)
    .attr("y", yMid + 6) // Position above the timeline
    .attr("text-anchor", "middle")
    .attr("fill", "steelblue")
    .style("font-family", "Arial, sans-serif")
    .style("font-size", "18px")
    .style("font-weight", "bold")
    .style("opacity", 0) // Start hidden
    .text("");

  // Create a function to track baseline animation progress
  baselineAnimation.tween("track-progress", function () {
    return function (t) {
      baselineDrawingProgress = t * innerWidth;

      // Calculate the current year based on timeline position
      const currentDate = xScale.invert(baselineDrawingProgress);
      const currentYear = currentDate.getFullYear();

      // Update the flying year text
      flyingYearText
        .attr("x", baselineDrawingProgress + flyingYearTextXOffset) // Position just ahead of the baseline
        .text(currentYear);

      // Handle the flying year opacity based on animation progress
      if (t < 0.05) {
        // Fade in at the beginning
        flyingYearText.style("opacity", t * 20);
      } else if (t > 0.95) {
        // Fade out at the end
        flyingYearText.style("opacity", (1 - t) * 20);
      } else {
        // Fully visible during the middle
        flyingYearText.style("opacity", 0.9);
      }

      // Update circles based on baseline position
      startEvents.attr("r", function (d: any) {
        // If the baseline has passed this dot's x position, show it
        if (baselineDrawingProgress >= d.x) {
          const timeSincePassing = (baselineDrawingProgress - d.x) / innerWidth;
          // Calculate a value between 0 and dotRadius based on how long ago the line passed
          const growthProgress = Math.min(1, timeSincePassing * 10);
          return dotRadius * growthProgress;
        }
        return 0;
      });

      // Animate the lines based on baseline progress
      eventLines.attr("y2", function (d: any) {
        const lineLength =
          baseLineLength + d.level * (labelHeight + labelPadding);
        if (baselineDrawingProgress >= d.x) {
          // Calculate how much time has passed since the baseline crossed this point
          const timeSincePassing = (baselineDrawingProgress - d.x) / innerWidth;
          // Allow a short delay before starting line animation
          if (timeSincePassing > 0.02) {
            // Calculate line growth progress (0 to 1)
            const growthProgress = Math.min(1, (timeSincePassing - 0.02) * 10);
            return d.direction * lineLength * growthProgress;
          }
        }
        return 0; // Default to no line until reached
      });

      // Add text labels that only appear when lines are fully extended
      eventsGroup.each(function (d: any) {
        const element = d3.select(this);
        const lineLength =
          baseLineLength + d.level * (labelHeight + labelPadding);

        if (baselineDrawingProgress >= d.x) {
          const timeSincePassing = (baselineDrawingProgress - d.x) / innerWidth;

          // Calculate line extension progress (0 to 1)
          const lineDelay = 0.02; // Delay before line starts growing
          const lineGrowthRate = 10; // How fast the line grows
          const lineProgress = Math.min(
            1,
            (timeSincePassing - lineDelay) * lineGrowthRate
          );

          // Start showing label when line is at least 85% extended (earlier start)
          if (lineProgress >= 0.85) {
            // Calculate fade-in progress for the label with a more gradual curve
            // Map 0.85-1.0 line progress to 0-1 opacity with easing
            const fadeProgress = (lineProgress - 0.85) / 0.15; // Normalized 0-1 for the fade range

            // Apply easing function for smoother transition (cubic ease-in)
            const easedFade =
              fadeProgress < 0.5
                ? 4 * fadeProgress * fadeProgress * fadeProgress
                : 1 - Math.pow(-2 * fadeProgress + 2, 3) / 2;

            // Apply a more gradual fade rate
            const textOpacity = Math.min(1, easedFade);

            // Get or create the text element
            let textLabel = element.select("text.event-label");
            let labelText = d.event.name;

            // Truncate long names with ellipsis
            if (labelText.length > maxLabelLength) {
              labelText = labelText.substring(0, maxLabelLength) + "...";
            }

            // Handle text and background creation/updates
            if (textLabel.empty()) {
              // Create the label if it doesn't exist
              textLabel = element
                .append("text")
                .attr("class", "event-label")
                .attr("x", 0)
                .attr(
                  "y",
                  d.direction * (lineLength + (d.direction === -1 ? 5 : 15))
                )
                .attr("text-anchor", "middle")
                .style("font-size", "12px")
                .style("font-weight", "500")
                .style("opacity", 0) // Start invisible
                .transition() // Add transition for smoother opacity changes
                .duration(200)
                .style("opacity", textOpacity)
                .text(labelText);
            } else {
              // Update existing elements with a smooth transition
              textLabel
                .transition()
                .duration(100)
                .style("opacity", textOpacity);
            }
          } else {
            // Keep label hidden until line is sufficiently extended
            element.selectAll("text.event-label").style("opacity", 0);
          }
        } else {
          // If baseline hasn't reached this point, hide text
          element.selectAll("text.event-label").style("opacity", 0);
        }
      });

      // Update job arcs based on baseline position
      jobArcs.attr("stroke-dashoffset", function (d: TimelineEvent) {
        const startX = xScale(new Date(d.startDate));
        const endX = xScale(new Date(d.endDate));
        const pathLength = (this as SVGPathElement).getTotalLength();
        const isOngoing = d.endDate >= Date.now() - 86400000;

        if (baselineDrawingProgress <= startX) {
          // Baseline hasn't reached this job's start yet
          return pathLength;
        } else if (baselineDrawingProgress >= endX) {
          // Baseline has passed this job's end (or current position for ongoing)
          return 0;
        } else {
          // Baseline is somewhere between job's start and end
          const jobProgress =
            (baselineDrawingProgress - startX) / (endX - startX);
          return pathLength * (1 - jobProgress);
        }
      });

      // Update arrow markers for ongoing events
      jobArcs.each(function (d: TimelineEvent) {
        const isOngoing = d.endDate >= Date.now() - 86400000;
        const todayX = xScale(new Date());

        if (isOngoing && baselineDrawingProgress >= todayX) {
          // Show arrow when baseline reaches today for ongoing events
          d3.select(this).attr("marker-end", "url(#arrow)");
        }
      });

      // Update end dots based on baseline position
      endEvents.attr("d", function (d: TimelineEvent) {
        const isOngoing = d.endDate >= Date.now() - 86400000;
        if (isOngoing) {
          // Ongoing events should not show end dots
          return d3.symbol().type(d3.symbolX).size(0)();
        }

        const endX = xScale(new Date(d.endDate));
        if (baselineDrawingProgress >= endX) {
          const timeSincePassing =
            (baselineDrawingProgress - endX) / innerWidth;
          const growthProgress = Math.min(1, timeSincePassing * 10);
          const size = 50 * growthProgress; // Max size of 50
          return d3.symbol().type(d3.symbolX).size(size)();
        }
        return d3.symbol().type(d3.symbolX).size(0)();
      });

      // Update year markers based on baseline progress
      yearMarkersGroup.style("opacity", function (d: any) {
        if (baselineDrawingProgress >= d.x) {
          const timeSincePassing = (baselineDrawingProgress - d.x) / innerWidth;
          return Math.min(1, timeSincePassing * 10);
        }
        return 0;
      });

      // Update current year indicator at the end
      if (t > 0.9) {
        // Show when animation is almost complete
        const fadeInProgress = Math.min(1, (t - 0.9) * 10);
        currentYearIndicator.style("opacity", fadeInProgress);
        currentYearLabel.style("opacity", fadeInProgress);
      }
    };
  });

  // Function to animate job arcs
  function animateJobArcs() {
    // This is no longer needed as arcs animate with the baseline
    // We're keeping the function in case there's any cleanup needed
    jobArcs.each(function (d: TimelineEvent, i: number) {
      // If there's any post-animation cleanup needed, it can go here
      const currentArc = d3.select(this);

      // After all animations are complete, remove dash arrays
      currentArc.attr("stroke-dasharray", null).attr("stroke-dashoffset", null);
    });
  }

  // Add hover effects to circles - these remain unchanged
  eventsGroup
    .selectAll("circle")
    .on("mouseover", function () {
      d3.select(this)
        .transition()
        .duration(200)
        .attr("r", dotRadius * 1.5)
        .attr("fill", "orange");
    })
    .on("mouseout", function () {
      d3.select(this)
        .transition()
        .duration(200)
        .attr("r", function (d: any) {
          // Return to radius based on baseline progress
          return baselineDrawingProgress >= d.x ? dotRadius : 0;
        })
        .attr("fill", "steelblue");
    });

  // Calculate the required height based on label positions
  const maxUpLineLength =
    baseLineLength + maxUpLevel * (labelHeight + labelPadding) + 20;
  const maxDownLineLength =
    baseLineLength + maxDownLevel * (labelHeight + labelPadding) + 20;

  // Calculate total height needed (accounting for the timeline in the middle)
  const requiredHeight =
    maxUpLineLength + maxDownLineLength + margin.top + margin.bottom;

  // Resize SVG element to fit all content
  svg.attr("height", requiredHeight);

  // Update the return statement in the TimelineUI component to use auto height
  // This is handled in a separate change to the component's return statement
}
