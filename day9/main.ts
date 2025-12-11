import { join } from "node:path";
import { parse } from "../utils/parser";
import { Tuple } from "../data-structures/types";
import { pairwise } from "../utils/arrays";

type Point = Tuple<number, 2>;
type Edge = Tuple<Point, 2>;
type Rect = { topLeft: Point; bottomRight: Point; area: number };

const isPoint = (val: number[]): val is Point => val.length === 2;

const input = parse(join(__dirname, "input1.txt"), (line) => line.split(",").map((n) => parseInt(n))).filter(isPoint);

const getRect = (c1: Point, c2: Point): Rect => {
  const topLeft: Point = [Math.min(c1[0], c2[0]), Math.min(c1[1], c2[1])];
  const bottomRight: Point = [Math.max(c1[0], c2[0]), Math.max(c1[1], c2[1])];
  return {
    topLeft,
    bottomRight,
    area: (bottomRight[0] - topLeft[0] + 1) * (bottomRight[1] - topLeft[1] + 1),
  };
};

const allRects = pairwise(input)
  .map(([c1, c2]) => getRect(c1, c2))
  .sort((a, b) => b.area - a.area);

console.log(`Part 1: ${allRects[0]?.area}`);

const outerPoints = input.map((prev, i): Point => {
  const curr = input[(i + 1) % input.length]!;
  const next = input[(i + 2) % input.length]!;

  if ((prev[0] < curr[0] && next[1] < curr[1]) || (prev[1] > curr[1] && next[0] > curr[0])) return curr;
  if ((prev[0] < curr[0] && next[1] > curr[1]) || (prev[1] < curr[1] && next[0] > curr[0]))
    return [curr[0] + 1, curr[1]];
  if ((prev[1] < curr[1] && next[0] < curr[0]) || (prev[0] > curr[0] && next[1] > curr[1]))
    return [curr[0] + 1, curr[1] + 1];
  if ((prev[0] > curr[0] && next[1] < curr[1]) || (prev[1] > curr[1] && next[0] < curr[0]))
    return [curr[0], curr[1] + 1];

  return curr;
});

const outerEdges = outerPoints.map((el, i) => [el, outerPoints[(i + 1) % outerPoints.length]!] as const satisfies Edge);

const pointInRectangle = (point: Point, rect: Rect) => {
  return (
    point[0] < rect.bottomRight[0] &&
    point[0] > rect.topLeft[0] &&
    point[1] < rect.bottomRight[1] &&
    point[1] > rect.topLeft[1]
  );
};

const edgeInRectange = (edge: Edge, rect: Rect) => {
  if (pointInRectangle(edge[0], rect) || pointInRectangle(edge[1], rect)) return true;

  if (edge[0][0] === edge[1][0]) {
    const top = Math.min(edge[0][1], edge[1][1]);
    const bottom = Math.max(edge[0][1], edge[1][1]);
    return (
      edge[0][0] < rect.bottomRight[0] &&
      edge[0][0] > rect.topLeft[0] &&
      top < rect.bottomRight[1] &&
      bottom > rect.topLeft[1]
    );
  }

  if (edge[0][1] === edge[1][1]) {
    const left = Math.min(edge[0][0], edge[1][0]);
    const right = Math.max(edge[0][0], edge[1][0]);
    return (
      edge[0][1] < rect.bottomRight[1] &&
      edge[0][1] > rect.topLeft[1] &&
      left < rect.bottomRight[0] &&
      right > rect.topLeft[0]
    );
  }

  return false;
};

const bestRect = allRects.find((rect) => !outerEdges.some((edge) => edgeInRectange(edge, rect)));

if (!bestRect) throw new Error("No inner rectangles found???");

console.log(`Part 2: ${bestRect.area}`);
