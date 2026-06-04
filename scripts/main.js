import { profile } from "../data/profile.js?v=20260603-bio";
import { projects } from "../data/projects.js?v=20260604-no-research-card-tags";
import { publications } from "../data/publications.js?v=20260603-dissertation";
import { courses, teachingThemes } from "../data/teaching.js?v=20260604-institution";
import { homePhotos as homePhotoItems } from "../data/homePhotos.js?v=20260602";

const navItems = [
  ["Research", "/research/"],
  ["Publications", "/publications/"],
  ["Tools", "/tools/"],
  ["Teaching", "/teaching/"],
  ["About", "/cv/"]
];

const page = document.body.dataset.page;

const escapeHtml = (value = "") =>
  value.replace(/[&<>"']/g, (match) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[match]);

const linkify = (value = "") =>
  escapeHtml(value).replace(
    /(https?:\/\/[^\s]+)/g,
    '<a href="$1">$1</a>'
  );

const profileLink = (link) => `
  <a href="${link.href}">${link.label}</a>
`;

function renderShell() {
  const layoutTarget = document.querySelector("[data-layout]");
  const footerTarget = document.querySelector("[data-footer]");
  const path = window.location.pathname;
  const brandMarkup = `
        <a class="brand" href="/" aria-label="Yao Lu home">
          <span>
            <strong class="brand-name" aria-label="Yao Lu"><span class="brand-name-text">Yao Lu</span></strong>
          </span>
        </a>
  `;

  layoutTarget.innerHTML = `
    <header class="site-header">
      <div class="container nav-shell">
        ${brandMarkup}
        <nav class="site-nav" aria-label="Main navigation">
          ${navItems.map(([label, href]) => `<a href="${href}" ${path.startsWith(href) ? "aria-current=\"page\"" : ""}>${label}</a>`).join("")}
        </nav>
      </div>
    </header>
  `;

  footerTarget.innerHTML = `
    <footer class="site-footer">
      <div class="container footer-grid">
        <div>
          <strong>&copy; ${new Date().getFullYear()} ${profile.name}</strong>
        </div>
        <div class="footer-links">
          <a href="mailto:${profile.email}">${profile.email}</a>
          ${profile.links.slice(0, 4).map(profileLink).join("")}
        </div>
      </div>
    </footer>
  `;
}

function startBrandTyping() {
  const brand = document.querySelector(".brand-name");
  const textTarget = document.querySelector(".brand-name-text");
  if (!brand || !textTarget) return;

  const phrases = [
    { text: "Yao Lu", bold: true, hold: 3500 },
    { text: "Architecture", bold: false, hold: 2000 },
    { text: "Structure", bold: false, hold: 2000 },
    { text: "Computational Geometry", bold: false, hold: 2000 }
  ];

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    brand.classList.add("is-bold");
    textTarget.textContent = "Yao Lu";
    return;
  }

  const wait = (duration) => new Promise((resolve) => window.setTimeout(resolve, duration));

  const run = async () => {
    while (true) {
      for (const phrase of phrases) {
        brand.classList.toggle("is-bold", phrase.bold);
        textTarget.textContent = "";

        for (let index = 1; index <= phrase.text.length; index += 1) {
          textTarget.textContent = phrase.text.slice(0, index);
          await wait(78);
        }

        await wait(phrase.hold);

        for (let index = phrase.text.length - 1; index >= 0; index -= 1) {
          textTarget.textContent = phrase.text.slice(0, index);
          await wait(46);
        }

        await wait(220);
      }
    }
  };

  run();
}

function diagram() {
  const target = document.querySelector("[data-diagram]");
  if (!target) return;
  target.innerHTML = `
    <svg viewBox="0 0 560 430" role="img" aria-label="Polyhedral graphic statics form and force diagram">
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="rgb(172, 5, 33)"/>
        </marker>
      </defs>
      <g font-family="Palatino Linotype, Palatino, serif" font-size="12" fill="#6d716b">
        <text x="54" y="46">form diagram</text>
        <text x="358" y="46">force diagram</text>
      </g>
      <g fill="none" stroke="#1f2421" stroke-width="1.25" opacity=".78">
        <path d="M58 290 C112 198 155 156 218 128 C262 108 300 105 330 116" stroke-dasharray="4 7"/>
        <path d="M76 292 L122 206 L176 164 L238 137 L302 126" />
        <path d="M122 206 L154 292 L176 164 L210 288 L238 137 L266 286 L302 126 L320 276" />
        <path d="M76 292 L154 292 L210 288 L266 286 L320 276" />
        <path d="M102 244 L184 226 L246 212 L312 198" opacity=".36"/>
      </g>
      <g fill="none" stroke="rgb(172, 5, 33)" stroke-width="1.4">
        <path d="M84 292 L112 318 L160 319 L184 292" />
        <path d="M184 292 L214 318 L264 316 L292 286" />
      </g>
      <g fill="#fafaf7" stroke="#1f2421" stroke-width="1.25">
        <circle cx="76" cy="292" r="4"/><circle cx="122" cy="206" r="4"/><circle cx="176" cy="164" r="4"/>
        <circle cx="238" cy="137" r="4"/><circle cx="302" cy="126" r="4"/><circle cx="154" cy="292" r="4"/>
        <circle cx="210" cy="288" r="4"/><circle cx="266" cy="286" r="4"/><circle cx="320" cy="276" r="4"/>
      </g>
      <g fill="none" stroke="rgb(172, 5, 33)" stroke-width="1.5" marker-end="url(#arrow)">
        <path d="M122 206 L122 168" />
        <path d="M176 164 L176 126" />
        <path d="M238 137 L238 99" />
        <path d="M302 126 L302 88" />
      </g>
      <g fill="none" stroke="#1f2421" stroke-width="1.25" opacity=".82">
        <path d="M374 298 L424 252 L476 278 L456 336 L400 344 Z" />
        <path d="M424 252 L456 336 M476 278 L400 344 M374 298 L456 336" />
        <path d="M386 206 L424 252 L476 278 L512 226 L466 182 Z" stroke="rgb(172, 5, 33)"/>
        <path d="M386 206 L476 278 M424 252 L466 182 M512 226 L456 336" stroke-dasharray="5 7" opacity=".55"/>
      </g>
      <g fill="#fafaf7" stroke="#1f2421" stroke-width="1.25">
        <circle cx="374" cy="298" r="4"/><circle cx="424" cy="252" r="4"/><circle cx="476" cy="278" r="4"/>
        <circle cx="456" cy="336" r="4"/><circle cx="400" cy="344" r="4"/><circle cx="386" cy="206" r="4"/>
        <circle cx="512" cy="226" r="4"/><circle cx="466" cy="182" r="4"/>
      </g>
      <g font-family="Palatino Linotype, Palatino, serif" font-size="11" fill="#6d716b">
        <text x="88" y="326">sheet edge</text>
        <text x="216" y="94">loads</text>
        <text x="406" y="366">reciprocal cells</text>
      </g>
    </svg>
  `;
}

function renderHomePhotos() {
  const target = document.querySelector("[data-home-photos]");
  if (!target) return;

  const photos = homePhotoItems;

  if (!photos.length) {
    target.hidden = true;
    return;
  }

  target.innerHTML = `
    <figure class="home-photo-stack">
      ${photos.map((photo, index) => `
        <img
          class="${index === 0 ? "is-active" : ""}"
          src="${photo.src}"
          alt="${photo.alt}"
          ${index === 0 ? "loading=\"eager\"" : "loading=\"lazy\""}
        >
      `).join("")}
      <button class="rotator-arrow rotator-prev" type="button" aria-label="Previous homepage image">‹</button>
      <button class="rotator-arrow rotator-next" type="button" aria-label="Next homepage image">›</button>
      <div class="rotator-dots" aria-label="Homepage image position">
        ${photos.map((photo, index) => `
          <button
            class="${index === 0 ? "is-active" : ""}"
            type="button"
            aria-label="Show homepage image ${index + 1} of ${photos.length}"
            aria-current="${index === 0 ? "true" : "false"}"
          ></button>
        `).join("")}
      </div>
    </figure>
  `;

  const slides = Array.from(target.querySelectorAll("img"));
  const dots = Array.from(target.querySelectorAll(".rotator-dots button"));
  let active = 0;
  let timer;

  const show = (index) => {
    active = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle("is-active", slideIndex === active);
    });
    dots.forEach((dot, dotIndex) => {
      const isActive = dotIndex === active;
      dot.classList.toggle("is-active", isActive);
      dot.setAttribute("aria-current", isActive ? "true" : "false");
    });
  };

  const start = () => {
    timer = window.setInterval(() => show(active + 1), 5000);
  };

  const restart = () => {
    window.clearInterval(timer);
    start();
  };

  target.querySelector(".rotator-prev").addEventListener("click", () => {
    show(active - 1);
    restart();
  });

  target.querySelector(".rotator-next").addEventListener("click", () => {
    show(active + 1);
    restart();
  });

  dots.forEach((dot, dotIndex) => {
    dot.addEventListener("click", () => {
      show(dotIndex);
      restart();
    });
  });

  start();
}

