import { readFileSync } from "node:fs";

export const parse = <T>(filename: string, parseLine: (line: string) => T): T[] => {
  const contents = readFileSync(filename, "ascii");
  const lines = contents.split(/\r?\n/);
  
  return lines.map(parseLine);
}
