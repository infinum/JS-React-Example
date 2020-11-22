import { Model } from 'datx';

/*
  Inspired by https://github.com/lukeed/dequal/blob/master/src/lite.js
*/
export const swrComparator = (a: unknown, b: unknown) => {
  if (a === b) {
    return true;
  }

  if (a && b && a.constructor === b.constructor) {
    let length: number;

    if (Array.isArray(a) && Array.isArray(b)) {
      // eslint-disable-next-line no-cond-assign
      if ((length = a.length) === b.length) {
        while (length-- && swrComparator(a[length], b[length]));
      }
      return length === -1;
    }

    if (a instanceof Model && b instanceof Model) {
      return swrComparator(a.meta.snapshot, b.meta.snapshot);
    }

    if (!a.constructor || typeof a === 'object') {
      length = 0;
      // eslint-disable-next-line guard-for-in, no-restricted-syntax
      for (const key in a as Record<string, unknown>) {
        if (
          Object.prototype.hasOwnProperty.call(a, key) &&
          ++length &&
          !Object.prototype.hasOwnProperty.call(b, key)
        ) {
          return false;
        }
        if (!(key in (b as Record<string, unknown>)) || !swrComparator(a[key], b[key])) {
          return false;
        }
      }

      return Object.keys(b).length === length;
    }
  }

  // eslint-disable-next-line no-self-compare
  return a !== a && b !== b;
};
