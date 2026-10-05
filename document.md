# PRD — "Ryan George Koickal" Portfolio Website

**Document version:** 1.0
**Target stack:** React 19 (JavaScript, **no TypeScript**), Vite 6, Tailwind CSS (CDN runtime), Framer Motion 12, Recharts 3, Lucide React
**Output:** A pixel-faithful rebuild of the existing site in `/my-portfolio`, converted from `.tsx` → `.jsx` / `.ts` → `.js`

---

## 0. How to read this document

This is an **exhaustive, implementation-ready specification**. Every value here is lifted from the working source and must be reproduced exactly.

**Definition of "done"** = a code agent can build this without reading the original source, and a human diffing the two builds sees no visual or behavioural difference.

### 0.1 Non-negotiable rules

| # | Rule |
|---|---|
| R1 | **JavaScript only.** `.jsx` and `.js` files. No `.ts`, no `.tsx`, no type annotations, no `interface`/`type` declarations, no `as` casts. Delete `tsconfig.json`. |
| R2 | **No component may be visually simplified.** Every animation, easing curve, spring constant, gradient stop, and pixel value in this document is binding. |
| R3 | **Content is data, not decoration.** All copy, project names, dates, URLs, and numbers must match character-for-character (including existing typos — see §1.6). |
| R4 | **No placeholder content.** No Lorem ipsum, no `TODO`, no "Your Name Here". |
| R5 | **Don't "fix" working things.** Some values look wrong (e.g. a CSS var named `--neon-blue` that is gold). Preserve them; comments explain why. |
| R6 | **Performance budget is a requirement**, not an optimisation phase. See §12. |

### 0.2 Known deviations the agent must NOT resolve (see §11.2)

Five certificate images referenced in the data **do not exist on disk**. The site relies on an `onError` fallback to render an elegant placeholder. Preserve this exactly. Do **not** rename, remap, or "helpfully" fix it.

---

## 1. Product overview

### 1.1 What this is

A single-page-application portfolio for **Ryan George Koickal**, a B.Tech CSE student (CGPA 9.21) and Python developer / data scientist based in Kakkanad, Ernakulam, Kerala, India.

The visual concept is **"Chelsea FC matchday"** — deep midnight-blue stadium, gold club accents, pitch-green and Premier-League-purple ambient light, mow-striped turf, floodlight bloom, scoreboard typography, and a particle field that collapses into a rotating 3D football on navigation.

It is deliberately **not** a generic dark portfolio. The football/stadium metaphor is load-bearing and appears in: the loading screen, the page-transition animation, the scroll progress "match clock", the ticket-stub project cards, the perforated scoreboard labels, and the 404 page's retro-Dribbble throwback.

### 1.2 Pages (8 + 404)

| Tab key | Nav label | Component | URL |
|---|---|---|---|
| `home` | Home | `Hero` | `/` |
| `profile` | Profile | `About` | `/profile` |
| `education` | Education | `Education` | `/education` |
| `projects` | Projects | `ProjectList` | `/projects` |
| `certificates` | Certificates | `Certificates` | `/certificates` |
| `achievements` | Achievements | `Achievements` | `/achievements` |
| `experience` | Experience | `Experience` | `/experience` |
| `contact` | Contact | `Footer` | `/contact` |
| `404` | — | `NotFound` | any unrecognised route |

`work` is a legacy alias that resolves to `projects`.

### 1.3 Global chrome (present on all pages except 404)

Rendered as siblings of the routed content, stacked bottom-to-top:

```
z-0    LiquidBackground      fixed pitch + floodlight + ambient gradient field
z-1    InteractiveParticles  fixed <canvas>, pointer-events-none
z-10   main content shell    relative z-10
z-50   Header                fixed top
z-50   AIChat                fixed bottom-right
z-60   ScrollHUD             fixed progress bar + match clock
z-80   GoalNetTransition     transient transition overlay
z-9999 custom cursor         desktop only
z-99999 AppleHelloLoader     transient, first load only
```

### 1.4 Persona / voice

First person, technical, confident-but-not-boastful. Uses `//` code-comment micro-labels above every section heading (e.g. `// Profile • Developer Background`) — this is a core brand device and appears on 6 of 8 pages. Keep it.

### 1.5 Contact details (single source of truth)

| Channel | Value |
|---|---|
| Name | Ryan George Koickal |
| Email | `Rg05.koickal@gmail.com` (capital `R`, capital `g`) |
| Phone | (+91) 9605715441 *(AI knowledge base only, not rendered in UI)* |
| GitHub | https://github.com/ryan1234814/ |
| LinkedIn | https://linkedin.com/in/ryan-george-1a6161283/ |
| LinkedIn certs | https://linkedin.com/in/ryan-george-1a6161283/details/certifications/ |
| HuggingFace | https://huggingface.co/coder1969 |
| Location | Kakkanad, Ernakulam, Kerala, India *(rendered as "Kerala, India" in footers)* |
| BRIKCODE | https://ai.studio/apps/3c9652a3-b4d9-48f8-aa1c-600c66c77716 |
| Year | 2026 |

### 1.6 Intentional typos — DO NOT CORRECT

These are load-bearing for fidelity. The agent must reproduce them exactly:

- `the page you are looking for not avaible!` → `avaible` (NotFound, §9.1)
- `Look like you're lost` → `Look`, not `Looks` (§9.1)
- `IBM - Artificial Intellignece Fundamentals.png` → `Intellignece` (filename on disk, §11.1)
- `// First Team • Matchday Archive` on the Projects page (§5.5)
- CSS comment `--neon-blue: #C8A754; /* Chelsea gold accent (legacy token name kept) */` (§2.3)

---

## 2. Design system

### 2.1 Colour tokens

Define via the Tailwind CDN config in `index.html` (§2.2) and mirror as CSS custom properties.

| Token | Hex | Tailwind name | Used for |
|---|---|---|---|
| Gold (primary accent) | `#C8A754` | `gold` | All accent text, borders, glows, gradients |
| Deep gold | `#a8863d` | `goldDeep` | Hover states on gold buttons |
| Chelsea blue | `#032477` | `chelsea` | Background tint, football panel fill |
| Light Chelsea blue | `#0a3a9e` | `chelseaLight` | Top-left ambient glow, football stroke |
| Pitch green | `#1b7a3d` | `pitch` | Bottom-right ambient glow, scroll bar start |
| PL purple | `#38003c` | `plPurple` | Centre ambient glow |
| PL lime | `#dbe4ff` | `plLime` | Floodlight glow, pitch markings |
| Stage black | `#03060f` | — | LiquidBackground base, loader bg, match-clock chip, ticket notches |
| Body black | `#050505` | — | `body` background |
| White | `#ffffff` | — | Primary text, particles, football body |

**Neutrals used:** `text-white`, `text-neutral-200`, `text-neutral-300`, `text-neutral-400`, `text-neutral-500`, `text-neutral-600`, `text-neutral-700`(unused), plus alpha variants `border-white/5`, `/10`, `/15`, `/20`.

> **Convention:** gold is always `#C8A754` written as a literal hex in Tailwind classes, **not** as a `gold-*` class. Keep the literal. It matters because several places need arbitrary alpha (`text-[#C8A754]/80`, `border-[#C8A754]/30`) which token classes can't express.

### 2.2 Tailwind setup (CDN — keep this, do not migrate to a build plugin)

In `index.html`, **before** any component mounts:

```html
<script src="https://cdn.tailwindcss.com"></script>
<script>
  tailwind.config = {
    theme: {
      extend: {
        colors: {
          chelsea:      '#032477',
          chelseaLight: '#0a3a9e',
          gold:         '#C8A754',
          goldDeep:     '#a8863d',
          pitch:        '#1b7a3d',
          plPurple:     '#38003c',
          plLime:       '#dbe4ff',
        },
      },
    },
  };
</script>
```

`pitch`, `plPurple`, `plLime` are consumed via class names (`from-pitch`, `border-plLime/20`). `gold`/`goldDeep`/`chelsea`/`chelseaLight` are available but the UI uses literal hexes; keep the config entries so nothing breaks.

### 2.3 Fonts

Load via Google Fonts (exact URL, one `<link>`):

```
https://fonts.googleapis.com/css2?family=Arvo:wght@400;700&family=Caveat:wght@400;600;700&family=Great+Vibes&family=Inter:wght@300;400;500;600&family=Manrope:wght@200;300;400;500;600;700;800&family=Oswald:wght@400;500;700&family=Poppins:wght@400;500;600;700;800;900&display=swap
```

| Family | Weights | Where used |
|---|---|---|
| `Manrope` | 200–800 | `body` default; UI copy |
| `Oswald` | 400–700 | `.font-oswald` — hero name, stat numbers, match clock, loader |
| `Poppins` | 400–900 | `.font-poppins` — menu items, role titles, CTA buttons, education titles |
| `Arvo` | 400, 700 | 404 page only |

`Caveat`, `Great Vibes`, and `Inter` are **loaded but unused**. Keep them in the `<link>` — removing them changes nothing visually and the original loads them.

```css
body {
  font-family: 'Manrope', sans-serif;
  background-color: #050505;
  color: #ffffff;
  overflow-x: hidden;
}
.font-oswald  { font-family: 'Oswald', sans-serif; }
.font-poppins { font-family: 'Poppins', sans-serif; }
```

> The AI thinking pill (§7.5) uses a **hardcoded stack**, not a class:
> `'-apple-system, BlinkMacSystemFont, "SF Pro Rounded", "SF Pro Display", "SF Pro Text", "Manrope", sans-serif'`

### 2.4 Global CSS — copy verbatim into `index.html`'s `<style>`

```css
:root {
  --neon-blue: #C8A754; /* Chelsea gold accent (legacy token name kept) */
  --chelsea-blue: #032477;
  --chelsea-blue-light: #0a3a9e;
  --matchday-gold: #C8A754;
  --pitch-green: #1b7a3d;
  --pl-purple: #38003c;
}

::selection {
  background-color: rgba(200, 167, 84, 0.3);
  color: #fff;
}

/* Kill black tap-highlight boxes and focus outlines on mobile */
*, *::before, *::after { -webkit-tap-highlight-color: transparent !important; }

button, a, input, textarea, select, [role="button"] {
  -webkit-tap-highlight-color: transparent !important;
  outline: none !important;
}
button:focus, button:active, button:focus-visible {
  outline: none !important;
  box-shadow: none !important;
}
```

**Custom cursor (desktop only).** This hides the native cursor and replaces it with the gold droplet in §3.4. Critical: the native cursor is hidden *globally*, so the replacement is not optional.

```css
@media (hover: hover) and (pointer: fine) {
  html, body, *, a, button, input, textarea, .hover-target {
    cursor: none !important;
  }
}
```

**Stadium texture utilities.**

```css
/* Mow-line stripes: alternating pitch-green / chelsea-blue bands, 80px each */
.pitch-stripes {
  background-image: repeating-linear-gradient(
    90deg,
    rgba(27, 122, 61, 0.05) 0px,
    rgba(27, 122, 61, 0.05) 80px,
    rgba(3, 36, 119, 0.05) 80px,
    rgba(3, 36, 119, 0.05) 160px
  );
}

/* Floodlight pooling from the two top corners of the stand */
.floodlight-glow {
  background:
    radial-gradient(60% 40% at 12% 0%, rgba(219, 228, 255, 0.08) 0%, rgba(219, 228, 255, 0) 70%),
    radial-gradient(60% 40% at 88% 0%, rgba(219, 228, 255, 0.08) 0%, rgba(219, 228, 255, 0) 70%);
}

/* Ticket-stub notch: 20px gold-rimmed perforation on the left edge */
.ticket-stub { position: relative; }
.ticket-stub::before,
.ticket-stub::after {
  content: '';
  position: absolute;
  left: -10px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #03060f;
  box-shadow: inset 0 0 0 1.5px rgba(200, 167, 84, 0.35);
}
.ticket-stub::before { top: 24%; }
.ticket-stub::after  { bottom: 24%; }

/* Scoreboard micro-label */
.scoreboard-label {
  font-family: 'Oswald', sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.28em;
}
```

**Liquid-glass text** (used on every section `<h2>` and the hero name):

```css
.liquid-glass-text {
  color: rgba(255, 255, 255, 0.1);
  background: linear-gradient(
    135deg,
    rgba(255,255,255,0.92) 0%,
    rgba(255,255,255,0.42) 25%,
    #C8A754 50%,
    rgba(255,255,255,0.42) 75%,
    rgba(255,255,255,0.92) 100%
  );
  background-size: 200% 200%;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: glass-shine 4s ease-in-out infinite;
}
@keyframes glass-shine {
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
.liquid-hover { transform: translateZ(0); }
```

**Gold droplet cursor** — dark surfaces:

```css
.glass-cursor {
  background: transparent;
  border: 1px solid rgba(200, 167, 84, 0.45);
  box-shadow:
    inset 1px 1px 1.5px rgba(255, 255, 255, 0.7),
    0 0 4px rgba(200, 167, 84, 0.25);
  border-radius: 50%;
  pointer-events: none;
  z-index: 9999;
  will-change: transform;
}
```

**Blue droplet cursor** — 404 page only (white background, needs contrast):

```css
.glass-cursor-dark {
  background: rgba(2, 102, 200, 0.14);
  border: 1.5px solid rgba(3, 105, 161, 0.88);
  box-shadow:
    inset 1px 1px 1.5px rgba(255, 255, 255, 0.85),
    inset -1px -1px 2px rgba(3, 105, 161, 0.35),
    0 2px 6px rgba(2, 102, 200, 0.35);
  border-radius: 50%;
  pointer-events: none;
  z-index: 9999;
  will-change: transform;
}
```

**Liquid-glass button** (AI chat FAB, "View On LinkedIn"):

```css
.liquid-glass-button {
  background: rgba(8, 12, 18, 0.78);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow:
    inset 0 0 10px rgba(255, 255, 255, 0.04),
    0 6px 20px rgba(0, 0, 0, 0.4);
  color: #C8A754;
  transition: background 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease, color 0.25s ease;
}
.liquid-glass-button:hover {
  background: rgba(14, 22, 32, 0.88);
  box-shadow:
    inset 0 0 14px rgba(255, 255, 255, 0.08),
    0 0 18px rgba(200, 167, 84, 0.35);
  border-color: rgba(200, 167, 84, 0.4);
  color: #fff;
}
```

### 2.5 Motion vocabulary

Standard easings used throughout — do not substitute:

| Name | Cubic bezier | Typical use |
|---|---|---|
| **Expo out** | `[0.16, 1, 0.3, 1]` | Default entrance easing |
| **Smooth out** | `[0.22, 1, 0.36, 1]` | Loader exit |
| **Inertia tumbler** | `[0.12, 0.95, 0.22, 1]` | Stat digit rollers |
| **Pen** | `[0.38, 0.04, 0.22, 1]` | Loader handwriting |

Default page-body transition: `duration: 0.28, ease: 'easeOut'`, `initial={{ opacity: 0, y: 12 }}`, `exit={{ opacity: 0, y: -12, transition: { duration: 0.16 } }}`.

### 2.6 Shared section layout

Six of eight pages (`About`, `Education`, `Experience`, `Achievements`, `Certificates`, `ProjectList`) use an identical shell:

```
className="pt-36 pb-24 px-6 md:px-12 bg-transparent relative z-10 min-h-screen flex flex-col justify-between"
  inner: className="max-w-[90vw] mx-auto w-full"
  footer: className="max-w-[90vw] mx-auto w-full mt-20 pt-8 border-t border-neutral-900
                   flex justify-between items-center text-xs font-mono text-neutral-600"
```

Per-page footer text (all `© 2026 Ryan George` on the left):

| Page | Right-hand text |
|---|---|
| Profile | `Kerala, India` |
| Education | `Rajagiri School of Engineering & Technology • CSE` |
| Experience | `Python Developer & Data Scientist` |
| Achievements | `Milestones & Honors` |
| Certificates | `Accreditations & Verifications` |
| Projects | `More Works Loading` |

### 2.7 Section header pattern

```jsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8 }}
  className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 border-b border-neutral-800 pb-8"
>
  <div>
    <span className="block text-xs font-mono font-bold uppercase tracking-widest text-[#C8A754] mb-4 flex items-center gap-2">
      <Icon size={14} className="text-[#C8A754]" />
      // Section Label &bull; Sub Label
    </span>
    <h2 className="liquid-glass-text text-5xl md:text-8xl font-bold uppercase tracking-tighter">
      Big<br/>Title
    </h2>
  </div>
  <div className="text-left md:text-right">…meta…</div>
</motion.div>
```

**Margin variants — do not normalise these.** `Education`, `Experience` and `Certificates` use this stacked header with `mb-16`; `Certificates` alone drops to `mb-12` because it carries an extra CTA button. `Projects` and `Achievements` use a different, simpler header entirely (`flex items-end justify-between`, no `gap-6`, meta column `hidden md:block`) — see the callout in §5.5. `About`/`Profile` does not use this pattern at all: it has no bottom rule and no meta column.

---

## 3. App shell

### 3.1 Routing (no react-router — hand-rolled History API)

All navigation uses `history.pushState` / `replaceState` + a `popstate` listener. **Do not add react-router.**

**Valid tabs array:**
```js
['home','profile','experience','education','projects','achievements','certificates','contact']
```

**Known repo bases:** `['my-portfolio', 'portfolio']` — used to detect GitHub Pages sub-path hosting.

**`getBasePath()`** — returns `'/'` unless the first path segment matches a known repo base (case-insensitive), in which case `'/${segments[0]}/'`.

**`getPageUrl(page)`** — `base` for `home`, otherwise `` `${base}${page}` ``. Note: **no trailing slash** on sub-pages, and **no `#` fragment** anywhere.

**`resolveCurrentPage()`** — three-tier resolution, in order:

1. **Query param.** Read `?page=` then `?tab=` (case-insensitive).
   - valid tab → that tab
   - `work` → `projects`
   - anything else → `404`
2. **Legacy hash.** `location.hash` minus `#`, minus leading slashes, lowercased.
   - Same valid/`work`/else-`404` logic.
3. **Pathname.** Strip the repo-base prefix, drop `index.html` segments.
   - 0 segments → `home`
   - 1 segment: valid tab → tab; `work` → `projects`
   - otherwise → `404`

**Initial-mount normalisation.** On first render, if the resolved page is not `404`, compute `getPageUrl(initialPage)` and, if the current URL had a hash, a query string, or a different pathname, call:
```js
window.history.replaceState({ page: initialPage }, '', targetUrl);
```
This converts legacy `/#projects` and `/?page=projects` into clean `/projects`.

**Load/ready flags:**
```js
const [isLoading, setIsLoading]         = useState(() => resolveCurrentPage() !== '404');
const [isContentReady, setIsContentReady] = useState(() => resolveCurrentPage() === '404');
```
→ The Apple loader **never runs on the 404 page**. Content is immediately ready there.

### 3.2 Tab transition choreography

State:
```js
const [activePage, setActivePage]             = useState<PageTab>(initial);
const [sphereTransitionId, setSphereTransitionId] = useState(0);
const [transitionDirection, setTransitionDirection] = useState<'left' | 'right'>('left');
const [transitionLabel, setTransitionLabel]   = useState('');
const [isTabTransitioning, setIsTabTransitioning] = useState(false);
```

`triggerTabTransition(page, updateHistory = true, fromMobilePull = false)`:

1. `cursorScale.set(1)`; close certificate modal.
2. If `updateHistory`: push `getPageUrl(page)` when pathname differs or a hash is present.
3. `window.scrollTo({ top: 0, behavior: 'smooth' })`.
4. **Early exit:** if `page === activePage && !isTabTransitioning && !fromMobilePull` → reset mobile pull visuals, return.
5. **`404`:** clear any pending timer, reset pull visuals, `setIsTabTransitioning(false)`, `setActivePage('404')`, return. (No sphere animation for 404.)
6. Compute direction from tab order:
   ```js
   const fromIdx = TAB_SEQUENCE.indexOf(activePage);
   const toIdx   = TAB_SEQUENCE.indexOf(page);
   setTransitionDirection(toIdx >= fromIdx || fromIdx === -1 ? 'left' : 'right');
   ```
   **Forward navigation → `'left'`** (ball rolls in from the left edge). Backward → `'right'`.
7. `setTransitionLabel(TAB_LABELS[page])`; `setActivePage(page)` **immediately** (so the header pill updates during the animation); `setIsTabTransitioning(true)`; `sphereTransitionId++`; reset pull visuals.
8. Schedule reveal:
   ```js
   const revealDelayMs = fromMobilePull ? 880 : 1460;
   tabTransitionTimerRef.current = window.setTimeout(() => {
     setIsTabTransitioning(false);
     tabTransitionTimerRef.current = null;
   }, revealDelayMs);
   ```

**Tab sequence** (drives direction and mobile "next"):
```
home → profile → education → projects → certificates → achievements → experience → contact → (wrap to home)
```

**Tab labels:** `home→Home, profile→Profile, education→Education, projects→Projects, certificates→Certificates, achievements→Achievements, experience→Experience, contact→Contact`

**Content gating.** Every page block renders only when `isContentReady && !isTabTransitioning && activePage === '<key>'`, wrapped in `<AnimatePresence mode="wait">` with `key` = the tab. Because `isTabTransitioning` is true during the whole 1460 ms, the outgoing page is removed immediately and the incoming one mounts after — this is what hides the hard swap behind the particle sphere.

**`popstate`** re-runs `resolveCurrentPage()` → `triggerTabTransition(page, false, false)`.

### 3.3 Mobile pull-to-sphere gesture (bottom overscroll)

