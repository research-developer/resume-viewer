import { describe, it, expect } from "vitest";
import { NodeSchema, TripleSchema, Predicate, NodeType } from "./IdeaGraph";

describe("IdeaGraph Schema", () => {
  it("validates a node", () => {
    const node = {
      id: "person.preston",
      type: "Person" as NodeType,
      label: "Preston",
      summary: "Human of many plots",
      tags: ["founder", "developer", "parent"],
    };
    const parsed = NodeSchema.parse(node);
    expect(parsed.id).toBe("person.preston");
  });

  it("validates a triple with meta", () => {
    const triple = {
      s: "person.preston",
      p: "authored" as Predicate,
      o: "musing.social_media_time_bomb",
      meta: { weight: 1.3, created: "2025-08-15" },
    };
    const parsed = TripleSchema.parse(triple);
    expect(parsed.p).toBe("authored");
  });

  it("rejects invalid predicate", () => {
    const triple = {
      s: "person.preston",
      // @ts-expect-error: invalid predicate
      p: "WRONG",
      o: "x",
    };
    expect(() => TripleSchema.parse(triple)).toThrowError();
  });
});
