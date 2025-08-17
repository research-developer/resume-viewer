import { useEffect, useMemo, useState } from "react";
import { loadNodesFromJson, loadTriplesFromNdjson } from "../../lib/src/graph/Loader";
import { query, top_nodes } from "../../lib/src/graph/API";
import type { IdeaTriple } from "../../lib/src/schema/IdeaGraph";

export function GraphDemo() {
  const [nodesCount, setNodesCount] = useState<number>(0);
  const [triples, setTriples] = useState<IdeaTriple[]>([]);
  const [q, setQ] = useState("type:Project linked:preston");

  useEffect(() => {
    // Load seeds from public
    async function load() {
      const [nodesRes, triplesRes] = await Promise.all([
        fetch("/graph/nodes.json"),
        fetch("/graph/triples.ndjson"),
      ]);
      const nodesText = await nodesRes.text();
      const triplesText = await triplesRes.text();
      const nodes = loadNodesFromJson(nodesText);
      const t = loadTriplesFromNdjson(triplesText);
      setNodesCount(nodes.length);
      setTriples(t);
    }
    load().catch(console.error);
  }, []);

  const results = useMemo<IdeaTriple[]>(() => (q.trim() ? query(q, triples) : []), [q, triples]);
  const top = useMemo(() => (triples.length ? top_nodes("person.preston", triples, 5) : []), [triples]);

  return (
    <div style={{ padding: 16, borderTop: "1px solid #eee" }}>
      <h2 style={{ fontSize: 18, fontWeight: 600 }}>Graph Demo</h2>
      <p style={{ color: "#555" }}>
        Loaded {nodesCount} nodes, {triples.length} triples
      </p>

      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        <input
          value={q}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQ(e.target.value)}
          placeholder="Try: type:Project tag:agentic linked:preston"
          style={{ flex: 1, padding: 8, border: "1px solid #ccc", borderRadius: 6 }}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 12 }}>
        <section>
          <h3 style={{ fontWeight: 600, marginBottom: 6 }}>Query Results ({results.length})</h3>
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {results.map((t: IdeaTriple, i: number) => (
              <li key={`${t.s}|${t.p}|${String(t.o)}|${i}`}>
                <code>{t.s}</code> <strong>{t.p}</strong> <code>{String(t.o)}</code>
              </li>
            ))}
            {!results.length && <li style={{ color: "#777" }}>No results</li>}
          </ul>
        </section>

        <section>
          <h3 style={{ fontWeight: 600, marginBottom: 6 }}>Top Nodes for person.preston</h3>
          <ol style={{ margin: 0, paddingLeft: 18 }}>
            {top.map((n: { id: string; score: number }) => (
              <li key={n.id}>
                <code>{n.id}</code> — score {n.score.toFixed(2)}
              </li>
            ))}
            {!top.length && <li style={{ color: "#777" }}>No scores</li>}
          </ol>
        </section>
      </div>
    </div>
  );
}
