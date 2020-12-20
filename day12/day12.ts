const MovDir = {
  N: [0, 1],
  E: [1, 0],
  S: [0, -1],
  W: [-1, 0],
} as const;
type MovDir = typeof MovDir[keyof typeof MovDir];

const RotDir = {
  R: 1,
  L: -1,
};
type RotDir = typeof RotDir[keyof typeof RotDir];

const Rot = {
  N: 0,
  E: 90,
  S: 180,
  W: 270,
} as const;
type Rot = typeof Rot[keyof typeof Rot];

interface RotInstr {
  type: "rot";
  deg: Rot;
  dir: RotDir;
}

interface MovInstr {
  type: "mov";
  dir: MovDir;
  amt: number;
}

interface FwdInstr {
  type: "fwd";
  amt: number;
}

type Instr = RotInstr | MovInstr | FwdInstr;

function rotToDir(rot: Rot) {
  switch (rot) {
    case Rot.N:
      return MovDir.N;
    case Rot.S:
      return MovDir.S;
    case Rot.E:
      return MovDir.E;
    case Rot.W:
      return MovDir.W;
  }
}

function assertValidRot(amt: number): Rot {
  if (amt !== 0 && amt !== 90 && amt !== 180 && amt !== 270) {
    throw new Error(`Invalid rotation amount: ${amt}`);
  }
  return amt;
}

class Ship {
  instrSet: Instr[];
  rot: Rot = Rot.E;
  x = 0;
  y = 0;

  static parseInstr(instr: string): Instr {
    const type = instr.slice(0, 1);
    const amt = Number.parseInt(instr.slice(1));
    if (!type || !amt) {
      throw new Error(`Invalid instruction format: ${instr}`);
    }
    switch (type) {
      case "N":
      case "S":
      case "E":
      case "W":
        return { type: "mov", dir: MovDir[type], amt };
      case "F":
        return { type: "fwd", amt };
      case "R":
      case "L":
        return { type: "rot", deg: assertValidRot(amt), dir: RotDir[type] };
      default:
        throw new Error(`Invalid instruction type: ${instr}`);
    }
  }

  constructor(input: string) {
    this.instrSet = input.trim().split("\n").map(Ship.parseInstr);
  }

  run() {
    for (let instr of this.instrSet) {
      switch (instr.type) {
        case "mov":
          this.doMove(instr.dir, instr.amt);
          break;
        case "fwd":
          this.doMove(rotToDir(this.rot), instr.amt);
          break;
        case "rot":
          this.doRot(instr);
          break;
        default:
          const _exhaustiveCheck: never = instr;
      }
    }
  }

  doMove(dir: MovDir, amt: number) {
    const [xDir, yDir] = dir;
    this.x += xDir * amt;
    this.y += yDir * amt;
  }

  doRot({ deg, dir }: RotInstr) {
    let newRot = this.rot + (dir * deg);
    this.rot = assertValidRot((newRot % 360 + 360) % 360);
  }

  dist() {
    return Math.abs(this.x) + Math.abs(this.y);
  }
}

// const input = `
// F10
// N3
// F7
// R90
// F11
// `;
const input = await Deno.readTextFile("./day12/input.txt");
const ship = new Ship(input);
ship.run();
console.log(ship.dist());
export {};
