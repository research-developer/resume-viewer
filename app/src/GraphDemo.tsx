import { useEffect, useMemo, useState } from "react";
import { loadNodesFromJson, loadTriplesFromNdjson } from "../../lib/src/graph/Loader";
import { query, top_nodes } from "../../lib/src/graph/API";
import type { IdeaTriple, IdeaNode, Predicate } from "../../lib/src/schema/IdeaGraph";

export function GraphDemo() {
  const [nodesCount, setNodesCount] = useState<number>(0);
  const [nodes, setNodes] = useState<IdeaNode[]>([]);
  const [triples, setTriples] = useState<IdeaTriple[]>([]);
  const [q, setQ] = useState("type:Project linked:preston");
  const [predFilter, setPredFilter] = useState<string>("All");
  const [subjectId, setSubjectId] = useState<string>("person.preston");

  useEffect(() => {
    // Load seeds from public
    async function load() {
      const [nodesRes, triplesRes] = await Promise.all([
        fetch("graph/nodes.json"),
        fetch("graph/triples.ndjson"),
      ]);
      const nodesText = await nodesRes.text();
      const triplesText = await triplesRes.text();
      const nodes = loadNodesFromJson(nodesText);
      const t = loadTriplesFromNdjson(triplesText);
      setNodesCount(nodes.length);
      setNodes(nodes);
      setTriples(t);
    }
    load().catch(console.error);
  }, []);

  const results = useMemo<IdeaTriple[]>(() => (q.trim() ? query(q, triples) : []), [q, triples]);
  const top = useMemo(() => (triples.length ? top_nodes("person.preston", triples, 5) : []), [triples]);

  const SUBJECT_ID = subjectId;

  // Build id -> node map for readable titles
  const nodeById = useMemo(() => {
    const m = new Map<string, IdeaNode>();
    for (const n of nodes) m.set(n.id, n);
    return m;
  }, [nodes]);

  // Group triples for subject by predicate, dedupe per predicate
  const grouped = useMemo(() => {
    const g = new Map<Predicate, Array<string | number | boolean>>();
    for (const t of triples) {
      if (t.s !== SUBJECT_ID) continue;
      const arr = g.get(t.p) ?? [];
      arr.push(t.o);
      g.set(t.p, arr);
    }
    for (const [p, arr] of g) {
      const seen = new Set<string>();
      const dedup: Array<string | number | boolean> = [];
      for (const v of arr) {
        const key = typeof v === "string" ? v : JSON.stringify(v);
        if (!seen.has(key)) {
          seen.add(key);
          dedup.push(v);
        }
      }
      g.set(p, dedup);
    }
    return g;
  }, [triples, SUBJECT_ID]);

  const preferredOrder = useMemo<Predicate[]>(
    () => [
      "worked_on",
      "built",
      "authored",
      "proposes",
      "role",
      "holds_degree_in",
      "learned_at_age",
      "inspired_by",
      "about",
      "category",
      "tag",
      "status",
      "evidence",
    ],
    []
  );

  const predicateOptions = useMemo(() => {
    const opts = Array.from(grouped.keys()).sort((a, b) => {
      const ai = preferredOrder.indexOf(a as Predicate);
      const bi = preferredOrder.indexOf(b as Predicate);
      if (ai === -1 && bi === -1) return a.localeCompare(b);
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    });
    return ["All", ...opts];
  }, [grouped, preferredOrder]);

  const subjectOptions = useMemo(() => {
    const subs = new Set<string>();
    for (const t of triples) subs.add(t.s);
    // Prefer to show Persons first if present in nodes
    const personIds = new Set(nodes.filter((n) => n.type === "Person").map((n) => n.id));
    const arr = Array.from(subs);
    arr.sort((a, b) => {
      const ap = personIds.has(a) ? 0 : 1;
      const bp = personIds.has(b) ? 0 : 1;
      if (ap !== bp) return ap - bp;
      return a.localeCompare(b);
    });
    return arr;
  }, [triples, nodes]);

  function friendlyPredicateBase(p: Predicate): string {
    const map: Record<Predicate, string> = {
      authored: "Wrote",
      proposes: "Proposes",
      worked_on: "Worked on",
      built: "Built",
      holds_degree_in: "Degree in",
      learned_at_age: "Learned at age",
      role: "Role",
      inspired_by: "Inspired by",
      about: "About",
      relates_to: "Related to",
      category: "Category",
      tag: "Tag",
      status: "Status",
      evidence: "Evidence",
    };
    return map[p] ?? p.replace(/_/g, " ").replace(/^./, (c) => c.toUpperCase());
  }

  function friendlyPredicate(p: Predicate, count: number): string {
    const base = friendlyPredicateBase(p);
    // pluralize when appropriate (simple rule)
    if (count > 1) {
      if (base.endsWith("y")) return base.slice(0, -1) + "ies";
      if (/\b(Wrote|Built|Proposes|Worked on|Inspired by|Related to)\b/.test(base)) return base; // phrases
      return base + "s";
    }
    return base;
  }

  function objectTitle(o: string | number | boolean): string {
    if (typeof o === "string") {
      const node = nodeById.get(o);
      if (node) return node.label;
      return o;
    }
    return String(o);
  }

  return (
    <div style={{ padding: 16, borderTop: "1px solid #eee" }}>
      <h2 style={{ fontSize: 18, fontWeight: 600 }}>Graph Demo</h2>
      <p style={{ color: "#555" }}>
        Loaded {nodesCount} nodes, {triples.length} triples
      </p>

      {/* Subject and predicate filters */}
      <div style={{ display: "flex", gap: 12, marginTop: 8, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <label style={{ fontSize: 12, color: "#555" }}>Subject</label>
          <select value={subjectId} onChange={(e) => setSubjectId(e.target.value)} style={{ padding: 6, borderRadius: 6, border: "1px solid #ccc" }}>
            {subjectOptions.map((opt) => (
              <option key={opt} value={opt}>
                {nodeById.get(opt)?.label ?? opt}
              </option>
            ))}
          </select>
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <label style={{ fontSize: 12, color: "#555" }}>Predicate</label>
          <select value={predFilter} onChange={(e) => setPredFilter(e.target.value)} style={{ padding: 6, borderRadius: 6, border: "1px solid #ccc" }}>
            {predicateOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Profile view for subject */}
      <section style={{ marginTop: 12 }}>
        <h3 style={{ fontWeight: 700, fontSize: 16 }}>Profile: {SUBJECT_ID}</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12, marginTop: 8 }}>
          {Array.from(grouped.entries())
            .filter(([p]) => predFilter === "All" || p === (predFilter as Predicate))
            .sort(([a], [b]) => {
              const ai = preferredOrder.indexOf(a as Predicate);
              const bi = preferredOrder.indexOf(b as Predicate);
              if (ai === -1 && bi === -1) return a.localeCompare(b);
              if (ai === -1) return 1;
              if (bi === -1) return -1;
              return ai - bi;
            })
            .map(([p, objs]) => (
            <div key={p} style={{ border: "1px solid #eee", borderRadius: 8, padding: 10 }}>
              <div style={{ fontWeight: 600, marginBottom: 6 }}>
                {friendlyPredicate(p, objs.length)} {objs.length > 1 ? `(${objs.length})` : ""}
              </div>
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                {objs.map((o, i) => {
                  const title = objectTitle(o);
                  const node = typeof o === "string" ? nodeById.get(o) : undefined;
                  return (
                    <li key={`${String(o)}|${i}`}>
                      {title}
                      {node && (
                        <div style={{ color: "#666", fontSize: 12 }}>
                          <em>{node.type}</em>
                          {node.summary ? ` — ${node.summary}` : ""}
                        </div>
                      )}
                    </li>
                  );
                })}
                {!objs.length && <li style={{ color: "#777" }}>No entries</li>}
              </ul>
            </div>
          ))}
          {!grouped.size && <div style={{ color: "#777" }}>No subject triples</div>}
        </div>
      </section>

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
