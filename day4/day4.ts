const input = `ecl:gry pid:860033327 eyr:2020 hcl:#fffffd
byr:1937 iyr:2017 cid:147 hgt:183cm

iyr:2013 ecl:amb cid:350 eyr:2023 pid:028048884
hcl:#cfa07d byr:1929

hcl:#ae17e1 iyr:2013
eyr:2024
ecl:brn pid:760753108 byr:1931
hgt:179cm

hcl:#cfa07d eyr:2025 pid:166559648
iyr:2011 ecl:brn hgt:59in`;

enum PassportField {
  BirthYear = "byr",
  IssueYear = "iyr",
  ExpirationYear = "eyr",
  Height = "hgt",
  HairColor = "hcl",
  EyeColor = "ecl",
  PassportID = "pid",
  CountryID = "cid",
}

type Validator = (input: string) => boolean;

class Passport {
  data: { [key in PassportField]?: string };

  constructor(batchEntry: string) {
    this.data = Passport.parseEntry(batchEntry);
  }

  isValid() {
    let valid = true;
    for (const key of Object.values(PassportField)) {
      if (!Passport.isRequiredField(key)) continue;

      const validator = Passport.validators[key];
      const val = this.data[key];
      if (val === undefined || !validator(val)) {
        valid = false;
        debugger;
        break;
      }
    }
    return valid;
  }

  static validators: { [key in PassportField]: Validator } = {
    [PassportField.BirthYear]: (input) => {
      const year = parseInt(input, 10);
      return year >= 1920 && year <= 2002;
    },
    [PassportField.IssueYear]: (input) => {
      const year = parseInt(input, 10);
      return year >= 2010 && year <= 2020;
    },
    [PassportField.ExpirationYear]: (input) => {
      const year = parseInt(input, 10);
      return year >= 2020 && year <= 2030;
    },
    [PassportField.Height]: (input) => {
      if (input.endsWith("cm")) {
        const height = parseInt(input.replace("cm", ""), 10);
        return height >= 150 && height <= 193;
      } else if (input.endsWith("in")) {
        const height = parseInt(input.replace("in", ""), 10);
        return height >= 59 && height <= 76;
      } else {
        return false;
      }
    },
    [PassportField.HairColor]: (input) => /^#[0-9a-f]{6}$/.test(input),
    [PassportField.EyeColor]: (input) =>
      ["amb", "blu", "brn", "gry", "grn", "hzl", "oth"].includes(input),
    [PassportField.PassportID]: (input) => /^[0-9]{9}$/.test(input),
    [PassportField.CountryID]: () => true,
  };

  static parseEntry(entryStr: string) {
    const entry: { [key in PassportField]?: string } = {};
    entryStr.replace("\n", " ").split(/\s+/).forEach((field) => {
      const [key, val] = field.split(":");
      if (!(Object.values(PassportField) as string[]).includes(key)) {
        throw new Error(`Invalid key ${key}`);
      }
      entry[key as PassportField] = val;
    });
    return entry;
  }

  static isRequiredField(field: PassportField) {
    return field !== PassportField.CountryID;
  }
}

const lines = await Deno.readTextFile("./day4/input.txt").then((input) =>
  input.trim().split("\n\n")
);
const passports = lines.map((line) => new Passport(line));
const validCount = passports.reduce(
  (count, passport) => passport.isValid() ? count + 1 : count,
  0,
);
console.log(validCount);

export { Passport };
