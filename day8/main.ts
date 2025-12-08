import { join } from "node:path";
import { parse } from "../utils/parser";
import { pairwise } from "../utils/arrays";
import { Tuple } from "../data-structures/types";
import { prod } from "../utils/math";

type Box = Tuple<number, 3>;
const isBox = (val: number[]): val is Box => val.length === 3;

const input = parse(join(__dirname, "input1.txt"), (line) => line.split(",").map((n) => parseInt(n))).filter(isBox);

const sqDistanceBetween = (box1: Box, box2: Box) => {
  const d0 = box1[0] - box2[0];
  const d1 = box1[1] - box2[1];
  const d2 = box1[2] - box2[2];

  return d0 * d0 + d1 * d1 + d2 * d2;
};

const distances = pairwise(input)
  .map(([box1, box2]) => ({ box1, box2, sqd: sqDistanceBetween(box1, box2) }))
  .sort((a, b) => a.sqd - b.sqd);

type BoxPair = { box1: Box; box2: Box };

const startingBoxCircuits = input.map((el) => [el]);

const addToCircuits = (circuits: Box[][], connection: BoxPair): Box[][] => {
  const connectedCircuits = circuits.filter((c) => c.includes(connection.box1) || c.includes(connection.box2));
  if (connectedCircuits.length < 2) {
    return circuits;
  } else {
    return [...circuits.filter((c) => !connectedCircuits.includes(c)), connectedCircuits.flat()];
  }
};

const resultPart1 = distances.slice(0, 1000).reduce(addToCircuits, startingBoxCircuits);

console.log(
  `Part 1: ${resultPart1
    .sort((a, b) => b.length - a.length)
    .slice(0, 3)
    .map((c) => c.length)
    .reduce(prod, 1)}`,
);

type ConnectState = {
  lastConnected?: BoxPair;
  circuits: Box[][];
};

const addToCircuitsPart2 = (state: ConnectState, connection: BoxPair): ConnectState => {
  // nothing left to connect
  if (state.circuits.length === 1) return state;

  const circuits = addToCircuits(state.circuits, connection);

  // the connection we just made changed nothing
  if (circuits.length === state.circuits.length) return state;

  return { circuits, lastConnected: connection };
};

const resultPart2 = distances.reduce(addToCircuitsPart2, {
  circuits: startingBoxCircuits,
});

if (!resultPart2.lastConnected) throw new Error("No final connection was made!");

console.log(`Part 2: ${resultPart2.lastConnected.box1[0] * resultPart2.lastConnected.box2[0]}`);
