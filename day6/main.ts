import { join } from "node:path";
import { parse } from "../utils/parser";
import { Grid } from "../data-structures/Grid";
import { prod, sum } from "../utils/math";

const input = parse(join(__dirname, "input1.txt"), (line) => line.trim().split(/ +/));
const numbers = input.slice(0, input.length - 1);
const operators = input[input.length - 1];

if (!operators) throw new Error("Worksheet had no operators");

const numberGrid = new Grid(numbers).map((n) => parseInt(n)).transpose();
const answers = operators.map((op, i) => {
  const operation = op === "+" ? sum : prod;
  const initialValue = op === "+" ? 0 : 1;

  return numberGrid.cells[i]!.reduce(operation, initialValue);
});

console.log(`Part 1: ${answers.reduce(sum, 0)}`);

const inputP2 = parse(join(__dirname, "input1.txt"), (line) => line.split(""));
const operatorsP2 = inputP2[inputP2.length - 1]?.join("").trim().split(/ +/);

if (!operatorsP2) throw new Error("Worksheet had no operators");

const lines = inputP2.slice(0, inputP2.length - 1);
const newLines = new Grid(lines)
  .transpose()
  .cells.map((row) => row.join(""))
  .join("\n");

const problemTexts = newLines.split(/\n +\n/);
const problemSets = problemTexts.map((pt) => pt.split("\n").map((l) => parseInt(l.trim())));

const answersPart2 = operatorsP2.map((op, i) => {
  const operation = op === "+" ? sum : prod;
  const initialValue = op === "+" ? 0 : 1;

  return problemSets[i]!.reduce(operation, initialValue);
});

console.log(`Part 2: ${answersPart2.reduce(sum, 0)}`);
