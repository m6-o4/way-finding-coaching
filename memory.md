# Memory — Programs block + design-token conformance

Last updated: 2026-08-20 20:26 +03:00

## What was built

- Fixed `src/payload/blocks/content-editor/component.tsx`: nonexistent `text-heading` → `text-foreground` on the `h2`.
- Conformed `src/payload/blocks/problem-agitation/component.tsx`: hardcoded `text-[#1A233D]`/`text-[#49536C]` → `text-foreground`/`text-muted-foreground`, `font-bold` → `font-semibold`, `py-20` → `py-16 lg:py-30`, manual `px-4`+`mx-auto` wrapper → shared `Container`.
- Built the `programs` Payload block end-to-end: `schema.ts` (`headline` required, `headlineDescription`, `bookingLink` link group, `programs` array max 9 of `programImage`/`programTitle`/`programDescription`/`programFeatures[]`/`programPrice`, `backgroundVariant`) + `component.tsx` (3-col card grid) + registration in `pages/schema.ts` and `render-blocks.tsx`.
- Programs card: posts-archive hover (group `scale-105` + `bg-primary/10` overlay fade), price renders `$X` + smaller muted `/person` suffix.
- Top-of-section booking CTA opposite the headline (posts-archive header pattern), CMS-driven via `bookingLink`.
- "Open in new tab" now honored everywhere a `link` field is rendered (programs, header nav + discovery, footer nav, hero CTAs, call-to-action CTAs) via `{ rel: "noopener noreferrer", target: "_blank" }`.

## Decisions made

- Booking link is CMS-driven via the existing `link()` factory wrapped in an optional `bookingLink` group (matching hero's `ctaDiscovery`), so the button renders only when `bookingLink.link.url` is set.
- Booking button: `variant="secondary"`, hidden below `md` (`hidden md:inline-flex`), matching posts-archive.
- Price is a plain text field; the component prefixes `$` and appends `/person` (muted `text-base`), so the CMS stores just the amount.
- Only "Custom URL" links render the button; the `link` field's "Internal link" (`reference`) path is ignored — same as hero/header/footer/CTA.

## Problems solved

- `link({ overrides: { name } })` used directly yields a *required* group type (inner `label` is required); wrapping it in an outer `group` field makes it optional/nullable (confirmed in generated `payload-types.ts`).
- `pnpm.ps1` blocked by PowerShell execution policy → use `pnpm.cmd`.
- Design reference image (`context/designs/interface/programs-section.png`) cannot be viewed (no image input) — grid built to the written 3×3 spec and the established card pattern.

## Current state

- Programs block renders; needs a visual pass in dev.
- `payload-types.ts` regenerated (`Programs` interface with `bookingLink`).
- Lint passes (0 errors); Prettier clean.
- `ui-registry.md` (ProgramsBlock + ProblemAgitationBlock) and `progress-tracker.md` updated.

## Next session starts with

- Visual pass of the programs section (homepage `Programs` block): card grid, image hover, price `/person`, booking button incl. new-tab.
- Run `pnpm.cmd build` (never run this session).
- Resume `build-plan.md` Phase 1.2: remaining blocks (testimonial, meet-michelle, faq) + homepage assembly; then Phase 2.1 `/posts` index.

## Open questions

- Should the booking button be visible on mobile (currently `hidden md:inline-flex`)?
- Should "Internal link" (`reference`) links render the booking button (currently only `url`)?
