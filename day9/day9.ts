type Buffer = number[];

function isDefined<T>(arg: T | undefined): arg is T {
  return arg !== undefined;
}

function isNotNull<T>(arg: T | null): arg is T {
  return arg !== null;
}

function calcSums(buffer: Buffer) {
  return buffer.flatMap((n: number) => {
    return buffer.map((x) => n === x ? null : n + x).filter(isNotNull);
  });
}

function isValid(buffer: Buffer, n: number) {
  return calcSums(buffer).includes(n);
}

function findInvalidNumber(list: number[], bufferSize = 25) {
  const input = [...list];
  const buffer: Buffer = [];

  while (buffer.length < bufferSize) {
    let n = input.shift();
    if (n) {
      buffer.push(n);
    }
  }

  while (input.length > 0) {
    let n = input.shift();
    if (n) {
      if (!isValid(buffer, n)) {
        return n;
      }
      buffer.shift();
      buffer.push(n);
    }
  }
}

function findContiguousSum(input: number[], targetSum: number) {
  const sum = (ns: number[]) => ns.reduce((sum, n) => sum + n, 0);

  for (let start = 0; start < input.length; start++) {
    let candidates: number[] = [];
    let end = start;
    while (sum(candidates) < targetSum) {
      candidates.push(input[end]);
      end++;
    }
    if (sum(candidates) === targetSum) {
      return candidates;
    }
  }

  return null;
}

function addSmallestAndLargest(nums: number[]) {
  return Math.min(...nums) + Math.max(...nums);
}

//////////

const input = await Deno.readTextFile("./day9/input.txt").then((input) =>
  input.split("\n").map((n) => parseInt(n, 10)).filter(isDefined)
);

const invalid = findInvalidNumber(input);
if (invalid) {
  const contigSum = findContiguousSum(input, invalid);

  if (contigSum) {
    console.log(addSmallestAndLargest(contigSum));
  }
}

export {};
