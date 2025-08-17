import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { loadTriplesFromNdjson } from "./Loader";
import { executeQuery } from "./QueryExec";
import { q } from "./QueryBuilder";
import { QueryAST } from "./QueryTypes";

const dataDir = join(process.cwd(), "data", "idea-graph");
const triples = loadTriplesFromNdjson(
  readFileSync(join(dataDir, "triples.ndjson"), "utf8")
);

describe("Query facade", () => {
  it("filters by subject eq", () => {
    const { ast, options } = q.s("person.preston").build();
    const out = executeQuery(ast, triples, options);
    expect(out.length).toBeGreaterThan(0);
    expect(out.every((t) => t.s === "person.preston")).toBe(true);
  });

  it("supports and/or/not composition", () => {
    const authored = q.and(q.s("person.preston"), q.p("authored"));
    const workedOn = q.and(q.s("person.preston"), q.p("worked_on"));
    const { ast, options } = q.or(authored, workedOn).build();
    const out = executeQuery(ast, triples, options);
    expect(out.length).toBeGreaterThan(0);
    // not should exclude authored
    const notAuthored: QueryAST = q.not(q.p("authored")).build().ast;
    const out2 = out.filter((t) => executeQuery(notAuthored, [t], {}).length > 0);
    expect(out2.every((t) => t.p !== "authored")).toBe(true);
  });

  it("applies sort then limit/offset", () => {
    const { ast, options } = q
      .s("person.preston")
      .sort({ field: "o", dir: "asc" })
      .limit(2)
      .offset(0)
      .build();
    const out = executeQuery(ast, triples, options);
    expect(out.length).toBeLessThanOrEqual(2);
    const sorted = [...out].sort((a, b) => String(a.o).localeCompare(String(b.o)));
    expect(out.map((t) => String(t.o))).toEqual(sorted.map((t) => String(t.o)));
  });
});
