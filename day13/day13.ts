export {};

// const input = `939
// 7,13,x,x,59,x,31,19`;

const input = await Deno.readTextFile("./day13/input.txt");

const [timestampStr, busStr] = input.trim().split("\n");
const timestamp = parseInt(timestampStr, 10);
type Bus = { id: number; wait: number };
const buses: Bus[] = busStr.split(",").filter((bus) => bus !== "x").map(
  (bus) => {
    const id = parseInt(bus, 10);
    const loops = Math.floor(timestamp / id) + 1;
    const nextStop = loops * id;
    return {
      id,
      wait: nextStop - timestamp,
    };
  },
);

const next = buses.reduce((shortest, curr) => {
  if (curr.wait < shortest.wait) {
    return curr;
  } else {
    return shortest;
  }
}, buses[0]);
console.log(next.id * next.wait);
