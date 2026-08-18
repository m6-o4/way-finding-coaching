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
