import { IdeaNode, IdeaTriple, parseNodes, parseTriples } from "../schema/IdeaGraph";

/** Parse a JSON string or object into IdeaNode[] using Zod validation. */
export function loadNodesFromJson(input: string | unknown): IdeaNode[] {
  const data = typeof input === "string" ? JSON.parse(input) : input;
  return parseNodes(data);
}

/** Parse NDJSON string (one JSON object per line) into IdeaTriple[] with Zod validation. */
export function loadTriplesFromNdjson(ndjson: string): IdeaTriple[] {
  const lines = ndjson
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
  const parsed = lines.map((line) => JSON.parse(line));
  return parseTriples(parsed);
}

/** Utility to parse already-materialized arrays with validation. */
export function validateNodes(nodes: unknown): IdeaNode[] {
  return parseNodes(nodes);
}

export function validateTriples(triples: unknown): IdeaTriple[] {
  return parseTriples(triples);
}

/** Serialize IdeaTriple[] to NDJSON (one JSON object per line). */
export function exportTriplesNdjson(triples: IdeaTriple[]): string {
  return triples.map((t) => JSON.stringify(t)).join("\n") + (triples.length ? "\n" : "");
}

/** Serialize IdeaNode[] to compact JSON string. */
export function exportNodesJson(nodes: IdeaNode[]): string {
  return JSON.stringify(nodes);
}
