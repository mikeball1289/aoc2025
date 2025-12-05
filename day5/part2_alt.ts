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

const starts = ranges.map((r) => ({ index: r.start, type: "start" as const }));
const ends = ranges.map((r) => ({ index: r.end, type: "end" as const }));

const [first, ...marks] = [...starts, ...ends].sort((a, b) => a.index - b.index);
if (!first || first.type !== "start") {
  throw new Error("Ranges are out of order");
}

type CombineState = {
  openCount: number;
  openRangeStart: number;
  ranges: Range[];
};

const initialState: CombineState = {
  openCount: 1,
  openRangeStart: first.index,
  ranges: [],
};

const allCombinedRanges = marks.reduce((state: CombineState, next): CombineState => {
  if (next.type === "start") {
    if (state.openCount === 0) {
      return {
        ...state,
        openCount: 1,
        openRangeStart: next.index,
      };
    } else {
      return {
        ...state,
        openCount: state.openCount + 1,
      };
    }
  } else {
    if (state.openCount === 1) {
      return {
        ...state,
        openCount: 0,
        ranges: [...state.ranges, { start: state.openRangeStart, end: next.index }],
      };
    } else {
      return {
        ...state,
        openCount: state.openCount - 1,
      };
    }
  }
}, initialState);

console.log(allCombinedRanges.ranges.map((r) => r.end - r.start + 1).reduce(sum, 0));
