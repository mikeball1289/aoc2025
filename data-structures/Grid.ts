export type Adjacencies = [number, number][];

/* eslint-disable prettier/prettier */
export const CARDINAL_ADJACENCIES: Adjacencies = [
            [0, -1],
  [-1,  0],          [1,  0],
            [0,  1],
];

export const EIGHT_WAY_ADJACENCIES: Adjacencies = [
  [-1, -1], [0, -1], [1, -1],
  [-1,  0],          [1,  0],
  [-1,  1], [0,  1], [1,  1],
];
/* eslint-enable */

export type CellResult<T> = {
  x: number;
  y: number;
  cell: T;
};

export class Grid<T> {
  get width() {
    return this.cells[0]?.length ?? 0;
  }

  get height() {
    return this.cells.length;
  }

  constructor(private cells: T[][]) {
    const width = this.width;
    if (cells.some((row) => row.length !== width)) {
      throw new Error("Cells must be rectangular");
    }
  }

  at(x: number, y: number): T {
    if (x < 0 || y < 0 || x >= this.width || y >= this.height) {
      throw new RangeError(`(${x},${y}) is out of range ${this.width} x ${this.height}`);
    }

    return this.cells[y]![x]!;
  }

  map<K>(mapping: (cell: T, x: number, y: number, grid: Grid<T>) => K): Grid<K> {
    const cells = this.cells.map((row, y) => row.map((cell, x) => mapping(cell, x, y, this)));

    return new Grid(cells);
  }

  reduce<K>(reducer: (accumulator: K, cell: T, x: number, y: number, grid: Grid<T>) => K, initial: K): K {
    return this.cells.reduce(
      (gridAcc, row, y) => row.reduce((rowAcc, cell, x) => reducer(rowAcc, cell, x, y, this), gridAcc),
      initial,
    );
  }

  isInBounds(x: number, y: number) {
    return !(x < 0 || y < 0 || x >= this.width || y >= this.height);
  }

  *iadjacencies(x: number, y: number, adjacency_matrix = EIGHT_WAY_ADJACENCIES): Generator<CellResult<T>> {
    for (const adjacency of adjacency_matrix) {
      const ax = x + adjacency[0];
      const ay = y + adjacency[1];
      if (this.isInBounds(ax, ay)) {
        yield {
          x: ax,
          y: ay,
          cell: this.at(ax, ay),
        };
      }
    }
  }

  adjacencies(x: number, y: number, adjacency_matrix = EIGHT_WAY_ADJACENCIES) {
    return Array.from(this.iadjacencies(x, y, adjacency_matrix));
  }

  findAll(predicate: (cell: T, x: number, y: number, grid: Grid<T>) => boolean): CellResult<T>[] {
    return this.cells.flatMap((row, y) =>
      row.map((cell, x) => ({ cell, x, y })).filter(({ cell }, x) => predicate(cell, x, y, this)),
    );
  }

  toString(options?: {
    serializeCell?: (cell: T, x: number, y: number, grid: Grid<T>) => string;
    delimitCell?: string;
    delimitRow?: string;
  }) {
    const serialize = options?.serializeCell ?? String;
    const delimitCell = options?.delimitCell ?? ",";
    const delimitRow = options?.delimitRow ?? "\n";

    return this.cells
      .map((row, y) => row.map((cell, x) => serialize(cell, x, y, this)).join(delimitCell))
      .join(delimitRow);
  }
}
