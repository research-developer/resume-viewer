import { QueryAST, QueryOptions } from "./QueryTypes";
import { q } from "./QueryBuilder";

export type CompileResult = { ast: QueryAST; options: QueryOptions };

// Simple space-delimited key:value parser with fallbacks for free text terms.
// Supported keys: s, p, o, linked, tag, category, type(alias->category), limit, offset
export function compileQuery(input: string): CompileResult {
  const tokens = input.trim().split(/\s+/).filter(Boolean);
  const filters: QueryAST[] = [];
  const options: QueryOptions = {};
  const freeText: string[] = [];

  for (const t of tokens) {
    const m = t.match(/^([a-zA-Z]+):(.*)$/);
    if (!m) {
      freeText.push(t);
      continue;
    }
    const key = m[1].toLowerCase();
    const value = m[2];
    switch (key) {
      case "s":
        filters.push(q.s(value).build().ast);
        break;
      case "p":
        filters.push(q.p(value).build().ast);
        break;
      case "o":
        filters.push(q.o(value).build().ast);
        break;
      case "linked": {
        const types = [
          "person",
          "idea",
          "project",
          "experiment",
          "theory",
          "musing",
          "skill",
          "experience",
          "education",
          "animal",
          "media",
          "website",
          "tool",
        ];
        const candidates = [value, ...types.map((t) => `${t}.${value}`)];
        const eqs = candidates.flatMap((v) => [q.s(v).build().ast, q.o(v).build().ast]);
        filters.push({ type: "or", filters: eqs });
        break;
      }
      case "tag": {
        const andAst = q.and(q.p("tag"), q.o(value)).build().ast;
        filters.push(andAst);
        break;
      }
      case "category":
      case "type": { // alias to category per PLANS.md intent
        const andAst = q.and(q.p("category"), q.o(value)).build().ast;
        filters.push(andAst);
        break;
      }
      case "limit": {
        const n = Number(value);
        if (!Number.isNaN(n)) options.limit = n;
        break;
      }
      case "offset": {
        const n = Number(value);
        if (!Number.isNaN(n)) options.offset = n;
        break;
      }
      default: {
        freeText.push(t);
      }
    }
  }

  // free text terms -> OR over object equals value (exact string match)
  if (freeText.length > 0) {
    if (freeText.length === 1) {
      filters.push({ type: "eq", field: "o", value: freeText[0] });
    } else {
      filters.push({
        type: "or",
        filters: freeText.map((term) => ({ type: "eq", field: "o", value: term })),
      });
    }
  }

  // Build final AST
  let ast: QueryAST;
  if (filters.length === 0) {
    // match-all: AND of zero filters evaluates to true
    ast = { type: "and", filters: [] };
  } else if (filters.length === 1) {
    ast = filters[0];
  } else {
    ast = { type: "and", filters };
  }

  return { ast, options };
}
