import { FluentMap } from "./FluentMap";
import { FluentSet } from "./FluentSet";

export class FluentIterable<T> implements Iterable<T> {
  constructor(private readonly iterableFactory?: () => Iterable<T>) {}

  [Symbol.iterator](): Iterator<T> {
    // If no iterableFactory is provided, return an empty iterable.
    if (!this.iterableFactory) {
      return this.empty()[Symbol.iterator]();
    }
    return this.iterableFactory()[Symbol.iterator]();
  }

  *empty(): Iterable<T> {
    // This generator function yields no values, creating an empty iterable.
  }

  toArray(): T[] {
    return Array.from(this);
  }

  toSet(): FluentSet<T> {
    return new FluentSet(this);
  }

  toMapKV<K, V>(
    keyFn: (item: T) => K,
    valueFn: (item: T) => V
  ): FluentMap<K, V> {
    const map = new FluentMap<K, V>();
    for (const item of this) {
      const key = keyFn(item);
      const value = valueFn(item);
      map.set(key, value);
    }
    return map;
  }

  toMap<K>(keyFn: (item: T) => K): FluentMap<K, T> {
    const map = new FluentMap<K, T>();
    for (const item of this) {
      const key = keyFn(item);
      map.set(key, item);
    }
    return map;
  }

  first(): T | undefined {
    for (const item of this) {
      return item;
    }
    return undefined;
  }

  last(): T | undefined {
    let last: T | undefined;
    for (const item of this) {
      last = item;
    }
    return last;
  }

  elementAt(index: number): T | undefined {
    let i = 0;
    for (const item of this) {
      if (i === index) return item;
      i++;
    }
    return undefined;
  }

  map<U>(fn: (item: T, index: number) => U): FluentIterable<U> {
    return new FluentIterable(() => {
      const self = this;
      function* generator(): Generator<U> {
        let index = 0;
        for (const item of self) {
          yield fn(item, index++);
        }
      }
      return generator();
    });
  }

  filter(predicate: (item: T, index: number) => boolean): FluentIterable<T> {
    return new FluentIterable(() => {
      const self = this;
      function* generator(): Generator<T> {
        let index = 0;
        for (const item of self) {
          if (predicate(item, index++)) {
            yield item;
          }
        }
      }
      return generator();
    });
  }

  reduce<U>(fn: (acc: U, item: T, index: number) => U, initial: U): U {
    let acc = initial;
    let index = 0;
    for (const item of this) {
      acc = fn(acc, item, index++);
    }
    return acc;
  }

  count(): number {
    let count = 0;
    for (const _ of this) {
      count++;
    }
    return count;
  }

  take(n: number): FluentIterable<T> {
    return new FluentIterable(() => {
      const self = this;
      function* generator(): Generator<T> {
        let i = 0;
        for (const item of self) {
          if (i++ >= n) break;
          yield item;
        }
      }
      return generator();
    });
  }

  skip(n: number): FluentIterable<T> {
    return new FluentIterable(() => {
      const self = this;
      function* generator(): Generator<T> {
        let i = 0;
        for (const item of self) {
          if (i++ < n) continue;
          yield item;
        }
      }
      return generator();
    });
  }

  some(predicate: (item: T) => boolean): boolean {
    for (const item of this) {
      if (predicate(item)) {
        return true;
      }
    }
    return false;
  }

  every(predicate: (item: T) => boolean): boolean {
    for (const item of this) {
      if (!predicate(item)) {
        return false;
      }
    }
    return true;
  }

  concat<U>(other: Iterable<U>): FluentIterable<T | U> {
    return new FluentIterable(() => {
      const self = this;
      function* generator(): Generator<T | U> {
        yield* self;
        yield* other;
      }
      return generator();
    });
  }

  append(item: T): FluentIterable<T> {
    return new FluentIterable(() => {
      const self = this;
      function* generator(): Generator<T> {
        yield* self;
        yield item;
      }
      return generator();
    });
  }

  forEach(fn: (item: T, index: number) => void): void {
    let index = 0;
    for (const item of this) {
      fn(item, index++);
    }
  }

  truthy(): FluentIterable<T> {
    return this.filter((item) => Boolean(item));
  }

  groupBy<K>(keyFn: (item: T) => K): FluentMap<K, T[]> {
    const map = new FluentMap<K, T[]>();
    for (const item of this) {
      const key = keyFn(item);
      if (!map.has(key)) {
        map.set(key, []);
      }
      map.get(key)?.push(item);
    }
    return map;
  }

  flatMap<U>(fn: (item: T) => Iterable<U>): FluentIterable<U> {
    return new FluentIterable(() => {
      const self = this;
      function* generator(): Generator<U> {
        for (const item of self) {
          yield* fn(item); // No need to check for FluentIterable explicitly.
        }
      }
      return generator();
    });
  }

  sortBy<K>(
    keyFn: (item: T) => K,
    descending: boolean = false
  ): FluentIterable<T> {
    return new FluentIterable(() => {
      const items = this.toArray();
      items.sort((a, b) => {
        const keyA = keyFn(a);
        const keyB = keyFn(b);
        if (keyA === keyB) return 0;
        if (descending) return (keyA < keyB ? -1 : 1) * -1;
        return keyA < keyB ? -1 : 1;
      });
      return items;
    });
  }

  sort(): FluentIterable<T> {
    return new FluentIterable(() => {
      const items = this.toArray();
      items.sort();
      return items;
    });
  }

  find(predicate: (item: T, index: number) => boolean): T | undefined {
    let index = 0;
    for (const item of this) {
      if (predicate(item, index++)) {
        return item;
      }
    }
    return undefined;
  }

  json(): T[] {
    return this.toArray();
  }

  static from<T>(iterable: Iterable<T>): FluentIterable<T> {
    return new FluentIterable(() => iterable);
  }

  static empty<T>(): FluentIterable<T> {
    return new FluentIterable(() => []);
  }
}
