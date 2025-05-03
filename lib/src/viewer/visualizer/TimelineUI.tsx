import * as d3 from "d3";
import React, { useEffect } from "react";
import {
  useVisualizerContext,
  VisualizerAnimationStartPosition,
  VisualizerD3State,
  VisualizerDispatchAction,
  VisualizerStatus,
} from "./VisualizerHook";
import { TimelineData, TimelineEvent } from "./TimelineModel";
import { destoryVisualization as destroyVisualization } from "./VisualizationUtil";
import "./TimelineUI.css";

export const TimelineUI: React.FC = () => {
  const [state] = useVisualizerContext();
  const { d3State, status: status, data } = state;
  const { timeline, gravatarUrl } = data || {};

  // Trigger replay animation when isAnimating changes
  useEffect(() => {
    d3State.dispatch.on("DRAW_TIMELINE", function () {
      if (!d3State.svgRef.current) return; // Ensure the SVG reference is available
      if (this.type === "DRAW_TIMELINE") {
        drawTimeline(d3State, this.data, this.origin);
      }
    });

    return () => {
      // Clean up the event listener when the component unmounts
      d3State.dispatch.on("DRAW_TIMELINE", null);

      // Destroy the visualization when the component unmounts
      if (d3State.svgRef.current) {
        destroyVisualization(d3State.svgRef.current, ".timeline");
      }
    };
  }, [d3State]);

  useEffect(() => {
    if (d3State.dispatch && timeline && status === VisualizerStatus.Started) {
      // Trigger the timeline drawing when the status changes to Started
      d3State.dispatch.call("DRAW_TIMELINE", {
        type: "DRAW_TIMELINE",
        data: { timeline, gravatarUrl },
        origin: {
          x: d3State.width / 2,
          y: d3State.height / 2,
          angle: 0,
        },
      });
    }
  }, [status, timeline, gravatarUrl, d3State]);

  return null;
};

