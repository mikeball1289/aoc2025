import { describe, expect, it } from "@jest/globals";
import { combin, edges } from "./arrays";

describe("combin", () => {
  it("should return all possible combinations of elements in the given array", () => {
    const W = "w";
    const U = "u";
    const B = "b";
    const R = "r";
    const G = "g";
    const result = combin([W, U, B, R, G]);

    expect(new Set(result)).toEqual(
      new Set([
        [],
        [W],
        [U],
        [B],
        [R],
        [G],
        [W, U],
        [W, B],
        [W, R],
        [W, G],
        [U, B],
        [U, R],
        [U, G],
        [B, R],
        [B, G],
        [R, G],
        [W, U, B],
        [W, U, R],
        [W, U, G],
        [W, B, R],
        [W, B, G],
        [W, R, G],
        [U, B, R],
        [U, B, G],
        [U, R, G],
        [B, R, G],
        [W, U, B, R],
        [W, U, B, G],
        [W, U, R, G],
        [W, B, R, G],
        [U, B, R, G],
        [W, U, B, R, G],
      ]),
    );
  });

  it("should return an array containing an empty array when given an empty array", () => {
    expect(combin([])).toEqual([[]]);
  });
});

describe("edges", () => {
  it("should return pairs of elements that make up the path defined by the array", () => {
    const result = edges(["a", "b", "c", "d"]);
    expect(result).toEqual([
      ["a", "b"],
      ["b", "c"],
      ["c", "d"],
    ]);
  });

  it("should close the cycle when CYCLE is passed", () => {
    const result = edges(["a", "b", "c", "d"], "CYCLE");
    expect(result).toEqual([
      ["a", "b"],
      ["b", "c"],
      ["c", "d"],
      ["d", "a"],
    ]);
  });

  it("should return an empty list for arrays with less than two elements", () => {
    expect(edges([])).toEqual([]);
    expect(edges(["a"])).toEqual([]);
  });
});
