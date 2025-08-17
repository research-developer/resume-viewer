import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { loadNodesFromJson, loadTriplesFromNdjson } from "./Loader";

const dataDir = join(process.cwd(), "data", "idea-graph");

describe("Graph Loader", () => {
  it("loads nodes.json and validates", () => {
    const json = readFileSync(join(dataDir, "nodes.json"), "utf8");
    const nodes = loadNodesFromJson(json);
    expect(nodes.length).toBeGreaterThan(0);
    expect(nodes.find((n) => n.id === "person.preston")).toBeTruthy();
  });

  it("loads triples.ndjson and validates", () => {
    const ndjson = readFileSync(join(dataDir, "triples.ndjson"), "utf8");
    const triples = loadTriplesFromNdjson(ndjson);
    expect(triples.length).toBeGreaterThan(0);
    expect(triples.some((t) => t.p === "authored")).toBe(true);
  });
});
