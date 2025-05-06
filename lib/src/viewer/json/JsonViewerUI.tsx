import React, { useState, useEffect } from "react";
import { ChevronRightIcon, ChevronDownIcon } from "@heroicons/react/24/solid";

interface CollapsedState {
  [path: string]: boolean;
}

interface JsonViewerUIProps {
  data: unknown;
  depth?: number;
  defaultExpandDepth?: number; // New prop for controlling default expansion level
}

/**
 * Builds a unique path string for each node. E.g. ("root.user", "address") => "root.user.address"
 */
const createPath = (parentPath: string, key: string | number) => {
  return parentPath ? `${parentPath}.${key}` : String(key);
};

/**
 * A small component to display primitive values (string, number, boolean, null)
 * with Tailwind color classes, including handling multiline strings.
 */
const PrimitiveValue: React.FC<{ value: unknown }> = ({ value }) => {
  if (value instanceof Date) {
    return (
      <span className="text-accent-green">
        {isNaN(value.getTime()) ? "Invalid Date" : value.toISOString()}
      </span>
    );
  }

  if (typeof value === "bigint") {
    return <span className="text-accent-purple">{value.toString()}n</span>;
  }

  if (typeof value === "symbol") {
    return <span className="text-accent-orange">{value.toString()}</span>;
  }

  if (typeof value === "undefined") {
    return <span className="text-muted">undefined</span>;
  }

  if (typeof value === "string") {
    // Split on newlines to preserve line breaks in multiline strings
    const lines = value.split("\n");

    return (
      <span className="text-primary">
        "
        {lines.map((line, i) => (
          <React.Fragment key={i}>
            {line}
            {i < lines.length - 1 && <br />}
          </React.Fragment>
        ))}
        "
      </span>
    );
  }

  if (typeof value === "number") {
    return <span className="text-accent-blue">{value}</span>;
  }

  if (typeof value === "boolean") {
    return <span className="text-primary">{value.toString()}</span>;
  }

  if (value === null) {
    return <span className="text-muted">null</span>;
  }

  // Fallback for other cases (e.g., undefined)
  return (
    <span className="text-accent-blue-light">{JSON.stringify(value)}</span>
  );
};

/**
 * A recursive component for displaying arrays, objects, or primitives.
 */
interface JsonNodeProps {
  value: unknown;
  path: string; // The path to this node in the JSON structure
  collapsedState: CollapsedState;
  setCollapsedState: React.Dispatch<React.SetStateAction<CollapsedState>>;
  depth: number;
  nodeKey?: string | number; // The key (or index) associated with this node
}

