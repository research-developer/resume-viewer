import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { loadTriplesFromNdjson } from "../graph/Loader";
import { topBaseNodes } from "./IdeaGraphScore";

const dataDir = join(process.cwd(), "data", "idea-graph");

describe("IdeaGraph scoring", () => {
  // Load seed triples
  const triples = loadTriplesFromNdjson(
    readFileSync(join(dataDir, "triples.ndjson"), "utf8")
  );

  it("computes top nodes for person.preston with expected high scores for worked_on", () => {
    const tops = topBaseNodes("person.preston", triples, 5);
    expect(tops.length).toBeGreaterThan(0);

    // Expect that project/worked_on edges contribute higher scores (1.5)
    const hasWorkedOn = tops.some((t) =>
      triples.some(
        (tr) => tr.s === "person.preston" && tr.o === t.id && tr.p === "worked_on"
      )
    );
    expect(hasWorkedOn).toBe(true);

    // The first two should be among objects with worked_on given our seed
    const topIds = new Set(tops.slice(0, 2).map((t) => t.id));
    const workedOnIds = new Set(
      triples
        .filter((tr) => tr.s === "person.preston" && tr.p === "worked_on")
        .map((tr) => String(tr.o))
    );
    const overlap = [...topIds].filter((id) => workedOnIds.has(id));
    expect(overlap.length).toBeGreaterThan(0);
  });
});