function drawTimeline(
  d3State: VisualizerD3State,
  data: VisualizerDispatchAction["data"],
  origin: VisualizerAnimationStartPosition
) {
  const { svgRef, defsRef, rootRef, zoom, width, height, minZoom, maxZoom } =
    d3State;
  if (!svgRef.current || !rootRef.current || !defsRef.current) return; // Ensure the SVG reference is available
  if (!data.timeline) return; // Ensure timeline data is available

  const { timeline, gravatarUrl } = data;
  const { events, now } = timeline;

  // Always clear the previous timeline before drawing a new one
  destroyVisualization(svgRef.current, ".timeline");

  const root = d3.select(rootRef.current);
  const svg = d3.select(svgRef.current);
  const defs = d3.select(defsRef.current);

  // Define constants for colors and styles
  const COLORS = {
    originDot: "var(--color-accent-light)",
    //timeline: "url(#timeline-line-gradient)",
    timeline: "var(--color-accent-light)",
    timelineStart: "var(--color-accent-yellow)",
    timelineEnd: "var(--color-accent-yellow)",
    jobArc: "var(--color-accent-blue)",
    jobArcHighlight: "var(--color-accent-yellow)",
    jobArcArrow: "var(--color-accent-blue)",
    jobArcArrowHighlight: "var(--color-accent-yellow)",
    eventStartDotFill: "var(--color-accent-blue)",
    eventStartDotStroke: null,
    eventStartDotFillHighlight: "var(--color-accent-yellow)",
    eventLabelText: "var(--color-primary)",
    eventLabelTextHighlight: "var(--color-accent-yellow)",
    eventLine: "var(--color-accent-light)",
    eventEndDotFill: null,
    eventEndDotStroke: null,
    eventEndDotFillHighlight: "var(--color-accent-yellow)",
    yearLine: "var(--color-accent-light)",
    yearText: "var(--color-accent-light)",
    background: "var(--color-background)",
    currentYear: "var(--color-accent-light)",
  };

  const OPACITIES = {
    eventLabel: 1,
    eventLabelHighlight: 1,
    eventLine: 1,
    jobArc: 1,
    jobArcArrow: 1,
    eventStartDotFill: 1,
    eventStartDotStroke: 1,
    eventEndDotFill: 1,
    eventEndDotStroke: 1,
    originDot: 1,
    timeline: 1,
    yearLine: 1,
    yearText: 1,
  };

  const FONT = {
    family: "Inter, Arial, sans-serif",
    size: {
      small: "10px",
      medium: "14px",
      large: "18px",
    },
    weight: {
      normal: "400",
      bold: "700",
    },
  };

  const FONTS = {
    eventLabel: {
      family: FONT.family,
      size: FONT.size.medium,
      weight: FONT.weight.normal,
    },
    eventLabelHighlight: {
      family: FONT.family,
      size: FONT.size.large,
      weight: FONT.weight.bold,
    },
  };

  // Get the SVG dimensions from the element
  const svgRect = svg.node()?.getBBox();
  if (!svgRect) return; // No dimensions available

  // Find min and max dates for the domain
  const minDate = new Date(
    d3.min(events, (d: TimelineEvent) => d.startDate) || now.getTime()
  );
  const maxDate = new Date(
    d3.max(events, (d: TimelineEvent) => d.endDate) || now.getTime()
  );

  // Calculate positions for labels with improved staggering
  const arcHeight = 30; // Height of the arc bow from the timeline
  const dotRadius = 6;
  const baseLineLength = arcHeight + dotRadius * 2 + 15; // Adjusted to include dot radius
  const isSmallScreen = width < 600; // Check if the screen is small
  const minLabelDistance = isSmallScreen ? 50 : 80; // Minimum distance between labels
  const labelHeight = 14;
  const labelPadding = 15; // Increased padding for better spacing
  const maxLabelLength = 25; // Maximum characters for label before truncating
  const baselineStartX = origin.x; // Start of the baseline
  const baselineEndX = baselineStartX + width; // End of the baseline
  const baselineY = origin.y; // Y position of the baseline (timeline)

  // Add padding to domain (3 months on each side)
  const domainPadding = 90 * 24 * 60 * 60 * 1000; // 90 days in milliseconds
  const paddedMinDate = new Date(minDate.getTime() - domainPadding);
  const paddedMaxDate = new Date(maxDate.getTime() + domainPadding);

  // Use scaleTime for the horizontal timeline
  const xTimelineScale = d3
    .scaleTime()
    .domain([paddedMinDate, paddedMaxDate])
    .range([baselineStartX, baselineEndX])
    .nice();
  const todayX = xTimelineScale(now); // X position of today on the timeline
  const maxDateX = xTimelineScale(paddedMaxDate); // X position of max date on the timeline

  // Assign levels to events based on their proximity
  const eventPositions = events
    .map((event) => {
      return {
        x: xTimelineScale(new Date(event.startDate)),
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
  defs
    .append("marker")
    .classed("timeline", true)
    .attr("id", "arrow")
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 8)
    .attr("refY", 0)
    .attr("markerWidth", 3)
    .attr("markerHeight", 3)
    .attr("orient", "auto")
    .append("path")
    .attr("d", "M0,-5L10,0L0,5")
    .attr("fill", COLORS.jobArcArrow);

  // Timeline line gradient
  const lineGradient = defs
    .append("linearGradient")
    .classed("timeline", true)
    .attr("id", "timeline-line-gradient")
    .attr("x1", "0%")
    .attr("y1", "0%")
    .attr("x2", "100%")
    .attr("y2", "0%");

  lineGradient
    .append("stop")
    .attr("offset", "0%")
    .attr("stop-color", COLORS.timelineStart)
    .attr("stop-opacity", 0.2); // Faded end for better visibility

  lineGradient
    .append("stop")
    .attr("offset", "100%")
    .attr("stop-color", COLORS.timelineEnd)
    .attr("stop-opacity", 1); // Faded end for better visibility

  // Create a group for the visualization with proper margins
  const container = root.append("g").classed("timeline", true);

  // Create a main group that will be transformed during zoom - needs to be created early
  const mainGroup = container
    .append("g")
    .classed("main-group", true)
    // Start with opacity 0 for entrance animation
    .style("opacity", 0);

  // Define the groups for the different layers of the timeline so they stack correctly
  const bottomLayer = mainGroup.append("g").classed("bottom-group", true);
  const lineLayer = mainGroup.append("g").classed("mid-group", true);
  const eventsLayer = mainGroup.append("g").classed("events-layer", true);
  const arcLayer = mainGroup.append("g").classed("arc-layer", true);
  const topLayer = mainGroup.append("g").classed("top-group", true);

  // Add entrance animation for the main group
  const entranceDuration = 100; // Duration of entrance animation
  mainGroup.transition().duration(entranceDuration).style("opacity", 1);

  // Calculate the current viewport based on the baseline drawing progress
  function calculateViewport(baselineDrawingProgress: number) {
    // Calculate a moving viewport width - enough to see context
    const viewportWidth =
      width * Math.min(0.25, Math.max(0.05, baseLineLength)); // Show 25% of timeline width

    // Get the relevant Y boundaries from events near the current position
    let minY = baselineY - arcHeight - 20; // Default: timeline with some margin
    let maxY = baselineY + 40; // Default: timeline with some margin

    // Find any visible events within the current viewport
    eventPositions.forEach((pos) => {
      // If event is in view, adjust Y boundaries
      const direction = pos.direction;
      const lineLength =
        baseLineLength + pos.level * (labelHeight + labelPadding);
      const eventY = baselineY + direction * lineLength;

      minY = Math.min(minY, eventY - 15);
      maxY = Math.max(maxY, eventY + 15);
    });

    // Calculate viewport height and center point
    const viewportHeight = maxY - minY;
    const viewportCenterX = baselineDrawingProgress;
    const viewportCenterY = minY + viewportHeight / 2;

    // Calculate appropriate zoom level based on viewport size
    const viewportZoom =
      Math.min(width / viewportWidth, height / viewportHeight) * 0.9; // 90% of the available zoom level

    return {
      viewportWidth,
      viewportHeight,
      viewportCenterX,
      viewportCenterY,
      viewportZoom,
    };
  }

  const startViewport = calculateViewport(baselineStartX);

  // draw a dot at the origin point
  const originDotX = startViewport.viewportCenterX;
  const originDotY = baselineY;
  const originDot = topLayer
    .append("circle")
    .attr("cx", originDotX)
    .attr("cy", originDotY)
    .attr("r", 3)
    .attr("fill", COLORS.originDot)
    .attr("opacity", 0);

  // zoom out to fill the screen
  svg
    .transition()
    .duration(0) // No transition for initial zoom out
    .call(
      zoom.transform as any,
      d3.zoomIdentity
        .translate(width / 2, height / 2)
        .scale(startViewport.viewportZoom)
        .translate(
          -startViewport.viewportCenterX,
          -startViewport.viewportCenterY
        )
    )
    .on("end", () => {
      // Zoom in at the start of the animation
      originDot
        .transition()
        .attr("opacity", OPACITIES.originDot) // Fade in the origin dot
        .duration(2500) // Duration of the zoom animation
        .ease(d3.easeCubicInOut) // Easing function for smooth transition
        .on("end", () => {
          // After the zoom, animate the origin dot to the timeline position
          startTimelineAnimation();
        });
    });

  function startTimelineAnimation() {
    // Add the timeline baseline with left-to-right animation that triggers dots to appear
    let isTimelineAnimating = true; // Flag to track animation state
    const animationDuration = Math.min(
      15000,
      Math.max(1500, events.length * 1500)
    );
    const baselineAnimation = lineLayer
      .append("line")
      .classed("timeline-baseline", true)
      .attr("x1", baselineStartX)
      .attr("y1", baselineY)
      .attr("x2", baselineEndX)
      .attr("y2", baselineY + 0.01) // Small offset to avoid 0-length line
      .attr("stroke", COLORS.timeline)
      .attr("stroke-width", 2)
      .attr("opacity", OPACITIES.timeline)
      .attr("stroke-dasharray", width) // Set dash array to line length
      .attr("stroke-dashoffset", width) // Initially offset by full length (invisible)
      .transition()
      .duration(animationDuration) // Increased duration for slower animation
      .delay(300) // Start slightly before other animations
      .ease(d3.easeLinear) // Use linear easing for constant drawing speed
      .attr("stroke-dashoffset", 0) // Animate to 0 offset (fully visible)
      .on("end", function () {
        // Remove dash array after animation completes
        d3.select(this)
          .attr("stroke-dasharray", null)
          .attr("stroke-dashoffset", null);
      });

    // Create a group for events but don't animate them yet - they'll be triggered by the baseline
    const eventsGroup = eventsLayer
      .selectAll(".event")
      .data(eventPositions)
      .enter()
      .append("g")
      .classed("event", true)
      .attr("transform", (d: any) => `translate(${d.x}, ${baselineY})`)
      .style("opacity", 1);

    // Add lines that grow after their respective dots appear
    const eventLines = eventsGroup
      .append("line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", 0)
      .attr("y2", 0) // Start with zero length
      .attr("stroke", COLORS.eventLine)
      .attr("stroke-width", 2)
      .attr("opacity", OPACITIES.eventLine);

    // Add circles with 0 radius - they'll be revealed when the baseline passes them
    const startEvents = eventsGroup
      .append("circle")
      .attr("r", 0)
      .attr("fill", COLORS.eventStartDotFill)
      .attr("stroke", COLORS.eventStartDotStroke)
      .attr("stroke-width", 1.5)
      .attr("transform", "scale(0.5)");

    // TODO: need to centralize the job arc gradient creation so we can reuse it for both highlighted and non-highlighted arcs
    function createJobArcGradient(
      gradientId: string,
      event: TimelineEvent,
      highlight: boolean = false
    ) {
      const isOngoing = event.endDate.getTime() >= now.getTime() - 86400000; // Within a day of current date
      const gradient = defs
        .append("linearGradient")
        .classed("timeline", true)
        .attr("id", gradientId)
        .attr("x1", "100%")
        .attr("y1", "0%")
        .attr("x2", highlight ? "100%" : isOngoing ? "80%" : "20%")
        .attr("y2", "0%");

      const color = highlight ? COLORS.jobArcHighlight : COLORS.jobArc;

      gradient
        .append("stop")
        .attr("offset", "0%")
        .attr("stop-color", color)
        .attr("stop-opacity", 0);

      gradient
        .append("stop")
        .attr("offset", "100%")
        .attr("stop-color", color)
        .attr("stop-opacity", 1);
    }

    // Draw curved arcs between start and end dates for each job with animated path drawing
    const jobArcs = arcLayer
      .selectAll(".job-duration")
      .data(events)
      .enter()
      .append("path")
      .classed("job-duration", true)
      .attr("d", (d: TimelineEvent) => {
        const startX = xTimelineScale(new Date(d.startDate));
        const endX = xTimelineScale(new Date(d.endDate));
        const isOngoing = d.endDate.getTime() >= now.getTime() - 86400000; // Within a day of current date

        // Calculate time difference in milliseconds
        const timeDiff = d.endDate.getTime() - d.startDate.getTime();
        const isShortTimespan = timeDiff < 180 * 24 * 60 * 60 * 1000; // Less than ~6 months

        // Calculate how high the arc should go based on duration
        // Shorter timespans get proportionally smaller arcs
        const effectiveArcHeight = isShortTimespan
          ? arcHeight * (timeDiff / (365 * 24 * 60 * 60 * 1000)) * 2
          : arcHeight;

        const controlY = baselineY - Math.max(15, effectiveArcHeight); // Ensure minimum height of 15px

        if (isOngoing) {
          // For ongoing events, create a path that rises to meet today's line at the middle
          // Adjust the path to meet today's vertical line at its midpoint
          const todayMidpointY = baselineY - arcHeight + 5; // Mid-point of today's vertical line

          if (isShortTimespan && startX > todayX - width * 0.2) {
            // Very recent start - create a gradual rise to today's line
            return `M ${startX} ${baselineY}
                  C ${startX + (todayX - startX) * 0.3} ${baselineY - 10},
                    ${todayX - 20} ${todayMidpointY + 10},
                    ${todayX} ${todayMidpointY}`;
          } else {
            // Regular ongoing event - arch up and then to today's line
            return `M ${startX} ${baselineY}
                  C ${startX + (todayX - startX) * 0.3} ${controlY},
                    ${todayX - (todayX - startX) * 0.3} ${controlY},
                    ${todayX} ${todayMidpointY}`;
          }
        } else {
          // Regular completed events return to the timeline
          return `M ${startX} ${baselineY}
                C ${startX} ${controlY},
                  ${endX} ${controlY},
                  ${endX} ${baselineY}`;
        }
      })
      .attr("fill", "none")
      .attr("stroke", (d, i) => {
        // Create a unique gradient for each arc
        const gradientId = `comet-gradient-${i}`;

        // Create gradient for non-highlighted arcs
        createJobArcGradient(gradientId, d, false);

        return `url(#${gradientId})`;
      })
      .attr("stroke-width", 2)
      .attr("opacity", OPACITIES.jobArc)
      .attr("stroke-linecap", "round")
      .attr("marker-end", "") // Start with no arrow markers
      .attr("stroke-dasharray", function () {
        return (this as SVGPathElement).getTotalLength();
      })
      .attr("stroke-dashoffset", function () {
        return (this as SVGPathElement).getTotalLength();
      });

    // Replace the end-dot circles with diamond shapes
    const endEvents = arcLayer
      .selectAll(".end-dot")
      .data(events.filter((e) => e.endDate.getTime() < now.getTime()))
      .enter()
      .append("path")
      .classed("end-dot", true)
      .attr(
        "transform",
        (d: TimelineEvent) =>
          `translate(${xTimelineScale(d.endDate)}, ${baselineY}) scale(0.75)`
      )
      .attr("d", d3.symbol().type(d3.symbolX).size(0)) // Start with size 0
      .attr("fill", COLORS.eventEndDotFill)
      .attr("stroke", COLORS.eventEndDotStroke)
      .attr("stroke-width", 3)
      .attr("opacity", OPACITIES.eventEndDotFill);

    // Track the state of the timeline animation in an object so we can access it from event handlers
    const interactiveState = {
      pinnedEventName: null as string | null,
      hoveringEventName: null as string | null,
      isTimelineAnimating: false,
    };

    // Function to handle hover highlighting
    const highlightEvent = (
      eventName: string | null,
      isHighlighted: boolean
    ) => {
      // Skip if we're still in the animation phase
      if (isTimelineAnimating) return;

      // Skip if no event name is provided (this happens on mouseout with no target)
      if (eventName === null && !isHighlighted) {
        // If nothing is pinned, reset all highlighting when mouseleave
        if (!interactiveState.pinnedEventName) {
          resetAllHighlighting();
          return;
        }
        return; // If something is pinned, don't reset on general mouseout
      }

      // If an event is pinned, only allow highlighting that event or unpinning it
      if (
        interactiveState.pinnedEventName &&
        eventName !== interactiveState.pinnedEventName &&
        !isHighlighted
      )
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
          if (!isHighlighted) return OPACITIES.jobArc; // Reset to default
          return d.name === eventName ? 1 : 0.3; // Highlight target, dim others
        })
        .attr("stroke", (d: TimelineEvent, i) => {
          if (isHighlighted && d.name === eventName) {
            // Create a unique gradient for the selected arc
            const gradientId = `highlight-gradient-${i}`;

            // Create gradient for highlighted arc
            createJobArcGradient(gradientId, d, true);

            return `url(#${gradientId})`;
          }
          // Use the original gradient for others
          return `url(#comet-gradient-${i})`;
        });

      // Add pulsing effect to the selected arc
      if (isHighlighted) {
        jobArcs
          .filter((d: TimelineEvent) => d.name === eventName)
          .transition()
          .duration(500)
          .ease(d3.easeCubicInOut)
          .attr("stroke-width", 6)
          .transition()
          .duration(500)
          .ease(d3.easeCubicInOut)
          .attr("stroke-width", 2)
          .on("end", function repeat() {
            const continuePulsing =
              interactiveState.pinnedEventName === eventName ||
              interactiveState.hoveringEventName === eventName;
            if (!continuePulsing) return; // Stop pulsing if not pinned or hovered
            d3.select(this)
              .transition()
              .duration(500)
              .ease(d3.easeCubicInOut)
              .attr("stroke-width", 6)
              .transition()
              .duration(500)
              .ease(d3.easeCubicInOut)
              .attr("stroke-width", 2)
              .on("end", repeat); // Loop the pulsing effect
          });
      }

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
          if (!isHighlighted) return OPACITIES.eventEndDotFill; // Reset to default
          return d.name === eventName ? 0.7 : 0.1; // Highlight target, dim others
        });

      // Handle text labels specifically to make them more readable when highlighted
      eventsGroup
        .selectAll("text.event-label")
        .transition()
        .duration(duration)
        .style("font-weight", (d: any) => {
          return isHighlighted && d.event.name === eventName
            ? FONTS.eventLabelHighlight.weight
            : FONTS.eventLabel.weight;
        })
        .style("font-size", (d: any) => {
          return isHighlighted && d.event.name === eventName
            ? FONTS.eventLabelHighlight.size
            : FONTS.eventLabel.size;
        })
        .style("fill", (d: any) => {
          return isHighlighted && d.event.name === eventName
            ? COLORS.eventLabelTextHighlight
            : COLORS.eventLabelText;
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
        .attr("opacity", OPACITIES.jobArc)
        .attr("stroke", (d, i) => `url(#comet-gradient-${i})`);

      // Reset event groups
      eventsGroup.transition().duration(duration).style("opacity", 1);

      // Reset end markers
      endEvents
        .transition()
        .duration(duration)
        .attr("opacity", OPACITIES.eventEndDotFill);

      // Reset text labels
      eventsGroup
        .selectAll("text.event-label")
        .transition()
        .duration(duration)
        .style("font-weight", FONTS.eventLabel.weight)
        .style("font-size", FONTS.eventLabel.size)
        .style("fill", COLORS.eventLabelText);
    };

    // Function to handle clicking on timeline elements
    const handleEventClick = (eventName: string) => {
      // always reset all highlighting on click
      resetAllHighlighting();

      // If an event is pinned, unpin it and reset highlighting
      if (interactiveState.pinnedEventName === eventName) {
        // If clicking on already pinned event, unpin it
        interactiveState.pinnedEventName = null;
      } else {
        // Pin the new event
        interactiveState.pinnedEventName = eventName;

        // Highlight the pinned event
        highlightEvent(interactiveState.pinnedEventName, true);
      }
    };

    // Function to handle clicking on background (unpin any pinned event)
    const handleBackgroundClick = () => {
      if (interactiveState.pinnedEventName) {
        interactiveState.pinnedEventName = null;
        resetAllHighlighting(); // Clean reset
      }
    };

    // Add background click handler to unpin events
    root.on("click", function (event) {
      // Only handle clicks directly on the background
      if (event.target === this) {
        handleBackgroundClick();
      }
    });

    function interactiveMouseEnter(d: TimelineEvent) {
      interactiveState.hoveringEventName = d.name; // Store the name of the hovered event
      if (!interactiveState.pinnedEventName) {
        highlightEvent(d.name, true); // Highlight on mouse enter
      }
    }

    function interactiveMouseLeave() {
      interactiveState.hoveringEventName = null; // Clear the hovered event name
      if (!interactiveState.pinnedEventName) {
        highlightEvent(null, false); // Reset highlighting on mouse leave
      }
    }

    // Apply hover and click handlers to job arcs
    jobArcs
      .on("mouseenter", (_, d: TimelineEvent) => {
        interactiveMouseEnter(d);
      })
      .on("mouseleave", () => {
        interactiveMouseLeave();
      })
      .on("click", null)
      .on("click", (event, d: TimelineEvent) => {
        event.stopPropagation(); // Prevent triggering background click
        handleEventClick(d.name);
      })
      .style("cursor", "pointer"); // Change cursor to indicate interactivity

    // Apply hover and click handlers to event groups (dots, lines, labels)
    eventsGroup
      .on("mouseenter", (_, d: any) => {
        interactiveMouseEnter(d.event);
      })
      .on("mouseleave", () => {
        interactiveMouseLeave();
      })
      .on("click", (event, d: any) => {
        event.stopPropagation(); // Prevent triggering background click
        handleEventClick(d.event.name);
      })
      .style("cursor", "pointer"); // Change cursor to indicate interactivity

    // Apply hover and click handlers to end events
    endEvents
      .on("mouseenter", (_, d: any) => {
        interactiveMouseEnter(d.event);
      })
      .on("mouseleave", () => {
        interactiveMouseLeave();
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
            x: xTimelineScale(yearDate),
            // Alternate positions for consecutive markers (above/below line)
            position: yearMarkers.length % 2 === 0 ? 1 : -1,
          });
        }
      }
    }

    // Add the year markers to the timeline
    const yearMarkersGroup = bottomLayer
      .selectAll(".year-marker")
      .data(yearMarkers)
      .enter()
      .append("g")
      .classed("year-marker", true)
      .attr("transform", (d) => `translate(${d.x}, ${baselineY})`)
      .style("opacity", 0);

    // Dashed line for year markers
    const yearMarkerYOffset = arcHeight + 5; // Offset for year markers
    yearMarkersGroup
      .append("line")
      .attr("x1", 0)
      .attr("y1", (d) => d.position * 1) // Start slightly away from center
      .attr("x2", 0)
      .attr("y2", (d) => d.position * yearMarkerYOffset) // Extend up or down based on position
      .attr("stroke", COLORS.yearLine)
      .attr("stroke-width", 1)
      .attr("stroke-opacity", OPACITIES.yearLine)
      .attr("stroke-dasharray", "2,2");

    // Add year labels with alternating positions above or below the timeline
    yearMarkersGroup
      .append("text")
      .attr("x", 0)
      // Position above or below based on alternating pattern
      .attr(
        "y",
        (d) => d.position * yearMarkerYOffset + (d.position > 0 ? 12 : -3)
      )
      .attr("text-anchor", "middle")
      .style("font-weight", "500")
      .style("opacity", OPACITIES.yearText)
      .style("font-family", "Arial, sans-serif")
      .style("font-size", "12px")
      .style("fill", COLORS.yearText)
      .text((d) => d.year);

    // Add current year indicator at the end with clearer positioning
    const currentYearIndicatorHeight = yearMarkerYOffset + 12;
    const y1CurrentYearIndicator = baselineY - currentYearIndicatorHeight; // Position above the timeline
    const currentYearIndicator = bottomLayer
      .append("line")
      .classed("current-year-indicator", true)
      .attr("x1", todayX)
      .attr("y1", y1CurrentYearIndicator) // Position above the timeline
      .attr("x2", todayX)
      .attr("y2", baselineY) // Position at the timeline
      .attr("stroke", COLORS.currentYear)
      .attr("stroke-width", 1)
      .attr("stroke-dasharray", "5,5") // Dashed line
      .attr("stroke-opacity", 1) // Slightly transparent
      .style("opacity", 0); // Start hidden

    // Add a label for the current year indicator to the top of the line
    const currentYearLabel = bottomLayer
      .append("text")
      .classed("current-year-label", true)
      .attr("x", todayX)
      .attr("y", y1CurrentYearIndicator - 5) // Position above the timeline
      .attr("text-anchor", "middle")
      .attr("dy", "-0.35em") // Adjust vertical alignment
      .attr("fill", COLORS.currentYear)
      .style("font-family", FONT.family)
      .style("font-size", "12px")
      .style("font-weight", "bold")
      .style("opacity", 0) // Start hidden
      .text("Today"); // Label for the current year indicator

    // Add a flying year indicator that moves with the baseline
    const flyingYearTextXOffset = 28; // Offset for the flying year text
    const flyingYearText = topLayer
      .append("text")
      .classed("flying-year", true)
      .attr("x", 0)
      .attr("y", baselineY + 6) // Position above the timeline
      .attr("text-anchor", "middle")
      .attr("fill", COLORS.currentYear)
      .style("font-family", FONT.family)
      .style("font-size", "18px")
      .style("font-weight", "bold")
      .style("opacity", 0) // Start hidden
      .text("");

    // Create a function to track baseline animation progress
    baselineAnimation.tween("track-progress", function () {
      return function (t) {
        // Update the baseline drawing progress based on animation progress
        baselineDrawingProgress = baselineStartX + t * width;

        // Check if animation is still in progress
        isTimelineAnimating = t < 1;

        // Zoom in on the current viewport based on progress
        const { viewportCenterX, viewportCenterY, viewportZoom } =
          calculateViewport(baselineDrawingProgress);

        // Calculate the current year based on timeline position
        const currentDate = xTimelineScale.invert(baselineDrawingProgress);
        const currentYear = currentDate.getFullYear();

        // Update the flying year text
        flyingYearText
          .attr("x", viewportCenterX + flyingYearTextXOffset) // Position just ahead of the baseline
          .text(currentYear);

        // Update the origin dot position to it follow the baseline and stop at today
        originDot.attr("cx", Math.min(viewportCenterX, todayX));

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
            const timeSincePassing = (baselineDrawingProgress - d.x) / maxDateX;
            // Calculate a value between 0 and dotRadius based on how long ago the line passed
            const growthProgress = Math.min(1, timeSincePassing * 10);
            return dotRadius * growthProgress;
          }
          return 0;
        });

        // Animate the lines based on baseline progress
        const lineDelay = 0.0; // Delay before line starts growing
        const lineGrowthRate = 20; // How fast the line grows
        eventLines.attr("y2", function (d: any) {
          const lineLength =
            baseLineLength + d.level * (labelHeight + labelPadding);
          if (baselineDrawingProgress >= d.x) {
            // Calculate how much time has passed since the baseline crossed this point
            const timeSincePassing = (baselineDrawingProgress - d.x) / maxDateX;
            // Calculate line growth progress (0 to 1)
            const growthProgress = Math.max(
              0,
              Math.min(1, (timeSincePassing - lineDelay) * lineGrowthRate)
            );
            return d.direction * lineLength * growthProgress;
          }
          return 0; // Default to no line until reached
        });

        // Add text labels that only appear when lines are fully extended
        eventsGroup.each(function (d: any) {
          const eventElm = d3.select(this);
          const lineLength =
            baseLineLength + d.level * (labelHeight + labelPadding);

          if (baselineDrawingProgress >= d.x) {
            const timeSincePassing = (baselineDrawingProgress - d.x) / maxDateX;

            // Calculate line extension progress (0 to 1)
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
              const textOpacity = Math.min(OPACITIES.eventLabel, easedFade);

              // Get or create the text element
              let textLabel: any = eventElm.select("text.event-label");
              let labelText = d.event.name;

              // Truncate long names with ellipsis
              if (labelText.length > maxLabelLength) {
                labelText = labelText.substring(0, maxLabelLength) + "...";
              }

              // Handle text and background creation/updates
              if (textLabel.empty()) {
                // Create the label if it doesn't exist
                textLabel = eventElm
                  .append("text")
                  .classed("event-label", true)
                  .attr("x", 0)
                  .attr(
                    "y",
                    d.direction * (lineLength + (d.direction === -1 ? 5 : 15))
                  )
                  .attr("text-anchor", "middle")
                  .style("font-size", FONTS.eventLabel.size)
                  .style("font-weight", FONTS.eventLabel.weight)
                  .style("font-family", FONTS.eventLabel.family)
                  .style("fill", COLORS.eventLabelText)
                  .style("line-height", "1.5")
                  .style("opacity", 0) // Start invisible
                  .transition() // Add transition for smoother opacity changes
                  .duration(300)
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
              eventElm.selectAll("text.event-label").style("opacity", 0);
            }
          } else {
            // If baseline hasn't reached this point, hide text
            eventElm.selectAll("text.event-label").style("opacity", 0);
          }
        });

        // Update job arcs based on baseline position
        jobArcs.attr("stroke-dashoffset", function (d: TimelineEvent) {
          const startX = xTimelineScale(new Date(d.startDate));
          const endX = xTimelineScale(new Date(d.endDate));
          const pathLength = (this as SVGPathElement).getTotalLength();

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
          const isOngoing = d.endDate.getTime() >= now.getTime() - 86400000;
          const todayX = xTimelineScale(new Date());

          if (isOngoing && baselineDrawingProgress >= todayX) {
            // Show arrow when baseline reaches today for ongoing events
            d3.select(this).attr("marker-end", "url(#arrow)");
          }
        });

        // Update end dots based on baseline position
        endEvents.attr("d", function (d: TimelineEvent) {
          const isOngoing = d.endDate.getTime() >= now.getTime() - 86400000;
          if (isOngoing) {
            // Ongoing events should not show end dots
            return d3.symbol().type(d3.symbolX).size(0)();
          }

          const endX = xTimelineScale(new Date(d.endDate));
          if (baselineDrawingProgress >= endX) {
            const timeSincePassing =
              (baselineDrawingProgress - endX) / maxDateX;
            const growthProgress = Math.min(1, timeSincePassing * 10);
            const size = 50 * growthProgress; // Max size of 50
            return d3.symbol().type(d3.symbolX).size(size)();
          }
          return d3.symbol().type(d3.symbolX).size(0)();
        });

        // Update year markers based on baseline progress
        yearMarkersGroup.style("opacity", function (d: any) {
          if (baselineDrawingProgress >= d.x) {
            const timeSincePassing = (baselineDrawingProgress - d.x) / maxDateX;
            return Math.min(1, timeSincePassing * 10);
          }
          return 0;
        });

        // Update current year indicator at the end
        if (currentDate >= now) {
          // Show when animation is almost complete
          const fadeInProgress = Math.min(1, (t - 0.9) * 10);
          currentYearIndicator.style("opacity", fadeInProgress);
          currentYearLabel.style("opacity", fadeInProgress);
        }

        if (t < 1) {
          svg
            .transition()
            .duration(50)
            .ease(d3.easeCubicInOut)
            .call(
              zoom.transform as any,
              d3.zoomIdentity
                .translate(width / 2, height / 2)
                .scale(viewportZoom)
                .translate(-viewportCenterX, -viewportCenterY)
            );
        } else {
          // At the end of the animation, zoom out to show the full timeline
          const fullTimelineBounds = mainGroup.node()?.getBBox();
          if (fullTimelineBounds) {
            // Calculate the zoom level to fit the full timeline bounds into the viewport
            const timelineZoom =
              Math.min(
                width / fullTimelineBounds.width,
                height / fullTimelineBounds.height
              ) * 0.9; // 90% of the available space

            // Center the zoom on the full timeline bounds
            svg
              .transition()
              .duration(2000)
              .ease(d3.easeCubicInOut)
              .call(
                zoom.transform as any,
                d3.zoomIdentity
                  .translate(width / 2, height / 2)
                  .scale(timelineZoom)
                  .translate(
                    -fullTimelineBounds.x - fullTimelineBounds.width / 2,
                    -fullTimelineBounds.y - fullTimelineBounds.height / 2
                  )
              );
          }
        }
      };
    });

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
  }
}
