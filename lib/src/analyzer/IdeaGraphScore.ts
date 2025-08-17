import { IdeaTriple, Predicate } from "../schema/IdeaGraph";

// Weights per PLANS.md
const DEFAULT_WEIGHT = 1.0;
const WEIGHTS: Partial<Record<Predicate, number>> = {
  worked_on: 1.5,
  authored: 1.3,
  proposes: 1.2,
  built: 1.2,
  relates_to: 0.7,
};

function predicateWeight(p: Predicate): number {
  return WEIGHTS[p] ?? DEFAULT_WEIGHT;
}

/** Compute score for a nodeId where subject is the given personId (e.g., "person.preston"). */
export function scoreNode(
  nodeId: string,
  subjectId: string,
  triples: IdeaTriple[]
): number {
  let score = 0;
  for (const t of triples) {
    if (t.s === subjectId && String(t.o) === nodeId) {
      score += predicateWeight(t.p);
    }
  }
  return score;
}

/**
 * Compute a recency value for tie-breaking using the latest meta.created
 * among triples where s=subjectId and o=nodeId. Returns epoch milliseconds, or 0.
 */
function latestRecency(
  nodeId: string,
  subjectId: string,
  triples: IdeaTriple[]
): number {
  let max = 0;
  for (const t of triples) {
    if (t.s === subjectId && String(t.o) === nodeId) {
      const created = t.meta?.created;
      if (created) {
        const ts = Date.parse(created);
        if (!Number.isNaN(ts) && ts > max) max = ts;
      }
    }
  }
  return max;
}

export type TopNode = { id: string; score: number; recency: number };

/**
 * Return top base nodes for a subject (e.g., "person.preston") ordered by score desc,
 * tie-broken by recency desc (meta.created). If limit is provided, truncate.
 */
export function topBaseNodes(
  subjectId: string,
  triples: IdeaTriple[],
  limit?: number
): TopNode[] {
  // Construct candidate set: nodes that appear as object of s=subjectId triples
  const candidateIds = new Set<string>();
  for (const t of triples) {
    if (t.s === subjectId && typeof t.o === "string") {
      candidateIds.add(t.o);
    }
  }

  const candidates: TopNode[] = [];
  for (const id of candidateIds) {
    const s = scoreNode(id, subjectId, triples);
    const r = latestRecency(id, subjectId, triples);
    candidates.push({ id, score: s, recency: r });
  }

  candidates.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return b.recency - a.recency;
  });

  return typeof limit === "number" ? candidates.slice(0, Math.max(0, limit)) : candidates;
}
