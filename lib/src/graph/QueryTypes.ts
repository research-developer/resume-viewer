import { IdeaTriple } from "../schema/IdeaGraph";

export type Field = "s" | "p" | "o";

export type QueryAST =
  | { type: "eq"; field: Field; value: string }
  | { type: "and"; filters: QueryAST[] }
  | { type: "or"; filters: QueryAST[] }
  | { type: "not"; filter: QueryAST };

export type SortSpec = { field: Field; dir?: "asc" | "desc" };
export type QueryOptions = {
  limit?: number;
  offset?: number;
  sort?: SortSpec[];
};

export type TripleSource = IdeaTriple[];
