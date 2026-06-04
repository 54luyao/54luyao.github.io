import { readdir, readFile, writeFile } from "node:fs/promises";
import { extname, join } from "node:path";

const root = "teaching";
const output = "data/teaching.js";
const version = "20260604-no-research-card-tags";
const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: "base" });
const imageExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);
const videoExtensions = new Set([".mp4", ".mov", ".webm"]);

const webPath = (path) =>
  `/${path.split("/").map((part) => encodeURIComponent(part)).join("/")}`;

const escapeHtml = (value = "") =>
  value.replace(/[&<>"']/g, (match) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[match]);

const isThumbnail = (file) => /^thumbnail\.(jpe?g|png)$/i.test(file);
const isGalleryMedia = (file) => {
  const extension = extname(file).toLowerCase();
  return !isThumbnail(file) && (imageExtensions.has(extension) || videoExtensions.has(extension));
};

const parseCourseInfo = (text) => {
  const lines = text.split(/\r?\n/);
  const firstLines = lines.map((line) => line.trim()).filter(Boolean).slice(0, 4);
  const studentsMatch = text.match(/Students:\s*([\s\S]*?)(?:\r?\n\s*\r?\n\s*Description:|Description:)/i);
  const descriptionMatch = text.match(/Description:\s*([\s\S]*)/i);

  return {
    semester: firstLines[0] || "",
    institution: firstLines[1] || "",
    courseType: firstLines[2] || "",
    title: firstLines[3] || "",
    students: studentsMatch?.[1].replace(/\s+/g, " ").trim() || "",
    description: descriptionMatch?.[1].trim().split(/\n\s*\n/).map((paragraph) => paragraph.replace(/\s+/g, " ").trim()).filter(Boolean) || []
  };
};

const detailPage = (course, gallery) => `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(course.title)} | Yao Lu</title>
    <meta name="description" content="${escapeHtml(`${course.semester} teaching work: ${course.title}`)}">
    <link rel="stylesheet" href="/styles/site.css?v=${version}">
    <script type="module" src="/scripts/main.js?v=${version}"></script>
  </head>
  <body data-page="teaching">
    <a class="skip-link" href="#main">Skip to content</a>
    <div data-layout></div>
    <main id="main" class="page-shell">
      <section class="container section-tight course-detail-section">
        <article class="course-detail">
          <div>
            <h1>${escapeHtml(course.title)}</h1>
            <dl class="course-info-list">
              <dt>Semester</dt>
              <dd>${escapeHtml(course.semester)}</dd>
              <dt>Institution</dt>
              <dd>${escapeHtml(course.institution)}</dd>
              <dt>Course Type</dt>
              <dd>${escapeHtml(course.courseType)}</dd>
              <dt>Course Name</dt>
              <dd>${escapeHtml(course.title)}</dd>
              <dt>Students</dt>
              <dd>${escapeHtml(course.students)}</dd>
              <dt>Description</dt>
              <dd>
                ${course.description.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("\n                ")}
              </dd>
            </dl>
            <div class="text-links course-detail-links">
              <a href="/teaching/">Back to Teaching</a>
            </div>
          </div>
        </article>
        <div class="course-gallery" aria-label="${escapeHtml(`${course.title} student work`)}">
          ${gallery.map((file, index) => mediaMarkup(course, file, index)).join("\n          ")}
        </div>
      </section>
    </main>
    <div data-footer></div>
  </body>
</html>
`;

const mediaMarkup = (course, file, index) => {
  const src = webPath(`${root}/${course.folder}/${file}`);
  if (videoExtensions.has(extname(file).toLowerCase())) {
    return `<video src="${src}" controls muted playsinline></video>`;
  }
  return `<img src="${src}" alt="${escapeHtml(`${course.title} work ${index + 1}`)}">`;
};

const folders = (await readdir(root, { withFileTypes: true }))
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort((a, b) => collator.compare(b, a));

const courses = [];

for (const folder of folders) {
  const folderPath = join(root, folder);
  const [info, files] = await Promise.all([
    readFile(join(folderPath, "course_info.txt"), "utf8"),
    readdir(folderPath)
  ]);
  const parsed = parseCourseInfo(info);
  const thumbnail = files.find(isThumbnail);
  const gallery = files.filter(isGalleryMedia).sort((a, b) => collator.compare(a, b));
  const course = {
    ...parsed,
    folder,
    slug: folder,
    thumbnail: thumbnail ? webPath(`${root}/${folder}/${thumbnail}`) : "#"
  };

  courses.push(course);
  await writeFile(join(folderPath, "index.html"), detailPage(course, gallery));
  console.log(`Updated ${folderPath}/index.html with ${gallery.length} media item${gallery.length === 1 ? "" : "s"}.`);
}

const data = courses.map(({ folder, ...course }) => course);
await writeFile(output, `export const courses = ${JSON.stringify(data, null, 2)};\nexport const teachingThemes = [];\n`);
console.log(`Updated ${output} with ${courses.length} course${courses.length === 1 ? "" : "s"}.`);
