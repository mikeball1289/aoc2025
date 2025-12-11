export const memo = <Args extends unknown[], Return>(
  fn: (...args: Args) => Return,
  hashArgs: (...args: Args) => number | string = (...args: unknown[]) => args.map((e) => String(e)).join("|"),
): ((...args: Args) => Return) => {
  const memoMap: Record<number | string, Return> = {};

  return (...args: Args) => {
    const hashKey = hashArgs(...args);
    if (Object.hasOwnProperty.call(memoMap, hashKey)) {
      return memoMap[hashKey]!;
    }

    return (memoMap[hashKey] = fn(...args));
  };
};
