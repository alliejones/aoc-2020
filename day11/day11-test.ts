import { assertEquals } from "../deps-test.ts";
import { Dir, Layout, Seat, SeatingSim } from "./day11.ts";

const testLayout = `
#.#L.L#.##
#LLL#LL.L#
L.L.L..#..
#LLL.##.L#
#.LL.LL.LL
#.LL#L#.##
..L.L.....
#L#LLLL#L#
#.LLLLLL.L
#.#L#L#.##`;

Deno.test("Layout#toString", () => {
  let layout = new Layout(testLayout);
  assertEquals(layout.toString(), testLayout.trim());
});

Deno.test("Layout#getSeat", () => {
  let layout = new Layout(testLayout);
  assertEquals(layout.getSeat(0, 0), Seat.full);
  assertEquals(layout.getSeat(9, 9), Seat.full);
  assertEquals(layout.getSeat(0, 1), Seat.floor);
  assertEquals(layout.getSeat(1, 1), Seat.empty);
});

Deno.test("Layout#findNearestSeat", () => {
  let layout = new Layout(`.............\n.L.L.#.#.#.#.\n.............`);
  assertEquals(layout.findNearestSeat(1, 1, Dir.E), Seat.empty);
  assertEquals(layout.findNearestSeat(1, 1, Dir.N), null);
});

Deno.test("Layout#findNearestSeat full all directions", () => {
  let layout = new Layout(`.......#.
...#.....
.#.......
.........
..#L....#
....#....
.........
#........
...#.....`);
  for (let dir of Object.values(Dir)) {
    assertEquals(layout.findNearestSeat(4, 3, dir), Seat.full);
  }
});

Deno.test("Layout#findNearestSeat none all directions", () => {
  let layout = new Layout(`.##.##.
#.#.#.#
##...##
...L...
##...##
#.#.#.#
.##.##.`);
  for (let dir of Object.values(Dir)) {
    assertEquals(layout.findNearestSeat(3, 3, dir), null);
  }
});
