const Op = {
  acc: "acc",
  jmp: "jmp",
  nop: "nop",
} as const;
type Op = typeof Op[keyof typeof Op];

type Instruction = {
  op: Op;
  arg: number;
  run: boolean;
};

type Program = Instruction[];

class Machine {
  acc: number;
  currLine: number;
  program: Program;

  constructor(program: Program);
  constructor(program: string);
  constructor(program: Program | string) {
    this.acc = 0;
    this.currLine = 0;
    if (Array.isArray(program)) {
      this.program = program;
    } else {
      this.program = Machine.parseProgram(program);
    }
  }

  static parseProgram(program: string): Program {
    return program.trim().split("\n").map(Machine.parseLine);
  }

  static parseLine(line: string): Instruction {
    const [opStr, argStr] = line.split(" ");
    if (!opStr || !argStr) {
      throw new Error(`Invalid line ${line}`);
    }

    return {
      op: Machine.parseOp(opStr),
      arg: Number.parseInt(argStr, 10),
      run: false,
    };
  }

  static parseOp(op: string): Op {
    switch (op) {
      case Op.acc:
        return Op.acc;
      case Op.jmp:
        return Op.jmp;
      case Op.nop:
        return Op.nop;
      default:
        throw new Error(`Unknown operation ${op}`);
    }
  }

  getAcc(): number {
    return this.acc;
  }

  terminates(): boolean {
    while (true) {
      if (this.currLine === this.program.length) {
        break;
      }

      let instr = this.program[this.currLine];
      if (instr.run) {
        return false;
      }

      this.execInstr(instr);
    }

    return true;
  }

  execInstr(instr: Instruction) {
    switch (instr.op) {
      case Op.acc:
        this.acc += instr.arg;
        this.currLine++;
        break;
      case Op.jmp:
        this.currLine += instr.arg;
        break;
      case Op.nop:
        this.currLine++;
        break;
    }
    instr.run = true;
  }
}

const input = await Deno.readTextFile("./day8/input.txt");

const original = Machine.parseProgram(input);

const variations: Program[] = [];

original.forEach((line, i) => {
  if (line.op === Op.jmp) {
    const changed = Machine.parseProgram(input);
    changed[i] = { ...line, op: Op.nop };
    variations.push(changed);
  } else if (line.op === Op.nop) {
    const changed = Machine.parseProgram(input);
    changed[i] = { ...line, op: Op.jmp };
    variations.push(changed);
  }
});

for (const prog of variations) {
  const machine = new Machine(prog);
  if (machine.terminates()) {
    console.log(machine.getAcc());
    break;
  }
}

export {};
