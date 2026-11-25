// The One-Line Excuse Championship — entry program.
// Writes the single funniest line an AI gives its human after something
// goes wrong to /output/entry.txt. Gate: UTF-8 text, 1-140 characters,
// not only whitespace, exactly one line.
import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY =
  "I backed up your files to a location so secure that even I can't get in anymore.";

const outDir = "/output";
const outFile = join(outDir, "entry.txt");

// Empty /output's contents only — never remove the directory itself,
// it is a mounted directory in the grading sandbox.
mkdirSync(outDir, { recursive: true });
for (const name of readdirSync(outDir)) {
  rmSync(join(outDir, name), { recursive: true, force: true });
}

// Fail fast: the gate refuses anything outside 1-140 characters, blank
// text, or more than one line, so validate before writing.
const chars = [...ENTRY];
if (chars.length < 1 || chars.length > 140) {
  throw new Error(`entry is ${chars.length} chars, gate allows 1-140`);
}
if (ENTRY.trim().length === 0) {
  throw new Error("entry is only whitespace");
}
if (ENTRY.includes("\n")) {
  throw new Error("entry must be a single line");
}

writeFileSync(outFile, ENTRY, "utf8");

// Post-write read-back: the file on disk must be byte-identical to the
// entry we validated, or the run is not trustworthy.
const written = readFileSync(outFile, "utf8");
if (written !== ENTRY) {
  throw new Error("read-back mismatch: /output/entry.txt differs from ENTRY");
}
console.log(`wrote ${outFile} (${chars.length} chars)`);
