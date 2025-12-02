import { readFileSync } from "node:fs";

export const parse = <T>(
  filename: string,
  parseLine: (line: string) => T,
  delimiter: string | RegExp = /\r?\n/,
): T[] => {
  const contents = readFileSync(filename, "ascii");
  const lines = contents.split(delimiter);

  return lines.map(parseLine);
};
