import { useEffect, useMemo, useState } from "react";
import { loadNodesFromJson, loadTriplesFromNdjson } from "../../lib/src/graph/Loader";
import { query, top_nodes } from "../../lib/src/graph/API";
import type { IdeaTriple, IdeaNode, Predicate } from "../../lib/src/schema/IdeaGraph";

export function GraphDemo() {
  const [nodesCount, setNodesCount] = useState<number>(0);
  const [nodes, setNodes] = useState<IdeaNode[]>([]);
  const [triples, setTriples] = useState<IdeaTriple[]>([]);
  const [q, setQ] = useState("type:Project linked:preston");
  // Multi-select predicate filter (empty = All)
  const [selectedPreds, setSelectedPreds] = useState<Set<Predicate>>(new Set());
  const [subjectId, setSubjectId] = useState<string>("person.preston");
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

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
    return opts;
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

// Color helper for predicate badges/chips
function predicateColor(p: Predicate): string {
  const map: Record<Predicate, string> = {
    worked_on: "#2563eb", // blue
    built: "#16a34a", // green
    authored: "#7c3aed", // purple
    proposes: "#ea580c", // orange
    role: "#0ea5e9", // sky
    holds_degree_in: "#9333ea", // violet
    learned_at_age: "#64748b", // slate
    inspired_by: "#f59e0b", // amber
    about: "#0d9488", // teal
    relates_to: "#0891b2", // cyan
    category: "#a16207", // yellow-darker
    tag: "#525252", // neutral
    status: "#b91c1c", // red
    evidence: "#065f46", // emerald-darker
  };
  return map[p] ?? "#4b5563"; // fallback slate-600
}

type DetailsDrawerProps = {
  nodeId: string;
  onClose: () => void;
  nodeById: Map<string, IdeaNode>;
  triples: IdeaTriple[];
  onNavigate?: (nextNodeId: string) => void;
};

function DetailsDrawer({ nodeId, onClose, nodeById, triples, onNavigate }: DetailsDrawerProps) {
  const node = nodeById.get(nodeId);
  const outbound = useMemo(() => triples.filter((t) => t.s === nodeId), [triples, nodeId]);
  const inbound = useMemo(
    () => triples.filter((t) => typeof t.o === "string" && t.o === nodeId),
    [triples, nodeId]
  );

  // Esc to close
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.25)",
        }}
      />
      {/* Drawer */}
      <aside
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          height: "100%",
          width: 380,
          background: "#fff",
          borderLeft: "1px solid #ddd",
          boxShadow: "-4px 0 12px rgba(0,0,0,0.08)",
          padding: 16,
          overflowY: "auto",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontWeight: 700 }}>Details</div>
          <button onClick={onClose} style={{ border: "1px solid #ccc", borderRadius: 6, padding: "4px 8px", cursor: "pointer" }}>
            Close
          </button>
        </div>
        <div style={{ marginTop: 10 }}>
          <div style={{ fontSize: 14, color: "#666" }}>ID</div>
          <div style={{ fontFamily: "monospace" }}>{nodeId}</div>
        </div>
        {node ? (
          <div style={{ marginTop: 10 }}>
            <div style={{ fontSize: 14, color: "#666" }}>Label</div>
            <div style={{ fontWeight: 600 }}>{node.label}</div>
            <div style={{ marginTop: 8, display: "flex", gap: 6, alignItems: "center" }}>
              <span style={{ fontSize: 12, color: "#666" }}>Type</span>
              <span style={{ fontSize: 12, padding: "2px 8px", borderRadius: 999, background: "#eef2ff", color: "#3730a3", border: "1px solid #c7d2fe" }}>
                {node.type}
              </span>
            </div>
            {node.summary && (
              <div style={{ marginTop: 8 }}>
                <div style={{ fontSize: 14, color: "#666" }}>Summary</div>
                <div>{node.summary}</div>
              </div>
            )}
            {node.tags?.length ? (
              <div style={{ marginTop: 8 }}>
                <div style={{ fontSize: 14, color: "#666" }}>Tags</div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 4 }}>
                  {node.tags.map((t) => (
                    <span key={t} style={{ fontSize: 12, padding: "2px 8px", borderRadius: 999, background: "#f3f4f6", border: "1px solid #e5e7eb" }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        ) : (
          <div style={{ color: "#666", marginTop: 8 }}>No node metadata found</div>
        )}

        <div style={{ marginTop: 16 }}>
          <div style={{ fontWeight: 600 }}>Outbound triples</div>
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {outbound.map((t, i) => (
              <li key={`out-${i}`}>
                <strong>{t.p}</strong>:
                {" "}
                {typeof t.o === "string" ? (
                  <button
                    onClick={() => onNavigate && onNavigate(t.o as string)}
                    style={{ background: "none", border: "none", padding: 0, color: "#2563eb", textDecoration: "underline", cursor: "pointer" }}
                  >
                    {nodeById.get(t.o)?.label ?? (t.o as string)}
                  </button>
                ) : (
                  String(t.o)
                )}
              </li>
            ))}
            {!outbound.length && <li style={{ color: "#777" }}>None</li>}
          </ul>
        </div>
        <div style={{ marginTop: 12 }}>
          <div style={{ fontWeight: 600 }}>Inbound triples</div>
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {inbound.map((t, i) => (
              <li key={`in-${i}`}>
                <strong>{t.p}</strong>:{" "}
                <button
                  onClick={() => onNavigate && onNavigate(t.s)}
                  style={{ background: "none", border: "none", padding: 0, color: "#2563eb", textDecoration: "underline", cursor: "pointer" }}
                >
                  {nodeById.get(t.s)?.label ?? t.s}
                </button>
              </li>
            ))}
            {!inbound.length && <li style={{ color: "#777" }}>None</li>}
          </ul>
        </div>
      </aside>
    </div>
  );
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
        {/* Predicate chips */}
        <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
          <label style={{ fontSize: 12, color: "#555" }}>Predicates</label>
          {/* All chip */}
          <button
            onClick={() => setSelectedPreds(new Set())}
            style={{
              padding: "4px 10px",
              borderRadius: 999,
              border: "1px solid #ccc",
              background: selectedPreds.size === 0 ? "#222" : "#fff",
              color: selectedPreds.size === 0 ? "#fff" : "#222",
              cursor: "pointer",
            }}
          >
            All
          </button>
          {predicateOptions.map((opt) => {
            const isOn = selectedPreds.has(opt as Predicate);
            const count = grouped.get(opt as Predicate)?.length ?? 0;
            const color = predicateColor(opt as Predicate);
            return (
              <button
                key={opt}
                onClick={() => {
                  setSelectedPreds((prev) => {
                    const next = new Set(prev);
                    if (next.has(opt as Predicate)) next.delete(opt as Predicate);
                    else next.add(opt as Predicate);
                    return next;
                  });
                }}
                style={{
                  padding: "4px 10px",
                  borderRadius: 999,
                  border: `1px solid ${isOn ? color : "#ccc"}`,
                  background: isOn ? color : "#fff",
                  color: isOn ? "#fff" : "#222",
                  cursor: "pointer",
                  display: "flex",
                  gap: 6,
                  alignItems: "center",
                }}
              >
                <span>{opt}</span>
                <span style={{
                  background: isOn ? "rgba(255,255,255,0.25)" : color,
                  color: "#fff",
                  borderRadius: 999,
                  padding: "0 6px",
                  fontSize: 12,
                }}>{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Profile view for subject */}
      <section style={{ marginTop: 12 }}>
        {/* Subject header UX */}
        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
          <h3 style={{ fontWeight: 700, fontSize: 18, margin: 0 }}>
            {nodeById.get(SUBJECT_ID)?.label ?? SUBJECT_ID}
          </h3>
          {nodeById.get(SUBJECT_ID)?.type && (
            <span style={{
              fontSize: 12,
              padding: "2px 8px",
              borderRadius: 999,
              background: "#eef2ff",
              color: "#3730a3",
              border: "1px solid #c7d2fe",
            }}>
              {nodeById.get(SUBJECT_ID)!.type}
            </span>
          )}
        </div>
        {nodeById.get(SUBJECT_ID)?.summary && (
          <div style={{ color: "#555", marginTop: 4 }}>{nodeById.get(SUBJECT_ID)!.summary}</div>
        )}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12, marginTop: 8 }}>
          {Array.from(grouped.entries())
            .filter(([p]) => selectedPreds.size === 0 || selectedPreds.has(p))
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
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                <div style={{ fontWeight: 600 }}>
                  {friendlyPredicate(p, objs.length)}
                </div>
                {/* Predicate badge with color */}
                <span style={{
                  background: predicateColor(p),
                  color: "#fff",
                  borderRadius: 999,
                  padding: "0 8px",
                  fontSize: 12,
                }}>
                  {objs.length}
                </span>
              </div>
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                {objs.map((o, i) => {
                  const title = objectTitle(o);
                  const node = typeof o === "string" ? nodeById.get(o) : undefined;
                  return (
                    <li
                      key={`${String(o)}|${i}`}
                      onClick={() => typeof o === "string" && setSelectedNodeId(o)}
                      style={{ cursor: typeof o === "string" ? "pointer" : "default" }}
                      title={typeof o === "string" ? "Click for details" : undefined}
                    >
                      <span style={{ textDecoration: typeof o === "string" ? "underline" : "none" }}>{title}</span>
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

      {/* Details Drawer */}
      {selectedNodeId && (
        <DetailsDrawer
          nodeId={selectedNodeId}
          onClose={() => setSelectedNodeId(null)}
          nodeById={nodeById}
          triples={triples}
          onNavigate={(next) => setSelectedNodeId(next)}
        />
      )}

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
