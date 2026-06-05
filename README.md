# 54luyao.github.io
This is the personal website of Yao Lu.

To update the website, use this from the website root folder:

```bash
node scripts/rebuild-site.mjs
```

That regenerates:

- homepage photos
- research projects
- publications
- tools pages
- teaching/course pages

Then preview locally:

```bash
python3 -m http.server 4173 --bind 127.0.0.1
```

Open:

```text
http://127.0.0.1:4173/
```

For GitHub Pages, after rebuilding:

```bash
git add .
git commit -m "Update website content"
git push origin main
```

Then check the site, and if it looks good, commit and push.
