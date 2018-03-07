import { on } from './function'

/**
 * The `Setoid` type class represents types which support decidable equality.
 *
 * Instances must satisfy the following laws:
 *
 * 1. Reflexivity: `S.equals(a, a) === true`
 * 2. Symmetry: `S.equals(a, b) === S.equals(b, a)`
 * 3. Transitivity: if `S.equals(a, b) === true` and `S.equals(b, c) === true`, then `S.equals(a, c) === true`
 *
 * @typeclass
 */
export interface Setoid<A> {
  equals: (x: A, y: A) => boolean
}

/** @function */
export const strictEqual = <A>(a: A, b: A): boolean => {
  return a === b
}

const setoidStrict = { equals: strictEqual }

/** @instance */
export const setoidString: Setoid<string> = setoidStrict

/** @instance */
export const setoidNumber: Setoid<number> = setoidStrict

/** @instance */
export const setoidBoolean: Setoid<boolean> = setoidStrict

/** @function */
export const getArraySetoid = <A>(S: Setoid<A>): Setoid<Array<A>> => {
  return {
    equals: (xs, ys) => xs.length === ys.length && xs.every((x, i) => S.equals(x, ys[i]))
  }
}

/** @function */
export const getRecordSetoid = <O extends { [key: string]: any }>(
  setoids: { [K in keyof O]: Setoid<O[K]> }
): Setoid<O> => {
  return {
    equals: (x, y) => {
      for (const k in setoids) {
        if (!setoids[k].equals(x[k], y[k])) {
          return false
        }
      }
      return true
    }
  }
}

/** @function */
export const getProductSetoid = <A, B>(SA: Setoid<A>, SB: Setoid<B>): Setoid<[A, B]> => {
  return {
    equals: ([xa, xb], [ya, yb]) => SA.equals(xa, ya) && SB.equals(xb, yb)
  }
}

/** @function */
export const contramap = <A, B>(f: (b: B) => A, fa: Setoid<A>): Setoid<B> => {
  return {
    equals: on(fa.equals)(f)
  }
}
