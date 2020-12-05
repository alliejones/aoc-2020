import { expandGlobSync } from "https://deno.land/std@0.79.0/fs/expand_glob.ts";

const scripts: { [key: string]: string } = {};
for (const file of expandGlobSync("day*/*.ts")) {
  if (file.isFile) {
    if (file.name.endsWith("test.ts")) {
      scripts[file.name.replace(".ts", "")] = `deno test ${file.path}`;
    } else {
      scripts[file.name.replace(".ts", "")] = file.path;
    }
  }
}

export default {
  allow: ["read", "write"],
  scripts,
};