Bypasses the menu: pull past the page bottom to advance to the next tab, with the particles forming a sphere live under your finger.

**Eligibility guards** (bail immediately if any is true):
`isLoading`, `isTabTransitioning`, certificate modal open, `activePage === '404'`, `e.touches.length !== 1`, or the touch originated inside an element matching `.closest('.overflow-y-auto')` (so the AI chat panel and open menu stay scrollable).

**At-bottom test** (10 px tolerance):
```js
const scrollEl = document.scrollingElement || document.documentElement;
const maxScroll = Math.max(0, scrollEl.scrollHeight - window.innerHeight);
return window.scrollY >= maxScroll - 10;
```

**Anchoring.** On `touchstart` at the bottom, record `bottomAnchorY = touches[0].clientY`. If the user reaches the bottom *mid-drag*, anchor at that moment instead. If the page leaves the bottom, reset.

**Progress maths:**
```js
const pullPixels      = Math.max(0, bottomAnchorY - currentY);
const DEADZONE_PX     = 20;
const FULL_SPHERE_PULL_PX = 155;
const progress = Math.min(1, (pullPixels - DEADZONE_PX) / FULL_SPHERE_PULL_PX);
```
0 px–20 px is a deadzone (progress snaps to 0). 175 px total pull = 100%.

**Visual response** (direct DOM writes via refs — no React state, to stay at 60 fps):

*Main content* (`mainContentRef`):
```js
contentOpacity = Math.max(0.08, 1 - progress * 0.88);
contentScale   = 1 - progress * 0.04;
mainContentRef.current.style.opacity = contentOpacity.toFixed(3);
mainContentRef.current.style.transform = `scale(${contentScale.toFixed(3)})`;
```
Below `progress <= 0.01` → clear both inline styles.

*Pull pill* (`pullIndicatorRef` / `pullLabelRef`), shown above `progress > 0.04`:
```js
opacity   = Math.min(1, progress * 1.6);
transform = `translate(-50%, ${Math.round((1 - progress) * 14)}px)`;
isReady   = progress >= 0.92;
borderColor = isReady ? 'rgba(200,167,84,0.85)' : 'rgba(200,167,84,0.3)';
boxShadow   = isReady ? '0 0 20px rgba(200,167,84,0.45)' : '0 4px 16px rgba(0,0,0,0.5)';
labelRef.textContent = isReady
  ? `Release to kick off ${nextLabel} ⚽`
  : `Scroll down for ${nextLabel} • ${Math.round(progress * 100)}%`;
```
Else → `opacity: '0'`, `transform: 'translate(-50%, 16px)'`.

Pill shell classes:
```
fixed bottom-6 left-1/2 z-50 px-4 py-2 rounded-full bg-black/85 backdrop-blur-md
border border-[#C8A754]/30 text-[#C8A754] text-xs font-mono uppercase tracking-widest
pointer-events-none select-none transition-opacity duration-150
```
Inline defaults: `opacity: 0`, `transform: translate(-50%, 16px)`.

**Release.** On `touchend` / `touchcancel`:
- `progress >= 0.92` → `triggerTabTransition(nextTab, true, /*fromMobilePull*/ true)`
- else → snap visuals back to 0

All four listeners are registered `{ passive: true }`.

### 3.4 Custom cursor (desktop only)

Guarded by `window.matchMedia('(hover: hover) and (pointer: fine)')`. If it doesn't match, **no listeners are attached at all** (touch devices keep their native behaviour — note the native cursor is only hidden by the same media query in CSS).

```js
const mouseX = useMotionValue(-100);
const mouseY = useMotionValue(-100);
const cursorX = useSpring(mouseX, { stiffness: 850, damping: 45, mass: 0.1 });
const cursorY = useSpring(mouseY, { stiffness: 850, damping: 45, mass: 0.1 });
const cursorScale = useSpring(1, { stiffness: 350, damping: 25 });
```

**Very high stiffness + tiny mass on purpose** — this gives silky 60/120 fps motion with no visible trailing lag.

Position offset: `mouseX.set(e.clientX - 10)` — compensates the 20 px (w-5) dot.

Hover detection — `isHoverable(target)` returns true when `target.closest('a, button, input, textarea, select, [role="button"], .cursor-pointer')`:
- `mouseover` on hoverable → `cursorScale.set(1.8)`
- `mouseout` where `!e.relatedTarget || !isHoverable(e.relatedTarget)` → `cursorScale.set(1)`
- `pointerdown` → `cursorScale.set(1)`
- On every page change → `cursorScale.set(1)`

Element:
```jsx
<motion.div
  className="glass-cursor fixed top-0 left-0 w-5 h-5 rounded-full pointer-events-none z-[9999] hidden md:block"
  style={{ x: cursorX, y: cursorY, scale: cursorScale }}
/>
```
`hidden md:block` means it's inert below 768 px *and* the media-query CSS keeps the native cursor visible there.

**404 variant** uses `glass-cursor-dark` (blue) because the 404 background is white.

### 3.5 Content shell

```jsx
<div className="relative z-10 md:cursor-none min-h-screen flex flex-col justify-between">
  <Header activePage onNavigate isHidden={isCertificateModalOpen}
          isTabLoaded={isContentReady && !isTabTransitioning} />
  <main ref={mainContentRef}
        className="flex-grow transition-transform duration-75 origin-center">
    …AnimatePresence…
  </main>
  <AIChat />
</div>
```

---

## 4. LiquidBackground (fixed stadium)

```jsx
<div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-[#03060f]"
     style={{ transform: 'translateZ(0)' }}>
```

Layers, in paint order (first = bottom):

| # | Layer | Spec |
|---|---|---|
| 1 | Mow-stripes | `.pitch-stripes absolute inset-0` — §2.4 |
| 2 | Floodlight | `.floodlight-glow absolute inset-0` — §2.4 |
| 3 | Halfway line | `absolute inset-0 opacity-[0.05]`, `backgroundImage: linear-gradient(to bottom, transparent calc(50% - 0.5px), rgba(219,228,255,0.9) 50%, transparent calc(50% + 0.5px))` |
| 4 | Centre circle | `absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[42vmin] h-[42vmin] rounded-full border border-plLime/20 opacity-[0.06]` |
| 5 | Static grid | `absolute inset-0 opacity-[0.025] z-10`; `linear-gradient(to right, #C8A754 1px, transparent 1px), linear-gradient(to bottom, #C8A754 1px, transparent 1px)`; `backgroundSize: '8vw 8vw'` |
| 6 | Top-left blue glow | `absolute top-[-18%] left-[-15%] w-[75vw] h-[75vw] md:w-[60vw] md:h-[60vw] rounded-full`; radial `rgba(10,58,158,0.34) 0% → rgba(3,36,119,0.14) 42% → rgba(3,36,119,0) 70%`; `translate3d(0,0,0)` |
| 7 | Bottom-right green glow | `absolute bottom-[-22%] right-[-15%] w-[85vw] h-[85vw] md:w-[68vw] md:h-[68vw]`; radial `rgba(27,122,61,0.22) 0% → rgba(27,122,61,0.07) 45% → transparent 70%`; `translate3d(0,0,0)` |
| 8 | Centre purple glow | `absolute top-[28%] left-[25%] w-[60vw] h-[60vw] md:w-[48vw] md:h-[48vw]`; radial `rgba(56,0,60,0.28) 0% → rgba(56,0,60,0.08) 45% → transparent 68%`; `translate3d(0,0,0)` |

All glows are **native radial gradients, never `blur-3xl`** — this is deliberate (zero Gaussian-blur shader load). All are `pointer-events-none`.

---

## 5. Page components

### 5.1 Header

```jsx
<motion.header
  initial={{ y: -100, opacity: 0 }}
  animate={{
    y: isHidden ? -100 : 0,
    opacity: isHidden ? 0 : 1,
    pointerEvents: isHidden ? 'none' : 'auto',
  }}
  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
  className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-5
              md:px-12 md:py-6 text-[#C8A754] transition-colors duration-300 ${
                menuOpen
                  ? 'bg-transparent border-transparent'
                  : 'bg-black/40 backdrop-blur-md border-b border-white/5'
              }`}
>
```

Slides up and away when the certificate lightbox opens (`isHidden`).

**Brand button** (left) — two stacked lines, `leading-none`:
```jsx
<button onClick={() => handleNav('home')}
  className="text-md font-bold tracking-tighter uppercase flex flex-col leading-none text-left
             cursor-pointer hover:opacity-80 transition-opacity z-50 bg-transparent outline-none
             focus:outline-none select-none"
  style={{ WebkitTapHighlightColor: 'transparent', outline: 'none' }}>
  <span className="text-[#C8A754]">Ryan</span>
  <span className="text-white">George</span>
</button>
```
Note: `text-md` is **not** a real Tailwind class (no-op) — reproduce it anyway.

**Active-tab pill** (absolutely centred):
```jsx
<div className="flex absolute left-1/2 -translate-x-1/2 items-center pointer-events-none">
```
Rendered when `!menuOpen && activePage !== '404' && activePage !== 'home' && isTabLoaded`:
```jsx
<motion.div
  key={activePage}
  initial={{ opacity: 0, scale: 0.9, y: -4 }}
  animate={{ opacity: 1, scale: 1, y: 0 }}
  exit={{ opacity: 0, scale: 0.9, y: 4 }}
  transition={{ duration: 0.25, ease: 'easeOut' }}
  className="flex items-center justify-center px-4 py-1 md:py-1.5 rounded-full text-[11px] md:text-xs
             font-bold uppercase tracking-widest text-[#C8A754] bg-[#C8A754]/10
             shadow-[0_0_15px_rgba(200,167,84,0.25)] border border-[#C8A754]/30
             backdrop-blur-md pointer-events-auto">
  <span className="inline-block text-center">{activeLabel}</span>
</motion.div>
```
`isTabLoaded` gates it so the pill appears only *after* the sphere animation finishes.

**Hamburger → interlaced X** (right). Three `<motion.line>` in a `24×24` `viewBox`, `strokeWidth="2.2"`, `strokeLinecap="round"`, transition `duration: 0.22, ease: [0.16, 1, 0.3, 1]`:

| Line | Closed (hamburger) | Open (interlaced X) |
|---|---|---|
| top | `x1:3.5 y1:6.5  x2:20.5 y2:6.5` | `x1:4.5 y1:4.5   x2:9.5  y2:9.5` |
| mid | `x1:3.5 y1:12   x2:20.5 y2:12` | `x1:4.5 y1:19.5 x2:19.5 y2:4.5` |
| bot | `x1:3.5 y1:17.5 x2:20.5 y2:17.5` | `x1:14.5 y1:14.5 x2:19.5 y2:19.5` |

Open state also sets `stroke: '#C8A754'`; closed uses `currentColor`.
SVG class: `` `w-6 h-6 transition-all duration-300 ${menuOpen ? 'text-[#C8A754] drop-shadow-[0_0_8px_rgba(200,167,84,0.7)]' : 'text-white group-hover:text-[#C8A754]'}` ``

Button shell:
```
relative z-50 flex items-center justify-center w-11 h-11 md:w-12 md:h-12 rounded-full
bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#C8A754]/40
shadow-lg cursor-pointer transition-all duration-300 group outline-none focus:outline-none
```
with `whileTap={{ scale: 0.94 }}`, `aria-label` = "Close navigation menu" / "Open navigation menu".

**Fullscreen overlay menu** (`AnimatePresence`, 0.2 s opacity fade):
```
fixed inset-0 z-40 bg-black/95 md:bg-black/90 backdrop-blur-md md:backdrop-blur-xl
flex flex-col justify-between px-8 md:px-20 pt-28 pb-12 overflow-y-auto
style={{ backgroundColor: 'rgba(8,10,15,0.96)', willChange: 'opacity', transform: 'translateZ(0)' }}
```
Click on the backdrop itself (`e.target === e.currentTarget`) closes it. Escape key closes it.

Ambient glows (radial gradients, no blur filters):
- top-right: `w-96 h-96`, `opacity-40 md:opacity-60`, `radial-gradient(circle, rgba(200,167,84,0.12) 0%, rgba(200,167,84,0) 70%)`
- bottom-left: `w-80 h-80`, `opacity-30 md:opacity-50`, `radial-gradient(circle, rgba(200,167,84,0.08) 0%, rgba(200,167,84,0) 70%)`

Nav list wrapper: `relative z-10 my-auto py-6 max-w-4xl`, `<ul className="space-y-4 md:space-y-6">`

Each `<motion.li>`: `initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.22, delay: idx * 0.02, ease: [0.16,1,0.3,1] }}`

Each item button:
```jsx
<button className={`group flex items-baseline gap-4 md:gap-8 text-left cursor-pointer transition-all
  duration-300 w-full py-1 bg-transparent hover:bg-transparent active:bg-transparent
  focus:bg-transparent outline-none focus:outline-none focus:ring-0 select-none
  ${isActive ? 'text-[#C8A754]' : 'text-neutral-400 hover:text-white'}`}
  style={{ WebkitTapHighlightColor: 'transparent', outline: 'none', backgroundColor: 'transparent' }}>
  <span className="font-mono text-xs md:text-sm text-neutral-600 group-hover:text-[#C8A754]
                   transition-colors select-none bg-transparent">
    {String(idx + 1).padStart(2, '0')} //
  </span>
  <span className="text-3xl sm:text-4xl md:text-6xl font-bold uppercase tracking-tight font-poppins
                   group-hover:translate-x-3 md:group-hover:translate-x-4 transition-transform
                   duration-300 flex items-center gap-4 select-none bg-transparent">
    {item.label}
    {isActive && <span className="w-2.5 h-2.5 md:w-3.5 md:h-3.5 rounded-full bg-[#C8A754]
                                 shadow-[0_0_15px_#C8A754]" />}
  </span>
</button>
```

Menu footer: `initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18, duration: 0.2 }}`
```
relative z-10 pt-8 border-t border-white/10 flex justify-between items-center text-xs font-mono text-neutral-400
  left:  <span className="text-white font-semibold">Ryan George</span> &bull; Kerala, India
  right: Portfolio &bull; 2026
```

### 5.2 Hero (home)

```
<section className="min-h-screen flex flex-col justify-between px-6 md:px-12 pt-6 pb-12
                    bg-transparent relative overflow-hidden">
```
Uses `useScroll({ target: containerRef, offset: ['start start', 'end start'] })` for parallax.

**Badge row** — `mt-[90px] md:mt-28`, motion `y: badgeY, opacity: badgeOpacity`:
```
flex items-center gap-3 mb-2
  ● <span className="w-2 h-2 rounded-full bg-[#C8A754] animate-pulse" />
  <p className="text-xs md:text-sm font-mono uppercase tracking-widest text-neutral-400">
    Python Developer &amp; Data Scientist &bull; 2026
  </p>
  <span className="scoreboard-label text-[10px] md:text-xs text-[#C8A754]/80
                   border border-[#C8A754]/30 rounded-full px-2.5 py-0.5 hidden sm:inline-block">
    Pride of London
  </span>
```
Entrance: `{ opacity: 0, y: 14 } → { opacity: 1, y: 0 }`, `duration 0.55`, no delay.

**Name block** — wrapper `w-full relative z-10 my-auto py-6`.

Line 1 "Ryan":
```jsx
<motion.h1
  style={{ x: davidX, y: davidY, opacity: davidOpacity }}
  className="liquid-glass-text liquid-hover font-oswald text-[18vw] md:text-[15vw] leading-[0.8]
             font-bold uppercase tracking-tighter whitespace-nowrap cursor-default pb-4
             will-change-transform"
  initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
  transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}>Ryan</motion.h1>
```
Line 2 "George": identical **plus** `ml-0 md:ml-24`, scroll vars `vargheseX/Y/Opacity`, entrance delay `0.04`.

Parallax transforms over `scrollYProgress` 0→1:

| Line | x | y | opacity |
|---|---|---|---|
| Ryan | `0 → -80` | `0 → 100` | `[0, 0.8]`: `1 → 0` |
| George | `0 → 90` | `0 → 140` | `[0, 0.8]`: `1 → 0` |
| Badge (both rows) | — | `0 → 60` | `[0, 0.4]`: `1 → 0` |
| Scroll indicator | — | `0 → 30` | `[0, 0.25]`: `1 → 0` |

**Matchday profile card** — same `badgeY`/`badgeOpacity`, entrance `{opacity:0, y:16} → {opacity:1,y:0}`, `duration 0.65`, `delay 0.1`:
```
mt-6 md:mt-8 ml-0 md:ml-24 max-w-2xl backdrop-blur-md bg-black/40 p-6 rounded-2xl
border border-white/10 shadow-2xl
  <div className="text-xs font-mono text-[#C8A754] uppercase tracking-widest mb-2 flex items-center gap-2">
    <span className="w-1.5 h-1.5 rounded-full bg-[#C8A754]" />
    // The Matchday Profile
  </div>
  <p className="text-neutral-300 text-sm md:text-base font-normal leading-relaxed">…</p>
```
Body copy (verbatim):
> I'm Ryan George Koickal, a B.Tech CSE student (CGPA 9.21) and Python developer / data scientist building edge-AI systems, production-grade Generative AI pipelines (RAG), and multi-agent LLM systems. I translate complex ML models into intuitive, actionable applications — from offline bird recognition on Raspberry Pi to real-time AQI digital twins and travel agents.

*(Uses a typographic apostrophe `’` and em-dashes `—`. Preserve.)*

**Bottom bar** — same `scrollIndicatorOpacity`/`scrollIndicatorY`, entrance `{opacity:0} → {opacity:1}`, `delay 0.18`, `duration 0.55`:
```
flex justify-between items-end border-t border-neutral-800/80 pt-6 mt-6
  <button className="group flex items-center gap-3 text-xs font-mono font-bold uppercase
                     tracking-widest text-neutral-400 hover:text-[#C8A754] transition-colors cursor-pointer">
    <span className="w-6 h-[1px] bg-neutral-600 group-hover:w-10 group-hover:bg-[#C8A754]
                     transition-all duration-300" />
    About Me &rarr;
  </button>
  <div className="text-xs font-mono text-neutral-500 hidden sm:block">&copy; 2026 Ryan George</div>
```
`About Me` → `preventDefault()` → `onNavigate('profile')` → `scrollTo({top:0, behavior:'smooth'})`.

### 5.3 About / Profile

Shell per §2.6. Layout: `flex flex-col lg:flex-row gap-16 lg:gap-24 items-start`, each column `lg:w-1/2`.

**Left column** — `initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{duration:0.8}}`

Eyebrow:
```
<span className="block text-xs font-mono font-bold uppercase tracking-widest text-[#C8A754]
                 mb-6 flex items-center gap-2">
  <ShieldCheck size={14} className="text-[#C8A754]" />
  // Profile &bull; Developer Background
</span>
```

H3 — `text-4xl md:text-6xl font-medium uppercase leading-[1.1] mb-8 tracking-tight`:
> Building edge-AI & `<span className="text-[#C8A754]">GenAI</span>` systems with `<span className="text-neutral-500">data</span>`.

Two paragraphs in `space-y-5 text-base md:text-lg font-light leading-relaxed text-neutral-300 max-w-xl`:

1. > I'm Ryan George Koickal, a Computer Science and Engineering student at Rajagiri School of Engineering & Technology (CGPA 9.21/10) based in Kakkanad, Ernakulam. I'm a results-driven Python developer and data scientist focused on edge-AI, RAG pipelines, and multi-agent LLM systems.

2. *(class `text-neutral-400 text-sm md:text-base`)* > From an offline BirdNET bird recognizer on Raspberry Pi and Gemini-powered species profiling, to scalable restaurant-data pipelines with LLM agents, to Xplora travel agents, ACP RAG reasoning, and a Kerala AQI digital twin — I ship production-grade AI that solves business problems.

**Highlights grid** — `mt-12 grid grid-cols-2 sm:grid-cols-3 gap-6 border-t border-neutral-800/80 pt-8`

| Order | Stat | Label |
|---|---|---|
| 1 | `5+` | Certificates |
| 2 | `5+` | Projects |
| 3 | `2+` | Internships |

Each: `initial={{opacity:0,y:22}} whileInView={{opacity:1,y:0}} viewport={{once:true, margin:'-20px'}} transition={{duration:0.65, delay:0.1|0.2|0.3, ease:[0.16,1,0.3,1]}}`
```jsx
<div className="flex items-center gap-1">
  <h4 className="text-4xl font-bold font-oswald text-white flex items-center">
    <PhysicalNumberRoller target={5} suffix="+" />
  </h4>
</div>
<p className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#C8A754] mt-1">
  Certificates
</p>
```

**PhysicalNumberRoller** — an odometer-style digit roll. See §5.3.1.

**Right column** — `initial={{opacity:0,y:40}} animate={{opacity:1,y:0}} transition={{duration:0.8, delay:0.2}}`, `id="skills"`

Eyebrow:
```
<span className="block text-xs font-mono font-bold uppercase tracking-widest text-[#C8A754]
                 mb-6 flex items-center gap-2">
  <Cpu size={14} className="text-[#C8A754]" />
  // Technical Capabilities
</span>
```

Then `<TiltSkillsTile />` (§5.3.2), then a 2-up sub-card grid (`mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4`) with §5.3.3's two cards.

#### 5.3.1 PhysicalNumberRoller

`useInView(ref, { once: true, margin: '-20px' })` gates the roll.

```jsx
<span ref={ref} className="inline-flex items-center font-oswald tabular-nums leading-none">
  <span className={`inline-flex items-center ${effectiveGapClass}`}>
    {digits.map((d, i) => (
      <span key={i} className={`inline-flex items-center ${target === 10 && i === 1 ? '-ml-[1px]' : ''}`}>
        <PhysicalDigitRoller digit={d} delay={i * 0.12} spins={1} isInView={isInView} />
      </span>
    ))}
  </span>
  <span className={`font-oswald text-white select-none self-center leading-none ${suffixMargin}`}>
    {suffix}
  </span>
