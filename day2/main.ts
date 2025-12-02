import { join } from "node:path";
import { parse } from "../utils/parser";
import { ndigits, sumRange } from "../utils/math";
import { range as arrayRange } from "../utils/arrays";

interface Range {
  start: number;
  end: number;
}

const parseRange = (range: string): Range => {
  const match = range.match(/^([0-9]+)-([0-9]+)$/);

  if (!match) throw new Error(`Failed to parse ${range}`);

  return {
    start: parseInt(match[1] ?? "0"),
    end: parseInt(match[2] ?? "0"),
  };
};

const sanitizeRange = (range: Range): Range[] => {
  const lowerDigits = ndigits(range.start);
  const upperDigits = ndigits(range.end);

  return arrayRange(lowerDigits, upperDigits + 1)
    .filter((nd) => nd % 2 !== 1)
    .map((nd) => ({
      start: Math.max(range.start, 10 ** (nd - 1)),
      end: Math.min(range.end, 10 ** nd - 1),
    }));
};

const sumInvalid = (range: Range): number => {
  const factor = 10 ** (ndigits(range.start) / 2) + 1;

  const startFactor = Math.ceil(range.start / factor);
  const endFactor = Math.floor(range.end / factor);

  if (endFactor < startFactor) return 0;

  return sumRange(startFactor, endFactor + 1) * factor;
};

const input = parse(join(__dirname, "input1.txt"), parseRange, ",");
const sanitizedInput = input.flatMap(sanitizeRange);
const invalidSums = sanitizedInput.map(sumInvalid);
const totalPart1 = invalidSums.reduce((acc, el) => acc + el, 0);

console.log(`Part 1: ${totalPart1}`);

const isRepeatedDigits = (num: string) => num.match(/^(\d+)\1+$/) != null;

const inputStrings = input.flatMap((range) => arrayRange(range.start, range.end + 1)).map((n) => n.toString());
const badIds = inputStrings.filter(isRepeatedDigits);
const badIdNums = badIds.map((n) => parseInt(n));
const totalPart2 = badIdNums.reduce((acc, el) => acc + el, 0);

console.log(`Part 2: ${totalPart2}`);
