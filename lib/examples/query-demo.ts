import fs from "node:fs";
import path from "node:path";
import { loadNodesFromJson, loadTriplesFromNdjson } from "../src/graph/Loader";
import { query, top_nodes } from "../src/graph/API";

const dataDir = path.join(__dirname, "../data");
const nodes = loadNodesFromJson(fs.readFileSync(path.join(dataDir, "nodes.json"), "utf8"));
const triples = loadTriplesFromNdjson(fs.readFileSync(path.join(dataDir, "triples.ndjson"), "utf8"));

console.log(`Loaded ${nodes.length} nodes, ${triples.length} triples`);

const results = query("type:Project tag:agentic linked:preston", triples);
console.log(`Query results: ${results.length}`);

const top = top_nodes("person.preston", triples, 5);
console.log(`Top nodes:`, top);
