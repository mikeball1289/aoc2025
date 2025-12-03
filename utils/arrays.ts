export const range = (start: number, end: number) => new Array(end - start).fill(0).map((_, i) => start + i);

/**
 * Find the maximum element of an array according to the provided projection function
 * @param arr An array of elements to evaluate
 * @param projection A function to turn an element of the array into a numeric score
 * @returns The highest value element of the given array
 */
export const maxBy = <T>(arr: T[], projection: (value: T, index: number, array: T[]) => number): T | undefined => {
  const [first, ...rest] = arr.map((value, index, array) => [value, projection(value, index, array)] as const);

  if (!first) return undefined;

  const best = rest.reduce((currBest, next) => (next[1] > currBest[1] ? next : currBest), first);

  return best[0];
};

/**
 * Find the minimum element of an array according to the provided projection function
 * @param arr An array of elements to evaluate
 * @param projection A function to turn an element of the array into a numeric score
 * @returns The lowest value element of the given array
 */
export const minBy = <T>(arr: T[], projection: (value: T, index: number, array: T[]) => number): T | undefined => {
  const [first, ...rest] = arr.map((value, index, array) => [value, projection(value, index, array)] as const);

  if (!first) return undefined;

  const best = rest.reduce((currBest, next) => (next[1] < currBest[1] ? next : currBest), first);

  return best[0];
};
