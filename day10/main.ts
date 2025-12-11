import { join } from "node:path";
import { parse } from "../utils/parser";
import { sum } from "../utils/math";
import { combin } from "../utils/arrays";
import { Model, equalTo, solve } from "yalps";

const input = parse(join(__dirname, "input1.txt"), (line) => {
  const match = line.match(/^\[([.#]+)] ((?:\([\d,]+\) ?)+) \{([\d,]+)\}$/);

  if (!match) throw new Error(`Bad input line: ${line}`);

  const [, targetStr, buttonsStr, joltageStr] = match;

  if (!targetStr) throw new Error("No target lights");

  const target = targetStr.split("").map((c) => (c === "#" ? 1 : 0));

  if (!buttonsStr) throw new Error("No buttons");

  const buttons = buttonsStr.split(" ").map((str) =>
    str
      .slice(1, -1)
      .split(",")
      .map((n) => parseInt(n)),
  );

  if (!joltageStr) throw new Error("No joltage");

  const joltage = joltageStr.split(",").map((n) => parseInt(n));

  return {
    target,
    buttons,
    joltage,
  };
});

const findButtonCombo = (target: number, buttons: number[]) => {
  const combos = combin(buttons).sort((a, b) => a.length - b.length);

  return combos.find((combo) => combo.reduce((a, b) => a ^ b, 0) === target);
};

const combos = input.map((machine) => {
  const combo = findButtonCombo(
    machine.target.map((el, i) => el * 2 ** i).reduce(sum, 0),
    machine.buttons.map((b) => b.map((el) => 2 ** el).reduce(sum, 0)),
  );

  if (!combo) throw new Error(`No button combo is possible for machine: ${JSON.stringify(machine)}`);

  return combo;
});

console.log(`Part 1: ${combos.map((c) => c.length).reduce(sum, 0)}`);

const createModel = (target: number[], buttons: number[][]): Model => {
  const variables = Object.fromEntries(
    buttons
      .map((b) => ({
        weight: 1,
        ...Object.fromEntries(b.map((v) => [v, 1])),
      }))
      .map((b, i) => [i, b]),
  );

  const constraints = Object.fromEntries(target.map((j, i) => [i, equalTo(j)]));

  return {
    direction: "minimize",
    objective: "weight",
    variables,
    constraints,
    integers: true,
  };
};

const models = input.map((machine) => createModel(machine.joltage, machine.buttons));
const solutions = models.map((model) => solve(model));

console.log(`Part 2: ${solutions.map((s) => s.result).reduce(sum, 0)}`);
