const INPUT_FILE = "./day1/input.txt";

const vals = await Deno.readTextFile(INPUT_FILE).then((input) =>
  input.split("\n").map(Number)
);

// IIFE to allow early return instead of the weird JS syntax for breaking from nested loops
(function () {
  for (let i = 0; i < vals.length; i++) {
    for (let j = i + 1; j < vals.length; j++) {
      for (let k = i + 2; k < vals.length; k++) {
        if (vals[i] + vals[j] + vals[k] === 2020) {
          console.log(vals[i] * vals[j] * vals[k]);
          return;
        }
      }
    }
  }
})();

export {};
