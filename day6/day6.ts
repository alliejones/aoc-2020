const input = `abc

a
b
c

ab
ac

a
a
a
a

b`;

const groups = await Deno.readTextFile("./day6/input.txt").then((input) =>
  input.trim().split("\n\n").map((group) =>
    group.split("\n").map((answer) => answer.split(""))
  )
);

// const groups = input.trim().split("\n\n").map((group) =>
//   group.split("\n").map((answer) => answer.split(""))
// );

const counts = groups.map((group) => {
  return group.reduce((yeses, person) => {
    return yeses.filter((item) => person.includes(item));
  }, group[0]).length;
});

const sum = counts.reduce((sum, count) => sum + count, 0);
console.log(sum);

export {};
