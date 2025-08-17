import { Field, QueryAST, QueryOptions, SortSpec } from "./QueryTypes";

export class QueryBuilder {
  private ast: QueryAST;
  private options: QueryOptions = {};

  private constructor(ast: QueryAST) {
    this.ast = ast;
  }

  static eq(field: Field, value: string) {
    return new QueryBuilder({ type: "eq", field, value });
  }

  static and(...filters: QueryBuilder[]) {
    return new QueryBuilder({ type: "and", filters: filters.map((f) => f.ast) });
  }

  static or(...filters: QueryBuilder[]) {
    return new QueryBuilder({ type: "or", filters: filters.map((f) => f.ast) });
  }

  static not(filter: QueryBuilder) {
    return new QueryBuilder({ type: "not", filter: filter.ast });
  }

  sort(...sort: SortSpec[]) {
    const qb = new QueryBuilder(this.ast);
    qb.options = { ...this.options, sort };
    return qb;
  }

  limit(n: number) {
    const qb = new QueryBuilder(this.ast);
    qb.options = { ...this.options, limit: n };
    return qb;
  }

  offset(n: number) {
    const qb = new QueryBuilder(this.ast);
    qb.options = { ...this.options, offset: n };
    return qb;
  }

  build(): { ast: QueryAST; options: QueryOptions } {
    return { ast: this.ast, options: this.options };
  }
}

// Convenience helpers
export const q = {
  eq: QueryBuilder.eq,
  and: QueryBuilder.and,
  or: QueryBuilder.or,
  not: QueryBuilder.not,
  // field shorthands
  s: (value: string) => QueryBuilder.eq("s", value),
  p: (value: string) => QueryBuilder.eq("p", value),
  o: (value: string) => QueryBuilder.eq("o", value),
};