function tagList(tags) {
  return `<div class="tag-list">${tags.map((tag) => `<span>${tag}</span>`).join("")}</div>`;
}

function projectCard(project) {
  return `
    <article class="project-card">
      <a class="image-link" href="/research/detail.html?slug=${project.slug}">
        <img src="${project.image}" alt="${project.title}">
      </a>
      <div class="card-body">
        <div class="meta-row"><span class="project-year">${project.year}</span><span class="meta-separator" aria-hidden="true">/</span><span>${project.category}</span></div>
        <h3><a href="/research/detail.html?slug=${project.slug}">${project.title}</a></h3>
      </div>
    </article>
  `;
}

function mediaItem(item, alt) {
  const src = typeof item === "string" ? item : item.src;
  const type = typeof item === "string" ? "image" : item.type;
  if (type === "video") {
    return `<video src="${src}" controls muted playsinline></video>`;
  }
  return `<img src="${src}" alt="${alt}">`;
}

function lineBreakText(value) {
  return value
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .join("<br>");
}

function publicationItem(pub, index) {
  const links = [
    pub.doi !== "#" ? `<a href="${pub.doi}">DOI</a>` : "",
    pub.pdf !== "#" ? `<a href="${pub.pdf}">PDF</a>` : "",
    pub.url !== "#" ? `<a href="${pub.url}">URL</a>` : "",
    pub.project !== "#" ? `<a href="${pub.project}">Project</a>` : "",
    `<span class="copy-link"><button class="link-button" type="button" data-copy-bib="${index}">BibTeX</button><span class="copy-status" aria-live="polite"></span></span>`
  ].filter(Boolean).join("");
  const thumbnail = pub.thumbnail && pub.thumbnail !== "#"
    ? `<img class="publication-thumb" src="${pub.thumbnail}" alt="${pub.title}">`
    : "";

  return `
    <article class="publication-item">
      ${thumbnail}
      <div class="pub-main">
        <div class="meta-row"><span class="pub-year-inline">${pub.year}</span><span class="meta-separator" aria-hidden="true">/</span><span>${pub.venue}</span></div>
        <h3>${pub.title}</h3>
        <p>${pub.authors}</p>
        <div class="text-links">
          ${links}
        </div>
        <pre class="bibtex" id="bib-${index}">${escapeHtml(pub.bibtex)}</pre>
      </div>
    </article>
  `;
}

