import { join } from "node:path";
import { parse } from "../utils/parser";
import { Grid } from "../data-structures/Grid";

type CellContents = "." | "@";

const input = parse(join(__dirname, "input1.txt"), (line) =>
  line.split("").map((e): CellContents => (e === "@" ? "@" : ".")),
);

const layout = new Grid(input);

const canAccessRoll = (cell: CellContents, x: number, y: number, grid: Grid<CellContents>) => {
  if (cell !== "@") {
    return false;
  }

  return grid.adjacencies(x, y).filter(({ cell }) => cell === "@").length < 4;
};

const numAccessibleRolls = layout.findAll(canAccessRoll).length;

console.log(`Part 1: ${numAccessibleRolls}`);

const removeAllPossibleRolls = (layout: Grid<CellContents>): Grid<CellContents> => {
  if (!layout.findAll(canAccessRoll).length) return layout;

  return removeAllPossibleRolls(
    layout.map((cell, x, y) => {
      if (layout.at(x, y) === "." || canAccessRoll(cell, x, y, layout)) return ".";
      return "@";
    }),
  );
};

const finalState = removeAllPossibleRolls(layout);

const numRemovedRolls = layout.findAll((cell, x, y) => cell === "@" && finalState.at(x, y) !== "@").length;

console.log(`Part 2: ${numRemovedRolls}`);
