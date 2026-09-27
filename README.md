# Ilupeju Foursquare Gospel Church — website

A scroll-driven, cinematic one-page site. Next.js 16 · TypeScript · Tailwind CSS 4 · GSAP + ScrollTrigger · Lenis · Motion.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

## Adding the photos

Every photo on the site is a named slot in **`src/content/images.ts`**. All slots are placeholders for now
("Photo coming soon"). To use a photo:

1. Put the file in `public/images/` (e.g. `public/images/hero.jpg`).
2. Set that slot's `src` to `'/images/hero.jpg'`.

Each slot lists the recommended orientation (`shape`) and what works best there (`note`).

## Editing content

Everything else the church may want to change lives in **`src/content/church.ts`**:

| What | Where | Status |
|---|---|---|
| Name, address, phone, email, Facebook | `church` | Verified from the church's Facebook page (facebook.com/foursquareilupeju) |
| Theme — "A New Class of People" | `church.theme` | Provided by the church |
| Service times | `services` | **Not verified — empty.** Add entries; they appear in the Visit section. Until then visitors are asked to call/email. |
| Church-life gallery | `life` | Generic labels (Worship, Prayer, Music…) — rename to the church's real ministries when confirmed. |
| Sermons | `sermons` | **Not verified — empty.** The featured slot links to the Facebook page until real sermons are added. |
| Events | `events` | District Convocation 2026 ("New Height"). Entries with `verified: false` are hidden. |

## Brand assets

- `src/content/emblem.ts` — the official Foursquare emblem (cross, cup, dove, crown),
  traced from the logo on foursquare.org.ng (`scripts/trace-emblem.mjs`) and split into its four symbols for animation.
  Colours (red cross, blue cup, gold dove, purple crown) sampled from the official colour icon.
- `public/brand/foursquare-nigeria-logo-white.png` — official Foursquare Gospel Church in Nigeria logo (foursquare.org.ng).

## Motion

Each section is a pinned, scrubbed GSAP timeline (described at the top of each file in `src/components/`).
Lenis drives smooth scrolling from GSAP's ticker (`SmoothScroll.tsx`); `prefers-reduced-motion` turns it off.

Dev tool: `node scripts/capture.mjs [url] [width] [height]` screenshots the page at scroll steps into `research/qc/`.
