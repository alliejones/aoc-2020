const Seat = {
  empty: "L",
  floor: ".",
  full: "#",
} as const;
type Seat = typeof Seat[keyof typeof Seat];

const Dir = {
  N: [-1, 0],
  NE: [-1, 1],
  E: [0, 1],
  SE: [1, 1],
  S: [1, 0],
  SW: [1, -1],
  W: [0, -1],
  NW: [-1, -1],
} as const;
type Dir = typeof Dir[keyof typeof Dir];

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
      seat === Seat.full && this.getNeighborCount(row, col, Seat.full) >= 5
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
    let count = 0;
    for (let dir of Object.values(Dir)) {
      let seat = this.findNearestSeat(row, col, dir);
      if (seat === state) {
        count++;
      }
    }
    return count;
  }

  findNearestSeat(
    seatRow: number,
    seatCol: number,
    [rowD, colD]: Dir,
  ): Seat | null {
    let row = seatRow + rowD;
    let col = seatCol + colD;

    let curr;
    while (this.isValidCoord(row, col)) {
      curr = this.getSeat(row, col);
      if (curr !== Seat.floor) {
        return curr;
      }
      row += rowD;
      col += colD;
    }

    return null;
  }

  isValidCoord(
    row: number,
    col: number,
  ) {
    return row >= 0 && row < this.layout.length && col >= 0 &&
      col < this.layout[row].length;
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

export { Dir, Layout, Seat, SeatingSim };
