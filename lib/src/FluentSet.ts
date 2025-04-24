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
}