</span>
```
- `suffix` default `'+'`; `suffixMargin` default `'ml-[3px]'`
- `digitGap`: `gap-0` when `target === 10`, else `'gap-[1.5px]'` (no stat currently uses `target === 10`, but keep the branch)

**PhysicalDigitRoller:**
```js
const numbers = Array.from({ length: spins * 10 + digit + 1 }, (_, i) => i % 10);
const targetIndex = isInView ? numbers.length - 1 : 0;
```
```jsx
<span className="relative inline-block h-[1.15em] overflow-hidden align-middle select-none px-0 bg-transparent">
  <motion.span
    initial={{ y: 0 }}
    animate={{ y: `-${(targetIndex / numbers.length) * 100}%` }}
    transition={{ duration: 1.6 + delay * 0.6, delay, ease: [0.12, 0.95, 0.22, 1] }}
    className="inline-flex flex-col text-center bg-transparent">
    {numbers.map((num, idx) => (
      <span key={idx}
            className="h-[1.15em] flex items-center justify-center font-oswald text-white leading-none bg-transparent">
        {num}
      </span>
    ))}
  </motion.span>
</span>
```
So a digit `5` renders the strip `0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5` and slides to the final `5`. Total roll ≈ 1.6–2.3 s per digit, staggered `i * 0.12`.

#### 5.3.2 TiltSkillsTile (3D holographic pod)

Wrapper: `<div style={{ perspective: 1200 }} className="w-full">`

Card: `onMouseMove` maps pointer to normalised `[-0.5, 0.5]` on each axis, then:
```js
const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [14, -14]), { stiffness: 220, damping: 24 });
const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-14, 14]), { stiffness: 220, damping: 24 });
```
Card style: `{ rotateX, rotateY, transformStyle: 'preserve-3d' }`, `animate={{ scale: isHovered ? 1.02 : 1 }}`, `transition={{ duration: 0.25 }}`.
Classes:
```
relative rounded-2xl bg-black/60 border border-white/10 p-6 md:p-8 shadow-2xl
transition-colors duration-300 group hover:border-[#C8A754]/40 cursor-pointer will-change-transform
```

Children:

1. **Corner aura** — `absolute top-0 right-0 w-44 h-44 rounded-full pointer-events-none`, `background: 'radial-gradient(circle at center, rgba(200,167,84,0.12) 0%, transparent 70%)'`, `transform: translateZ(0px)`

2. **Holographic stage** — `absolute inset-4 md:inset-6 rounded-2xl bg-[#C8A754]/[0.03] border border-[#C8A754]/30 pointer-events-none`
   - style `{ transform: 'translateZ(30px)', boxShadow: '0 16px 36px rgba(0,0,0,0.7), 0 0 24px rgba(200,167,84,0.14)' }`
   - `animate={{ translateZ: isHovered ? 42 : 30 }}`, `transition={{ duration: 0.3 }}`
   - Four corner brackets, each `absolute w-3 h-3 border-[#C8A754]/70`, side-2 border-2:
     - `top-2.5 left-2.5 border-t-2 border-l-2`
     - `top-2.5 right-2.5 border-t-2 border-r-2`
     - `bottom-2.5 left-2.5 border-b-2 border-l-2`
     - `bottom-2.5 right-2.5 border-b-2 border-r-2`

3. **Projected web graph** — `{ transform: 'translateZ(70px)', transformStyle: 'preserve-3d' }`, `animate={{ translateZ: isHovered ? 95 : 70 }}`, `transition={{ duration: 0.35, ease: 'easeOut' }}`, classes `relative z-20 w-full`. Contains `<SkillChart />`.

#### 5.3.3 TiltSubCard

Wrapper `perspective: 800`. Springs `{ stiffness: 240, damping: 22 }`, range `[-0.5,0.5] → [10,-10]` / `[-10,10]`, `whileHover={{ scale: 1.02 }}`, `transition={{ duration: 0.2 }}`.
```
p-6 bg-black/40 backdrop-blur-md border border-white/5 rounded-xl hover:border-[#C8A754]/30
hover:bg-black/60 transition-colors shadow-lg will-change-transform cursor-pointer
```
Inner content wrapper: `<div style={{ transform: 'translateZ(16px)' }}>`.

**Card A — Core Engineering** (`Code2` icon, `size={14}`):
```
<div className="flex items-center gap-2 mb-3">
  <Code2 size={14} className="text-[#C8A754]" />
  <h5 className="font-mono font-bold uppercase text-xs tracking-wider text-white">Core Engineering</h5>
</div>
<ul className="space-y-1.5 text-sm text-neutral-400 font-light">
```
List (use `&bull;` between inline items):
- `LangChain &bull; LangGraph &bull; CrewAI`
- `RAG &bull; FAISS &bull; ChromaDB`
- `TensorFlow &bull; PyTorch &bull; Scikit-learn`
- `XGBoost &bull; Random Forest &bull; NLP`
- `NumPy &bull; Pandas &bull; SciPy`
- `FastAPI &bull; Flask &bull; MySQL`
- `React &bull; JavaScript &bull; Streamlit`

**Card B — Data & Deployment** (`Sparkles` icon):
- `CAMS & ERA5 Weather Datasets`
- `BirdNET & Edge-AI on Raspberry Pi`
- `Gemini & Groq APIs`
- `Vercel &bull; Netlify &bull; Render`
- `GCP (Basic) &bull; Git & GitHub`

### 5.4 SkillChart (Recharts radar)

```jsx
<div className="w-full h-[380px] md:h-[420px] bg-transparent rounded-lg p-2 select-none relative">
  <motion.div initial={{ scale: 0.9, opacity: 0 }}
               whileInView={{ scale: 1, opacity: 1 }} transition={{ duration: 0.6 }}
               className="w-full h-full relative z-10">
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart cx="50%" cy="50%" outerRadius="68%" data={SKILLS_DATA}>
        <PolarGrid stroke="#C8A754" strokeOpacity={0.25} />
        <PolarAngleAxis dataKey="subject" tick={{ fill: '#ffffff', fontSize: 11, fontWeight: 600 }} />
        <Radar name="Skills" dataKey="A" stroke="#C8A754" strokeWidth={2.4}
               fill="#C8A754" fillOpacity={0.3}
               dot={{ r: 3.5, fill: '#C8A754', stroke: '#ffffff', strokeWidth: 1.5 }} />
      </RadarChart>
    </ResponsiveContainer>
  </motion.div>
</div>
```

Data (`SKILLS_DATA`, 9 axes, `fullMark` is 100 for all):

| subject | A |
|---|---|
| Python & AI | 96 |
| LLM & RAG | 94 |
| ML & NLP | 92 |
| Data Science | 90 |
| Backend APIs | 88 |
| React & JS | 85 |
| Databases | 86 |
| Cloud & Deploy | 82 |
| Edge AI | 89 |

*(Note: axis order is not strictly descending — `React & JS 85` precedes `Databases 86`. Preserve.)*

### 5.5 ProjectList — "Matchday Squad"

Section header eyebrow: `// First Team &bull; Matchday Archive` *(sic)* with `<FolderGit2 size={14} />`.
H2: `Matchday<br/>Squad`
Right meta block: `(2025 — 2026)` + `{PROJECTS.length} Featured Projects`

> **Header variant (A).** Projects and Achievements use the *simplified* header from §2.7 — not the `flex-col md:flex-row` version:
> ```jsx
> <motion.div
>   initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
>   className="flex items-end justify-between mb-16 border-b border-neutral-800 pb-8">
>   …
>   <div className="text-right hidden md:block">…meta…</div>
> </motion.div>
> ```
> Note `hidden md:block` on the meta column — below the `md` breakpoint the right-hand meta disappears entirely rather than stacking. The other four pages (`Profile` aside, `Education`, `Experience`, `Certificates`) use the stacked `flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16` form.

**Card classes** (shared by the `<a>` and `<div>` variants):
```
group ticket-stub relative border border-[#C8A754]/15 py-10 md:py-14
flex flex-col md:flex-row md:items-baseline justify-between cursor-pointer
transition-all duration-300 hover:bg-[#C8A754]/[0.05] hover:border-[#C8A754]/35
px-8 md:px-10 rounded-2xl backdrop-blur-sm bg-[#0a1230]/30 text-left no-underline block w-full
```
Cards are stacked in `relative flex flex-col` (no gap — the ticket notches read as a continuous strip).

Entrance: `initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{duration:0.6, delay: index*0.1, ease:[0.16,1,0.3,1]}}`

Card content:

```jsx
<div className="flex items-baseline gap-4 md:gap-12 z-10 pointer-events-none">
  <span className="scoreboard-label text-[11px] font-bold text-neutral-500 tracking-widest
                   group-hover:text-[#C8A754] transition-colors duration-300">
    MD 0{project.id}
  </span>
  <div>
    <h3 className="text-3xl md:text-5xl font-medium uppercase tracking-tight text-neutral-200
                   group-hover:text-white group-hover:font-bold group-hover:translate-x-2
                   transition-all duration-300 ease-out flex items-center gap-3">
      {project.title}
      <ArrowUpRight size={24} className={`transition-all duration-300 text-[#C8A754] ${
        project.link
          ? 'opacity-80 md:opacity-0 -translate-x-1 md:-translate-x-2 translate-y-1 md:translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0'
          : 'opacity-0 -translate-x-2 translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0'
      }`} />
    </h3>
    <p className="text-xs md:text-sm text-neutral-400 font-light mt-2 max-w-xl
                  group-hover:text-neutral-300 transition-colors">
      {project.description}
    </p>
  </div>
</div>

<div className="mt-4 md:mt-0 flex items-center gap-4 md:gap-8 z-10 pointer-events-none">
  <span className="text-xs font-mono uppercase tracking-widest text-[#C8A754]/90
                   px-3 py-1 rounded-full border border-[#C8A754]/20 bg-[#C8A754]/5">
    {project.category}
  </span>
  <span className="text-sm font-mono text-neutral-500 group-hover:text-white
                   transition-colors duration-300">{project.year}</span>
</div>

<div className="absolute left-0 bottom-0 w-full h-[1px] bg-gradient-to-r from-transparent
                via-[#C8A754]/50 to-transparent scale-x-0 group-hover:scale-x-100
                transition-transform duration-500 origin-center" />
```

The `MD 0{id}` label is a matchday fixture number. The trailing glow line sweeps in on hover. `.ticket-stub` gives each card two gold-rimmed perforation notches on the left edge (§2.4).

**`PROJECTS` data (5 items, all with `link`):**

| id | title | category | year | image | link |
|---|---|---|---|---|---|
| 1 | Xplora Travel Agent | Multi-Agent AI | 2026 | `https://picsum.photos/800/600?grayscale&random=50` | https://github.com/ryan1234814/ |
| 2 | ACP RAG Agent | Generative AI & RAG | 2026 | `https://picsum.photos/800/600?grayscale&random=10` | https://github.com/ryan1234814/ |
| 3 | Digital Twin AQI Kerala | Data Science & ML | 2026 | `https://picsum.photos/800/600?grayscale&random=60` | https://github.com/ryan1234814/ |
| 4 | Edge-AI Bird Recognition | Edge AI & IoT | 2025 | `https://picsum.photos/800/600?grayscale&random=20` | https://github.com/ryan1234814/ |
| 5 | Restaurant Review Intelligence | LLM Agents | 2025 | `https://picsum.photos/800/600?grayscale&random=30` | https://github.com/ryan1234814/ |

Descriptions (verbatim):
1. > High-concurrency multi-agent LangGraph travel planner with 6 custom agents (Budget, Itinerary, Weather, etc.) and 7 live APIs generating layouts in under 30 seconds.
2. > Multi-agent documentation reasoning pipeline using Agent Communication Protocol (LangChain + CrewAI) with FAISS semantic search over academic PDFs.
3. > Real-time AQI indexing and 24-hour prediction across 12 Kerala stations using physics-guided Random Forest/XGBoost trained on CAMS and ERA5 data.
4. > Offline Raspberry Pi bird recognition with BirdNET and USB microphone plus Gemini-generated species profiles and Streamlit analytics dashboard.
5. > Multi-model AI agents (Gemini & Groq) summarizing reviews and classifying OpenTable dishes, backed by scalable BeautifulSoup/Selenium pipelines.

> `image` is stored on the object but **not rendered** by `ProjectList` (the layout is text-only). Keep the field; it costs nothing.

### 5.6 Education — "Academic Journey"

Eyebrow: `<GraduationCap size={14} />` + `// Academic Background &bull; Higher Studies`
H2: `Academic<br/>Journey` · Right meta: `(2023 — 2027)`

**`EDUCATION_DATA` — exactly 1 entry:**

```js
{
  id: "btech",
  degree: "Bachelor of Technology (B.Tech)",
  field: "Computer Science & Engineering (CSE)",
  institute: "Rajagiri School of Engineering & Technology",
  location: "Kakkanad, Ernakulam, Kerala",
  year: "Sep 2023 — May 2027",
  level: "Undergraduate Degree",
  metrics: [ { label: "CGPA", value: "9.21 / 10.00", highlight: true } ],
  featured: true
}
```

**EducationCard** — `motion.div`, `initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{duration:0.7, delay: idx*0.12}}`; entrance only (no scroll trigger).

Classes:
```
group relative bg-black/40 backdrop-blur-xl border rounded-[2.5rem] p-8 md:p-12
shadow-2xl overflow-hidden transition-all
featured ? 'border-[#C8A754]/30 hover:border-[#C8A754]/60 bg-gradient-to-br from-black/60 via-black/40 to-[#C8A754]/5'
         : 'border-white/10 hover:border-white/20 hover:bg-black/60'
```

Two hover overlays (mouse-tracked), identical to the Experience cards — see §5.7 "Spotlight". Plus, for `featured`, an ambient glow: `absolute top-0 right-0 w-96 h-96 bg-[#C8A754]/10 rounded-full blur-3xl pointer-events-none`.

Inner layout: `relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8`

Left (`space-y-4 max-w-3xl`):
```jsx
<div className="flex flex-wrap items-center gap-3">
  <span className={`px-3.5 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider ${
    edu.featured
      ? 'text-black bg-[#C8A754] shadow-[0_0_15px_rgba(200,167,84,0.3)]'
      : 'text-[#C8A754] bg-[#C8A754]/10 border border-[#C8A754]/20'
  }`}>{edu.level}</span>
  <span className="flex items-center gap-1.5 text-xs font-mono text-neutral-400">
    <Calendar size={13} className="text-[#C8A754]" />{edu.year}
  </span>
  <span className="flex items-center gap-1.5 text-xs font-mono text-neutral-400">
    <MapPin size={13} className="text-[#C8A754]" />{edu.location}
  </span>
</div>

<div>
  <h3 className="text-2xl md:text-4xl font-bold font-poppins text-white tracking-tight leading-tight">
    {edu.degree}
  </h3>
  {edu.field && <p className="text-lg md:text-xl text-[#C8A754] font-light mt-1">{edu.field}</p>}
</div>

<div className="flex items-center gap-2 text-sm md:text-base font-mono text-neutral-300 pt-1">
  <Building2 size={16} className="text-[#C8A754] shrink-0" />
  <span className="font-semibold text-white">{edu.institute}</span>
</div>
```

Right — `flex flex-wrap lg:flex-col items-stretch gap-3 shrink-0 lg:min-w-[240px]`:
```jsx
<div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md
                flex flex-col justify-center flex-1 lg:flex-none">
  <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 mb-1">
    {metric.label}
  </span>
  <span className={`text-xl md:text-2xl font-bold font-mono ${
    metric.highlight ? 'text-[#C8A754]' : 'text-white'
  }`}>{metric.value}</span>
</div>
```

### 5.7 Experience

Eyebrow: `<Briefcase size={14} />` + `// Work &bull; Industry Exposure`
H2: `Experience` *(single line — no `<br/>`)*
Right meta: `(Industry Internships)` / `IIIT Kottayam &bull; Olcademy`

**`EXPERIENCES` — 2 entries, both `featured: true`, both `link: https://linkedin.com/in/ryan-george-1a6161283/`:**

**Entry 1**
```js
{
  id: "iiit-kottayam",
  role: "Research Intern",
  organization: "IIIT Kottayam",
  collaboration: "Edge-AI & Generative AI Research",
  type: "Research Internship",
  duration: "May 2025 – Jun 2025",       // note: EN DASH with spaces
  location: "Kottayam, Kerala, India",
  summary: "Engineered an offline edge-AI bird recognition system on Raspberry Pi and linked generative AI for automated species profiling with an interactive analytics dashboard.",
  highlights: [
    "Edge-AI Classification: built offline bird recognition on Raspberry Pi using BirdNET and USB microphone for internet-independent audio classification in remote field environments.",
    "Generative AI Integration: linked Google Gemini API to generate instant natural-language species profiles covering habitat, behavior, and ecological relevance.",
    "Interactive Analytics: developed responsive Streamlit dashboard with real-time audio playback, spectrogram/waveform visualization, and educational summaries."
  ],
  skills: ["BirdNET","Raspberry Pi","Google Gemini API","Streamlit","Edge-AI","Audio Classification"],
  featured: true,
  link: "https://linkedin.com/in/ryan-george-1a6161283/"
}
```

**Entry 2**
```js
{
  id: "olcademy",
  role: "Data Engineering Intern (Remote)",
  organization: "Olcademy",
  collaboration: "Data Pipelines & LLM Agents",
  type: "Internship",
  duration: "Mar 2025 – Sep 2025",
  location: "Remote",
  summary: "Built scalable web-scraping pipelines and multi-model LLM agents for restaurant intelligence, hardening pipeline reliability with checkpoint protocols.",
  highlights: [
    "Scalable Web Scraping: extracted large-scale restaurant metrics from RestaurantGuru via BeautifulSoup and Selenium pipelines, standardizing automated delivery to SharePoint.",
    "Intelligent LLM Agents: developed specialized multi-model AI agents (Gemini & Groq APIs) to summarize lengthy reviews and classify OpenTable dishes into dietary categories.",
    "Pipeline Infrastructure: refactored custom checkpoint-saving protocols, preventing data loss and ensuring continuous uninterrupted pipelines."
  ],
  skills: ["BeautifulSoup","Selenium","SharePoint","Gemini API","Groq API","Python"],
  featured: true,
  link: "https://linkedin.com/in/ryan-george-1a6161283/"
}
```

**ExperienceCard** — the whole card is an `<a>` (`target="_blank" rel="noopener noreferrer"`):
```jsx
initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
whileHover={{ scale: 1.01 }}
transition={{ duration: 0.7, delay: idx * 0.12 }}
```
Classes:
```
group block relative bg-black/40 backdrop-blur-xl border rounded-[2.5rem] p-8 md:p-12
shadow-2xl overflow-hidden transition-all cursor-pointer
featured ? 'border-[#C8A754]/30 hover:border-[#C8A754]/80 hover:shadow-[0_0_40px_rgba(200,167,84,0.25)]
                bg-gradient-to-br from-black/60 via-black/40 to-[#C8A754]/5'
         : 'border-white/10 hover:border-white/20 hover:bg-black/60'
```

**Cursor Spotlight** (two layers, both `pointer-events-none absolute -inset-px rounded-[2.5rem] transition-opacity duration-300 z-0`, `opacity: isHovered ? 1 : 0`):

```js
// Layer 1 — radial glow
background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(200,167,84,0.15), transparent 70%)`

// Layer 2 — border shine
border: '1px solid rgba(200,167,84,0.7)'
maskImage:          `radial-gradient(350px circle at ${mousePos.x}px ${mousePos.y}px, black 20%, transparent 100%)`
WebkitMaskImage:    (same)
```
`mousePos` is `{ x: e.clientX - rect.left, y: e.clientY - rect.top }` from `onMouseMove`.

Ambient glow (Experience variant animates on hover, Education does not):
```jsx
<div className="absolute top-0 right-0 w-96 h-96 bg-[#C8A754]/10 rounded-full blur-3xl
                pointer-events-none group-hover:bg-[#C8A754]/20 transition-all duration-500" />
```

Body: `relative z-10 space-y-6`

1. **Badges row** — `flex flex-wrap items-center justify-between gap-3`
   ```jsx
   <span className="px-3.5 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider
                    text-black bg-[#C8A754] shadow-[0_0_15px_rgba(200,167,84,0.3)]">{exp.type}</span>
   <span className="flex items-center gap-1.5 text-xs font-mono text-neutral-400">
     <Calendar size={13} className="text-[#C8A754]" />{exp.duration}</span>
   <span className="flex items-center gap-1.5 text-xs font-mono text-neutral-400">
     <MapPin size={13} className="text-[#C8A754]" />{exp.location}</span>
   ```
   LinkedIn chip (right side), `onClick` inside an `<a>` so it is decorative only:
   ```jsx
   <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10
                   text-xs font-mono text-[#C8A754] group-hover:bg-[#C8A754] group-hover:text-black
                   group-hover:border-[#C8A754] transition-all duration-300">
     <span>View LinkedIn Profile</span><ExternalLink size={12} />
   </div>
   ```

2. **Role & org** — `space-y-2`
   ```jsx
   <h3 className="text-2xl md:text-4xl font-bold font-poppins text-white tracking-tight
                  leading-tight group-hover:text-[#C8A754] transition-colors">{exp.role}</h3>
   <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-base md:text-lg
                   font-medium text-neutral-200">
     <div className="flex items-center gap-2">
       <Building2 size={18} className="text-[#C8A754] shrink-0" />
       <span className="text-white font-semibold">{exp.organization}</span>
     </div>
     <span className="hidden sm:inline text-neutral-600">&bull;</span>
     <span className="text-[#C8A754] font-light">{exp.collaboration}</span>
   </div>
   ```

3. **Summary** — `text-neutral-300 text-sm md:text-base leading-relaxed max-w-4xl`

4. **Key Takeaways** — `space-y-3 pt-2`
   ```jsx
   <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-[#C8A754]">
     Key Takeaways &amp; Contributions:
   </h4>
   <ul className="space-y-2.5">
     <li className="flex items-start gap-3 text-xs md:text-sm text-neutral-300">
       <CheckCircle2 size={16} className="text-[#C8A754] shrink-0 mt-0.5" />
       <span>{highlight}</span>
     </li>
   ```
   Note the leading `Label: ` inside each highlight string is bold-ish content, not a separate span — it's all one string.

5. **Skills pills** — `pt-4 border-t border-white/10` then `flex flex-wrap items-center gap-2`
   ```jsx
   <span className="px-3 py-1 rounded-full text-xs font-mono bg-white/5 border border-white/10
                    text-neutral-300 group-hover:border-[#C8A754]/40 group-hover:text-white
                    transition-colors">{skill}</span>
   ```

Cards stacked in `space-y-8 mb-16`.

### 5.8 Achievements — "Key Achievements"

Eyebrow: `<Trophy size={14} />` + `// Milestones &bull; Honors`
H2: `Key<br/>Achievements`
Right meta block: `(2026)` / `{ACHIEVEMENTS.length} Highlighted Milestones`

> **Header variant (A).** Projects and Achievements use the *simplified* header from §2.7 — not the `flex-col md:flex-row` version:
> ```jsx
> <motion.div
>   initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
>   className="flex items-end justify-between mb-16 border-b border-neutral-800 pb-8">
>   …
>   <div className="text-right hidden md:block">…meta…</div>
> </motion.div>
> ```
> Note `hidden md:block` on the meta column — below the `md` breakpoint the right-hand meta disappears entirely rather than stacking. The other four pages (`Profile` aside, `Education`, `Experience`, `Certificates`) use the stacked `flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16` form.

**`ACHIEVEMENTS` — 5 entries:**

| id | title | category | year | issuer | highlight | imageUrl | link |
|---|---|---|---|---|---|---|---|
| 1 | A Grade — English Essay Writing Competition | Literature & Communication | 2026 | Bharatham 2026 | `A Grade` | — | — |
| 2 | Official Website Development Contributions | Web Development | 2026 | `Confluence 3.0 • RSET IEDC` | `Production Websites` | — | — |
| 3 | Top 7 — CodeEdge Hackathon | Hackathon | 2026 | ACM FISAT | `Top 7` | — | — |
| 4 | NSOC 2026 — Open Source Contributions | Open Source | 2026 | Nation Open Source Challenge | `Rank 159/980` | `achievements/nsoc-contributions.png` | — |
| 5 | Winner — BRIK Community Buildathon | Buildathon | 2026 | BRIK Community | `Buildathon Winner` | — | https://ai.studio/apps/3c9652a3-b4d9-48f8-aa1c-600c66c77716 |

Descriptions (verbatim):
1. > Secured an A Grade in the English Essay Writing competition at Bharatham 2026, demonstrating strong written communication and analytical expression.
2. > Contributed to the development of the official website of Confluence 3.0 and the RSET IEDC official website, delivering polished, responsive web experiences.
3. > Secured a Top 7 position in the CodeEdge Hackathon conducted by ACM FISAT, competing against skilled teams across rapid prototyping and build challenges.
4. > Secured rank 159/980 among NSOC 2026 open source project contributions, shipping verified pull requests across collaborative repositories.
5. > Won the BRIK Community's Buildathon by building BRIKCODE, a standout application delivered under competitive build constraints.

**Grid** — `grid grid-cols-1 md:grid-cols-2 gap-6`

Card: `motion.div`, `initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{duration:0.6, delay:index*0.1, ease:[0.16,1,0.3,1]}}`
```
group relative bg-black/40 backdrop-blur-xl border border-white/10 p-8 rounded-2xl
flex flex-col justify-between hover:border-[#C8A754]/40 hover:bg-black/60
transition-all duration-300 shadow-xl
```
(5 cards in a 2-col grid → last card sits alone in the left column.)

Card body:
```jsx
<div className="flex items-center justify-between gap-4 mb-6">
  <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#C8A754]
                   px-3 py-1 rounded-full border border-[#C8A754]/20 bg-[#C8A754]/10">
    {item.category}
  </span>
  <span className="text-xs font-mono text-neutral-500">{item.year}</span>
</div>

<h3 className="text-2xl md:text-3xl font-medium tracking-tight text-white
               group-hover:text-[#C8A754] transition-colors mb-2">{item.title}</h3>

<p className="text-xs font-mono text-neutral-400 mb-4 flex items-center gap-1.5">
  <Award size={13} className="text-[#C8A754]" />{item.issuer}
</p>

<p className="text-sm text-neutral-300 font-light leading-relaxed">{item.description}</p>
```

Optional image block (`mt-6 overflow-hidden rounded-xl border border-white/10 bg-black/40`):
```jsx
<img src={item.imageUrl} alt={`${item.title} proof`} loading="lazy"
     className="w-full h-auto object-cover" />
```

Optional link (`mt-6 inline-flex items-center gap-2 self-start text-xs font-mono font-bold uppercase tracking-wider text-[#C8A754] border border-[#C8A754]/30 bg-[#C8A754]/10 px-4 py-2 rounded-lg hover:bg-[#C8A754]/20 hover:border-[#C8A754]/60 transition-all duration-300`):
`View Project` + `<ExternalLink size={13} />`

Highlight footer (`mt-8 pt-4 border-t border-white/5 flex items-center justify-between`):
```jsx
<span className="text-xs font-mono text-neutral-500 uppercase tracking-wider flex items-center gap-1.5">
  <Star size={12} className="text-[#C8A754]" />Recognition
</span>
<span className="text-xs font-mono font-bold text-white bg-white/5 px-2.5 py-1 rounded-md border border-white/10">
  {item.highlight}
</span>
```

### 5.9 Certificates — "Course Certificates"

Eyebrow: `<BadgeCheck size={14} />` + `// Accreditations &bull; Credentials`
H2: `Course<br/>Certificates` · Right meta: `(2023 — 2026)` + a `.liquid-glass-button` LinkedIn link.

Header meta block: `flex flex-col items-start md:items-end gap-3`, header `mb-12` (**not** `mb-16`).

LinkedIn quick link:
```jsx
<a href="https://linkedin.com/in/ryan-george-1a6161283/details/certifications/"
   target="_blank" rel="noopener noreferrer"
   className="liquid-glass-button inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs
              font-mono font-bold uppercase tracking-wider transition-all transform hover:-translate-y-0.5">
  <span>View On LinkedIn</span><ExternalLink size={13} />
</a>
```

**`CERTIFICATES` — 5 entries:**

| id | title | issuer | year | field | skills | imageUrl |
|---|---|---|---|---|---|---|
| 1 | Building AI Apps via RAG | Codecademy | 2025 | Generative AI & RAG | RAG, Vector Search, LLM Apps | `certificates/codecademy-rag.png` |
| 2 | Deep Learning with TensorFlow | Codecademy | 2025 | Deep Learning | TensorFlow, Neural Networks, Model Training | `certificates/codecademy-tensorflow.png` |
| 3 | Text Classification with PyTorch | Codecademy | 2025 | NLP & PyTorch | PyTorch, NLP, Classification | `certificates/codecademy-pytorch.png` |
| 4 | Advanced Data Analysis with Python | Codecademy | 2025 | Data Analysis | Python, Pandas, NumPy | `certificates/codecademy-data-analysis.png` |
| 5 | Machine Learning Model Architecture | Codecademy | 2025 | Machine Learning | Model Design, Evaluation, Scikit-learn | `certificates/codecademy-ml-architecture.png` |

> ⚠️ **None of these 5 files exist.** See §11.2. The fallback card is the real rendered output.

Grid: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`

**CertificateCard** — `motion.div`, `initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.4, delay: index*0.03}}`
```
group relative h-[360px] md:h-[370px] w-full [perspective:1200px] cursor-pointer
onClick={() => toggleTapCard(cert.id)}
```

Flip container:
```jsx
<div className={`relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] ease-out
                  group-hover:[transform:rotateY(180deg)] ${isTapped ? '[transform:rotateY(180deg)]' : ''}`}>
```
**Hover flips on desktop; tap toggles `tappedCertId` on touch (only one card can be tapped at a time — `setTappedCertId(prev => prev === id ? null : id)`).**

**FRONT face:**
```
absolute inset-0 w-full h-full [backface-visibility:hidden] [webkit-backface-visibility:hidden]
bg-black/45 backdrop-blur-xl border border-white/10 p-6 rounded-2xl
flex flex-col justify-between group-hover:border-[#C8A754]/40 group-hover:bg-black/60
transition-all duration-300 shadow-xl overflow-hidden
```
- Spotlight glow: `radial-gradient(400px circle at ${x}px ${y}px, rgba(200,167,84,0.18), transparent 75%)`, `-inset-px rounded-2xl`
- Spotlight border: `border-[#C8A754]/70`, `maskImage: radial-gradient(220px circle at ${x}px ${y}px, black 20%, transparent 100%)`
- Ambient: `absolute -top-24 -right-24 w-48 h-48 bg-[#C8A754]/5 rounded-full blur-3xl pointer-events-none group-hover:bg-[#C8A754]/10 transition-colors`

Front content:
```jsx
<div className="relative z-10">
  <div className="flex items-center justify-between gap-2 mb-4">
    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#C8A754]
                     px-2.5 py-0.5 rounded-full border border-[#C8A754]/20 bg-[#C8A754]/10
                     truncate max-w-[70%]">{cert.field}</span>
    <div className="flex items-center gap-1 text-xs font-mono text-neutral-400 shrink-0">
      <Calendar size={12} className="text-[#C8A754]" />
      <span className="font-semibold text-white">{cert.year}</span>
    </div>
  </div>

  <h3 className="text-lg md:text-xl font-medium tracking-tight text-white
                 group-hover:text-[#C8A754] transition-colors mb-2 line-clamp-2">{cert.title}</h3>

  <p className="text-xs font-mono text-neutral-400 mb-4 flex items-center gap-1.5">
    <Award size={13} className="text-[#C8A754] shrink-0" />
    <span className="text-neutral-300 font-medium">{cert.issuer}</span>
  </p>

  <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
    <span className="text-[10px] font-mono text-neutral-300 bg-white/5 border border-white/10
                     px-2 py-0.5 rounded-md">{skill}</span>
  </div>
</div>
```

**BACK face:**
```
absolute inset-0 w-full h-full [backface-visibility:hidden] [webkit-backface-visibility:hidden]
[transform:rotateY(180deg)] bg-neutral-950/95 backdrop-blur-2xl border border-[#C8A754]/50
p-4 rounded-2xl flex flex-col shadow-[0_0_35px_rgba(200,167,84,0.18)] overflow-hidden
```
Back spotlight: `radial-gradient(400px circle at ${x}px ${y}px, rgba(200,167,84,0.14), transparent 75%)`

Back top bar — `relative z-10 flex items-center justify-between gap-2 border-b border-white/10 pb-2`:
```jsx
<span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#C8A754]
                 bg-[#C8A754]/10 border border-[#C8A754]/30 px-2.5 py-0.5 rounded-full
                 truncate max-w-[70%]">{cert.issuer}</span>
<div className="flex items-center gap-1.5 shrink-0" onClick={e => e.stopPropagation()}>
  {cert.verifyUrl && (<a href={cert.verifyUrl} target="_blank" rel="noopener noreferrer"
    className="p-1.5 rounded-lg bg-white/5 hover:bg-[#C8A754]/20 text-neutral-300 hover:text-[#C8A754]
               border border-white/10 hover:border-[#C8A754]/40 transition-colors"
    title="Verify on Issuer Portal"><ExternalLink size={13} /></a>)}
  <button onClick={() => setActiveModalCert(cert)}
    className="p-1.5 rounded-lg bg-[#C8A754]/10 hover:bg-[#C8A754]/25 text-[#C8A754]
               border border-[#C8A754]/30 transition-colors"
    title="Enlarge Certificate"><Maximize2 size={13} /></button>
</div>
```
> `verifyUrl` is absent on all 5 entries, so the verify link never renders — but the code path stays.

Image frame — `relative z-10 flex-1 w-full mt-2.5 rounded-xl overflow-hidden bg-neutral-900/90 border border-white/10 flex items-center justify-center p-2 group/img hover:border-[#C8A754]/40 transition-all shadow-inner cursor-pointer`, `onClick` stops propagation and opens the lightbox.

```jsx
{!failedImages[cert.id] ? (
  <img src={cert.imageUrl} alt={`${cert.title} Certificate`} loading="lazy" referrerPolicy="no-referrer"
       className="w-full h-full object-contain rounded-lg drop-shadow-lg
                  transition-transform duration-300 group-hover/img:scale-[1.02]"
       onError={() => setFailedImages(prev => ({ ...prev, [cert.id]: true }))} />
) : (
  /* Fallback — see §11.2 */
  <div className="flex flex-col items-center justify-center text-center p-3 h-full w-full">
    <div className="w-10 h-10 rounded-full bg-[#C8A754]/10 border border-[#C8A754]/30
                    flex items-center justify-center mb-2"><Award size={20} className="text-[#C8A754]" /></div>
    <span className="text-[11px] font-mono font-bold text-white uppercase tracking-wider mb-1 line-clamp-1">
      {cert.title}
    </span>
    <span className="text-[10px] font-mono text-neutral-400">{cert.issuer} &bull; {cert.year}</span>
  </div>
)}
```

**"More Certificates" CTA** — centred, `mt-14 md:mt-20`:
```jsx
<motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}
            transition={{duration:0.6, delay:0.2}} className="mt-14 md:mt-20 flex justify-center w-full">
  <a href="https://linkedin.com/in/ryan-george-1a6161283/details/certifications/"
     target="_blank" rel="noopener noreferrer"
     className="group relative inline-flex items-center gap-4 px-8 py-4 md:px-10 md:py-5 rounded-full
                overflow-hidden backdrop-blur-sm border border-white/10 hover:border-[#C8A754]/40
                shadow-2xl transition-all">
    <div className="absolute inset-0 bg-[#C8A754] origin-right scale-x-0
                    transition-transform duration-500 ease-out group-hover:origin-left group-hover:scale-x-100" />
    <span className="relative z-10 text-lg md:text-2xl font-bold uppercase tracking-tight font-poppins
                     text-neutral-200 group-hover:text-black transition-colors duration-300">
      More Certificates
    </span>
    <svg …strokeWidth="2" className="relative z-10 w-6 h-6 md:w-7 md:h-7 text-neutral-400 group-hover:text-black
                                   transition-colors duration-300 shrink-0">
      <path d="M6 18 L15.2 8.8" /><path d="M18 6 L9 6" /><path d="M18 10 L18 16" />
    </svg>
  </a>
</motion.div>
```
**Liquid swipe background:** the gold panel is `scaleX(0)` with `origin-right`; on hover it flips to `origin-left` and scales to 1 — the gold wipes in from the left.

**Certificate lightbox modal.** State `activeModalCert`; parent callback `onModalChange` lifts "is modal open" to App so the Header hides (§3.5) and the mobile pull gesture is disabled (§3.3).

```jsx
useEffect(() => {
  onModalChange?.(!!activeModalCert);
  return () => { onModalChange?.(false); };
}, [activeModalCert, onModalChange]);
```
Escape closes.

Container: `fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 md:p-6`
Backdrop: `absolute inset-0 bg-black/85 backdrop-blur-md`, click closes.
Modal card:
```
relative z-10 max-w-3xl w-full bg-neutral-950/95 backdrop-blur-2xl border border-[#C8A754]/40
rounded-3xl p-3.5 sm:p-5 shadow-[0_0_60px_rgba(200,167,84,0.3)] flex flex-col
max-h-[78vh] overflow-y-auto my-auto
```
`initial={{opacity:0, scale:0.95, y:15}} animate={{opacity:1, scale:1, y:0}} exit={same as initial} transition={{duration:0.25, ease:'easeOut'}}`

Header — `flex items-center justify-between gap-4 border-b border-neutral-800 pb-2.5 mb-2.5`:
```jsx
<span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#C8A754]
                 bg-[#C8A754]/10 border border-[#C8A754]/30 px-2.5 py-0.5 rounded-full">
  {activeModalCert.issuer}
</span>
<span className="text-xs font-mono text-neutral-400">{activeModalCert.year}</span>
…
<h3 className="text-sm sm:text-base md:text-lg font-bold text-white tracking-tight leading-snug">
  {activeModalCert.title}
</h3>
<WebsiteXCloseButton onClick={() => setActiveModalCert(null)} size="md"
                     title="Close Certificate Modal" />
```

Image area — `w-full flex-1 min-h-[180px] bg-black/50 rounded-2xl border border-white/10 p-2 sm:p-3 flex items-center justify-center overflow-hidden`:
```jsx
<img src={activeModalCert.imageUrl} alt={activeModalCert.title} referrerPolicy="no-referrer"
     className="max-h-[40vh] md:max-h-[46vh] w-auto max-w-full object-contain rounded-xl shadow-2xl"
     onError={…} />
```
Fallback detail panel (shown when the image failed):
```jsx
<div className="flex flex-col items-center justify-center text-center p-6 max-w-md">
  <div className="w-16 h-16 rounded-full bg-[#C8A754]/10 border border-[#C8A754]/30
                  flex items-center justify-center mb-4"><Award size={32} className="text-[#C8A754]" /></div>
  <h4 className="text-xl font-bold text-white mb-2">{activeModalCert.title}</h4>
  <p className="text-xs font-mono text-neutral-400 mb-4">{activeModalCert.issuer} &bull; {activeModalCert.year}</p>
  <div className="text-xs font-mono text-neutral-300 bg-white/5 border border-white/10 rounded-xl
                  p-4 text-left w-full space-y-2">
    <div className="flex justify-between text-neutral-400">
      <span>Target File:</span>
      <span className="text-[#C8A754] font-semibold truncate max-w-[200px]">
        {activeModalCert.imageUrl.replace('certificates/', '')}
      </span>
    </div>
    <div className="flex justify-between text-neutral-400">
      <span>Domain:</span><span className="text-white">{activeModalCert.field}</span>
    </div>
    <div className="flex justify-between text-neutral-400">
      <span>Status:</span><span className="text-emerald-400 font-semibold">Verified Credential</span>
    </div>
  </div>
</div>
```
> This panel displays the *missing filename* as a "Target File" — it is intentional UI, not an error message.

Modal footer — `flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 mt-3 border-t border-neutral-800`:
```jsx
<div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
  <ShieldCheck size={15} className="text-[#C8A754]" />
  <span>Issued to <strong className="text-white">Ryan George</strong></span>
</div>
{activeModalCert.verifyUrl && ( …Verify Credential button, gold bg… )}
```

**InterlacedX** (used in `Certificates`) — `viewBox="0 0 24 24"`, `stroke="currentColor"`, `strokeLinecap="round"`:
```jsx
<line x1="5"   y1="19"  x2="19"  y2="5"  />   // continuous bottom-left → top-right diagonal
<line x1="5"   y1="5"   x2="8.5" y2="8.5" />   // top-left segment of the broken diagonal
<line x1="15.5" y1="15.5" x2="19" y2="19" />   // bottom-right segment
```

**WebsiteXCloseButton** — `size` in `'sm' | 'md' | 'lg'` → `w-9 h-9 / w-11 h-11 / w-12 h-12`, icon `18 / 20 / 24`:
```
relative rounded-full bg-[#060e17] border border-[#C8A754]/40
shadow-[0_0_20px_rgba(200,167,84,0.25)] hover:border-[#C8A754]/80 hover:shadow-[0_0_25px_rgba(200,167,84,0.5)]
flex items-center justify-center cursor-pointer shrink-0 outline-none focus:outline-none
transition-all duration-300 group
```
`whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.94 }}`; icon wrapper `text-[#C8A754] drop-shadow-[0_0_8px_rgba(200,167,84,0.9)] group-hover:drop-shadow-[0_0_12px_rgba(200,167,84,1)]`.

### 5.10 Footer / Contact

```
<div id="contact" className="bg-transparent text-white pt-36 pb-12 px-6 md:px-12 relative z-10
                            min-h-screen flex flex-col justify-between">
  <div className="max-w-[90vw] mx-auto w-full flex flex-col justify-between flex-grow">
```
*(Note: `pb-12` here, not the shared `pb-24`, and it has no border-t footer — it has its own bottom block.)*

Top grid — `motion.div`, `initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{duration:0.8}}`:
```
grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center
```

**Left column** (`max-w-xl`):
```jsx
<span className="block text-xs font-mono font-bold uppercase tracking-widest text-[#C8A754]
                 mb-4 flex items-center gap-2">
  <Mail size={14} className="text-[#C8A754]" />
  // Contact &bull; Get In Touch
</span>
<h3 className="text-3xl md:text-5xl font-medium uppercase tracking-tight text-white mb-4">
  Let's connect &amp; build together.
</h3>
<p className="text-neutral-400 font-light text-base md:text-lg">
  Have a project, research collaboration, or internship opportunity in AI / data science?
  Reach out directly via email or on social platforms.
</p>
```

**Right column**: `<div className="flex items-center justify-center w-full py-4 lg:py-0"><FloatingDock /></div>`

**Kinetic CTA** — `motion.div`, `initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{duration:0.8, delay:0.2}}`, class `mt-auto pt-16 md:pt-24 flex justify-center w-full`:
```jsx
<a href="mailto:Rg05.koickal@gmail.com"
   className="group relative inline-flex items-center justify-center gap-5 md:gap-6 px-8 py-4
              md:px-12 md:py-6 rounded-full overflow-hidden backdrop-blur-sm border border-white/10
              hover:border-[#C8A754]/40 shadow-2xl transition-all">
  <div className="absolute inset-0 bg-[#C8A754] origin-right scale-x-0
                  transition-transform duration-500 ease-out group-hover:origin-left group-hover:scale-x-100" />
  <span className="relative z-10 text-2xl md:text-4xl lg:text-5xl font-bold uppercase tracking-tight
                   font-poppins text-neutral-200 group-hover:text-black transition-colors duration-300">
    Get in Touch
  </span>
  <svg …strokeWidth="2.5" className="relative z-10 w-6 h-6 md:w-9 md:h-9 text-neutral-400
                                    group-hover:text-black transition-colors duration-300 shrink-0">
    <path d="M6 18 L15.2 8.8" /><path d="M18 6 L9 6" /><path d="M18 10 L18 16" />
  </svg>
</a>
```

**Bottom block**:
```jsx
<div className="flex flex-col md:flex-row justify-between items-center mt-12 pt-8
                border-t border-neutral-900 text-neutral-600 text-xs uppercase tracking-widest font-medium">
  <p>&copy; 2026 Ryan George</p>
  <p>Python Developer &amp; Data Scientist</p>
  <p className="mt-4 md:mt-0">
    Local Time: {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
  </p>
</div>
```
Live clock — evaluated at render only (it does **not** tick; it updates on re-render/navigation).

### 5.11 FloatingDock (macOS-style magnifier)

```jsx
<div onMouseMove={e => mouseX.set(e.clientX)} onMouseLeave={() => mouseX.set(Infinity)}
     className="relative inline-flex flex-col items-center">
```

Ambient outer glow: `absolute -inset-1.5 rounded-[34px] bg-gradient-to-r from-[#C8A754]/30 via-[#00cce0]/15 to-[#C8A754]/30 blur-xl pointer-events-none -z-10`

Dock body:
```
relative flex items-end h-[68px] pb-2.5 sm:pb-3 gap-2.5 sm:gap-3.5 px-3.5 sm:px-4
rounded-[28px] bg-gradient-to-b from-[#C8A754]/15 via-black/80 to-black/95 backdrop-blur-2xl
border border-[#C8A754]/40
shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(200,167,84,0.22),inset_0_1px_2px_rgba(200,167,84,0.5)]
```
Top rim highlight: `absolute inset-x-4 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#C8A754]/70 to-transparent pointer-events-none`

Ground shadow: `w-[82%] h-3.5 -mt-1 rounded-full bg-[#C8A754]/20 blur-md pointer-events-none -z-20`

**Dock items (3):**

| title | href | icon | brandColor hover | glowColor |
|---|---|---|---|---|
| LinkedIn | https://linkedin.com/in/ryan-george-1a6161283/ | `<Linkedin size={21} strokeWidth={1.75} />` | `hover:!text-[#0A66C2] hover:!border-[#0A66C2]/80 hover:bg-[#0A66C2]/20` | `rgba(10, 102, 194, 0.75)` |
| GitHub | https://github.com/ryan1234814/ | `<Github size={21} strokeWidth={1.75} />` | `hover:!text-white hover:!border-[#C8A754]/80 hover:bg-[#C8A754]/25` | `rgba(200, 167, 84, 0.5)` |
| HuggingFace | https://huggingface.co/coder1969 | custom SVG (below) | `hover:!text-[#FFD21E] hover:!border-[#FFD21E]/80 hover:bg-[#FFD21E]/15` | `rgba(255, 210, 30, 0.5)` |

**Custom HuggingFace icon** (inline SVG, `fill="currentColor"`, `viewBox="0 0 24 24"`, default class `w-[21px] h-[21px]`):
```jsx
<path d="M12 2.5c-1.5 0-2.7.8-3.4 2L7 7H4.5A1.5 1.5 0 0 0 3 8.5v9A1.5 1.5 0 0 0 4.5 19h15a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 19.5 7H17l-1.6-2.5c-.7-1.2-1.9-2-3.4-2zM9.2 11.2a1.7 1.7 0 1 1 0 3.4 1.7 1.7 0 0 1 0-3.4zm5.6 0a1.7 1.7 0 1 1 0 3.4 1.7 1.7 0 0 1 0-3.4z" />
```

**Magnification maths:**
```js
const distance = useTransform(mouseX, (val) => {
  const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
  return val - bounds.x - bounds.width / 2;
});

const widthSync     = useTransform(distance, [-110, 0, 110], [46, 62, 46]);
const width         = useSpring(widthSync,     { mass: 0.1, stiffness: 220, damping: 15 });
const iconScaleSync = useTransform(distance, [-110, 0, 110], [1, 1.25, 1]);
const iconScale     = useSpring(iconScaleSync, { mass: 0.1, stiffness: 220, damping: 15 });
```
`mouseX` initialises to `Infinity`, so the dock is at rest (46 px) until the pointer enters.

Button:
```jsx
<motion.a ref={ref} href={item.href} target="_blank" rel="noopener noreferrer" aria-label={item.title}
  style={{ width, height: width }}
  className={`group relative rounded-2xl flex items-center justify-center origin-bottom
    text-[#C8A754]/80 bg-[#C8A754]/[0.08] border border-[#C8A754]/30 backdrop-blur-xl
    shadow-[0_8px_20px_rgba(0,0,0,0.45),0_0_12px_rgba(200,167,84,0.12),inset_0_1px_1.5px_rgba(200,167,84,0.4)]
    transition-colors duration-200 cursor-pointer ${item.brandColor}`}>
  {/* specular sheen */}
  <div className="absolute inset-x-0 top-0 h-[40%] rounded-t-2xl pointer-events-none
                  bg-gradient-to-b from-[#C8A754]/30 via-[#C8A754]/10 to-transparent" />
  {/* hover glow */}
  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100
                  transition-opacity duration-300 pointer-events-none"
       style={{ boxShadow: `0 0 22px ${item.glowColor}` }} />
  <motion.div style={{ scale: iconScale }} className="relative z-10 flex items-center justify-center transition-colors">
    {item.icon}
  </motion.div>
</motion.a>
```
The icon **stays at 21 px** and only scales — the button box is what grows (46 → 62 px).

---

## 6. Background & transition animations

### 6.1 InteractiveParticles (canvas parallax + 3D sphere)

```jsx
<canvas ref={canvasRef} id="parallax-particles-canvas"
        className="fixed inset-0 z-[1] pointer-events-none w-full h-full" aria-hidden="true" />
```

**Palette** (batch-drawn by colour, one `beginPath`/`fill` per colour):
```js
['#ffffff', '#3f6fd8'→ order as written: '#ffffff', '#C8A754', '#3f6fd8', '#0a3a9e', '#3ba86a']
// white (away kit), gold, light blue, royal blue, pitch green
```

**Count:** `isMobile = innerWidth < 768` → **65** mobile / **120** desktop.

**Particle init per index `i`:**
```js
const goldenAngle = Math.PI * (3 - Math.sqrt(5));
const y3d      = 1 - (i / Math.max(1, count - 1)) * 2;      // 1 → -1
const radiusAtY = Math.sqrt(Math.max(0, 1 - y3d * y3d));
const theta   = goldenAngle * i;
const shellR  = 0.86 + (i % 5) * 0.035;
sx3d = Math.cos(theta) * radiusAtY * shellR;
sy3d = y3d * shellR;
sz3d = Math.sin(theta) * radiusAtY * shellR;
```
→ Fibonacci-sphere distribution with 5 nested shells.

Other fields:
```js
x = Math.random() * width;  y = Math.random() * height;
depth = 0.2 + Math.pow(Math.random(), 1.4) * 0.8;   // 0.2 … 1.0
size  = 0.9 + depth * 1.0;                        // 0.9 … 1.9 px
speed = (0.04 + Math.random() * 0.08) * depth;
angle = Math.random() * Math.PI * 2;
vx = Math.cos(angle) * speed;  vy = Math.sin(angle) * speed;
colorIndex = Math.floor(Math.random() * PALETTE_COLORS.length);
baseAlpha  = 0.25 + depth * 0.55;
shimmerSpeed = 0.01 + Math.random() * 0.02;
shimmerPhase = Math.random() * Math.PI * 2;
```

**Canvas sizing — `dpr = 1` deliberately.** The canvas is sized `width = window.innerWidth`, `height = window.innerHeight` in CSS pixels with `canvas.style.width/height` set in px. Rationale: cuts GPU fill-rate up to 4× on Retina/4K; particles are 1–2 px so the loss is invisible. **Do not "fix" this to `devicePixelRatio`.**

**Resize handling:**
```js
const isMobileScrollResize = newWidth === lastWidth && Math.abs(newHeight - lastHeight) < 160;
if (isMobileScrollResize) {
  // just re-size the canvas (address-bar collapse), do NOT rescale particles, do NOT re-init
} else {
  // genuine orientation/resize: scale every particle by newWidth/width, newHeight/height, then re-init
}
```

**Parallax input sources (priority order):**

1. **`mousemove`** (desktop, only when no orientation data has arrived): normalised against viewport centre, inverted, `maxRange = 65`.
   ```js
   targetX = -((e.clientX - centerX) / centerX) * 65;
   targetY = -((e.clientY - centerY) / centerY) * 65;
   ```
   `mouseleave` → reset to 0.
2. **`deviceorientation` / `deviceorientationabsolute`**: first reading establishes a baseline (gamma/beta); subsequent deltas normalised by `tiltSensitivity = 22`, inverted, `maxRange = 70`.
3. **`devicemotion`** fallback: skipped if `deviceorientation` fired within the last **1500 ms**. Uses `accelerationIncludingGravity`, iOS gravity sign flip (`/iPad|iPhone|iPod/` → `sign = -1`, else `1`):
   ```js
   normX = clamp((acc.x * sign) / 5.5, -1, 1);
   normY = clamp((acc.y - 7.5) / 5.5, -1, 1);
   targetX = normX * 65;  targetY = -normY * 65;
   ```
4. **`touchmove`** fallback (only when no sensor data): normalised, inverted, `maxRange = 40`. `touchend` → 0.
5. **iOS 13+ permission** is requested from `touchstart` and `click` handlers (`requestIOSPermission`), attaching the orientation/motion listeners only on `granted`. Failures are swallowed.

**Render loop:**
```js
const dt = Math.min((currentTime - lastTime) / 16.67, 2.0);
const lerpSpeed = prefersReducedMotion ? 0.03 : 0.08;
parallax.currentX += (parallax.targetX - parallax.currentX) * lerpSpeed * dt;
```
`prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches` also freezes `shimmerPhase`.

**Pull smoothing:**
```js
const rawPull = clamp(pullSphereProgressRef.current, 0, 1);
smoothedPullBlend += (rawPull - smoothedPullBlend) * Math.min(1, 0.22 * dt);
if (Math.abs(rawPull - smoothedPullBlend) < 0.001) smoothedPullBlend = rawPull;
```

**Tab sphere timeline** (starts when `sphereTransitionId` increments; `sphereTransitionStartRef = performance.now()`):

| Phase | Duration | `transitionBlend` |
|---|---|---|
| Gather | `startedFromPull ? 120 : 680` ms | if from pull → `1` for the whole phase; else cubic ease-in-out `t<0.5 ? 4t³ : 1 − (−2t+2)³/2` |
| Hold | `260` ms | `1` |
| Spread | `760` ms | `1 − (1 − t)³` (cubic ease-out) |
| Done | — | `0`, refs cleared |

`startedFromPull` = `pullSphereProgressRef.current >= 0.8` at trigger time (and the ref is reset to 0).

`sphereBlend = Math.max(transitionBlend, smoothedPullBlend)`

**Sphere geometry:**
```js
const sphereRadius = Math.max(76, Math.min(130, Math.min(width, height) * (width < 768 ? 0.19 : 0.15)));
const rotY = currentTime * 0.0018 + parallax.currentX * 0.006;
const rotX = Math.sin(currentTime * 0.001) * 0.35 - parallax.currentY * 0.006;
```
Rotation matrices per particle:
```js
const x1 = sx3d * cosY - sz3d * sinY;
const z1 = sx3d * sinY + sz3d * cosY;
const y2 = sy3d * cosX - z1  * sinX;
const z2 = sy3d * sinX + z1  * cosX;
const persp    = 1 / (1 - z2 * 0.28);
const sphereX  = centerX + x1 * sphereRadius * persp + parallax.currentX * 0.22;
const sphereY  = centerY + y2 * sphereRadius * persp + parallax.currentY * 0.22;
renderX = ambientX + (sphereX - ambientX) * sphereBlend;
renderY = ambientY + (sphereY - ambientY) * sphereBlend;
renderSize = p.size + (p.size * (0.95 + 0.4 * persp) - p.size) * sphereBlend;
```

**Core glow** (drawn before particles when `sphereBlend > 0.02`):
```js
const sphereGlowAlpha = sphereBlend * 0.25;
grad = ctx.createRadialGradient(glowX, glowY, 2, glowX, glowY, sphereRadius * 1.6);
grad.addColorStop(0,    `rgba(200, 167, 84, ${sphereGlowAlpha})`);
grad.addColorStop(0.5,  `rgba(63, 111, 216, ${sphereGlowAlpha * 0.45})`);
grad.addColorStop(1,    'rgba(200, 167, 84, 0)');
// filled as a full circle of radius sphereRadius * 1.6
```
`glowX/glowY = centre + parallax.current * 0.22`.

**Ambient drift + wrap:** `margin = 50`; particles wrap when beyond ±(dimension + margin).

**Batching:** outer loop over the 5 palette colours, inner loop over all particles filtered by `colorIndex`, accumulating `ctx.arc()` into a single path, then one `ctx.fill()`.

**Visibility:** `document.visibilitychange` → on hidden, `isLoopRunning = false` + `cancelAnimationFrame`; on visible, reset `lastTime` and restart.

The effect has `[]` deps — all changing values flow through refs (`activePageRef`, `pullSphereProgressRef`).

### 6.2 GoalNetTransition

Props: `{ transitionId, active, direction, label }`. `BALL_SIZE = 56`.

```js
const vw = window.innerWidth;
const centerX = vw / 2;
const stopX  = direction === 'left' ? centerX - 90 - BALL_SIZE / 2
                                 : centerX + 90 - BALL_SIZE / 2;
const startX = direction === 'left' ? -BALL_SIZE - 20 : vw + 20;
const travel = Math.abs(stopX - startX);
const spins  = (travel / (Math.PI * BALL_SIZE)) * 360;
const spin   = direction === 'left' ? spins : -spins;
```
The spin is derived from travel distance and circumference so the ball **rolls** rather than slides.

Root: `motion.div` `key={transitionId}`, `fixed inset-0 z-[80] pointer-events-none overflow-hidden`, exit `{ opacity: 0, transition: { duration: 0.4, ease: 'easeOut' } }`.

**Layer 1 — goal-net ripple:**
```jsx
<motion.div className="absolute inset-0"
            initial={{ opacity: 0 }} animate={{ opacity: [0, 0.5, 0] }}
            transition={{ duration: 1.25, times: [0, 0.4, 1], ease: 'easeInOut' }}>
  <GoalNet />
</motion.div>
```
`GoalNet` SVG — `preserveAspectRatio="none"`, `viewBox="0 0 100 100"`, `absolute inset-0 w-full h-full`:
```xml
<pattern id="netMesh" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
  <line x1="0" y1="0" x2="0" y2="7" stroke="rgba(255,255,255,0.14)" strokeWidth="0.35" />
  <line x1="0" y1="0" x2="7" y2="0" stroke="rgba(255,255,255,0.14)" strokeWidth="0.35" />
</pattern>
<linearGradient id="netFade" x1="0%" y1="0%" x2="100%" y2="0%">
  <stop offset="0%"   stopColor="#ffffff" stopOpacity="0" />
  <stop offset="50%"  stopColor="#ffffff" stopOpacity="1" />
  <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
</linearGradient>
<mask id="rippleMask">
  <rect x="-100" y="0" width="100" height="100" fill="url(#netFade)">
    <animate attributeName="x" values="-100;100" dur="1s" fill="freeze" begin="0s"
             calcMode="spline" keySplines="0.22 1 0.36 1" keyTimes="0;1" />
  </rect>
</mask>
<rect x="0" y="0" width="100" height="100" fill="url(#netMesh)" mask="url(#rippleMask)" />
```
A 100-unit-wide soft band sweeps right-to-left revealing the diamond net mesh.

**Layer 2 — section label:**
```jsx
<motion.div className="absolute bottom-[7vh] left-1/2 -translate-x-1/2 flex items-center gap-3 whitespace-nowrap"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.28, ease: 'easeOut' }}>
  <span className="scoreboard-label text-sm md:text-lg font-oswald text-[#C8A754] tracking-[0.3em]">
    {label}
  </span>
</motion.div>
```

**Layer 3 — rolling football:**
```jsx
<motion.div className="absolute"
  style={{ bottom: '6.5vh', left: 0, width: BALL_SIZE, height: BALL_SIZE, willChange: 'transform' }}
  initial={{ x: startX, rotate: 0, opacity: 0 }}
  animate={{
    x: [startX, stopX, stopX, stopX],
    rotate: [0, spin, spin + 40, spin + 40],
    opacity: [0, 1, 1, 0],
  }}
  transition={{ duration: 1.25, times: [0, 0.55, 0.85, 1], ease: ['easeIn', 'easeOut', 'linear'] }}>
  <Football />
</motion.div>
```

**Football SVG** (56×56, `viewBox="0 0 100 100"`): white circle `r=47` stroked `#0a3a9e` 3px; centre pentagon `50,30 63,40 58,55 42,55 37,40` filled `#032477` and outlined `#C8A754` 1.5px; five spokes from the pentagon vertices to the rim in `#0a3a9e` 2.5px round caps.

Total transition: 1250 ms animation, content revealed at **1460 ms** (§3.2).

### 6.3 ScrollHUD (match clock)

```jsx
const { scrollYProgress } = useScroll();
const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 });
const minute = useTransform(scrollYProgress, p => `${Math.round(p * 90)}'`);
```

**Progress bar:**
```
fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-pitch via-[#C8A754] to-[#C8A754]
origin-left z-[60] shadow-[0_0_10px_#C8A754]
```

**Match clock chip:**
```
fixed bottom-5 right-5 z-[60] hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg
bg-[#03060f]/85 backdrop-blur-md border border-[#C8A754]/30
shadow-[0_0_16px_rgba(200,167,84,0.15)] pointer-events-none select-none
  <span className="scoreboard-label text-[10px] text-white/50">MIN</span>
  <motion.span className="font-oswald text-sm font-bold text-[#C8A754] tabular-nums tracking-widest">
    {minute}
  </motion.span>
```
Scroll depth is presented as football match minutes: `0'` at the top → `90'` at the bottom. Hidden below the `sm` breakpoint.

### 6.4 AppleHelloLoader (first-load intro)

Mounted while `isLoading`, `z-[99999]`, `fixed inset-0 bg-[#03060f]`. **Clicking anywhere skips it.**

**Timing:** after **2850 ms** → `setIsFinished(true)` + `onExitStart()` (reveals content behind) → **320 ms** later → `onComplete()` (unmounts, `isLoading = false`). Skip path uses **200 ms**.

Exit: `{ opacity: 0, scale: 1.02, transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] } }`

**Ambient glow:** `w-[550px] h-[260px] rounded-full opacity-60`, `radial-gradient(ellipse at center, rgba(200,167,84,0.24) 0%, rgba(10,58,158,0.16) 45%, rgba(3,6,15,0) 70%)`, `translate3d(0,0,0)`.

**SVG:** wrapper `w-[90vw] max-w-[780px]`, `svg viewBox="-130 -30 2560 790"`, `fill="none"`, `shapeRendering="geometricPrecision"`.

Two gradients:
```xml
<linearGradient id="neonBlueGlass" x1="0%" y1="0%" x2="100%" y2="100%">
  <stop offset="0%"   stopColor="#F5E6BF" />
  <stop offset="25%"  stopColor="#C8A754" />
  <stop offset="65%"  stopColor="#a8863d" />
  <stop offset="90%"  stopColor="#C8A754" />
  <stop offset="100%" stopColor="#EAD9A8" />
</linearGradient>
<linearGradient id="glassSheen" x1="0%" y1="0%" x2="100%" y2="0%">
  <stop offset="0%"   stopColor="#FFFFFF" stopOpacity="0.9" />
  <stop offset="50%"  stopColor="#E7D3A0" stopOpacity="0.5" />
  <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.95" />
</linearGradient>
```

**`<g transform="scale(1, -1) translate(0, -728.156005859375)">`** (Y-flip so the original Apple path renders upright) containing three `motion.path`s, all `initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2.8, ease: [0.38, 0.04, 0.22, 1] }}`, all `fill="none"` `strokeLinecap="round"` `strokeLinejoin="round"`:

1. Outer neon tube glow — `stroke="#C8A754"` `strokeWidth="76"` `strokeOpacity="0.22"`
2. Main liquid-glass stroke — `stroke="url(#neonBlueGlass)"` `strokeWidth="56"`
3. Inner specular sheen — `stroke="url(#glassSheen)"` `strokeWidth="15"` `strokeOpacity="0.85"`

**The `hello` path data (verbatim — do not regenerate):**
```
M-109.06069946289062,95.92639923095703 C1.9544999599456787,157.6403045654297 103.11389923095703,236.9969940185547 217.881103515625,372.07550048828125 C296,464.2846984863281 337.9999084472656,569.5725708007812 340,642.1939697265625 C341,696.1920166015625 314.6702880859375,737.156005859375 266,737.156005859375 C212,737.156005859375 178,696.1920166015625 157,602.1610107421875 C134,498.82000732421875 117,380.239990234375 74,0 L78.21453094482422,37.160953521728516 C100.22924041748047,230.68260192871094 184,372 291,372 C355,372 395.6745910644531,321 384.1253967285156,248 C377.6238098144531,205 370.0873107910156,161 361.3063049316406,110 C351.0714111328125,46 380.3254089355469,-4 468.96173095703125,-4 C598.2246704101562,-4 739.2435302734375,67.83381652832031 811.4124145507812,179.0941619873047 C836,217 846,251 847,284 C848,344 814,389 754,389 C678,389 620,303 620,193 C620,75 684,-8 819.9180908203125,-8 C1004.7244873046875,-8 1209.4246826171875,213.84754943847656 1303.4808349609375,461.42327880859375 C1330.037353515625,531.3258056640625 1340,596.2349243164062 1340,641.593994140625 C1340,695.3764038085938 1323,736.673583984375 1275,736.673583984375 C1228,736.673583984375 1197,700.1784057617188 1169,642.5543823242188 C1136.1939697265625,575.7216186523438 1111.927734375,479.32598876953125 1102,370.3599853515625 C1077,96.94000244140625 1133,-4 1266.152099609375,-4 C1427.6083984375,-4 1607.1151123046875,220.92921447753906 1698.771728515625,462.18878173828125 C1725.037353515625,531.3258056640625 1735,596.2349243164062 1735,641.593994140625 C1735,695.3764038085938 1718,736.673583984375 1670,736.673583984375 C1623,736.673583984375 1592,700.1784057617188 1564,642.5543823242188 C1531.1939697265625,575.7216186523438 1506.927734375,479.32598876953125 1497,370.3599853515625 C1472,96.94000244140625 1528,-4 1646.906005859375,-4 C1765.623779296875,-4 1830.114990234375,99.48485565185547 1868.77880859375,209.3712158203125 C1907,318 1954,385 2052,385 C2133,385 2197,325 2197,212 C2197,87 2115.90087890625,-7 2013.41845703125,-8 C1923.234130859375,-9 1864,64 1870,174 C1877,296 1951,385 2048,385 C2104,385 2151.03564453125,360.1071472167969 2188,333 C2288.21435546875,259.8928527832031 2365.4287109375,305.0714416503906 2395,377.3571472167969
```

---

## 7. AI chat ("Livoq")

### 7.1 Floating button

```jsx
<div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
```

```jsx
<motion.button
  variants={{ idle: { scale: 1 }, hover: { scale: 1 }, tap: { scale: 0.96 } }}
  initial="idle" animate="idle" whileHover="hover" whileTap="tap"
  onClick={() => setIsOpen(!isOpen)}
  aria-label={isOpen ? "Close AI Assistant" : "Ask AI Assistant"}
  className="liquid-glass-button h-[60px] min-w-[60px] max-h-[60px] rounded-full flex items-center
             justify-center overflow-hidden shadow-2xl origin-bottom-right group">
  <div className="relative z-10 w-[60px] h-[60px] flex items-center justify-center shrink-0">
    <AnimatedChatToggleIcon isOpen={isOpen} size={38} />
  </div>
  {!isOpen && (
    <motion.div variants={{
        idle:  { width: 0,   opacity: 0, transition: { duration: 0.32, ease: [0.32, 0, 0.67, 0] } },
        hover: { width: 64,  opacity: 1, transition: { duration: 0.44, ease: [0.22, 1, 0.36, 1] } },
      }}
      className="h-[60px] flex items-center overflow-hidden whitespace-nowrap">
      <span className="block whitespace-nowrap text-sm font-semibold tracking-wide pr-3.5 text-white">
        Ask AI
      </span>
    </motion.div>
  )}
</motion.button>
```
Note `hover: { scale: 1 }` — **no scale-up on hover**; the hover affordance is the text expansion only.

**`AnimatedChatToggleIcon`** — `AnimatePresence mode="wait"`:
- open → `InterlacedX` at `round(38 * 0.7) = 27` px, `text-[#C8A754] drop-shadow-[0_0_8px_rgba(200,167,84,0.8)]`, in from `{ opacity: 0, rotate: -90, scale: 0.6 }`
- closed → `<AIAssistantAvatar size={38} glow />` from `{ opacity: 0, scale: 0.6 }`
- both `duration: 0.22, ease: [0.16, 1, 0.3, 1]`

**`InterlacedX`** (AIChat copy — note the different coordinates from the Certificates version):
```jsx
<line x1="4.5"  y1="19.5" x2="19.5" y2="4.5" />   // continuous diagonal
<line x1="4.5"  y1="4.5"  x2="9.5"  y2="9.5" />   // top-left segment
<line x1="14.5" y1="14.5" x2="19.5" y2="19.5" />  // bottom-right segment
```
`stroke="currentColor"`, `strokeWidth="2.2"`, `strokeLinecap="round"`.

**`PaperAirplaneSendIcon`** — `viewBox="0 0 24 24"`, `fill="currentColor"`, wrapped in `<g transform="translate(-2.5, -1.2)">`:
```jsx
<path d="M21.92 3.63a1.2 1.2 0 0 0-1.25-.26L2.61 10.66a1.2 1.2 0 0 0 .08 2.26l5.05 1.95 1.9 5.86a1.2 1.2 0 0 0 1.83.6l3.18-2.65 4.58 3.39a1.2 1.2 0 0 0 1.89-.72l3-16.5a1.2 1.2 0 0 0-.21-1.22zM9.54 14.12l8.8-7.92-7.05 9.16-.33 3.4-1.42-4.64z" />
```

### 7.2 Panel

```jsx
<motion.div
  initial={{ opacity: 0, y: 20, scale: 0.92 }}
  animate={{ opacity: 1, y: 0, scale: 1 }}
  exit={{ opacity: 0, y: 20, scale: 0.92 }}
  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
  className="mb-4 w-[90vw] sm:w-96 bg-black/85 backdrop-blur-2xl rounded-2xl
             shadow-[0_12px_40px_rgba(0,0,0,0.8),0_0_20px_rgba(200,167,84,0.15)]
             border border-white/10 overflow-hidden flex flex-col relative"
  style={{ maxHeight: '560px', minHeight: '460px' }}>
```

**Header** — `bg-black/60 text-white p-3.5 flex justify-between items-center border-b border-white/10`:
```jsx
<AIAssistantAvatar size={24} glow trackCursor={false} blink={true} />
<div>
  <div className="flex items-center gap-1.5">
    <span className="font-medium text-sm text-white tracking-wide">Livoq</span>
  </div>
  <span className="text-[10px] font-mono text-[#C8A754]/80 block">Ryan's Interactive AI</span>
</div>
<button onClick={() => setIsOpen(false)} aria-label="Close assistant"
        className="text-neutral-400 hover:text-[#C8A754] hover:bg-white/5 p-1.5 rounded-lg
                   transition-colors flex items-center justify-center group">
  <InterlacedX size={17} className="group-hover:drop-shadow-[0_0_6px_rgba(200,167,84,0.6)]" />
</button>
```

**Messages** — `flex-1 overflow-y-auto p-4 space-y-3.5 bg-transparent scroll-smooth`

Initial message:
```js
{ role: 'model',
  text: "Hi! I'm Livoq, Ryan George's AI assistant. Ask me anything about Ryan's projects, technical skills, AI background, certifications, or how to get in touch!" }
```

**User bubble** (right-aligned):
```
flex justify-end
```
```jsx
<motion.div initial={{ opacity: 0, scale: 0.94, y: 6 }} animate={{ opacity: 1, scale: 1, y: 0 }}
  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
  className="relative max-w-[84%] rounded-[22px] overflow-hidden backdrop-blur-2xl
             bg-gradient-to-b from-[#C8A754]/45 via-[#b8963f]/36 96% to-black/85
             border border-[#C8A754]/45
             shadow-[0_10px_28px_rgba(0,0,0,0.55),0_0_24px_rgba(200,167,84,0.25),inset_0_1px_1.5px_rgba(255,255,255,0.6)] group">
  <div className="absolute inset-x-0 top-0 h-[75%] pointer-events-none rounded-t-[21px]
                  bg-gradient-to-b from-[#C8A754]/50 via-[#C8A754]/20 to-transparent" />
  <div className="absolute inset-x-0 bottom-0 h-[7%] pointer-events-none rounded-b-[21px]
                  bg-gradient-to-t from-black/90 to-transparent border-b-[1.5px] border-[#C8A754]/50
                  shadow-[inset_0_-3px_6px_rgba(0,0,0,0.7)]" />
  <div className="relative z-10 px-4 py-3 text-xs sm:text-sm text-white leading-relaxed
                  whitespace-pre-wrap font-medium tracking-[-0.01em]
                  drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">{renderFormattedText(msg.text)}</div>
</motion.div>
```

**Model bubble** (left-aligned, with avatar):
```jsx
<motion.div initial={{ opacity: 0, scale: 0.15, x: -24, y: 2 }}
  animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
  transition={{ type: "spring", stiffness: 340, damping: 24, mass: 0.7 }}
  style={{ transformOrigin: "top left" }}
  className="relative max-w-[84%] rounded-[22px] origin-top-left overflow-hidden backdrop-blur-2xl
             bg-white/[0.07] border border-[#C8A754]/20
             shadow-[0_10px_28px_rgba(0,0,0,0.5),0_0_16px_rgba(200,167,84,0.08),inset_0_1px_1.5px_rgba(200,167,84,0.3)] group">
  <div className="absolute inset-x-0 top-0 h-[36%] pointer-events-none rounded-t-[21px]
                  bg-gradient-to-b from-[#C8A754]/24 via-[#C8A754]/06 to-transparent" />
  <div className="absolute inset-x-0 bottom-0 h-[38%] pointer-events-none rounded-b-[21px]
                  bg-gradient-to-t from-[#C8A754]/22 via-[#C8A754]/05 to-transparent
                  border-b-[1.5px] border-[#C8A754]/40
                  shadow-[inset_0_-6px_14px_rgba(200,167,84,0.14)]" />
  <div className="relative z-10 px-4 py-3.5 text-xs sm:text-sm text-neutral-200 leading-relaxed
                  whitespace-pre-wrap font-normal tracking-[-0.01em]">{renderFormattedText(msg.text)}</div>
</motion.div>
```
Avatar: `motion.div` `{ scale: 0.7, opacity: 0 } → { scale: 1, opacity: 1 }`, `duration: 0.2`, `className="shrink-0 mt-0.5"`, `<AIAssistantAvatar size={22} glow trackCursor={false} blink={true} />`.

**Loading row:**
```jsx
<motion.div initial={{ opacity: 0, scale: 0.9, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }}
  exit={{ opacity: 0, scale: 0.9, y: 8 }}
  transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
  className="flex items-center gap-2.5 py-1.5">
  <div className="shrink-0" title="Thinking...">
    <AIAssistantAvatar size={22} glow trackCursor={false} blink={true} />
  </div>
  <SiriThinkingAnimation size="sm" />
</motion.div>
```

**Quick suggestions** — rendered only when `messages.length <= 2 && !isLoading`:
```jsx
<div className="flex items-center gap-1 text-[11px] font-mono text-neutral-400 mb-2">
  <Sparkles size={11} className="text-[#C8A754]" />Suggested queries:
</div>
```
`SUGGESTIONS`:
```js
["Tell me about Xplora Travel Agent",
 "What is Ryan's tech stack?",
 "Show me his certifications",
 "How can I contact Ryan?"]
```
Chip classes: `text-[11px] font-mono text-neutral-300 bg-white/5 hover:bg-[#C8A754]/10 hover:border-[#C8A754]/40 hover:text-[#C8A754] border border-white/10 px-2.5 py-1 rounded-full transition-all text-left`; container `flex flex-wrap gap-1.5`.

**Input bar** — `p-3 bg-black/60 border-t border-white/10 flex items-center gap-2`:
```jsx
<input type="text" value={input} placeholder="Ask about projects, skills, certifications..."
  className="flex-1 bg-white/5 text-white placeholder-neutral-500 rounded-full px-4 py-2
             text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#C8A754]
             border border-white/10" />
```
Enter sends (Shift+Enter does nothing — no multiline).

Send button:
```
w-10 h-10 flex items-center justify-center shrink-0 bg-[#C8A754] text-black rounded-full
hover:bg-[#a8863d] hover:scale-105 active:scale-95 disabled:opacity-35
disabled:hover:scale-100 disabled:cursor-not-allowed transition-all
shadow-[0_0_14px_rgba(200,167,84,0.4)] hover:shadow-[0_0_20px_rgba(200,167,84,0.7)]
```

**Effects:**
- `scrollIntoView({ behavior: 'smooth' })` on `[messages, isLoading, isOpen]`
- Input autofocus 150 ms after opening
- **Minimum 1100 ms** perceived thinking time — the response is awaited together with a 1100 ms timer, so fast API replies still feel considered:
  ```js
  const minThinkingTime = new Promise(r => setTimeout(r, 1100));
  const [responseText] = await Promise.all([sendChatMessage(userMsg, newHistory), minThinkingTime]);
  ```
- On error, `console.error('Chat error:', err)` and append:
  > I'm here to answer questions about Ryan's projects, skills, or background. Feel free to ask or reach out to Rg05.koickal@gmail.com!

**`renderFormattedText`** — minimal markdown: splits on `/(\*\*.*?\*\*|`.*?`)/g`, renders `**bold**` as `<strong className="font-semibold text-white">` and `` `code` `` as `` `bg-white/10 px-1 py-0.5 rounded text-[#C8A754] text-xs font-mono` ``.

### 7.3 AIAssistantAvatar ("Livoq's face")

Props `{ size = 28, className, glow = true, trackCursor = true, blink = true }`.

**Pebble path (verbatim):**
```
M 57.5 15.5 C 65.5 15.5, 72.8 17.2, 78.5 20.2 C 84.2 23.2, 87.6 28.5, 89.2 36.0
C 90.2 40.8, 90.0 46.5, 89.2 51.5 C 88.0 59.0, 85.0 66.5, 80.5 72.5
C 75.5 79.2, 67.5 83.8, 59.5 85.2 C 54.5 86.0, 48.5 85.8, 42.0 84.8
C 34.0 83.2, 25.5 79.2, 19.5 73.0 C 13.5 66.8, 10.0 58.5, 9.5 49.5
C 9.0 41.5, 11.5 33.5, 16.0 27.2 C 20.5 21.0, 27.8 17.5, 36.5 16.0
C 43.5 15.0, 51.0 15.5, 57.5 15.5 Z
```

**Gradient IDs must be unique per instance** — `const idPrefix = useRef(\`avatar-${Math.random().toString(36).substring(2, 8)}\`).current;`

```xml
<linearGradient id="{id}-neonGradient" x1="20%" y1="12%" x2="85%" y2="88%">
  <stop offset="0%"   stopColor="#2df7ff" />
  <stop offset="45%"  stopColor="#C8A754" />
  <stop offset="100%" stopColor="#0077ff" />
</linearGradient>
<linearGradient id="{id}-specularSheen" x1="50%" y1="15%" x2="50%" y2="60%">
  <stop offset="0%"   stopColor="rgba(255, 255, 255, 0.55)" />
  <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
</linearGradient>
<linearGradient id="{id}-eyeColor" x1="0%" y1="0%" x2="0%" y2="100%">
  <stop offset="0%"   stopColor="#04060d" />
  <stop offset="100%" stopColor="#070c17" />
</linearGradient>
```

**Glow** (`glow` true): `absolute inset-[-35%] rounded-full pointer-events-none`, `radial-gradient(circle, rgba(200,167,84,0.45) 0%, rgba(200,167,84,0) 70%)`

**`<g ref={blobGroupRef}>` body** — four stacked paths:
1. aura stroke: `stroke="#C8A754"` `strokeWidth="3.0"` `opacity="0.38"` `fill="none"`
2. body fill: `url(#{id}-neonGradient)`
3. gloss: `url(#{id}-specularSheen)`
4. rim light: `fill="none"` `stroke="rgba(255, 255, 255, 0.55)"` `strokeWidth="1.2"`

**`<g ref={eyesGroupRef}>` eyes** — two vertical capsules filled with `url(#{id}-eyeColor)`:
- left: `x=36.8 y=37.5 w=9.4 h=19.0 rx=4.7 ry=4.7`
- right: `x=59.3 y=36.5 w=9.4 h=19.0 rx=4.7 ry=4.7` (1 px higher, matching the reference image)

**Cursor tracking** (only when `trackCursor`, used for the FAB avatar):
```js
const factor      = Math.min(1, distance / 200);
const angle       = Math.atan2(dy, dx);
targetBodyX = Math.cos(angle) * (factor * 4.8);
targetBodyY = Math.sin(angle) * (factor * 3.6);
targetRotate = Math.cos(angle) * (factor * 5.5);      // ±5.5° lean
targetEyeX  = Math.cos(angle) * (factor * 11.0);
targetEyeY  = Math.sin(angle) * (factor * 9.0);
```
Lerp rates: body `0.12`, eyes `0.16`. Element centre is cached on mount and on `resize`.

**DOM writes only when the string changes** (avoids re-rasterising the SVG):
```js
// body
`translate(${cx.toFixed(1)}, ${cy.toFixed(1)}) rotate(${rot.toFixed(1)}, 50, 50)`
// eyes
`translate(${ex.toFixed(1)}, ${ey.toFixed(1)}) translate(0, 46.5) scale(1, ${bs.toFixed(2)}) translate(0, -46.5)`
```
The eyes' nested `translate(0, 46.5) … translate(0, -46.5)` scales about y = 46.5 (the eye centre).

**Blink** (`blink` true): next blink at `Date.now() + 3000 + random*3000`; while blinking, `blinkProgress += 0.18` and `blinkScale = 1 - sin(progress * π) * 0.9`; on completion `blinkScale = 1` and the next blink is scheduled at `now + 3500 + random*3500`.

SVG classes: `w-full h-full overflow-visible transition-transform duration-200 hover:scale-108` (`scale-108` is not a real Tailwind class — a no-op; keep it).

### 7.4 SiriThinkingAnimation ("Thinking..." pill)

Canvas-rendered liquid wave inside a glass capsule.

**Sizes:**

| size | box | text |
|---|---|---|
| `xs` | `w-[112px] h-[34px]` | `text-[12px]` |
| `sm` | `w-[126px] h-[38px]` | `text-[13.5px]` |
| `md` | `w-[151px] h-[46px]` | `text-[15px]` |
| `lg` | `w-[198px] h-[60px]` | `text-[18px]` |

**Structure:**
- Outer: `relative inline-flex items-center justify-center select-none`, `style={{ filter: 'drop-shadow(0 10px 24px rgba(0,0,0,0.85))' }}`
- Breathing glow: `absolute -inset-1.5 rounded-full opacity-70 blur-md pointer-events-none animate-pulse`, `linear-gradient(90deg, rgba(0,102,255,0.3) 0%, rgba(200,167,84,0.45) 50%, rgba(56,189,248,0.35) 100%)`, `animationDuration: '2.8s'`
- Capsule: `relative overflow-hidden rounded-full {size} flex items-center justify-center border border-[#C8A754]/25`, `background: '#04070c'`, and:
  ```js
  boxShadow: `
    inset 0 1.5px 2px rgba(255, 255, 255, 0.45),
    inset 0 -1.5px 2px rgba(200, 167, 84, 0.2),
    inset 0 0 14px rgba(0, 0, 0, 0.7),
    0 6px 20px rgba(200, 167, 84, 0.15),
    0 10px 26px rgba(0, 0, 0, 0.8)
  `
  ```
- Canvas: `absolute inset-0 w-full h-full pointer-events-none`
- Gloss sheen: `linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.02) 40%, rgba(0,0,0,0.2) 100%)`, `boxShadow: inset 0 1px 1px rgba(255,255,255,0.5)`
- Label: white, `font-medium`, SF-stack font-family, `textShadow: '0 1px 4px rgba(0,0,0,0.9), 0 0 10px rgba(200,167,84,0.5)'`, `letterSpacing: '-0.015em'`

**Canvas render (per frame):**
1. `dpr = Math.min(devicePixelRatio, 2)`; back-buffer resized to `clientWidth * dpr`.
2. `time += 0.032`
3. `baseHeight = height * 0.49`
4. Fill `#04070c`
5. Blurred ambience (`ctx.filter = blur(max(4, round(height * 0.16)))`) — three ellipses:
   - left at `(0.16w, base - 0.10h)` radii `(0.22w, 0.25h)`: `rgba(0,102,255,0.5)` → `rgba(0,85,255,0.22)` → transparent
   - centre at `(0.53w, base - 0.14h)` radii `(0.28w, 0.30h)`: `rgba(200,167,84,0.65)` → `rgba(56,189,248,0.35)` → transparent
   - right at `(0.86w, base - 0.11h)` radii `(0.24w, 0.28h)`: `rgba(56,189,248,0.55)` → `rgba(0,140,255,0.28)` → transparent
6. Wave path — 60 steps, quadratic midpoint smoothing. Gaussian crest biases:
   ```js
   leftBias   = exp(-((nx - 0.16) / 0.13) ** 2) * (height * 0.11);
   centreBias = exp(-((nx - 0.53) / 0.17) ** 2) * (height * 0.085);
   rightBias  = exp(-((nx - 0.85) / 0.14) ** 2) * (height * 0.12);
   wave1 = sin(nx * 8.5  + time * 1.5) * (height * 0.045);
   wave2 = cos(nx * 13.0 - time * 1.8) * (height * 0.026);
   wave3 = sin(nx * 4.2  + time * 0.8) * (height * 0.032);
   y = baseHeight - leftBias - centreBias - rightBias + (wave1 + wave2 + wave3) * 0.8;
   ```
7. **Milky fluid fill** (bottom region): vertical gradient `#e8f4f8` → `#d0e5ee` (0.2) → `#9cb8c9` (0.6) → `#506e82` (1.0).
8. **Cyan crest fill**, same path closed to the bottom, `globalCompositeOperation: 'source-atop'` then `'destination-in'` with a vertical fade `rgba(0,0,0,1)` → `rgba(0,0,0,0.88)` (0.45) → transparent. Horizontal gradient stops:
   `0.00 rgba(0,102,255,0.95)` · `0.18 rgba(0,140,255,1)` · `0.36 rgba(2,175,240,1)` · `0.52 rgba(200,167,84,1)` · `0.68 rgba(186,246,255,1)` · `0.84 rgba(56,189,248,1)` · `1.00 rgba(0,119,255,0.95)`
9. **Crest stroke**: horizontal gradient `0.05 rgba(0,119,255,0.85)` · `0.30 rgba(200,167,84,1)` · `0.55 rgba(235,253,255,1)` · `0.75 rgba(200,167,84,1)` · `0.95 rgba(56,189,248,0.85)`; `lineWidth = max(1.1, height * 0.03)`; `filter: blur(0.5px)`.
10. **Top specular band**: `linear-gradient(0, rgba(255,255,255,0.4), transparent)` over the top `max(4, height * 0.12)`.

The loop early-returns after `requestAnimationFrame(render)` when `document.hidden`.

### 7.5 geminiService — API chain and knowledge base

**API key resolution order** (`getStoredApiKey`):
1. `localStorage.getItem('user_gemini_api_key')` (trimmed, if non-empty)
2. `process.env.API_KEY`
3. `process.env.GEMINI_API_KEY`
4. `import.meta.env.VITE_GEMINI_API_KEY`
5. `window.GEMINI_API_KEY`

`setStoredApiKey(key)` writes/removes the localStorage entry and nulls the cached client. (No UI currently calls it — keep the API.)

**`sendChatMessage(message, history)` — three-tier fallback:**

**Tier 1 — direct browser Gemini SDK** (only if a key resolves). Builds `contents` from `history.slice(-6)` plus the new user turn, then tries each model in `['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash']`:
```js
await client.models.generateContent({
  model, contents,
  config: { systemInstruction: SYSTEM_INSTRUCTION, maxOutputTokens: 250 }
});
```
First non-empty `response.text.trim()` wins; failures fall through to the next model.

**Tier 2 — `POST /api/gemini`** with `{ message, history: history.slice(-6).map(m => ({ role, text })) }`. Accepts only if `response.ok` **and** `content-type` includes `application/json` **and** the parsed body has a non-empty `data.text`. Every failure mode (non-JSON content type, bad JSON, network error) falls through silently.

**Tier 3 — `getOfflinePortfolioAnswer(trimmed, history)`.**

This tier must work with **no API key and no backend** — it is the site's guaranteed baseline.

**`SYSTEM_INSTRUCTION` (verbatim):**

```
You are "Livoq", the intelligent, friendly, and articulate personal AI assistant on Ryan George Koickal's portfolio website.

ABOUT RYAN GEORGE KOICKAL:
- Identity: B.Tech Computer Science & Engineering student at Rajagiri School of Engineering & Technology, Kakkanad, Ernakulam (Sep 2023 – May 2027, CGPA 9.21/10). Python developer and data scientist.
- Location: Kakkanad, Ernakulam, India | Phone: (+91) 9605715441
- Contact & Profiles:
  • Email: Rg05.koickal@gmail.com
  • GitHub: https://github.com/ryan1234814/
  • LinkedIn: https://linkedin.com/in/ryan-george-1a6161283/
  • HuggingFace: https://huggingface.co/coder1969
- Summary: Results-driven Python developer and data scientist with hands-on experience building edge-AI systems, production-grade Generative AI pipelines (RAG), and multi-agent LLM systems.

TECHNICAL SKILLS:
- AI & LLM: LangChain, LangGraph, CrewAI, RAG, FAISS, ChromaDB
- ML & NLP: TensorFlow, PyTorch, Scikit-learn, XGBoost, Random Forest, NLP, JAX (Beginner)
- Data: NumPy, Pandas, SciPy
- Backend & APIs: Flask, FastAPI, MySQL
- Frontend: React, JavaScript, Streamlit
- Deployment: Vercel, Netlify, Render | Cloud: GCP (Basic) | Tools: Git, GitHub

WORK EXPERIENCE:
- IIIT Kottayam, Research Intern (May 2025 – Jun 2025): offline BirdNET bird recognition on Raspberry Pi with USB mic; Gemini API species profiling; Streamlit dashboard with audio playback and spectrogram/waveform.
- Olcademy, Data Engineering Intern Remote (Mar 2025 – Sep 2025): RestaurantGuru scraping with BeautifulSoup/Selenium to SharePoint; Gemini & Groq LLM agents for review summaries and OpenTable dietary classification; checkpoint-saving pipeline hardening.

FEATURED PROJECTS:
1. Xplora Travel Agent (Dec 2025 – Apr 2026): multi-agent LangGraph with 6 agents and 7 live APIs, under-30s layouts, Streamlit + Google Maps. Stack: Python, LangGraph, Streamlit, Google Maps API, REST APIs.
2. ACP RAG Agent (Feb 2026 – Present): ACP multi-agent doc reasoning with LangChain + CrewAI over academic PDFs via FAISS. Stack: Python 3.11, FastAPI, LangChain, FAISS, CrewAI, Gemini API, Uvicorn, Streamlit.
3. Digital Twin AQI Kerala (Dec 2025 – Feb 2026): real-time AQI + 24h forecast across 12 Kerala stations, physics-guided Random Forest/XGBoost on CAMS/ERA5, React portal. Stack: React, Python, Scikit-learn, XGBoost, CAMS/ERA5.

EDUCATION:
- Rajagiri School of Engineering and Technology, B.Tech CSE, Sep 2023 – May 2027, CGPA 9.21/10.

CERTIFICATIONS (Codecademy Professional):
- Building AI Apps via RAG, Deep Learning with TensorFlow, Text Classification with PyTorch, Advanced Data Analysis with Python, Machine Learning Model Architecture.

SCOPE RESTRICTIONS:
- Answer ONLY questions related to Ryan George, his portfolio, education, projects, skills, certifications, achievements, experience, contact information, or hiring.
- You may respond to simple greetings such as "hi", "hello", "hey", "good morning", "how are you?", and polite messages such as "thanks" or "bye".
- For ANY unrelated question, do NOT answer the question.
- Unrelated questions include general knowledge, mathematics, science, programming unrelated to Ryan, homework, recipes, politics, entertainment, creative writing, or unrelated people, companies, or topics.
- For unrelated questions, politely reject the request in one or two short sentences and redirect the user toward Ryan's portfolio.
- Never provide an answer to an unrelated question.

RESPONSE LENGTH:
- Every response MUST be 600 characters or fewer.
- This includes spaces and punctuation.

INSTRUCTIONS FOR RESPONSES:
- Provide friendly, intelligent, crisp, and helpful answers.
- Highlight Ryan's strengths in edge-AI, RAG, multi-agent LLMs, and data science.
- For hiring, collaboration, or general inquiries, invite users to contact Rg05.koickal@gmail.com.
```

**Offline engine — `tryEvaluateMath(query)` (runs first):**
```js
const clean = query.replace(/what is|calculate|evaluate|equals|solve|\?|\=/gi, '').trim();
if (/^[\d\s\+\-\*\/\(\)\.\%\^]+$/.test(clean) && /\d/.test(clean)) {
  const sanitized = clean.replace(/\^/g, '**');
  const result = Function(`'use strict'; return (${sanitized})`)();
  if (typeof result === 'number' && !isNaN(result) && isFinite(result))
    return `The calculated result for \`${clean}\` is **${result}**.`;
}
```
The character-class guard is what makes `Function` safe here — only digits and operators pass.

**Offline engine — branch order (first match wins).** All matching is on `msg.toLowerCase().trim()`.

| # | Condition | Response |
|---|---|---|
| 1 | Math expression (§ above) | computed result |
| 2 | Greeting regex (see below) | one of 3 random greetings |
| 3 | Identity — "who made/built/created you" | "I was created by **Ryan George Koickal** as an interactive AI assistant for his portfolio!" |
| 3b | Identity — other identity keys | "I'm **Livoq**, Ryan George's AI assistant. I know his Xplora/ACP-RAG/AQI projects, IIIT Kottayam & Olcademy internships, 9.21 CGPA, and 5 Codecademy certifications." |
| 4 | "how are you" / "how are u" / "whats up" / "what's up" | "I'm running great! What would you like to discover about Ryan's AI projects, toolkit, or experience?" |
| 5 | "what can you do" / "how can you help" / "help me" / `=== 'help'` / "menu" / "what can i ask" | see capability list below |
| 6 | "thank" / "thx" / "awesome" / "great" | "Thank you! Let me know if you want deeper detail on any project, certification, or collaboration with Ryan!" |
| 7 | "bye" / "goodbye" / "see you" / "take care" | "Goodbye! Reach Ryan anytime at **Rg05.koickal@gmail.com**!" |
| 8 | "joke" / "funny" / "make me laugh" | "Why do Python devs prefer RAG? Because they hate forgetting context! Ask me about Ryan's RAG pipelines!" |
| 9 | "xplora" / "travel agent" / "travel planner" | Xplora answer |
| 10 | "acp" / "rag agent" / (`"rag"` && !`"what is"`) | ACP answer |
| 11 | "aqi" / "digital twin" / "air quality" / "kerala" | AQI answer |
| 12 | "bird" / "birdnet" / "raspberry" / "edge" | Bird answer |
| 13 | "project" / "portfolio" / "built" / "work" | 5-project list |
| 14 | "education" / "college" / "degree" / "study" / "rajagiri" / "cgpa" / "gpa" / "school" | Education answer |
| 15 | "experience" / "internship" / "intern" / "iiit" / "kottayam" / "olcademy" | Experience answer |
| 16 | "certificat" / "credential" / "codecademy" / "course" | Certifications answer |
| 17 | "skill" / "stack" / "tech" / "tool" | Toolkit answer |
| 18 | "python" | Python answer |
| 19 | "langchain" / "langgraph" / "crewai" / "multi-agent" / "llm" | Multi-agent answer |
| 20 | "where" / "location" / "based" / "kerala" / "kakkanad" | Location answer |
| 21 | "who is ryan" / "about ryan" / "bio" / "summary" / "profile" | Bio answer |
| 22 | "hire" / "collaborat" / "opportunity" / "freelance" | Hiring answer |
| 23 | "contact" / "email" / "reach" / "phone" / "touch" | Contact block |
| 24 | "github" | GitHub link |
| 25 | "linkedin" | LinkedIn link |
| 26 | "huggingface" / "hugging face" / "hf" | HuggingFace link |
| 27 | *(fallback)* | menu card |

> ⚠️ **Order matters.** Branch 11 tests `"kerala"` before branch 20, so "where is Kerala" returns the AQI answer. Branch 10 excludes `"what is"` from the bare-`rag` case. Branch 13 (`"work"`) precedes branch 14. **Preserve this exact order** — reordering changes answers.

Greeting regexes:
```js
/^(hi|hello|hey|greetings|howdy|sup|yo|hiya|namaste|vanakkam|hola|bonjour|aloha|salut|oi|hallo|ciao)[\s!.,?]*$/i
/^(hi|hello|hey|yo)\s+(there|livoq|bot|assistant|ryan|buddy|friend|bro)[\s!.,?]*$/i
/^(good\s+(morning|afternoon|evening|day|night))[\s!.,?]*$/i
```

**Exact reply strings** (newline and bullet characters are significant — they render via `whitespace-pre-wrap`):

**Greetings (random pick of 3):**
```
Hello! I'm **Livoq**, Ryan George's personal AI assistant. Ask about his edge-AI, RAG, and multi-agent LLM projects, data-science skills, or internships!
```
```
Hey there! I'm **Livoq**, the guide to Ryan George's portfolio. Explore Xplora, ACP RAG Agent, AQI Digital Twin, or his IIIT & Olcademy experience.
```
```
Greetings! I'm **Livoq**. I can share Ryan's Python/AI toolkit, Codecademy certifications, CGPA 9.21 record, or contact details.
```

**Capability list (branch 5):**
```
Explore:

• **Projects**: Xplora Travel Agent, ACP RAG Agent, Digital Twin AQI Kerala
• **Experience**: IIIT Kottayam Research Intern, Olcademy Data Engineering Intern
• **Skills**: LangChain, LangGraph, CrewAI, RAG, FAISS, TensorFlow, PyTorch, Scikit-learn, FastAPI
• **Education**: B.Tech CSE, Rajagiri (CGPA 9.21/10)
• **Certifications**: 5x Codecademy (RAG, TensorFlow, PyTorch, Data Analysis, ML Architecture)
• **Contact**: `Rg05.koickal@gmail.com`, LinkedIn, GitHub, HuggingFace
```

**Xplora:**
```
**Xplora Travel Agent (Dec 2025 – Apr 2026)**: LangGraph multi-agent system with 6 agents (Budget, Itinerary, Weather, etc.) + 7 live APIs, layouts in under 30s, Streamlit + Google Maps. Stack: Python, LangGraph, Streamlit, Maps API, REST.
```

**ACP:**
```
**ACP RAG Agent (Feb 2026 – Present)**: ACP multi-agent doc reasoning with LangChain + CrewAI over academic PDFs via FAISS semantic search. Stack: Python 3.11, FastAPI, LangChain, FAISS, CrewAI, Gemini, Uvicorn, Streamlit.
```

**AQI:**
```
**Digital Twin AQI Kerala (Dec 2025 – Feb 2026)**: real-time AQI + 24h forecast across 12 Kerala stations, physics-guided Random Forest/XGBoost on CAMS/ERA5, React portal. Stack: React, Python, Scikit-learn, XGBoost.
```

**Bird:**
```
**Edge-AI Bird Recognition (IIIT Kottayam, 2025)**: offline Raspberry Pi + BirdNET + USB mic for field classification, Gemini species profiles, Streamlit spectrogram dashboard.
```

**Project list:**
```
Ryan's projects:

1. **Xplora Travel Agent** — LangGraph multi-agent travel planner
2. **ACP RAG Agent** — multi-agent PDF reasoning with FAISS
3. **Digital Twin AQI Kerala** — 12-station forecast with XGBoost
4. **Edge-AI Bird Recognition** — Raspberry Pi + BirdNET
5. **Restaurant Intelligence** — Gemini/Groq agents + scraping
```

**Education:**
```
**Ryan's Education**: B.Tech CSE at **Rajagiri School of Engineering & Technology**, Kakkanad (Sep 2023 – May 2027), **CGPA 9.21/10**.
```

**Experience:**
```
**IIIT Kottayam Research Intern (May–Jun 2025)**: Edge-AI BirdNET on Pi + Gemini profiles + Streamlit.
**Olcademy Data Engineering Intern (Mar–Sep 2025, Remote)**: RestaurantGuru scraping to SharePoint + Gemini/Groq review/dietary agents + checkpoint hardening.
```

**Certifications:**
```
Ryan holds **5 Codecademy Professional certifications**: Building AI Apps via RAG, Deep Learning with TensorFlow, Text Classification with PyTorch, Advanced Data Analysis with Python, Machine Learning Model Architecture.
```

**Toolkit:**
```
Ryan's toolkit:
• **AI/LLM**: LangChain, LangGraph, CrewAI, RAG, FAISS, ChromaDB
• **ML/NLP**: TensorFlow, PyTorch, Scikit-learn, XGBoost, NLP, JAX (beginner)
• **Data**: NumPy, Pandas, SciPy
• **Backend**: Flask, FastAPI, MySQL
• **Frontend**: React, JS, Streamlit
• **Deploy**: Vercel, Netlify, Render, GCP basic
```

**Python:**
```
Python is Ryan's core language — RAG agents, LangGraph pipelines, FastAPI backends, scraping, and ML with TensorFlow/PyTorch/Scikit-learn.
```

**Multi-agent:**
```
Ryan builds **multi-agent LLM systems** with LangChain, LangGraph, CrewAI, Gemini/Groq APIs, FAISS/ChromaDB, and ACP orchestration.
```

**Location:**
```
Ryan is based in **Kakkanad, Ernakulam, Kerala, India**.
```

**Bio:**
```
**Ryan George Koickal** is a B.Tech CSE student (9.21 CGPA) and Python developer/data scientist building edge-AI, RAG, and multi-agent LLM systems into actionable apps.
```

**Hiring:**
```
**Why work with Ryan?** Edge-AI + production RAG + multi-agent LLMs, 2 internships, 3 flagship AI projects, 9.21 CGPA. Contact **Rg05.koickal@gmail.com**.
```

**Contact:**
```
Contact Ryan:
• **Email**: Rg05.koickal@gmail.com
• **Phone**: (+91) 9605715441
• **LinkedIn**: https://linkedin.com/in/ryan-george-1a6161283/
• **GitHub**: https://github.com/ryan1234814/
• **HuggingFace**: https://huggingface.co/coder1969
```

**GitHub / LinkedIn / HuggingFace:**
```
Ryan's GitHub: **https://github.com/ryan1234814/**.
```
```
Ryan's LinkedIn: **https://linkedin.com/in/ryan-george-1a6161283/**.
```
```
Ryan's HuggingFace: **https://huggingface.co/coder1969**.
```

**Fallback:**
```
I'm **Livoq**, Ryan George's AI assistant!

Ask about:
• **Projects**: Xplora, ACP RAG Agent, AQI Digital Twin
• **Experience**: IIIT Kottayam, Olcademy
• **Skills**: LangChain, RAG, FAISS, PyTorch, FastAPI
• **Contact**: **Rg05.koickal@gmail.com**!
```

---

## 8. Types → plain shapes

The `.ts` types become JSDoc-free plain objects in `.js`:

```js
// types.js (informational — no runtime exports)
// PageTab = 'home' | 'profile' | 'education' | 'projects' | 'certificates'
//          | 'achievements' | 'experience' | 'contact' | '404'
// Project  = { id:number, title:string, category:string, year:string,
//              image:string, description:string, link?:string }
// NavItem  = { label:string, href:string }
// ChatMessage = { role:'user'|'model', text:string }
// SkillData = { subject:string, A:number, fullMark:number }
```

Optionally emit them as JSDoc typedefs on `constants.js`. **Do not** run a TS→JS transpiler over the source; the conversion is manual and mechanical.

---

## 9. 404

### 9.1 React `NotFound` (in-app)

Rendered when `resolveCurrentPage()` returns `'404'`. On this route **App skips `ScrollHUD`, `Header`, `AIChat`, and the Apple loader** entirely and renders:

```jsx
<>
  <LiquidBackground />
  <InteractiveParticles />
  <div className="relative z-10 md:cursor-none min-h-screen flex flex-col justify-between">
    <NotFound onGoHome={() => handleNavigate('home')} />
  </div>
  <motion.div className="glass-cursor-dark fixed top-0 left-0 w-5 h-5 rounded-full
                          pointer-events-none z-[9999] hidden md:block"
               style={{ x: cursorX, y: cursorY, scale: cursorScale }} />
</>
```

`NotFound` itself is a light-themed counterpoint to the rest of the site:

```jsx
<section className="page_404 min-h-screen w-full bg-white text-[#333333] flex items-center
                    justify-center py-10 px-4 select-none"
         style={{ fontFamily: "'Arvo', serif" }}>
  <div className="container mx-auto max-w-4xl">
    <div className="flex justify-center">
      <div className="w-full sm:w-10/12 text-center">
        <div className="four_zero_four_bg w-full h-[400px] bg-center bg-no-repeat"
             style={{ backgroundImage: isConnecting
               ? `url('${connectGifSrc}'), url('/dribbble_connected.gif'), url('./dribbble_connected.gif')`
               : "url('/dribbble_1.gif'), url('./dribbble_1.gif')" }}>
          <h1 className="text-center text-[80px] leading-none font-normal text-[#333333]">404</h1>
        </div>

        <div className="contant_box_404 -mt-[50px]">
          <h3 className="text-[28px] sm:text-[30px] leading-tight font-normal text-[#333333] mb-2">
            Look like you're lost
          </h3>
          <p className="text-[#333333] text-base mb-5">
            the page you are looking for not avaible!
          </p>
          <a href="/" onClick={handleHomeClick} className="group relative inline-flex items-center
               justify-center gap-4 md:gap-5 px-8 py-3.5 md:px-10 md:py-4 my-3 rounded-full
               overflow-hidden bg-[#080a0f] backdrop-blur-sm border border-white/15
               hover:border-[#C8A754]/40 shadow-2xl transition-all no-underline">
            <div className="absolute inset-0 bg-[#C8A754] origin-right scale-x-0
                            transition-transform duration-500 ease-out group-hover:origin-left
                            group-hover:scale-x-100" />
            <span className="relative z-10 text-lg md:text-2xl font-bold uppercase tracking-tight
                             font-poppins text-neutral-200 group-hover:text-black
                             transition-colors duration-300">Go to Home</span>
            <svg …strokeWidth="2.5" className="relative z-10 w-5 h-5 md:w-7 md:h-7 text-neutral-400
                                       group-hover:text-black transition-colors duration-300 shrink-0">
              <path d="M6 18 L15.2 8.8" /><path d="M18 6 L9 6" /><path d="M18 10 L18 16" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  </div>
</section>
```

**GIF swap behaviour:**
- On mount, preload `/dribbble_connected.gif` via `new Image()`.
- `handleHomeClick` → `preventDefault()`; guard `if (isConnecting) return`; set `connectGifSrc = \`/dribbble_connected.gif?t=${Date.now()}\`` (cache-bust so it replays); `setIsConnecting(true)`; after **1500 ms** call `onGoHome()`.
- Cleanup clears the pending timer.

The GIF sits behind the `404` text, so the text stays legible while the animation plays.

### 9.2 `public/404.html` (static GitHub-Pages shim)

Copied verbatim to the build output so GitHub Pages serves it for unknown paths. Title: `404 Page Not Found - Ryan George`.

**Head script — route recovery.** Runs before paint. If the visited path's single segment is a known tab (including legacy `work`), redirect to the real app:
```js
var validTabs = ['home','profile','experience','education','projects','work',
                 'achievements','certificates','contact'];
var repoFolders = ['my-portfolio', 'portfolio'];
// strip repo base → basePath = '/<repo>/', routeSegments = rest
// if routeSegments.length === 1 && validTabs.includes(page):
//   window.location.replace(basePath + (targetTab === 'home' ? '' : '?page=' + targetTab));
```
This is why §3.1's query-param tier exists — the static shim hands off via `?page=`.

**Styles** (standalone, not Tailwind):
```css
* { box-sizing: border-box; margin: 0; padding: 0; }
body { background:#fff; color:#333; font-family:'Arvo',serif; min-height:100vh;
       display:flex; align-items:center; justify-content:center; }
.page_404 { padding:40px 16px; background:#fff; font-family:'Arvo',serif;
            width:100%; max-width:900px; margin:0 auto; text-align:center; }
.four_zero_four_bg { background-image:url('/dribbble_1.gif'), url('./dribbble_1.gif');
                     height:400px; background-position:center; background-repeat:no-repeat; }
.four_zero_four_bg h1 { font-size:80px; line-height:1; font-weight:400; text-align:center; color:#333; }
.contant_box_404 { margin-top:-50px; }
.contant_box_404 h3 { font-size:30px; font-weight:400; color:#333; margin-bottom:8px; }
.contant_box_404 p { font-size:16px; color:#333; margin-bottom:20px; }
.link_404 { position:relative; display:inline-flex; align-items:center; justify-content:center;
            gap:18px; padding:14px 36px; margin:12px 0; border-radius:9999px; overflow:hidden;
            background:#080a0f; border:1px solid rgba(255,255,255,0.15);
            box-shadow:0 25px 50px -12px rgba(0,0,0,0.25); text-decoration:none;
            transition:border-color .3s ease, box-shadow .3s ease; }
.link_404::before { content:''; position:absolute; inset:0; background:#C8A754;
                    transform-origin:right; transform:scaleX(0); transition:transform .5s ease-out; }
.link_404:hover { border-color:rgba(200,167,84,0.4); }
.link_404:hover::before { transform-origin:left; transform:scaleX(1); }
.link_404 span { position:relative; z-index:10; font-family:'Poppins',sans-serif; font-size:22px;
                 font-weight:700; text-transform:uppercase; letter-spacing:-0.025em; color:#e5e5e5;
                 transition:color .3s ease; }
.link_404 svg { position:relative; z-index:10; width:24px; height:24px; color:#a3a3a3;
                 flex-shrink:0; transition:color .3s ease; }
.link_404:hover span, .link_404:hover svg { color:#000; }
```

**Body script** — mirrors the React version: preload the connect GIF, recompute `targetHref` (`/` or `/<repo>/`), set it on `#home-link`, and on click swap `.four_zero_four_bg`'s `background-image` to the cache-busted connected GIF then `window.location.href = targetHref` after 1500 ms.

---

## 10. Project structure & tooling

```
my-portfolio/
├── index.html            # Tailwind CDN, fonts, global CSS, GA tag
├── index.jsx             # React root (StrictMode)
├── App.jsx
├── constants.js          # NAV_ITEMS, PROJECTS, SKILLS_DATA
├── vite.config.js
├── package.json
├── components/
│   ├── About.jsx
│   ├── Achievements.jsx
│   ├── AIAssistantAvatar.jsx
│   ├── AIChat.jsx
│   ├── AppleHelloLoader.jsx
│   ├── Certificates.jsx
│   ├── Education.jsx
│   ├── Experience.jsx
│   ├── FloatingDock.jsx
│   ├── Footer.jsx
│   ├── GoalNetTransition.jsx
│   ├── Header.jsx
│   ├── Hero.jsx
│   ├── InteractiveParticles.jsx
│   ├── LiquidBackground.jsx
│   ├── NotFound.jsx
│   ├── ProjectList.jsx
│   ├── ScrollHUD.jsx
│   └── SiriThinkingAnimation.jsx
├── services/
│   └── geminiService.js
└── public/               # copied verbatim to build output
    ├── 404.html
    ├── dribbble_1.gif
    ├── dribbble_connected.gif
    ├── achievements/nsoc-contributions.png
    └── certificates/*.png|jpg
```

**`index.jsx`:**
```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Could not find root element to mount to');

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode><App /></React.StrictMode>
);
```

**`vite.config.js`** — note it inlines the Gemini key at build time and emits to `docs/` for GitHub Pages:
```js
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const geminiApiKey = env.GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';

  return {
    base: './',
    build: { outDir: 'docs', emptyOutDir: true },
    server: { port: 3000, host: '0.0.0.0' },
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(geminiApiKey),
      'process.env.GEMINI_API_KEY': JSON.stringify(geminiApiKey),
      'import.meta.env.VITE_GEMINI_API_KEY': JSON.stringify(geminiApiKey),
    },
    resolve: { alias: { '@': path.resolve(__dirname, '.') } },
  };
});
```

**`package.json`** — dependencies to install. `jspdf` and `simple-icons` are currently declared but **unused**; keep them declared for parity, or drop them — either is acceptable, but say which you did.

```json
{
  "name": "my-portfolio",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "predeploy": "npm run build",
    "deploy": "gh-pages -d docs"
  },
  "dependencies": {
    "@google/genai": "^1.30.0",
    "framer-motion": "^12.23.24",
    "jspdf": "^4.2.1",
    "lucide-react": "^0.554.0",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "recharts": "^3.4.1",
    "simple-icons": "^16.28.0"
  },
  "devDependencies": {
    "@types/node": "^22.14.0",
    "@vitejs/plugin-react": "^5.0.0",
    "gh-pages": "^6.1.1",
    "typescript": "~5.8.2",
    "vite": "^6.2.0"
  }
}
```

**Files to delete:** `tsconfig.json`. **Files not to create:** `tsconfig`, `*.ts`, `*.tsx`, `types.ts`.

**Analytics** — Google gtag ID `G-YNLVLNRPDW` in `<head>`, before everything:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-YNLVLNRPDW"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-YNLVLNRPDW');
</script>
```

**`<title>`:** `Ryan George - Portfolio`

**`metadata.json`** (hosting-platform hint, copy as-is):
```json
{
  "name": "My Portfolio",
  "description": "Ryan George Koickal — Python developer & data scientist portfolio: edge-AI, RAG, multi-agent LLMs, React, FastAPI.",
  "requestFramePermissions": [],
  "majorCapabilities": ["MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API"]
}
```

**Lucide icons used (exact import set per file):**

| File | Icons |
|---|---|
| `About` | `ShieldCheck`, `Cpu`, `Code2`, `Sparkles` |
| `Experience` | `Briefcase`, `Calendar`, `MapPin`, `Building2`, `CheckCircle2`, `ExternalLink` |
| `Education` | `GraduationCap`, `Calendar`, `MapPin`, `Building2` |
| `Achievements` | `Trophy`, `Award`, `Target`, `Flame`, `Star`, `ExternalLink` |
| `Certificates` | `BadgeCheck`, `Calendar`, `Award`, `ExternalLink`, `Maximize2`, `ShieldCheck` |
| `ProjectList` | `ArrowUpRight`, `FolderGit2` |
| `Footer` | `Mail` |
| `FloatingDock` | `Github`, `Linkedin` |
| `AIChat` | `Sparkles` |

> `Target` and `Flame` are imported in `Achievements` but never rendered. **Remove the unused imports** (lint cleanliness) — no visual change.

---

## 11. Assets

### 11.1 Required public files

| Path | Size | Used by |
|---|---|---|
| `dribbble_1.gif` | ~1.37 MB | NotFound + `public/404.html` |
| `dribbble_connected.gif` | ~31 KB | NotFound + `public/404.html` |
| `achievements/nsoc-contributions.png` | ~467 KB | Achievements card #4 |
| `certificates/*.png` + `.jpg` files | 19 files | *referenced but unused — see §11.2* |

Certificate images currently on disk (documented in `public/certificates/README.txt`):
```
IBM - Vulnerability Management.png
HP - Data Science & Analytics.png
Infosys - Programming Fundamentals using Python -  Part 2.png
Infosys - Artificial Intelligence.png
Microsoft - Describe the concept of cybersecurity.png
Digital 101.jpg
IBM - Cybersecurity Fundamentals.png
Cisco - Cyber Threat Management.png
Cisco - Introduction to IoT.png
Deloitte - Technology Job Simulation.png
IEEE - English for Technical Professionals.png
IBM - Quantum Machine Learning.png
IBM - Artificial Intellignece Fundamentals.png
IBM - Developing Front-End Apps with React.jpg
IBM - Software Engineering Essentials.png
IBM - Introduction to Software Engineering.jpg
Cisco - Introduction to Cybersecurity.png
Digital Marketing.jpg
```
Keep these files in place. Keep `README.txt`.

**Optimisation:** `dribbble_1.gif` at 1.37 MB is the largest asset on a page that only ever shows one frame at a time. Convert to an appropriately-sized WebP/MP4 with an `<img>` fallback **only if** it doesn't alter the visual result. If you do, note it as an explicit deviation.

### 11.2 ⚠️ Known gap: certificate images do not exist

`Certificates.tsx` references five files that are **not in `public/certificates/`**:

```
certificates/codecademy-rag.png                ← MISSING
certificates/codecademy-tensorflow.png         ← MISSING
certificates/codecademy-pytorch.png            ← MISSING
certificates/codecademy-data-analysis.png      ← MISSING
certificates/codecademy-ml-architecture.png    ← MISSING
```

**The behaviour to reproduce is the graceful degradation, not the crash:**

1. The `<img>` fires `onError`.
2. `failedImages` records `{ [cert.id]: true }` — **per-certificate**, so one failure never blanks the others.
3. The back face renders the fallback card from §5.9 (award medallion + title + `issuer • year`).
4. The lightbox renders the "Verified Credential" detail panel, which deliberately displays the missing filename under **Target File**.
5. The front face is unaffected — title, issuer, field, year and skill chips all render normally.

**Required:** all five cards must render their front face identically to a build where the images exist, and the back face must show the medallion fallback — **never** a broken-image icon. Verify by flipping a card with the network panel open.

Do **not** remap these entries to the 19 on-disk images, and do not "fix" the filenames. This is a deliberate state of the current site.

---

## 12. Performance requirements

These are functional requirements, measured on the real thing.

| # | Requirement | Verification |
|---|---|---|
| P1 | Particle canvas renders at `devicePixelRatio = 1` | `canvas.width === window.innerWidth` |
| P2 | Particle canvas pauses when `document.hidden` | `isLoopRunning = false`, `cancelAnimationFrame` |
| P3 | Siri thinking canvas early-returns when `document.hidden` | render loop still schedules, draw skipped |
| P4 | Siri thinking canvas DPR capped at 2 | `Math.min(devicePixelRatio, 2)` |
| P5 | Zero Gaussian-blur filters on ambient backgrounds | `LiquidBackground` uses radial gradients only; `blur-3xl` appears only on small, static decorative orbs |
| P6 | Mobile pull gesture writes to `style` via refs, never `setState` | no re-render during drag |
| P7 | `AIAssistantAvatar` writes SVG `transform` attributes, and only when the string changes | no React re-render per frame |
| P8 | Particles batch-drawn — 5 `fill()` calls per frame regardless of count | one path per palette colour |
| P9 | Custom cursor listeners are never attached on touch devices | `matchMedia('(hover: hover) and (pointer: fine)')` gate |
| P10 | Sensor listeners registered `{ passive: true }` | no scroll-blocking |
| P11 | Certificate images `loading="lazy"` + `referrerPolicy="no-referrer"` | |
| P12 | Achievement image `loading="lazy"` | |
| P13 | Resize does not re-init particles for mobile address-bar height changes (<160 px delta with equal width) | particle positions preserved |
| P14 | `InteractiveParticles` effect has `[]` deps; live values flow through refs | no listener churn on navigation |

**Targets:** 60 fps on desktop; ≥50 fps on a mid-range Android. Particle canvas + Framer Motion springs must not exceed a 16.7 ms frame budget on the hero.

---

## 13. Accessibility & resilience

- The custom cursor is `aria-hidden` in effect (decorative div, `pointer-events-none`) and only active on fine pointers.
- `#parallax-particles-canvas` carries `aria-hidden="true"`.
- Icon-only buttons carry `aria-label`: hamburger, chat FAB, chat close, send, certificate close, and each dock item.
- Escape closes: the nav menu and the certificate modal.
- `prefers-reduced-motion` is respected by the particle canvas (lerp `0.08 → 0.03`, shimmer frozen). It is **not** yet respected by Framer Motion animations — adding a global `MotionConfig reducedMotion="user"` would change the load/transition experience, so it is deliberately left out of scope. Note it as a known gap.
- The AI chat degrades fully offline (§7.5 tier 3) — a missing key must never surface a stack trace to the user.
- All external links use `target="_blank" rel="noopener noreferrer"`.

---

## 14. Build order

Follow this order; each step is independently verifiable.

1. **Scaffold** — `package.json`, `vite.config.js`, `index.html` (Tailwind CDN + fonts + all §2.4 CSS + gtag), `index.jsx`, delete `tsconfig.json`. *Verify:* `npm run dev` serves a blank page with the Manrope font and gold `#C8A754` sample.
2. **Foundation** — `constants.js`, `LiquidBackground.jsx`, `ScrollHUD.jsx`, `InteractiveParticles.jsx`. *Verify:* striped pitch, floodlight, ambient glows, 3px gold progress bar, 65/120 drifting particles that respond to mouse, sphere collapse on `sphereTransitionId` bump.
3. **App shell** — `App.jsx` routing + tab transition + pull gesture + cursor. *Verify:* direct-load `/projects`, back/forward via `popstate`, `#projects` and `?page=projects` both normalise to `/projects`, unknown path → 404.
4. **Content pages** — `Hero`, `About`, `Education`, `Experience`, `Projects`, `Achievements`, `Certificates`, `Footer` + `SkillChart`, `FloatingDock`. *Verify:* all 8 tabs render at both 375 px and 1440 px; footer text matches §2.6.
5. **Overlays** — `GoalNetTransition`, `AppleHelloLoader`. *Verify:* ball rolls in from the left for forward nav and from the right for backward; loader draws "hello" in 2.8 s and skips on click.
6. **AI chat** — `AIAssistantAvatar`, `SiriThinkingAnimation`, `AIChat`, `geminiService.js`. *Verify:* panel opens, avatar blinks and leans toward the cursor on the FAB, suggestions appear only on a fresh conversation, offline engine answers all 27 branches with **no API key configured**.
7. **404** — `NotFound.jsx`, `public/404.html`. *Verify:* GIF swaps to the connecting animation on click, redirect fires after 1500 ms, header/chat/HUD all absent.
8. **Full pass** — every §15 criterion.

---

## 15. Acceptance criteria

### Routing & navigation

- [ ] `/` renders Hero; `/profile`, `/education`, `/projects`, `/certificates`, `/achievements`, `/experience`, `/contact` each render their page.
- [ ] `/#projects` on load rewrites the URL to `/projects` with no history entry added.
- [ ] `/?page=projects` on load rewrites to `/projects`.
- [ ] `/work` resolves to the Projects page.
- [ ] Any other path (e.g. `/nope`, `/a/b`) renders 404.
- [ ] Browser back/forward restores the correct page via `popstate`.
- [ ] Sub-path hosting (`/my-portfolio/`) builds correct URLs.
- [ ] Navigating scrolls to top; clicking the active tab is a no-op (except resetting pull visuals).
- [ ] The active-tab pill is hidden on Home, on 404, while the menu is open, and during transitions.

### Loader & transitions

- [ ] First load on a non-404 route shows the "hello" loader for ~2.85 s + 0.32 s fade.
- [ ] Clicking the loader skips immediately (~0.2 s).
- [ ] The loader **never** appears on 404.
- [ ] Tab navigation: particles gather into a sphere (680 ms), hold (260 ms), spread (760 ms); content appears at 1460 ms.
- [ ] Forward navigation → ball enters from the left; backward → from the right.
- [ ] The ball visibly rotates proportionally to distance travelled.
- [ ] The incoming section label appears at 0.28 s, bottom 7vh.
- [ ] Navigating to 404 plays no sphere animation.
- [ ] Mobile pull ≥ 92 % then release → advances to the next tab, content returns at 880 ms.

### Visuals

- [ ] Every colour matches §2.1 exactly (spot-check `#C8A754`, `#a8863d`, `#03060f`, `#0a1230`).
- [ ] Fonts render: Oswald (hero name, stats, match clock), Poppins (menu, roles, CTAs), Manrope (body), Arvo (404).
- [ ] `.liquid-glass-text` shines on a 4 s `ease-in-out` loop on all 6 section headings + the hero name.
- [ ] Project cards show two gold-rimmed perforation notches on the left edge.
- [ ] Scoreboard micro-labels render in Oswald, uppercase, `0.28em` tracking.
- [ ] Scroll progress bar is a 3 px green→gold gradient at the top; match clock counts `0'` → `90'`.
- [ ] No horizontal scrollbar at 320 px.
- [ ] The native cursor is hidden and replaced by the gold droplet on desktop; the native cursor is intact on touch.
- [ ] The droplet scales to 1.8× over links, buttons, and inputs.

### Profile & data

- [ ] About: exact heading, both paragraphs, and `5+` / `5+` / `2+` roll up when scrolled into view.
- [ ] Radar chart renders 9 axes with the exact §5.4 values and gold stroke/fill.
- [ ] Skills tile tilts in 3D on hover; the inner stage lifts 30 → 42 px and the chart 70 → 95 px.
- [ ] Projects: 5 cards in order, `MD 01`–`MD 05`, correct titles/categories/years/descriptions; hover reveals the gold underline sweep and the arrow.
- [ ] Education: 1 card, CGPA `9.21 / 10.00` in gold.
- [ ] Experience: 2 cards with correct badges, highlights, and skill pills; cursor spotlight follows the pointer.
- [ ] Achievements: 5 cards; #4 shows the NSOC proof image; #5 shows a "View Project" link.
- [ ] Certificates: 5 cards; hover flips to the back face on desktop; tap toggles on touch; the maximise button opens the lightbox; Escape closes it; opening the lightbox hides the header.
- [ ] Contact: mailto button, local time, and the dock with 3 items magnifying on hover.
- [ ] All external links open in a new tab with `rel="noopener noreferrer"`.

### AI chat

- [ ] FAB expands to reveal "Ask AI" on hover; the icon crossfades avatar ↔ X.
- [ ] The FAB avatar leans and its eyes track the cursor.
- [ ] Panel opens with the Livoq greeting; input autofocuses after 150 ms.
- [ ] Four suggestion chips appear only on a fresh conversation and send on click.
- [ ] Every reply takes at least 1100 ms to display.
- [ ] `**bold**` and `` `code` `` render formatted.
- [ ] The thinking pill shows and disappears around generation.
- [ ] **With no API key and no backend**, all 27 offline branches return their exact §7.5 strings — including `18 + 24`, "xplora", "cgpa", "certificat", "hackathon"-style unknowns → fallback, "hello livoq", "who made you".
- [ ] An API failure never surfaces an error to the user.

### 404

- [ ] White page, Arvo serif, centred, `404` over the Dribbble GIF.
- [ ] "Look like you're lost" and "the page you are looking for not avaible!" render verbatim.
- [ ] Clicking "Go to Home" swaps to the connecting GIF, then navigates home after 1500 ms.
- [ ] Header, AI chat, and ScrollHUD are all absent.
- [ ] The cursor is the **blue** droplet variant.
- [ ] `public/404.html` recovers known tab paths; unknown paths stay on the static 404.

### Performance

- [ ] All of §12 P1–P14 verified.
- [ ] `npm run build` completes with no errors and emits to `docs/`.
- [ ] No console errors or React key warnings on any page.

---

## 16. Definition of done

The rebuild is complete when:

1. Every checkbox in §15 is verified in a real browser at ≥375 px and ≥1440 px.
2. `npm run dev` and `npm run build` both succeed; output lands in `docs/` with `base: './'`.
3. No `.ts` or `.tsx` files remain; `tsconfig.json` is deleted.
4. All copy matches this document character-for-character, including the §1.6 typos.
5. No placeholder content anywhere.
6. Any deliberate deviation from this PRD is **written down explicitly** rather than made silently.