import { describe, it, expect } from "vitest";
import { compileQuery } from "./NLCompiler";
import { executeQuery } from "./QueryExec";
import type { IdeaTriple } from "../schema/IdeaGraph";

const triples: IdeaTriple[] = [
  { s: "a", p: "tag", o: "media" },
  { s: "a", p: "relates_to", o: "oxytocin" },
  { s: "b", p: "tag", o: "media" },
  { s: "x", p: "category", o: "Project" },
];

describe("NLCompiler", () => {
  it("parses key:value filters and executes", () => {
    const { ast, options } = compileQuery("p:tag o:media");
    const out = executeQuery(ast, triples, options);
    expect(out.map((t) => t.s)).toEqual(["a", "b"]);
  });

  it("parses free text terms as OR on object", () => {
    const { ast, options } = compileQuery("media oxytocin");
    const out = executeQuery(ast, triples, options);
    // should include triples with o in {media, oxytocin}
    expect(out.map((t) => t.o)).toEqual(["media", "oxytocin", "media"]);
  });

  it("supports linked: term as s:val OR o:val", () => {
    const { ast, options } = compileQuery("linked:a");
    const out = executeQuery(ast, triples, options);
    // s=a matches 2 triples
    expect(out.length).toBe(2);
  });

  it("supports type: as alias to category:", () => {
    const { ast, options } = compileQuery("type:Project");
    const out = executeQuery(ast, triples, options);
    expect(out).toHaveLength(1);
    expect(out[0].s).toBe("x");
  });

  it("matches all when no filters provided", () => {
    const { ast, options } = compileQuery("");
    const out = executeQuery(ast, triples, options);
    expect(out).toHaveLength(triples.length);
  });
});
