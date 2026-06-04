import { readdir, readFile, writeFile } from "node:fs/promises";
import { basename, extname, join } from "node:path";

const root = "research";
const output = "data/projects.js";
const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: "base" });
const imageExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);
const videoExtensions = new Set([".mp4", ".mov", ".webm"]);

const webPath = (path) =>
  `/${path.split("/").map((part) => encodeURIComponent(part)).join("/")}`;

const slugify = (value) =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const titleFromFolder = (folder) =>
  folder
    .replace(/^\d+[_ -]*/, "")
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .trim();

const isThumbnail = (file) => /^thumbnail\.(jpe?g|png|webp|gif)$/i.test(file);
const isMedia = (file) => {
  const extension = extname(file).toLowerCase();
  return !isThumbnail(file) && (imageExtensions.has(extension) || videoExtensions.has(extension));
};

const cleanParagraphs = (value = "") =>
  value
    .trim()
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.replace(/\s+/g, " ").trim())
    .filter(Boolean);

const sectionValue = (text, heading) => {
  const pattern = new RegExp(`^${heading}\\s*\\n([\\s\\S]*?)(?=\\n[A-Z][^\\n]{1,48}\\n|$)`, "im");
  return text.match(pattern)?.[1]?.trim() || "";
};

const inlineValue = (text, label) => {
  const pattern = new RegExp(`${label}:\\s*([\\s\\S]*)`, "i");
  return text.match(pattern)?.[1]?.trim() || "";
};

const parseProjectInfo = (text, folder) => {
  const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const projectName = sectionValue(text, "Project Name").split(/\r?\n/)[0]?.trim();
  const year = lines.find((line) => /^\d{4}(?:\s*[-–]\s*(?:\d{4}|present|current))?$/i.test(line)) || "";
  const yearIndex = lines.indexOf(year);
  const institution = yearIndex >= 0 ? lines[yearIndex + 1] || "" : lines[1] || "";
  const description = inlineValue(text, "Description") || sectionValue(text, "Description");
  const team = sectionValue(text, "Team") || sectionValue(text, "Credits");
  const acknowledgements = sectionValue(text, "Acknowledgments") || sectionValue(text, "Acknowledgements") || sectionValue(text, "Project Acknowledgement") || sectionValue(text, "Acknoledgements");
  const awards = sectionValue(text, "Awards");
  const keywords = sectionValue(text, "Keywords");

  return {
    title: projectName || titleFromFolder(folder),
    year,
    institution,
    description: cleanParagraphs(description),
    team: team.replace(/\s+/g, " ").trim(),
    acknowledgements: acknowledgements.replace(/\s+/g, " ").trim(),
    awards: awards.replace(/\s+/g, " ").trim(),
    keywords: keywords.split(",").map((keyword) => keyword.trim()).filter(Boolean)
  };
};

const folders = (await readdir(root, { withFileTypes: true }))
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort((a, b) => collator.compare(b, a));

const projects = [];

for (const folder of folders) {
  const folderPath = join(root, folder);
  const [info, files] = await Promise.all([
    readFile(join(folderPath, "project_info.txt"), "utf8"),
    readdir(folderPath)
  ]);
  const parsed = parseProjectInfo(info, folder);
  const thumbnail = files.find(isThumbnail);
  const media = files
    .filter(isMedia)
    .sort((a, b) => collator.compare(a, b))
    .map((file) => {
      const extension = extname(file).toLowerCase();
      return {
        src: webPath(`${root}/${folder}/${file}`),
        type: videoExtensions.has(extension) ? "video" : "image"
      };
    });
  const description = parsed.description.join(" ");
  const tags = parsed.keywords.length ? parsed.keywords : [parsed.institution].filter(Boolean);

  projects.push({
    slug: slugify(folder),
    folder,
    title: parsed.title,
    year: parsed.year,
    category: parsed.institution || "Research",
    type: "Research",
    tags,
    image: thumbnail ? webPath(`${root}/${folder}/${thumbnail}`) : "#",
    summary: description || `${parsed.title} research project.`,
    abstract: description || `${parsed.title} research project.`,
    collaborators: parsed.team || parsed.institution || "",
    role: "",
    tools: "",
    status: "",
    gallery: media,
    technical: description || "",
    related: [],
    awards: parsed.awards || parsed.acknowledgements || ""
  });
}

await writeFile(output, `export const projects = ${JSON.stringify(projects, null, 2)};\n`);
console.log(`Updated ${output} with ${projects.length} research project${projects.length === 1 ? "" : "s"}.`);
