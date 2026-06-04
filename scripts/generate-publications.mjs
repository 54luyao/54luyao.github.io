import { readdir, readFile, writeFile } from "node:fs/promises";
import { join, extname } from "node:path";

const root = "publications";
const output = "data/publications.js";
const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: "base" });

const latexReplacements = [
  [/\\textbf\{([^{}]*)\}/g, "$1"],
  [/\\'{a}/g, "á"],
  [/\\'{e}/g, "é"],
  [/\\'{i}/g, "í"],
  [/\\'{o}/g, "ó"],
  [/\\'{u}/g, "ú"],
  [/\\"{a}/g, "ä"],
  [/\\"{o}/g, "ö"],
  [/\\"{u}/g, "ü"],
  [/\\`{a}/g, "à"],
  [/\\`{e}/g, "è"],
  [/\\&/g, "&"],
  [/[{}]/g, ""]
];

const cleanLatex = (value = "") => {
  let cleaned = value.replace(/\s+/g, " ").trim();
  for (const [pattern, replacement] of latexReplacements) {
    cleaned = cleaned.replace(pattern, replacement);
  }
  return cleaned.trim();
};

const smallTitleWords = new Set([
  "a",
  "an",
  "and",
  "as",
  "at",
  "but",
  "by",
  "for",
  "from",
  "in",
  "of",
  "on",
  "or",
  "the",
  "through",
  "to",
  "via",
  "with"
]);

const preserveToken = (word) =>
  /[A-Z].*[A-Z]/.test(word) || /\d/.test(word);

const capitalizeWord = (word) => {
  if (!word) return word;
  if (word.includes("-")) {
    return word
      .split("-")
      .map((part) => capitalizeWord(part))
      .join("-");
  }
  if (preserveToken(word)) return word;
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
};

const titleCase = (title = "") => {
  const words = cleanLatex(title).split(" ");
  let startsSegment = true;

  return words
    .map((word) => {
      const leading = word.match(/^[“"'([{]+/)?.[0] || "";
      const trailing = word.match(/[”"')\]},;:.!?]+$/)?.[0] || "";
      const core = word.slice(leading.length, word.length - trailing.length);
      const lower = core.toLowerCase();
      const shouldLowercase = !startsSegment && smallTitleWords.has(lower);
      const nextStartsSegment = /[:.!?]$/.test(trailing);
      const cased = shouldLowercase ? lower : capitalizeWord(core);

      startsSegment = nextStartsSegment;
      if (!nextStartsSegment) {
        startsSegment = false;
      }

      return `${leading}${cased}${trailing}`;
    })
    .join(" ");
};

const webPath = (path) =>
  `/${path.split("/").map((part) => encodeURIComponent(part)).join("/")}`;

const readText = async (path) => readFile(path, "utf8");
const isThumbnail = (file) =>
  [".jpg", ".jpeg", ".png", ".webp", ".gif"].includes(extname(file).toLowerCase());

const parseBibtex = (bibtex) => {
  const fields = {};
  const fieldPattern = /([A-Za-z][A-Za-z0-9_-]*)\s*=\s*(\{(?:[^{}]|\{[^{}]*\})*\}|"[^"]*"|[^,\n]+)\s*,?/g;
  let match;

  while ((match = fieldPattern.exec(bibtex)) !== null) {
    const key = match[1].toLowerCase();
    let value = match[2].trim();
    if ((value.startsWith("{") && value.endsWith("}")) || (value.startsWith('"') && value.endsWith('"'))) {
      value = value.slice(1, -1);
    }
    fields[key] = cleanLatex(value);
  }

  return fields;
};

const formatAuthor = (author) => {
  const cleaned = cleanLatex(author);
  if (!cleaned.includes(",")) return cleaned;
  const [last, ...rest] = cleaned.split(",").map((part) => part.trim());
  return `${rest.join(" ")} ${last}`.trim();
};

const formatAuthors = (authors = "") =>
  authors
    .split(/\s+and\s+/i)
    .map(formatAuthor)
    .filter(Boolean)
    .join(", ");

const folders = (await readdir(root, { withFileTypes: true }))
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort((a, b) => collator.compare(b, a));

const publications = [];

for (const folder of folders) {
  const folderPath = join(root, folder);
  const [info, bibtex, files] = await Promise.all([
    readText(join(folderPath, "info.txt")),
    readText(join(folderPath, "bibtex.bib")),
    readdir(folderPath)
  ]);

  const [infoYear = "", infoType = "", infoVenue = ""] = info
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const bib = parseBibtex(bibtex);
  const pdf = files
    .filter((file) => extname(file).toLowerCase() === ".pdf")
    .sort((a, b) => collator.compare(a, b))[0];
  const thumbnail = files
    .filter(isThumbnail)
    .sort((a, b) => collator.compare(a, b))[0];

  publications.push({
    title: titleCase(bib.title || folder.replace(/[_-]+/g, " ")),
    authors: formatAuthors(bib.author),
    year: infoYear || bib.year || "",
    venue: infoVenue || bib.journal || bib.booktitle || bib.publisher || "",
    type: infoType || "Publication",
    thumbnail: thumbnail ? webPath(`${root}/${folder}/${thumbnail}`) : "#",
    doi: bib.doi ? `https://doi.org/${bib.doi}` : "#",
    pdf: pdf ? webPath(`${root}/${folder}/${pdf}`) : "#",
    url: !pdf && !bib.doi && bib.url ? bib.url : "#",
    project: "#",
    bibtex: bibtex.trim()
  });
}

const contents = `export const publications = ${JSON.stringify(publications, null, 2)};\n`;
await writeFile(output, contents);

console.log(`Updated ${output} with ${publications.length} publication${publications.length === 1 ? "" : "s"}.`);
