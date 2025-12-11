import { join } from "node:path";
import { parse } from "../utils/parser";
import { prod, sum } from "../utils/math";
import { edges } from "../utils/arrays";
import { memo } from "../utils/fns";

const input = parse(join(__dirname, "input1.txt"), (line) => {
  const [label, outputs] = line.split(": ");
  if (!label || !outputs) throw new Error(`Missing input or output on line: ${line}`);

  return [label, outputs.split(" ")] as const;
});

const graph = Object.fromEntries(input);

const countPaths = memo((from: string, to: string): number => {
  if (from === to) return 1;

  const nextNodes = graph[from] ?? [];

  return nextNodes.map((node) => countPaths(node, to)).reduce(sum, 0);
});

console.log(`Part 1: ${countPaths("you", "out")}`);

const countCheckpointPaths = (checkpoints: string[]) => {
  const segments = edges(checkpoints);
  const numPathsInSegments = segments.map(([from, to]) => countPaths(from, to));
  return numPathsInSegments.reduce(prod, 1);
};

const dac2fft = countCheckpointPaths(["svr", "dac", "fft", "out"]);
const fft2dac = countCheckpointPaths(["svr", "fft", "dac", "out"]);

console.log(`Part 2: ${dac2fft + fft2dac}`);
