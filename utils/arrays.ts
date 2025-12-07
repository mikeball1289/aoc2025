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

/**
 * Split an array into multiple arrays based on a set of given partition keys
 * @param arr
 * @param predicate
 */
export const partitionBy = <T, PartitionKey extends string | number, PredicateResult extends PartitionKey>(
  arr: T[],
  partitions: PartitionKey[],
  predicate: (item: T, index: number, arr: T[]) => PredicateResult,
): Record<PartitionKey, T[]> => {
  const labels = arr.map((item, i, arr) => [item, predicate(item, i, arr)] as const);

  return labels.reduce(
    (map: Record<PartitionKey, T[]>, [item, label]) => {
      map[label].push(item);
      return map;
    },
    Object.fromEntries(partitions.map((name) => [name, []] as [PartitionKey, T[]])) as Record<PartitionKey, T[]>,
  );
};

export const isElement = <const T>(el: unknown, arr: readonly T[]): el is T => {
  return arr.includes(el as T);
};
