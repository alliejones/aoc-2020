enum CellValue {
  Tree = "#",
  Open = ".",
}

class TreeMap {
  grid: string[];
  width: number;
  height: number;

  constructor(grid: string) {
    this.grid = grid.trim().split("\n");
    this.width = this.grid[0].length;
    this.height = this.grid.length;
  }

  isTree(x: number, y: number) {
    return this.get(x, y) === CellValue.Tree;
  }

  run(dx: number, dy: number): number {
    let treeCount = 0;

    let x = dx;
    for (let y = dy; y < this.height; y += dy) {
      if (this.isTree(x, y)) {
        treeCount++;
      }
      x += dx;
    }

    return treeCount;
  }

  get(x: number, y: number): CellValue {
    if (x > this.width - 1) {
      x = x % this.width;
    }

    if (y > this.height - 1) {
      throw new Error(`Out of bounds y coordinate: ${y}`);
    }

    const val = this.grid[y][x];
    if (!(Object.values(CellValue) as string[]).includes(val)) {
      throw new Error(`Invalid cell value: ${val}`);
    }

    return val as CellValue;
  }
}

const input = await Deno.readTextFile("./day3/input.txt");
const map = new TreeMap(input);
const slopes = [[1, 1], [3, 1], [5, 1], [7, 1], [1, 2]];
const output = slopes.map(([dx, dy]) => map.run(dx, dy)).reduce(
  (total, count) => total * count,
  1,
);

console.log(output);

export { CellValue, TreeMap };
