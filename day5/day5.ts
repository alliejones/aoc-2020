const input = `FBFBBFFRLR
BFFFBBFRRR
FFFBBBFRRR
BBFFBBFRLL`;

function parsePosition(
  input: string,
): { row: number; seat: number; id: number } {
  const matches = input.match(/(?<rowStr>[FB]{7})(?<seatStr>[RL]{3})/);
  if (!matches?.groups?.rowStr || !matches?.groups?.seatStr) {
    throw new Error(`Could not parse input ${input}`);
  }
  const pos = {
    row: binaryPartition(
      matches.groups.rowStr,
      { min: 0, max: 127, upperChar: "B", lowerChar: "F" },
    ),
    seat: binaryPartition(
      matches.groups.seatStr,
      { min: 0, max: 7, upperChar: "R", lowerChar: "L" },
    ),
  };
  return {
    ...pos,
    id: pos.row * 8 + pos.seat,
  };
}

function binaryPartition(
  input: string,
  { min, max, lowerChar, upperChar }: {
    min: number;
    max: number;
    lowerChar: string;
    upperChar: string;
  },
) {
  const pos = { min, max };
  for (const c of input) {
    const half = (pos.max - pos.min + 1) / 2;
    if (c === lowerChar) {
      pos.max = pos.max - half;
    } else if (c === upperChar) {
      pos.min = pos.min + half;
    } else {
      throw new Error(`Invalid value ${c}`);
    }
  }
  return pos.min;
}

const lines = await Deno.readTextFile("./day5/input.txt").then((input) =>
  input.trim().split("\n")
);
const seats = lines.map(parsePosition);
const ids = seats.map((seat) => seat.id).sort((a, b) => a - b);

let currId = ids[0];
for (let i = 0; i < ids.length; i++) {
  if (currId != ids[i]) {
    console.log(currId);
    break;
  }
  currId++;
}

export {};
