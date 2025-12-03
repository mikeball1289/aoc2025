import { join } from "node:path";
import { parse } from "../utils/parser";
import { maxBy } from "../utils/arrays";
import { sum } from "../utils/math";

type PowerBank = number[];

const input = parse(join(__dirname, "input1.txt"), (line) => line.split("").map((n) => parseInt(n)));

const maximizeJoltage = (bank: PowerBank, digits: number): number => {
  if (!bank.length || digits <= 0) return 0;

  const enumeratedJoltages = bank.slice(0, bank.length - digits + 1).map((el, i) => ({ index: i, joltage: el }));
  const digit = maxBy(enumeratedJoltages, ({ joltage }) => joltage);

  if (!digit) {
    throw new Error("Not enough joltages!");
  }

  const restBank = bank.slice(digit.index + 1);
  const restJoltage = maximizeJoltage(restBank, digits - 1);

  return digit.joltage * 10 ** (digits - 1) + restJoltage;
};

const maxTotalPart1 = input.map((bank) => maximizeJoltage(bank, 2)).reduce(sum, 0);

console.log(`Part 1: ${maxTotalPart1}`);

const maxTotalPart2 = input.map((bank) => maximizeJoltage(bank, 12)).reduce(sum, 0);

console.log(`Part 2: ${maxTotalPart2}`);
