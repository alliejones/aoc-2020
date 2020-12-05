import { assertEquals } from "https://deno.land/std@0.79.0/testing/asserts.ts";

import { charCount, parseLine, Password } from "./day2.ts";

Deno.test("parseLine", () => {
  const expected: Password = {
    min: 1,
    max: 3,
    char: "a",
    str: "abcde",
  };
  assertEquals(parseLine("1-3 a: abcde"), expected);
});

Deno.test("charCount", () => {
  assertEquals(charCount("aaaaa", "a"), 5);
  assertEquals(charCount("ffffff", "a"), 0);
  assertEquals(charCount("bababa", "a"), 3);
});
