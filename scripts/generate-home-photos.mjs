import { readdir, writeFile } from "node:fs/promises";
import { extname, basename } from "node:path";

const folder = "home_page";
const output = "data/homePhotos.js";
const imageExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);
const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: "base" });

const titleCase = (value) =>
  value
    .replace(/^\d+[_ -]*/, "")
    .replace(/[_-]+/g, " ")
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

const files = (await readdir(folder))
  .filter((file) => imageExtensions.has(extname(file).toLowerCase()))
  .sort((a, b) => collator.compare(a, b));

const photos = files.map((file) => ({
  src: `/${folder}/${file}`,
  alt: titleCase(basename(file, extname(file)))
}));

const contents = `export const homePhotos = ${JSON.stringify(photos, null, 2)};\n`;

await writeFile(output, contents);
console.log(`Updated ${output} with ${photos.length} image${photos.length === 1 ? "" : "s"}.`);
