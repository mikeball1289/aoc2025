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
  }
}

const inputs = parse(join(__dirname, "input1.txt"), parseInputString);

interface LockState {
  dial: number;
  zeroes: number;
}

const initialState: LockState = {
  dial: 50,
  zeroes: 0,
};

const countZeroPasses = (startPosition: number, dialPosition: number) => {
  const normalPosition = dialPosition <= 0 ? -dialPosition + (startPosition > 0 ? DIAL_SIZE : 0) : dialPosition;
  
  return Math.floor(normalPosition / DIAL_SIZE);
}

const spinDial = (lockState: LockState, move: Move): LockState => {
  const moveAmount = move.amount * (move.direction === "L" ? -1 : 1);
  const newDialPosition = lockState.dial + moveAmount;

  return {
    dial: modulo(newDialPosition, DIAL_SIZE),
    zeroes: lockState.zeroes + countZeroPasses(lockState.dial, newDialPosition),
  }
};

const answer = inputs.reduce(spinDial, initialState);

console.log(answer.zeroes);
