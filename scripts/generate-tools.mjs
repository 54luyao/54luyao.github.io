import { readdir, writeFile } from "node:fs/promises";
import { extname, join } from "node:path";

const version = "20260604-no-research-card-tags";
const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: "base" });
const imageExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);
const videoExtensions = new Set([".mp4", ".mov", ".webm"]);

const tools = [
  {
    slug: "polyframe-2",
    title: "PolyFrame 2",
    meta: "PolyFrame 2, a Rhino and Grasshopper plugin for polyhedron-based 3D graphic statics.",
    logo: "/tools/logos/polyframe2logov2-12small.png",
    category: "Rhino / Grasshopper",
    developers: "Yao Lu, Andrei Nejur, Mathias Bernhard, Yefan Zhi, Hua Chai, Mostafa Akbari, Márton Hablicsek, Masoud Akbarzadeh",
    year: "2022 - current",
    downloadLabel: "Download PolyFrame 2",
    downloadHref: "https://www.food4rhino.com/en/app/polyframe-2",
    acknowledgement: "This work is funded by the National Science Foundation CAREER Award (NSF CAREER-1944691).",
    description: [
      "PolyFrame 2 is a geometry-based, structural form-finding plugin for Rhinoceros 3D and Grasshopper implementing polyhedron-based 3D graphic statics.",
      "Built upon PolyFrame for Rhino, this new version incorporates a Grasshopper plug-in that not only makes all previous functions available to Grasshopper, but also introduces a variety of new features including tension-compression-combined form-finding, algebraic 3D graphic statics, matrix static and kinematic analysis, scripting interface, built-in examples, and a lot more.",
      "The algebraic approach greatly expands the solution space and allows for flexible manipulations of form and force diagrams based on the geometric degrees of freedom. The matrix analysis tools provide additional methods for evaluating the static and kinematic behaviors of the form-finding results."
    ]
  },
  {
    slug: "earthworms",
    title: "Earthworms",
    meta: "Earthworms, a RhinoPython scripting environment for computational design workflows.",
    logo: "/tools/logos/earthworms-01.png",
    category: "Rhino scripting",
    developers: "Yao Lu, Yang Yang",
    year: "2022",
    downloadLabel: "Download Earthworms",
    downloadHref: "https://www.food4rhino.com/app/earthworms",
    acknowledgement: "This work is supported by Polyhedral Structures Lab at Weitzman School of Design, University of Pennsylvania.",
    description: [
      "Earthworms provides a Python scripting environment with enhanced interactivity and flexibility based on RhinoPython.",
      "The code in Earthworms is organized into cells that can be individually modified and executed. The variables defined and the results produced in previous code cells are inherited by the following cells.",
      "It learns from notebook-style programming interfaces like Jupyter Notebook and Colab, aiming to simplify computational design exploration, multi-stage visualization, and debugging."
    ]
  },
  {
    slug: "polybrick",
    title: "PolyBrick",
    meta: "PolyBrick, a Grasshopper plugin for load-responsive lattice generation.",
    logo: "/tools/logos/polybrick_plugin_1.gif",
    category: "Grasshopper",
    developers: "Yao Lu",
    year: "2019-2020",
    contributors: "Eda Begum Birol",
    acknowledgement: "PolyBrick is an outcome of the PolyBrick 2.0 research project, supervised by Prof. Jenny Sabin.",
    description: [
      "PolyBrick is written in C# and compiled as a Grasshopper plugin. It uses ellipsoid packing as a morphology control method to create load-responsive lattices. Available upon request."
    ]
  }
];

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

const isMedia = (file) => {
  const extension = extname(file).toLowerCase();
  return imageExtensions.has(extension) || videoExtensions.has(extension);
};

const mediaMarkup = (tool, file, index) => {
  const src = `${webPath(`tools/${tool.slug}/${file}`)}?v=${version}`;
  const extension = extname(file).toLowerCase();
  if (videoExtensions.has(extension)) {
    return `<video src="${src}" controls muted playsinline></video>`;
  }
  return `<img src="${src}" alt="${escapeHtml(`${tool.title} demo ${index + 1}`)}">`;
};

const actionRowMarkup = (tool) => {
  if (tool.downloadHref && tool.downloadLabel) {
    return `<dt>Download Link</dt>
              <dd><a href="${tool.downloadHref}">${escapeHtml(tool.downloadLabel)}</a></dd>`;
  }
  if (tool.contributors) {
    return `<dt>Contributors</dt>
              <dd>${escapeHtml(tool.contributors)}</dd>`;
  }
  return "";
};

const pageTemplate = (tool, media) => `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(tool.title)} | Yao Lu</title>
    <meta name="description" content="${escapeHtml(tool.meta)}">
    <link rel="stylesheet" href="/styles/site.css?v=${version}">
    <script type="module" src="/scripts/main.js?v=${version}"></script>
  </head>
  <body data-page="tools">
    <a class="skip-link" href="#main">Skip to content</a>
    <div data-layout></div>
    <main id="main" class="page-shell">
      <section class="container section-tight tool-detail-section">
        <article class="tool-detail">
          <img class="tool-detail-image" src="${tool.logo}?v=${version}" alt="${escapeHtml(`${tool.title} logo`)}">
          <div>
            <p class="eyebrow">${escapeHtml(tool.category)}</p>
            <h1>${escapeHtml(tool.title)}</h1>
            <dl class="tool-info-list">
              <dt>Developers</dt>
              <dd>${escapeHtml(tool.developers)}</dd>
              <dt>Year</dt>
              <dd>${escapeHtml(tool.year)}</dd>
              ${actionRowMarkup(tool)}
              <dt>Acknowledgement</dt>
              <dd>${escapeHtml(tool.acknowledgement)}</dd>
              <dt>Description</dt>
              <dd>
                ${tool.description.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("\n                ")}
              </dd>
            </dl>
            <div class="text-links tool-detail-links">
              <a href="/tools/">Back to Tools</a>
            </div>
          </div>
        </article>
        <div class="tool-demo-gallery" aria-label="${escapeHtml(`${tool.title} demos`)}">
          ${media.map((file, index) => mediaMarkup(tool, file, index)).join("\n          ")}
        </div>
      </section>
    </main>
    <div data-footer></div>
  </body>
</html>
`;

for (const tool of tools) {
  const folder = join("tools", tool.slug);
  const media = (await readdir(folder))
    .filter(isMedia)
    .sort((a, b) => collator.compare(a, b));
  await writeFile(join(folder, "index.html"), pageTemplate(tool, media));
  console.log(`Updated ${folder}/index.html with ${media.length} demo item${media.length === 1 ? "" : "s"}.`);
}