function courseCard(course) {
  return `
    <a class="course-card" href="/teaching/${course.slug}/">
      <img src="${course.thumbnail}" alt="${course.title}">
      <div>
        <div class="meta-row"><span class="course-semester">${course.semester}</span><span class="meta-separator" aria-hidden="true">/</span><span class="course-institution">${course.institution}</span></div>
        <h3>${course.title}</h3>
      </div>
    </a>
  `;
}

function renderHome() {
  renderHomePhotos();
  const recentPrototypes = projects
    .filter((project) => (project.tags || []).includes("Physical Prototyping"))
    .sort((a, b) => parseInt(b.year, 10) - parseInt(a.year, 10))
    .slice(0, 5);
  document.querySelector("[data-featured-projects]").innerHTML = recentPrototypes.map(projectCard).join("");
  document.querySelector("[data-selected-publications]").innerHTML = publications.slice(0, 4).map(publicationItem).join("");
  document.querySelector("[data-teaching-preview]").innerHTML = courses.slice(0, 3).map(courseCard).join("");
}

function makeFilters(target, values, onSelect) {
  let current = "All";
  const render = () => {
    target.innerHTML = ["All", ...values].map((value) => `
      <button type="button" class="filter-button" ${value === current ? "aria-pressed=\"true\"" : ""}>${value}</button>
    `).join("");
    target.querySelectorAll("button").forEach((button) => {
      button.addEventListener("click", () => {
        current = button.textContent;
        onSelect(current);
        render();
      });
    });
  };
  render();
}

