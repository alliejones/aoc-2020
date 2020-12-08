interface Bag {
  color: string;
  inner?: InnerBag[];
}

interface InnerBag extends Bag {
  count: number;
}

function parseLine(line: string): Bag {
  if (line.includes("no other bags.")) {
    const matches = line.match(/^(?<bagColor>.+) bags contain/);
    if (!matches?.groups?.bagColor) {
      throw new Error(`Error parsing line: ${line}`);
    }
    return {
      color: matches.groups.bagColor,
      inner: [],
    };
  } else {
    const matches = line.match(
      /^(?<bagColor>.+) bags contain (?<innerBags>.+)\.$/,
    );
    if (!matches?.groups?.bagColor || !matches?.groups?.innerBags) {
      throw new Error(`Error parsing line: ${line}`);
    }
    return {
      color: matches.groups.bagColor,
      inner: parseInnerBag(matches.groups.innerBags),
    };
  }
}

function parseInnerBag(innerBags: string): InnerBag[] {
  const bags = innerBags.split(", ");
  return bags.map((bag) => {
    const matches = bag.match(/^(?<count>\d+) (?<bagColor>.+) bags?$/);
    if (!matches?.groups?.bagColor || !matches?.groups?.count) {
      throw new Error(`Error parsing inner bag string: ${innerBags}`);
    }
    return {
      color: matches.groups.bagColor,
      count: parseInt(matches.groups.count, 10),
    };
  });
}

const lines = await Deno.readTextFile("./day7/input.txt").then((input) =>
  input.trim().split("\n")
);

// const lines = `shiny gold bags contain 2 dark red bags.
// dark red bags contain 2 dark orange bags.
// dark orange bags contain 2 dark yellow bags.
// dark yellow bags contain 2 dark green bags.
// dark green bags contain 2 dark blue bags.
// dark blue bags contain 2 dark violet bags.
// dark violet bags contain no other bags.`.split("\n");

type BagRules = { [bagColor: string]: InnerBag[] };
const bagRules = lines.reduce((map: BagRules, line: string) => {
  const bag = parseLine(line);
  map[bag.color] = bag.inner ?? [];
  return map;
}, {});

// collect colors of all descendants of a given bag
function collectChildren(bagColor: string): string[] {
  const children = bagRules[bagColor];
  if (children.length === 0) {
    return [];
  } else {
    let childColors: string[] = [];
    for (const child of children) {
      childColors = childColors.concat(
        [child.color, ...collectChildren(child.color)],
      );
    }
    return childColors;
  }
}

// sum count of all descendants of a given bag color
function sumChildren(bagColor: string): number {
  const children = bagRules[bagColor];
  return children.reduce((sum, child) => {
    return sum + child.count + child.count * sumChildren(child.color);
  }, 0);
}

type BagChildMap = { [bagColor: string]: string[] };
const allChildren = Object.keys(bagRules).reduce(
  (map: BagChildMap, color: string) => {
    map[color] = [...new Set(collectChildren(color))];
    return map;
  },
  {},
);

console.log(sumChildren("shiny gold"));

export { parseLine };
export type { Bag };
