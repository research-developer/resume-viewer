import { IdeaTriple } from "../schema/IdeaGraph";
import { QueryAST, QueryOptions, SortSpec } from "./QueryTypes";

function matches(ast: QueryAST, t: IdeaTriple): boolean {
  switch (ast.type) {
    case "eq": {
      const v = t[ast.field];
      return String(v) === ast.value;
    }
    case "and":
      return ast.filters.every((f) => matches(f, t));
    case "or":
      return ast.filters.some((f) => matches(f, t));
    case "not":
      return !matches(ast.filter, t);
  }
}

function applySort(arr: IdeaTriple[], sort?: SortSpec[]): IdeaTriple[] {
  if (!sort || sort.length === 0) return arr;
  return [...arr].sort((a, b) => {
    for (const s of sort) {
      const av = String(a[s.field]);
      const bv = String(b[s.field]);
      if (av === bv) continue;
      const cmp = av < bv ? -1 : 1;
      return s.dir === "desc" ? -cmp : cmp;
    }
    return 0;
  });
}

export function executeQuery(
  ast: QueryAST,
  triples: IdeaTriple[],
  options: QueryOptions = {}
): IdeaTriple[] {
  // filter
  let out = triples.filter((t) => matches(ast, t));
  // sort
  out = applySort(out, options.sort);
  // offset/limit
  const start = options.offset ?? 0;
  const end = options.limit != null ? start + options.limit : undefined;
  return out.slice(start, end);
}