const JsonNode: React.FC<JsonNodeProps> = ({
  value,
  path,
  collapsedState,
  setCollapsedState,
  depth,
  nodeKey,
}) => {
  const isCollapsed = collapsedState[path] || false;

  const toggleCollapse = () => {
    setCollapsedState((prev) => ({
      ...prev,
      [path]: !prev[path],
    }));
  };

  // ---------------------------------------
  // PRIMITIVE VALUES OR DATES
  // ---------------------------------------
  if (typeof value !== "object" || value === null || value instanceof Date) {
    return (
      <>
        {nodeKey !== undefined && (
          <>
            <span className="text-accent-blue-light">"{nodeKey}"</span>:{" "}
          </>
        )}
        <PrimitiveValue value={value} />
      </>
    );
  }

  // ---------------------------------------
  // ARRAYS
  // ---------------------------------------
  if (Array.isArray(value)) {
    const length = value.length;
    if (length === 0) {
      return (
        <div>
          {nodeKey !== undefined && (
            <>
              <span className="text-accent-blue-light">"{nodeKey}"</span>:{" "}
            </>
          )}
          <span className="text-accent-blue-dark">[]</span>
        </div>
      );
    }

    return (
      <div>
        {nodeKey !== undefined && (
          <>
            <span className="text-accent-blue-light">"{nodeKey}"</span>:{" "}
          </>
        )}
        <button
          className="inline-flex items-center justify-center p-0.5 rounded-sm bg-accent-blue/30 border-0 text-primary hover:bold  duration-200 focus:outline-none"
          onClick={toggleCollapse}
          aria-label={isCollapsed ? "Expand array" : "Collapse array"}
        >
          {isCollapsed ? (
            <ChevronRightIcon className="w-3 h-3" />
          ) : (
            <ChevronDownIcon className="w-3 h-3" />
          )}
        </button>{" "}
        {isCollapsed ? (
          <span className="text-accent-blue-dark">
            [<span className="text-accent-blue-light">{length}</span>]
          </span>
        ) : (
          <>
            <span className="text-accent-blue-dark">[</span>
            <div className="ml-6 border-l-2 border-border pl-2 mt-1">
              {value.map((item, index) => {
                const childPath = createPath(path, index);
                return (
                  <div key={childPath} className="mt-1">
                    <JsonNode
                      value={item}
                      path={childPath}
                      nodeKey={index}
                      collapsedState={collapsedState}
                      setCollapsedState={setCollapsedState}
                      depth={depth + 1}
                    />
                  </div>
                );
              })}
            </div>
            <div className="mt-1">
              <span className="text-accent-blue-dark">]</span>
            </div>
          </>
        )}
      </div>
    );
  }

  // ---------------------------------------
  // OBJECTS
  // ---------------------------------------
  const entries = Object.entries(value);
  if (entries.length === 0) {
    return (
      <div>
        {nodeKey !== undefined && (
          <>
            <span className="text-accent-blue-light">"{nodeKey}"</span>:{" "}
          </>
        )}
        <span className="text-accent-blue">{`{}`}</span>
      </div>
    );
  }

  return (
    <div>
      {nodeKey !== undefined && (
        <>
          <span className="text-accent-blue-light">"{nodeKey}"</span>:{" "}
        </>
      )}
      <button
        className="inline-flex items-center justify-center p-0.5 rounded-sm bg-transparent border-0 text-accent-blue hover:text-accent-blue-light transition-colors duration-200 focus:outline-none"
        onClick={toggleCollapse}
        aria-label={isCollapsed ? "Expand object" : "Collapse object"}
      >
        {isCollapsed ? (
          <ChevronRightIcon className="w-3 h-3" />
        ) : (
          <ChevronDownIcon className="w-3 h-3" />
        )}
      </button>{" "}
      {isCollapsed ? (
        <span className="text-accent-blue">{`{...}`}</span>
      ) : (
        <>
          <span className="text-accent-blue">{"{"}</span>
          <div className="ml-6 border-l-2 border-border pl-2 mt-1">
            {entries.map(([childKey, val]) => {
              const childPath = createPath(path, childKey);
              return (
                <div key={childPath} className="mt-1">
                  <JsonNode
                    value={val}
                    path={childPath}
                    nodeKey={childKey}
                    collapsedState={collapsedState}
                    setCollapsedState={setCollapsedState}
                    depth={depth + 1}
                  />
                </div>
              );
            })}
          </div>
          <div className="mt-1">
            <span className="text-accent-blue">{"}"}</span>
          </div>
        </>
      )}
    </div>
  );
};

/**
 * Recursively initializes collapse state based on node depth
 */
const initializeCollapsedState = (
  data: unknown,
  path: string = "",
  currentDepth: number = 0,
  maxDepth: number = 2
): CollapsedState => {
  const state: CollapsedState = {};

  // Only process objects and arrays past depth 0
  if (typeof data === "object" && data !== null) {
    // Mark as collapsed if deeper than max depth
    if (currentDepth >= maxDepth) {
      state[path] = true;
    }

    // Recursively process children
    if (Array.isArray(data)) {
      data.forEach((item, index) => {
        const childPath = createPath(path, index);
        const childState = initializeCollapsedState(
          item,
          childPath,
          currentDepth + 1,
          maxDepth
        );
        Object.assign(state, childState);
      });
    } else {
      Object.entries(data).forEach(([key, value]) => {
        const childPath = createPath(path, key);
        const childState = initializeCollapsedState(
          value,
          childPath,
          currentDepth + 1,
          maxDepth
        );
        Object.assign(state, childState);
      });
    }
  }

  return state;
};

const JsonViewerUI: React.FC<JsonViewerUIProps> = ({
  data,
  depth = 0,
  defaultExpandDepth = 2, // Default to expanding first 2 levels
}) => {
  // Precompute the initial collapsed state
  const initialCollapsedState = React.useMemo(
    () => initializeCollapsedState(data, "", 0, defaultExpandDepth),
    [data, defaultExpandDepth]
  );

  const [collapsedState, setCollapsedState] = useState<CollapsedState>(
    initialCollapsedState
  );

  // Update collapsed state if data or defaultExpandDepth changes
  useEffect(() => {
    setCollapsedState(
      initializeCollapsedState(data, "", 0, defaultExpandDepth)
    );
  }, [data, defaultExpandDepth]);

  return (
    <div className={`${depth === 0 ? "overflow-auto" : ""}`}>
      {/* Use pre-wrap and break-words to handle long lines or multiline strings */}
      <pre className="text-sm leading-6 whitespace-pre-wrap break-words font-[var(--font-body)]">
        <JsonNode
          value={data}
          path=""
          collapsedState={collapsedState}
          setCollapsedState={setCollapsedState}
          depth={depth}
        />
      </pre>
    </div>
  );
};

export default JsonViewerUI;
