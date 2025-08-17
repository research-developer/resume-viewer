import { IdeaTriple } from "../schema/IdeaGraph";
import { topBaseNodes, TopNode } from "../analyzer/IdeaGraphScore";
import { compileQuery } from "./NLCompiler";
import { executeQuery } from "./QueryExec";
import { exportNodesJson, exportTriplesNdjson } from "./Loader";

/**
 * Facade: return top base nodes for a subject given triples.
 * Keeps API minimal and pure; caller supplies triples (e.g., from loaders or an API).
 */
export function top_nodes(
  subjectId: string,
  triples: IdeaTriple[],
  limit?: number
): TopNode[] {
  return topBaseNodes(subjectId, triples, limit);
}

/**
 * Facade: execute a natural-language or key:value query against triples.
 * Supports tokens like: s:, p:, o:, tag:, category:, type:, linked:, limit:, offset:
 */
export function query(input: string, triples: IdeaTriple[]): IdeaTriple[] {
  const tokens = input.trim().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) {
    const { ast, options } = compileQuery("");
    return executeQuery(ast, triples, options);
  }
  const seen = new Set<string>();
  const out: IdeaTriple[] = [];
  for (const tok of tokens) {
    const { ast, options } = compileQuery(tok);
    const part = executeQuery(ast, triples, options);
    for (const t of part) {
      const key = `${t.s}|${t.p}|${String(t.o)}`;
      if (!seen.has(key)) {
        seen.add(key);
        out.push(t);
      }
    }
  }
  return out;
}

/** Export helpers for consumers */
export const exporter = {
  nodesJson: exportNodesJson,
  triplesNdjson: exportTriplesNdjson,
};
