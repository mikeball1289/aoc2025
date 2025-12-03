export const modulo = (value: number, base: number) => ((value % base) + base) % base;

export const precisionRound = (num: number, precision: number) => Math.round(num * 10 ** precision) / 10 ** precision;

export const ndigits = (num: number, base = 10) => {
  if (num === 0) return 1;
  return Math.floor(precisionRound(Math.log(Math.abs(num)) / Math.log(base), 12)) + 1;
};

export const sumRange = (start: number, end: number) => {
  const delta = end - start;
  return start * delta + (delta * (delta - 1)) / 2;
};

export const sum = (a: number, b: number) => a + b;
