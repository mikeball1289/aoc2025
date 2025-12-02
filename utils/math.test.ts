import { describe, expect, it } from "@jest/globals";
import { ndigits, sumRange } from "./math";

describe("math", () => {
  describe("ndigits", () => {
    it("should compute the base 10 number of digits for all numbers up to 10,000,000,000", () => {
      expect(ndigits(1)).toBe(1);
      expect(ndigits(9)).toBe(1);

      expect(ndigits(10)).toBe(2);
      expect(ndigits(99)).toBe(2);

      expect(ndigits(100)).toBe(3);
      expect(ndigits(999)).toBe(3);

      expect(ndigits(1000)).toBe(4);
      expect(ndigits(9999)).toBe(4);

      expect(ndigits(10000)).toBe(5);
      expect(ndigits(99999)).toBe(5);

      expect(ndigits(100000)).toBe(6);
      expect(ndigits(999999)).toBe(6);

      expect(ndigits(1000000)).toBe(7);
      expect(ndigits(9999999)).toBe(7);

      expect(ndigits(10000000)).toBe(8);
      expect(ndigits(99999999)).toBe(8);

      expect(ndigits(100000000)).toBe(9);
      expect(ndigits(999999999)).toBe(9);

      expect(ndigits(1000000000)).toBe(10);
      expect(ndigits(9999999999)).toBe(10);

      expect(ndigits(10_000_000_000)).toBe(11);
    });
  });

  describe("sumRange", () => {
    it("should sum numbers between start (inclusive) and end (exclusive)", () => {
      expect(sumRange(1, 10)).toBe(45);
      expect(sumRange(3, 10)).toBe(42);
    });
  });
});