function renderProjects() {
  const grid = document.querySelector("[data-projects]");
  const filters = document.querySelector("[data-project-filters]");
  const keywords = [...new Set(projects.flatMap((project) => project.tags || []))];
  const draw = (keyword = "All") => {
    const filtered = keyword === "All" ? projects : projects.filter((project) => (project.tags || []).includes(keyword));
    grid.innerHTML = filtered.map(projectCard).join("");
  };
  makeFilters(filters, keywords, draw);
  draw();
}

function renderProjectDetail() {
  const slug = new URLSearchParams(window.location.search).get("slug") || projects[0].slug;
  const project = projects.find((item) => item.slug === slug);
  const target = document.querySelector("[data-project-detail]");
  if (!project) {
    target.innerHTML = `<section class="container page-hero"><h1>Research not found</h1><p><a href="/research/">Return to research</a></p></section>`;
    return;
  }
  document.title = `${project.title} | Yao Lu`;
  target.innerHTML = `
    <section class="container section-tight research-detail-section">
      <article class="research-detail">
        <div>
          <h1>${project.title}</h1>
          <dl class="research-info-list">
            ${project.year ? `<dt>Year</dt><dd>${project.year}</dd>` : ""}
            ${project.category ? `<dt>Institution</dt><dd>${project.category}</dd>` : ""}
            ${project.collaborators ? `<dt>Team</dt><dd>${lineBreakText(project.collaborators)}</dd>` : ""}
            ${project.technical ? `<dt>Description</dt><dd><p>${project.technical}</p></dd>` : ""}
            ${project.awards ? `<dt>Awards</dt><dd>${project.awards}</dd>` : ""}
            ${project.acknowledgements ? `<dt>Acknowledgements</dt><dd>${project.acknowledgements}</dd>` : ""}
          </dl>
          <div class="text-links research-detail-links">
            <a href="/research/">Back to Research</a>
          </div>
        </div>
      </article>
      <div class="research-gallery">${project.gallery.map((item, index) => mediaItem(item, `${project.title} media ${index + 1}`)).join("")}</div>
    </section>
  `;
}

