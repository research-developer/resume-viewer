# Idea Graph — RDF Spec (Markdown for LLM Ingestion)

This specification represents Preston’s projects, skills, experiences, theories, musings, and media concepts as RDF‑like triples. It is optimized for ingestion by an AI‑powered IDE or LLM system.

---

## 1. Data Model

### Node Types
- `Person`
- `Idea`
- `Project`
- `Experiment`
- `Theory`
- `Musing`
- `Skill`
- `Experience`
- `Education`
- `Animal`
- `Media`
- `Website`
- `Tool`

### Predicates
- `authored` (Person → Idea/Project/Musing)
- `proposes` (Person → Theory/Experiment)
- `worked_on` (Person → Project)
- `built` (Person → Tool/Website)
- `holds_degree_in` (Person → Education)
- `learned_at_age` (Person → Skill)
- `role` (Person → Experience)
- `inspired_by` (Idea/Theory → Experience/Event)
- `about` (Idea/Theory → Topic)
- `relates_to` (Any → Any)
- `category` (Any → Tag)
- `tag` (Any → Tag)
- `status` (Project/Idea → planned | active | paused | archived)
- `evidence` (Theory → Source/Note)

### Triple Shape
```json
{
  "s": "node_id",
  "p": "predicate",
  "o": "node_id | literal",
  "meta": {
    "weight": 1.0,
    "notes": "string",
    "created": "2025-08-15"
  }
}
```

### Node Shape
```json
{
  "id": "node_id",
  "type": "NodeType",
  "label": "Human label",
  "summary": "1–2 line description",
  "tags": ["tag1", "tag2"]
}
```

---

## 2. Base‑Node Scoring

Base nodes = nodes where Preston is the subject.

```
score(node) = Σ_w predicate_weight(p) over edges where s = preston and o = node
```

Weights:
- `worked_on`: 1.5
- `authored`: 1.3
- `proposes`: 1.2
- `built`: 1.2
- `relates_to`: 0.7
- Others: 1.0

Order base nodes by score; tie‑break with recency.

---

## 3. Query Box Behavior
- Accept natural language queries → compile to graph operations.
- Example: *“show projects related to media bias and oxytocin”*.
- Allow lightweight filter syntax: `type:Project tag:media-bias linked:oxytocin`.
- Return subgraph (nodes + edges) with pagination.
- Export formats: JSON, NDJSON.

---

## 4. Seed Nodes
```json
[
  {"id": "person.preston", "type": "Person", "label": "Preston", "summary": "Human of many plots", "tags": ["founder","developer","parent"]},
  {"id": "musing.social_media_time_bomb", "type": "Musing", "label": "Ticking Time Bomb: Social Media & Corporations", "summary": "Speculation that current incentive structures make both social platforms and large corporations brittle and societally hazardous.", "tags": ["incentives","fragility","society"]},
  {"id": "story.cats_infected_mouse", "type": "Experience", "label": "Cats: Infected Mouse Origin", "summary": "A formative story: love for cats and meme-chaos traced back to an infected mouse encounter.", "tags": ["cats","origin","memes"]},
  {"id": "work.psychedelics_patent", "type": "Experience", "label": "Patented Psychedelic Formula", "summary": "Co-developed a patented formulation; industry path blocked by $$$ scale to approval.", "tags": ["psychedelics","patent"]},
  {"id": "theory.psychedelic_modulation", "type": "Theory", "label": "Psychedelic Modulation Theory", "summary": "Therapeutic action via modulation of predictive coding/priors and interoceptive precision; state-dependent plasticity.", "tags": ["predictive-processing","interoception"]},
  {"id": "edu.design_degree", "type": "Education", "label": "Graphic/Web Design Degree", "summary": "Formal education in graphic & web design; later adjunct instructor.", "tags": ["design","web"]},
  {"id": "skill.early_programming", "type": "Skill", "label": "Self-Taught Programming (childhood)", "summary": "Learned programming very young (circa ages 6–8), from AppleSoft BASIC onward.", "tags": ["programming","early"]},
  {"id": "role.semi_pro_photographer", "type": "Experience", "label": "Semi-Pro Photographer", "summary": "Paid and portfolio-grade work; visual systems sense honed.", "tags": ["photography"]},
  {"id": "role.amateur_racer_mechanic", "type": "Experience", "label": "Regional Amateur Racer & Makeshift Mechanic", "summary": "Competitive regional racing; hands-on wrenching and tuning.", "tags": ["motorsport","mechanic"]},
  {"id": "project.branching_agentic_chat", "type": "Project", "label": "Branching Agentic AI Chat Tool", "summary": "DAG of thoughts with agent roles; exports reproducible playbooks; MCP-aware.", "tags": ["agentic","graph","MCP"]}
]
```

---

## 5. Seed Triples
```json
[
  {"s": "person.preston", "p": "authored", "o": "musing.social_media_time_bomb", "meta": {"weight": 1.3}},
  {"s": "person.preston", "p": "inspired_by", "o": "story.cats_infected_mouse"},
  {"s": "person.preston", "p": "worked_on", "o": "work.psychedelics_patent", "meta": {"weight": 1.5}},
  {"s": "person.preston", "p": "proposes", "o": "theory.psychedelic_modulation", "meta": {"weight": 1.2}},
  {"s": "person.preston", "p": "holds_degree_in", "o": "edu.design_degree"},
  {"s": "person.preston", "p": "learned_at_age", "o": "skill.early_programming", "meta": {"notes": "ages 6–8"}},
  {"s": "person.preston", "p": "role", "o": "role.semi_pro_photographer"},
  {"s": "person.preston", "p": "role", "o": "role.amateur_racer_mechanic"},
  {"s": "person.preston", "p": "worked_on", "o": "project.branching_agentic_chat", "meta": {"weight": 1.5}}
]
```

---

## 6. UI Sketch (Desktop)
- **Top Bar:** Query input + button. Right side: dynamic Top Base Nodes.
- **Left Pane:** Filters (type, tags, time).
- **Main Canvas:** Zoomable graph; nodes colored by `type`; edge thickness = `meta.weight`.
- **Right Pane (Inspector):** Node details, edges, export controls, “Make Playbook” action.

---

## 7. File/Endpoint Conventions
- **NDJSON** for triples → `triples.ndjson`.
- **JSON** for nodes → `nodes.json`.
- MCP Tool methods: `graph.query`, `graph.top_nodes`, `graph.export(subgraph_id)`, `graph.add(nodes|triples)`.
- CLI helpers: `ideas graph search --type Project --tag agentic --near preston`.

---

## 8. Next Steps
1. Populate remaining legacy nodes.
2. Implement scoring & Top Base Nodes endpoint.
3. Wire NL → filter query compiler.
4. Export seed `nodes.json` and `triples.ndjson` bundle.

