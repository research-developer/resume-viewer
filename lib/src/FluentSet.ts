import { FluentIterable } from "./FluentIterable";

/**
 * FluentSet<T> is a custom implementation of a Set that provides additional utility methods.
 */
export class FluentSet<T> extends Set<T> {
  constructor(items?: T[] | Iterable<T>) {
    super(items);
  }

  fluent(): FluentIterable<T> {
    return new FluentIterable(() => this.values());
  }

  append(items: FluentIterable<T>): FluentSet<T> {
    for (const item of items) {
      this.add(item);
    }
    return this;
  }

  json(): T[] {
    return Array.from(this.values());
  }
}
