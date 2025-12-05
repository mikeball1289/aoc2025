import { join } from "node:path";
import { parse } from "../utils/parser";
import { partitionBy } from "../utils/arrays";
import { sum } from "../utils/math";

type Range = {
  start: number;
  end: number;
};

const [rangesTexts, idsTexts] = parse(join(__dirname, "input1.txt"), (block) => block.split(/\r?\n/), /\r?\n\r?\n/);

const ranges =
  rangesTexts?.map((range): Range => {
    const match = range.match(/^(\d+)-(\d+)$/);
    if (!match) throw new Error(`Invalid range: ${range}`);
    return {
      start: parseInt(match[1] ?? ""),
      end: parseInt(match[2] ?? ""),
    };
  }) ?? [];

const ids = idsTexts?.map((id) => parseInt(id)) ?? [];

const freshIds = ids.filter((id) => ranges.some((range) => id >= range.start && id <= range.end));
console.log(`Part 1: ${freshIds.length}`);

const rangesOverlap = (range1: Range, range2: Range) => {
  return range1.start <= range2.end && range2.start <= range1.end;
};

const combineRanges = (range1: Range, range2: Range) => {
  return {
    start: Math.min(range1.start, range2.start),
    end: Math.max(range1.end, range2.end),
  };
};

const reduceRanges = (ranges: Range[]): Range[] => {
  const [first, ...restRanges] = ranges;

  if (!first || !restRanges.length) return ranges;

  const { overlaps, distinct } = partitionBy(restRanges, ["overlaps", "distinct"], (range) =>
    rangesOverlap(first, range) ? "overlaps" : "distinct",
  );

  if (!overlaps.length) return [first, ...reduceRanges(distinct)];

  const fullRange = overlaps.reduce((acc, range) => combineRanges(acc, range), first);

  return reduceRanges([...distinct, fullRange]);
};

const allCombinedRanges = reduceRanges(ranges);

const totalGoodIds = allCombinedRanges.map((range) => range.end - range.start + 1).reduce(sum, 0);

console.log(`Part 2: ${totalGoodIds}`);
