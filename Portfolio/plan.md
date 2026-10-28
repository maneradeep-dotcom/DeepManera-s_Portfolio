# DeepManera portfolio: implementation and design plan

## Product and delivery
A dependency-free static portfolio for DeepManera, an independent full-stack developer and digital studio. The experience is organized into distinct pages: a cinematic landing page, a project archive, a scrollytelling method page, an interactive lab, pricing/estimate, showcase, privacy and terms. Plain HTML, CSS, vanilla JavaScript and JSON are used; no external fonts, tracking, analytics or new package dependency is required.

## Design system
**Design Movement:** Editorial software studio — Apple-style restraint meets cinematic tech noir, with Swiss typography, bento composition, glass surfaces, gradient light and subtle interactive depth.

**Core Principles:** Make the work legible; use contrast with intent; keep motion explanatory; preserve direct, candid authorship.

**Color Philosophy:** Deep navy-black creates a cinematic stage for warm ivory copy, champagne gold highlights and a restrained lime status color. Light mode inverts the relationship for a paper-like reading experience.

**Layout Paradigm:** Asymmetric editorial columns, bento cards, wide statement breaks, and immersive hero/lab compositions rather than one centered page grid.

**Signature Elements:** DeepManera DM monogram, tracked mono labels, thin rules, orbit/field diagrams, gold edge highlights and quiet status dots.

**Interaction Philosophy:** Navigation, theme, reveal and hover motion are progressive enhancements. Reduced motion leaves all useful content available with no scroll hijacking.

**Typography System:** Georgia/Times for statements and names; system sans for readable UI; system mono for labels, indexing and metadata.

**Brand Essence:** A direct, thoughtful independent practice for people who need useful software, not theatre. Practical, considered, candid.

## Project structure
`index.html` is the cinematic studio home. `work.html` is the archive of selected builds. `method.html` is the process/scrollytelling page. `lab.html` is the experimental motion and interaction page. `pricing.html`, `showcase.html`, `privacy.html` and `terms.html` remain supporting pages. `styles.css` owns the shared design system, responsive layouts and animation states. `app.js` owns navigation, theme switching, reveals, current year and tilt interaction. `manus-routes.json`, `vercel.json`, `robots.txt` support static hosting.
