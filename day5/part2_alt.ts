import { join } from "node:path";
import { parse } from "../utils/parser";
import { sum } from "../utils/math";

type Range = {
  start: number;
  end: number;
};

const [rangesTexts] = parse(join(__dirname, "input1.txt"), (block) => block.split(/\r?\n/), /\r?\n\r?\n/);

const ranges =
  rangesTexts?.map((range): Range => {
    const match = range.match(/^(\d+)-(\d+)$/);
    if (!match) throw new Error(`Invalid range: ${range}`);
    return {
      start: parseInt(match[1] ?? ""),
      end: parseInt(match[2] ?? ""),
    };
  }) ?? [];

const rangesOverlap = (range1: Range, range2: Range) => {
  return range1.start <= range2.end && range2.start <= range1.end;
};

const combineRanges = (range1: Range, range2: Range) => {
  return {
    start: Math.min(range1.start, range2.start),
    end: Math.max(range1.end, range2.end),
  };
};

type CombineState = {
  currentRange: Range;
  completedRanges: Range[];
};

const [first, ...rest] = ranges.sort((a, b) => a.start - b.start);

if (!first) throw new Error("No ranges");

const processedRanges = rest.reduce(
  ({ currentRange, completedRanges }: CombineState, nextRange): CombineState => {
    if (rangesOverlap(currentRange, nextRange)) {
      return { currentRange: combineRanges(currentRange, nextRange), completedRanges };
    } else {
      return { currentRange: nextRange, completedRanges: [...completedRanges, currentRange] };
    }
  },
  { currentRange: first, completedRanges: [] },
);

const allCombinedRanges = [...processedRanges.completedRanges, processedRanges.currentRange];

console.log(allCombinedRanges.map((r) => r.end - r.start + 1).reduce(sum, 0));
