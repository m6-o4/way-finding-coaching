# Progress Tracker

## Purpose
A running log of work actually completed on this project — the historical
record, as opposed to `build-plan.md`'s forward-looking roadmap. Updated after
every feature is finished.

## How to Use
- **After completing a feature**: add an entry below with what was built.
- Cross-reference the corresponding item in `build-plan.md` if relevant.

## Log Entry Format

### [YYYY-MM-DD] — Feature Name
- **What was built**: brief description
- **Files touched**: key files/folders
- **Notes**: anything future work should know (decisions made, deviations from
  plan, known follow-ups)

---

## Log

### [2026-08-18] — Header reworked to floating pill design
- **What was built**: replaced the scaffold's fixed full-width header (Sheet-based
  mobile menu) with a floating, rounded pill nav — absolute-positioned,
  translucent `bg-card` pill with a serif primary wordmark, muted nav links, a
  primary pill CTA, and a plain conditional mobile dropdown.
- **Files touched**: `src/payload/blocks/globals/header/component-client.tsx`.
- **Notes**: dropped `Sheet` for a plain `menuOpen` conditional dropdown; removed
  `Container` and `Sheet` imports. Stays CMS-driven (`organizationName`,
  `organizationLogo`, `navigationItems`, `discovery`). Per design system: no
  shadows, `font-heading` (not `font-serif`), token radii. Nav links carry no
  explicit size class (inherit body size) after Michael removed `text-sm`.

### [2026-08-18] — Brand font wiring
- **What was built**: wired the finalized brand typography — Libre Caslon Text
  (headings/display/quotes) and Hanken Grotesk (body/labels/UI) — via
  `next/font/google`, replacing the scaffold's placeholder `Geist`.
- **Files touched**: `src/lib/fonts.ts`, `src/globals.css`,
  `src/app/(web)/layout.tsx`, `src/app/(auth)/layout.tsx`,
  `src/app/(saas)/layout.tsx`, `context/ui-tokens.md`,
  `context/code-standards.md`.
- **Notes**: `--font-heading` token was mis-mapped to `var(--font-sans)`; fixed
  to `var(--font-heading)` and added a base rule so `h1`–`h6` use
  `font-heading`. Libre Caslon Text only ships weights 400/700, so the type
  scale's 600 heading weight falls back to browser-synthesized bold — revisit
  if it renders poorly. Corrected `code-standards.md` which still documented
  `style: new-york`; actual shadcn 4 style is `base-nova`.

### [2026-08-18] — Button conformed to design system
- **What was built**: customized the shared `Button` variants in
  `src/components/ui/button.tsx` to the finalized button rules (pill radius,
  weight 600, 16/8 padding, `saturate(0.85)` hover, no shadow), and simplified
  `not-found.tsx`'s CTA to use the default variant instead of bespoke classes.
- **Files touched**: `src/components/ui/button.tsx`,
  `src/app/(web)/not-found.tsx`.
- **Notes**: destructive variant is now full-fill
  (`bg-destructive text-destructive-foreground`) per the design spec, dropping
  the shadcn tinted `/10` treatment. The `lg`/`sm`/`xs` size variants were left
  untouched — only the `default` size was brought to the 16/8 padding spec.
