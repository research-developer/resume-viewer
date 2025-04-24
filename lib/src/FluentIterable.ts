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

  toSet(): Set<T> {
    return new Set(this);
  }

  toFluentSet(): FluentSet<T> {
    return new FluentSet(this);
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

  static from<T>(iterable: Iterable<T>): FluentIterable<T> {
    return new FluentIterable(() => iterable);
  }
}
