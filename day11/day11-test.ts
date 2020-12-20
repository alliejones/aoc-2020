import { assertStringIncludes } from "https://deno.land/std@0.79.0/testing/asserts.ts";
import { assertEquals } from "../deps-test.ts";
import { Layout, Seat, SeatingSim } from "./day11.ts";

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

// one tick after layout 1
const testLayout2 = `
#.#L.L#.##
#LLL#LL.L#
L.#.L..#..
#L##.##.L#
#.#L.LL.LL
#.#L#L#.##
..L.L.....
#L#L##L#L#
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

Deno.test("Layout#getNeighborCount", () => {
  let layout = new Layout(testLayout);
  assertEquals(layout.getNeighborCount(3, 4, Seat.floor), 3);
  assertEquals(layout.getNeighborCount(3, 4, Seat.empty), 4);
  assertEquals(layout.getNeighborCount(3, 4, Seat.full), 1);
});

Deno.test("Layout#getNeighborCount corner", () => {
  let layout = new Layout(testLayout);
  assertEquals(layout.getNeighborCount(0, 0, Seat.empty), 1);
  assertEquals(layout.getNeighborCount(9, 0, Seat.floor), 2);
  assertEquals(layout.getNeighborCount(9, 9, Seat.full), 1);
});

Deno.test("Layout#next", () => {
  let layout = new Layout(testLayout);
  let layout2 = new Layout(testLayout2);
  assertEquals(layout.next().toString(), layout2.toString());
});
