## Day 2

### Prompt 1

> Here is my portfolio HTML. Don't rewrite it. Just list any semantic HTML or accessibility issues you see — missing alt text, missing labels, skipped heading levels, non-semantic divs where a semantic tag would fit better.

### Response 1

Semantic/accessibility review of `portfolio.html`, organized by category.

**Landmarks**

- No `<main>` element. All the content sections (`home`, `About`, `Education`, `Skills`, `Project`, `Contact`) sit as direct children of `<body>` with no `<main>` wrapper. Screen reader users rely on a `main` landmark (and "skip to content" links) to bypass the header/nav — right now there isn't one to jump to.
- No skip-navigation link before the `<nav>`, so keyboard users have to tab through all 6 nav links before reaching page content.

**Heading hierarchy**

- `h2` → `h4` skip in the About section: `<h2>Full Stack developer and AI Learner</h2>` is followed by two `<h4>Full Stack</h4>` / `<h4>Responsive</h4>`, skipping `h3` entirely.
- Skills section has no headings at all. "Technical Skills" and "Professional Skills" are `<p>` tags, not headings — a screen reader user navigating by heading list won't know this section exists or how it's divided.
- Project titles aren't headings. "Quiz project", "Sample web page", "Shop Expenses web page" are bare text nodes inside `<article>`, not wrapped in `<h3>` (or similar). They won't show up in a heading-based navigation list.
- Contact section has no heading, while About/Education/Projects all use `<h2>`. Inconsistent, and means "Contact" won't appear when navigating by headings.

**Non-semantic / mis-chosen elements**

- `<aside id="Skills">` is the wrong element. Skills are core portfolio content, not tangential/supplementary — this should be a `<section>`.
- Project entries use `<article>` with a stray text node as the "title" and a `<ul>` for body copy — the second `<li>` in each (the long full-stack description) isn't really list content, it reads more like a paragraph forced into a list item.
- The two "Full Stack" / "Responsive" highlight boxes in About are plain nested `<div>`s where something like a `<ul>` of feature items (or at least `<article>`s, since each is a self-contained blurb) would communicate structure better.

**Links / IDs** (breaks in-page navigation, which is also a keyboard-accessibility issue)

- `<a href="#Home">` (nav + logo) doesn't match `id="home"` — case mismatch means the link won't actually scroll/jump to the section for users relying on it (including keyboard-only users using it as an in-page skip target).
- `<a href="#Projects">` doesn't match `id="Project"` (plural vs singular) — same broken-link problem.

**Forms**

- Labels and `for`/`id` pairs are done correctly (`name`, `phone`, `email`, `message`) — this part is solid.
- Layout is done with `<br /><br />` instead of grouping fields semantically (e.g. `<fieldset>`/`<legend>`, or just CSS spacing) — not a hard a11y blocker but a semantic smell, and brittle if a screen reader announces stray line breaks.
- No `<fieldset>`/`<legend>` around the form to give it an accessible group label beyond context.

**Images**

- The one `<img>` (profile photo) does have `alt="Logesh Kannan Profile Picture"` — correctly present. Minor nitpick: alt text conventionally shouldn't include "Picture of/Picture" since AT already announces it as an image, but this isn't a real violation.

**Summary of must-fix items:** wrap content in `<main>`, fix the `#Home`/`home` and `#Projects`/`Project` id mismatches, fix the `h2`→`h4` skip, turn Skills' `<p>` labels and Project titles into real headings, add a heading to Contact, and swap `<aside>` for `<section>` on Skills.

---

### Prompt 2

> fix the code.

### Response 2

Applied fixes to `portfolio.html`:

- Wrapped all content sections in `<main id="main-content">` and added a skip-link before the header.
- Fixed broken anchors: nav/logo now link to `#home` (was `#Home`) and `#Project` (was `#Projects`) to match the actual section ids.
- Fixed heading skip: About's "Full Stack"/"Responsive" cards are now `<h3>` instead of `<h4>` (h2 → h3, no gap).
- Changed `<aside id="Skills">` to `<section id="Skills">` and promoted "Technical Skills"/"Professional Skills" from `<p>` to `<h2>`, since they're core content, not tangential.
- Wrapped each project's bare title text in `<h3>` (Quiz project, Sample web page, Shop Expenses web page) so they're navigable as headings.
- Added a missing `<h2>Contact</h2>` for consistency with the other sections.

Note: added `class="skip-link"` on the skip-to-content link, but there's no stylesheet in the file yet, so it renders as a plain visible link at the very top rather than the usual "hidden until focused" pattern.

Not changed (flagged earlier but stylistic, not semantic bugs): the `<br />`-based form layout and the deeply nested layout `<div>`s in About/Education — those work fine, just aren't maximally semantic, and touching them would mean restructuring layout rather than fixing markup correctness.

---

### Prompt 3

> you will fix the proper md file. and apply this prompt and response in the last.

### Response 3

Rewrote `ai-log.md` to clean up formatting: consistent `### Prompt N` / `### Response N` headers, bullet lists instead of run-on paragraphs, inline code spans (`` `<tag>` ``) around HTML elements/attributes instead of bare angle brackets, and removed leftover raw tool-call artifacts (`Read ...`, `Edit ...`, `Modified`) from the Prompt 2 response. Appended this exchange as Prompt 3/Response 3.

---

### Prompt 4

> fix the readme.md file properly and this prompt and response will update in ai-log.md file .

### Response 4

Rewrote `readme.md` as proper markdown: added a title and `## Day N` headers, and corrected the grammar/typos in each day's entry (e.g. "dispaly" → "displays", "lean" → "learn/learning", "read.md" → `readme.md`) while keeping the original meaning as daily-learning notes. Appended this exchange as Prompt 4/Response 4 here in `ai-log.md`.
