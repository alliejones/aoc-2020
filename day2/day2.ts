const lines = await Deno.readTextFile("./day2/input.txt").then((input) =>
  input.trim().split("\n")
);

type Password = {
  min: number;
  max: number;
  char: string;
  str: string;
};

interface ValidatedPassword extends Password {
  valid: boolean;
}

function parseLine(line: string): Password {
  const [rules, str] = line.split(": ");
  const [count, char] = rules.split(" ");
  const [min, max] = count.split("-").map((n) => parseInt(n, 10));
  return { str, char, min, max };
}

function charCount(str: string, char: string): number {
  console.log(str, char);
  return str.split("").reduce((count, c): number => {
    if (c === char) return count + 1;
    else return count;
  }, 0);
}

function ruleOne(lines: string[]): ValidatedPassword[] {
  return lines.map((line): ValidatedPassword => {
    const pwd = parseLine(line);
    const count = charCount(pwd.str, pwd.char);
    const valid = count >= pwd.min && count <= pwd.max ? true : false;
    return {
      ...pwd,
      valid,
    };
  });
}

function ruleTwo(lines: string[]): ValidatedPassword[] {
  return lines.map((line): ValidatedPassword => {
    const pwd = parseLine(line);
    const pos1 = pwd.str[pwd.min - 1];
    const pos2 = pwd.str[pwd.max - 1];

    let valid;
    if (
      (pos1 === pwd.char && pos2 !== pwd.char) ||
      (pos1 !== pwd.char && pos2 === pwd.char)
    ) {
      valid = true;
    } else {
      valid = false;
    }

    return {
      ...pwd,
      valid,
    };
  });
}

function validCount(pwds: ValidatedPassword[]): number {
  return pwds.reduce(
    (count, pwd) => pwd.valid ? count + 1 : count,
    0,
  );
}

console.log(validCount(ruleTwo(lines)));

export { charCount, parseLine };
export type { Password };
