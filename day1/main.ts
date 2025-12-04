import { join } from "node:path";
import { parse } from "../utils/parser";
import { modulo } from "../utils/math";

const DIAL_SIZE = 100;

interface Move {
  direction: "L" | "R";
  amount: number;
}

const parseInputString = (input: string): Move => {
  const match = input.match(/^(L|R)([0-9]+)$/);

  if (!match) throw new Error(`Invalid input ${input}`);

  return {
    direction: match[1] as "L" | "R",
    amount: parseInt(match[2] ?? "0"),
  };
};

const inputs = parse(join(__dirname, "input1.txt"), parseInputString);

interface LockState {
  dial: number;
  zeroes: number;
}

const initialState: LockState = {
  dial: 50,
  zeroes: 0,
};

const spinDialPart1 = (lockState: LockState, move: Move): LockState => {
  const moveAmount = move.amount * (move.direction === "L" ? -1 : 1);
  const newDialPosition = modulo(lockState.dial + moveAmount, DIAL_SIZE);

  return {
    dial: newDialPosition,
    zeroes: lockState.zeroes + (newDialPosition === 0 ? 1 : 0),
  };
};

const answerPart1 = inputs.reduce(spinDialPart1, initialState);

console.log(`Part 1: ${answerPart1.zeroes}`);

const spinDialPart2 = (lockState: LockState, move: Move): LockState => {
  const moveAmount = move.amount * (move.direction === "L" ? -1 : 1);
  const newDialPosition = modulo(lockState.dial + moveAmount, DIAL_SIZE);
  const normalStart = moveAmount < 0 ? (DIAL_SIZE - lockState.dial) % DIAL_SIZE : lockState.dial;
  const normalEnd = normalStart + Math.abs(moveAmount);
  const zeroPasses = Math.floor(normalEnd / DIAL_SIZE);

  return {
    dial: newDialPosition,
    zeroes: lockState.zeroes + zeroPasses,
  };
};

const answerPart2 = inputs.reduce(spinDialPart2, initialState);

console.log(`Part 2: ${answerPart2.zeroes}`);