function renderPublications() {
  const list = document.querySelector("[data-publications]");
  const filters = document.querySelector("[data-publication-filters]");
  const types = [...new Set(publications.map((pub) => pub.type))];
  const draw = (type = "All") => {
    const filtered = type === "All" ? publications : publications.filter((pub) => pub.type === type);
    list.innerHTML = filtered.map((pub) => publicationItem(pub, publications.indexOf(pub))).join("");
    wireBibtex();
  };
  makeFilters(filters, types, draw);
  draw();
}

function wireBibtex() {
  document.querySelectorAll("[data-copy-bib]").forEach((button) => {
    button.addEventListener("click", async () => {
      const index = button.dataset.copyBib;
      const status = button.nextElementSibling;
      await copyText(publications[index].bibtex);
      status.textContent = "Copied";
      window.setTimeout(() => (status.textContent = ""), 1400);
    });
  });
}

async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch {
      // Fall through to the textarea copy path for local preview contexts.
    }
  }

  const field = document.createElement("textarea");
  field.value = text;
  field.setAttribute("readonly", "");
  field.style.position = "fixed";
  field.style.top = "-1000px";
  document.body.append(field);
  field.select();
  document.execCommand("copy");
  field.remove();
}

function renderTeaching() {
  const grid = document.querySelector("[data-courses]");
  const filters = document.querySelector("[data-teaching-filters]");
  const courseType = (course) => course.courseType?.includes("Seminar") ? "Seminar" : "Studio";
  const draw = (type = "All") => {
    const filtered = type === "All" ? courses : courses.filter((course) => courseType(course) === type);
    grid.innerHTML = filtered.map(courseCard).join("");
  };

  if (filters) {
    makeFilters(filters, ["Studio", "Seminar"], draw);
  }
  draw();

  const themes = document.querySelector("[data-teaching-themes]");
  if (!themes) return;
  themes.innerHTML = `
    <div class="section-heading compact">
      <p class="eyebrow">Teaching themes</p>
      <h2>Recurring Questions</h2>
    </div>
    <div class="theme-chips">${teachingThemes.map((theme) => `<span>${theme}</span>`).join("")}</div>
  `;
}

function renderCv() {
  const target = document.querySelector("[data-cv]");
  const visibleCvSections = new Set(["Education", "Employment", "Professional Certification"]);
  target.innerHTML = `
    <section class="cv-summary">
      <p class="eyebrow">Last updated ${profile.updated}</p>
      <p>${profile.bio}</p>
      <dl class="cv-contact">
        <dt>Email</dt><dd><a href="mailto:${profile.email}">${profile.email}</a></dd>
        <dt>Institution</dt><dd>${profile.institution}</dd>
        <dt>Address</dt><dd>${profile.address}</dd>
      </dl>
    </section>
    ${profile.cv.filter((section) => visibleCvSections.has(section.heading)).map((section) => `
    <section class="cv-section">
      <h2>${section.heading}</h2>
      ${section.items.map((item) => `
        <article class="cv-item">
          <span>${item.date}</span>
          <div><h3>${item.title}</h3><p>${linkify(item.detail)}</p></div>
        </article>
      `).join("")}
    </section>
  `).join("")}
  `;
}

function renderContact() {
  const target = document.querySelector("[data-contact]");
  target.innerHTML = `
    <section class="contact-card">
      <h2>Contact</h2>
      <dl>
        <dt>Email</dt><dd><a href="mailto:${profile.email}">${profile.email}</a></dd>
        <dt>Institution</dt><dd>${profile.institution}</dd>
        <dt>Location</dt><dd>${profile.location}</dd>
      </dl>
    </section>
    <section class="contact-card">
      <h2>Profiles</h2>
      <div class="profile-links">
        ${profile.links.map(profileLink).join("")}
      </div>
    </section>
  `;
}

renderShell();
startBrandTyping();

const renderers = {
  home: renderHome,
  research: renderProjects,
  "research-detail": renderProjectDetail,
  publications: renderPublications,
  teaching: renderTeaching,
  cv: renderCv,
  contact: renderContact
};

renderers[page]?.();
wireBibtex();
