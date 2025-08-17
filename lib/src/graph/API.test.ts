import { describe, it, expect } from "vitest";
import { exporter, query, top_nodes } from "./API";
import { loadNodesFromJson, loadTriplesFromNdjson } from "./Loader";
import fs from "node:fs";
import path from "node:path";

const dataDir = path.join(__dirname, "../../data");

describe("graph API seeds and helpers", () => {
  const nodes = loadNodesFromJson(
    fs.readFileSync(path.join(dataDir, "nodes.json"), "utf8")
  );
  const triples = loadTriplesFromNdjson(
    fs.readFileSync(path.join(dataDir, "triples.ndjson"), "utf8")
  );

  it("exports nodes and triples", () => {
    const nj = exporter.nodesJson(nodes);
    const tj = exporter.triplesNdjson(triples);
    expect(JSON.parse(nj)).toHaveLength(nodes.length);
    expect(tj.trim().split(/\n/)).toHaveLength(triples.length);
  });

  it("query facade works with NL filters", () => {
    const results = query("type:Project tag:agentic linked:preston", triples);
    expect(results.some((t) => t.o === "project.branching_agentic_chat")).toBe(true);
  });

  it("top_nodes computes scores with recency tiebreak", () => {
    const top = top_nodes("person.preston", triples, 3);
    expect(top.length).toBeGreaterThan(0);
    expect(top[0]).toHaveProperty("id");
    expect(top[0]).toHaveProperty("score");
  });
});
