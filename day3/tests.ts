import {
  assertEquals,
  assertThrows,
} from "https://deno.land/std@0.79.0/testing/asserts.ts";
import { CellValue, TreeMap } from "./day3.ts";

const grid = `..##.......
#...#...#..
.#....#..#.
..#.#...#.#
.#...##..#.
..#.##.....
.#.#.#....#
.#........#
#.##...#...
#...##....#
.#..#...#.#`;

Deno.test("Map#get", () => {
  const map = new TreeMap(grid);

  // regular coords
  assertEquals(map.get(0, 0), CellValue.Open);
  assertEquals(map.get(3, 0), CellValue.Tree);
  assertEquals(map.get(2, 9), CellValue.Open);
  assertEquals(map.get(2, 10), CellValue.Open);
  assertEquals(map.get(10, 10), CellValue.Tree);

  // wrapping x coords
  // 0, 0 wrapped once
  assertEquals(map.get(11, 0), CellValue.Open);
  // 0, 0 wrapped twice
  assertEquals(map.get(22, 0), CellValue.Open);
  // 10, 10 wrapped twice
  assertEquals(map.get(32, 10), CellValue.Tree);
});

Deno.test("Map#get errors", () => {
  const map = new TreeMap(grid);

  // out of bounds y coord
  assertThrows(() => map.get(0, 11));
});

Deno.test("Map#run", () => {
  const map = new TreeMap(grid);
  const count = map.run(3, 1);
  assertEquals(count, 7);
});

export {};
