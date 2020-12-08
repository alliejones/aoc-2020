import { assertEquals } from "../deps-test.ts";

import { parseLine } from "./day7.ts";
import type { Bag } from "./day7.ts";

const input = `light red bags contain 1 bright white bag, 2 muted yellow bags.
dark orange bags contain 3 bright white bags, 4 muted yellow bags.
bright white bags contain 1 shiny gold bag.
muted yellow bags contain 2 shiny gold bags, 9 faded blue bags.
shiny gold bags contain 1 dark olive bag, 2 vibrant plum bags.
dark olive bags contain 3 faded blue bags, 4 dotted black bags.
vibrant plum bags contain 5 faded blue bags, 6 dotted black bags.
faded blue bags contain no other bags.
dotted black bags contain no other bags.`.split("\n");

Deno.test("parseLine empty bag", () => {
  const expected: Bag = {
    color: "faded blue",
    inner: [],
  };
  assertEquals(parseLine("faded blue bags contain no other bags."), expected);
});

Deno.test("parseLine filled bag 1 inner", () => {
  const expected: Bag = {
    color: "bright white",
    inner: [
      { color: "shiny gold", count: 1 },
    ],
  };

  assertEquals(
    parseLine(
      "bright white bags contain 1 shiny gold bag.",
    ),
    expected,
  );
});

Deno.test("parseLine filled bag 2 inner", () => {
  const expected: Bag = {
    color: "dark orange",
    inner: [
      { color: "bright white", count: 3 },
      { color: "muted yellow", count: 4 },
    ],
  };

  assertEquals(
    parseLine(
      "dark orange bags contain 3 bright white bags, 4 muted yellow bags.",
    ),
    expected,
  );
});
