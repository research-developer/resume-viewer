import { IdeaTriple } from "../schema/IdeaGraph";
import { topBaseNodes, TopNode } from "../analyzer/IdeaGraphScore";

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
