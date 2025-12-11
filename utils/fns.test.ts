import { describe, expect, it, jest } from "@jest/globals";
import { memo } from "./fns";

describe("memo", () => {
  it("should short circuit calls to the same function with the same arguments", () => {
    const tfn = jest.fn((n: number) => n);
    const memoTfn = memo(tfn);

    expect(memoTfn(1)).toBe(1);
    expect(memoTfn(2)).toBe(2);
    expect(memoTfn(1)).toBe(1);
    expect(memoTfn(2)).toBe(2);
    expect(tfn).toHaveBeenCalledTimes(2);
  });

  it("should allow expensive operations to run quickly", () => {
    const fibs = memo((n: number): number => {
      if (n === 0 || n === 1) return 1;
      return fibs(n - 1) + fibs(n - 2);
    });

    expect(fibs(200)).toBe(4.53973694165308e41);
  });
});
