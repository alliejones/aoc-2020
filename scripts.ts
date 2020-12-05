import { expandGlobSync } from "https://deno.land/std@0.79.0/fs/expand_glob.ts";

const scripts: { [key: string]: string } = {};
for (const file of expandGlobSync("day*/*.ts")) {
  if (file.isFile) {
    scripts[file.name.replace(".ts", "")] = file.path;
  }
}

export default {
  allow: ["read", "write"],
  scripts,
};
