export {};

// const input = `16
// 10
// 15
// 5
// 1
// 11
// 7
// 19
// 6
// 12
// 4`;

// const input = `28
// 33
// 18
// 42
// 31
// 14
// 46
// 20
// 48
// 47
// 24
// 23
// 49
// 45
// 19
// 38
// 39
// 11
// 1
// 32
// 25
// 35
// 8
// 17
// 7
// 9
// 4
// 2
// 34
// 10
// 3`;

const input = await Deno.readTextFile("./day10/input.txt");
const ratings = input.trim().split("\n").map((n) => parseInt(n, 10));
ratings.sort((a, b) => a - b);
ratings.unshift(0);
ratings.push(ratings[ratings.length - 1] + 3);

const diffs = new Map();
for (let i = 0; i < ratings.length - 1; i++) {
  const a = ratings[i];
  const b = ratings[i + 1];
  let diff = b - a;
  if (!diffs.has(diff)) {
    diffs.set(diff, 1);
  } else {
    diffs.set(diff, diffs.get(diff) + 1);
  }
}
console.log(diffs.get(1) * diffs.get(3));
