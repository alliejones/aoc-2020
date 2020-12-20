export {};

const Seat = {
  empty: "L",
  floor: ".",
  full: "#",
} as const;
type Seat = typeof Seat[keyof typeof Seat];

class Layout {
  layout: Seat[][] = [];

  static parse(input: string) {
    return input.trim().split("\n").map((row) => {
      return row.split("").map(this.parseSeat);
    });
  }

  static parseSeat(str: string): Seat {
    if (str === Seat.empty || str === Seat.full || str === Seat.floor) {
      return str;
    } else {
      throw new Error("Invalid seat value");
    }
  }

  constructor(seats: Seat[][]);
  constructor(seats: string);
  constructor(seats: string | Seat[][]) {
    if (typeof seats === "string") {
      seats = Layout.parse(seats);
    }
    this.layout = seats;
  }

  getSeat(row: number, col: number) {
    return this.layout[row][col];
  }

  isEmpty(row: number, col: number) {
    return this.getSeat(row, col) === Seat.empty;
  }

  isFull(row: number, col: number) {
    return this.getSeat(row, col) === Seat.full;
  }

  isFloor(row: number, col: number) {
    return this.getSeat(row, col) === Seat.floor;
  }

  next(): Layout {
    const next: Seat[][] = [];
    for (let row = 0; row < this.layout.length; row++) {
      const newRow: Seat[] = [];
      for (let col = 0; col < this.layout[row].length; col++) {
        newRow.push(this.nextSeat(row, col));
      }
      next.push(newRow);
    }
    return new Layout(next);
  }

  nextSeat(row: number, col: number): Seat {
    const seat = this.getSeat(row, col);
    if (
      seat === Seat.empty && this.getNeighborCount(row, col, Seat.full) === 0
    ) {
      return Seat.full;
    } else if (
      seat === Seat.full && this.getNeighborCount(row, col, Seat.full) >= 4
    ) {
      return Seat.empty;
    } else {
      return seat;
    }
  }

  get length() {
    return this.layout.length;
  }

  getRow(row: number) {
    return this.layout[row];
  }

  getNeighborCount(row: number, col: number, state: Seat) {
    return [
      [row - 1, col - 1],
      [row - 1, col],
      [row - 1, col + 1],
      [row, col - 1],
      [row, col + 1],
      [row + 1, col - 1],
      [row + 1, col],
      [row + 1, col + 1],
    ].filter(([row, col]) =>
      row >= 0 && row < this.length && col >= 0 && col < this.getRow(row).length
    ).reduce(
      (count, [row, col]) =>
        this.getSeat(row, col) === state ? count + 1 : count,
      0,
    );
  }

  getTypeCount(state: Seat) {
    let count = 0;
    for (let row = 0; row < this.layout.length; row++) {
      for (let col = 0; col < this.layout[row].length; col++) {
        if (this.layout[row][col] === state) {
          count++;
        }
      }
    }
    return count;
  }

  diffCount(layout: Layout) {
    let count = 0;
    for (let row = 0; row < this.layout.length; row++) {
      for (let col = 0; col < this.layout[row].length; col++) {
        if (this.layout[row][col] !== layout.getSeat(row, col)) {
          count++;
        }
      }
    }
    return count;
  }

  toString() {
    return this.layout.map((row) => row.join("")).join("\n");
  }
}

class SeatingSim {
  states: Layout[];

  constructor(input: string) {
    this.states = [new Layout(input)];
  }

  getCurrentLayout() {
    return this.states[this.states.length - 1];
  }

  run() {
    let current = this.getCurrentLayout();
    let next = current.next();
    this.states.push(next);
    let diff = current.diffCount(next);

    while (diff > 0) {
      current = next;
      next = current.next();
      this.states.push(next);
      diff = current.diffCount(next);
    }
  }
}

const initial = await Deno.readTextFile("./day11/input.txt");
const sim = new SeatingSim(initial);
sim.run();
console.log(sim.getCurrentLayout().getTypeCount(Seat.full));

export { Layout, Seat, SeatingSim };
