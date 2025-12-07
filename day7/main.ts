import { join } from "node:path";
import { parse } from "../utils/parser";
import { Adjacencies, Grid } from "../data-structures/Grid";
import { sum } from "../utils/math";

const START = "S";
const EMPTY = ".";
const IDLE_SPLITTER = "^";
const ACTIVE_SPLITTER = "*";

const NEIGHBORS: Adjacencies = [
  [-1, 0],
  [1, 0],
];

const input = parse(join(__dirname, "input1.txt"), (line) => line.split(""));
const manifold = new Grid(input).map<string | number>((c) => (c === START ? 1 : c === EMPTY ? 0 : c));

const [first, ...rest] = manifold.cells;

if (!first) throw new Error("No manifold in input!");

const isBeam = (val: unknown): val is number => typeof val === "number" && val > 0;
const isEmpty = (val: unknown): val is 0 => val === 0;

const firedBeamsState = rest.reduce(
  (previousLines, line, y) => {
    const previousLine = previousLines[previousLines.length - 1];

    if (!previousLine) throw new Error("Bad state");

    const nextLine = line.map((cell, x) => {
      if (isEmpty(cell)) {
        const baseBeams = isBeam(previousLine[x]) ? previousLine[x] : 0;

        const splitBeams = manifold
          .adjacencies(x, y + 1, NEIGHBORS)
          .map((n) => {
            if (n.cell !== IDLE_SPLITTER) return 0;
            const aboveCell = previousLine[n.x];
            return isBeam(aboveCell) ? aboveCell : 0;
          })
          .reduce(sum, 0);

        return baseBeams + splitBeams;
      }

      if (cell === IDLE_SPLITTER && isBeam(previousLine[x])) {
        return ACTIVE_SPLITTER;
      }

      return cell;
    });

    return [...previousLines, nextLine];
  },
  [first],
);

const result = new Grid(firedBeamsState);

console.log(`Part 1: ${result.findAll((cell) => cell === ACTIVE_SPLITTER).length}`);
console.log(
  `Part 2: ${result
    .row(result.height - 1)
    .filter((v) => isBeam(v))
    .reduce(sum, 0)}`,
);
