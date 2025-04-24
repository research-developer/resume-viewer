import { FluentIterable } from "./FluentIterable";

/**
 * FluentMap<K, V> is a custom implementation of a Map that provides additional utility methods.
 */
export class FluentMap<K, V> extends Map<K, V> {
  constructor(entries?: [K, V][] | Iterable<[K, V]>) {
    super(entries);
  }

  fluent(): FluentIterable<[K, V]> {
    return new FluentIterable(() => this.entries());
  }

  fluentValues(): FluentIterable<V> {
    return new FluentIterable(() => this.values());
  }

  fluentKeys(): FluentIterable<K> {
    return new FluentIterable(() => this.keys());
  }
}
