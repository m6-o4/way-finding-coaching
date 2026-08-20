# Memory — Theme conformance sweep + Container refactor

Last updated: 2026-08-20 13:29 +03:00

## What was built

- Installed shadcn `badge`, conformed its `rounded-4xl` → `rounded-full`.
- Conformed `src/app/(web)/posts/[slug]/page.tsx` (headings + card image frame).
- Conformed `src/payload/blocks/posts-archive/component.tsx` end-to-end
  (headline, CTA, card, category badge, card body).
- Posts schema: added Lexical `OrderedListFeature`/`UnorderedListFeature`
  (change made by Michael, verified).
- Posts revalidation hooks: added `revalidatePath("/")` + `revalidatePath("/posts")`
  (change made by Michael, verified).
- Container refactor: added `--container: 1120px` token and rebuilt the shared
  `Container`; conformed every container surface — `call-to-action`,
  `posts-archive`, `not-found`, header (nav + dropdown), hero (primary).
  `content-editor` and `posts/[slug]` needed no change.

## Decisions made

- `--container: 1120px` is the single page-width token, consumed as
  `max-w-(--container)` (Tailwind v4 variable shorthand). No `max-w-6xl`
  (1152px) remains anywhere in `src`.
- Section vertical rhythm is 64px mobile / 120px desktop (`py-16 lg:py-30`),
  owned by each section — `Container` carries no vertical padding.
- Hand-rolled buttons/badges/containers are replaced with the `Button`/`Badge`/
  `Container` primitives, not restyled in place.
- "View All Articles" CTA is a `secondary` Button.

## Problems solved

- `pnpm.ps1` blocked by PowerShell execution policy → use `pnpm.cmd`.
- `container` utility was removed in Tailwind v4 — the old `Container` had no
  max-width and inert `mx-auto`. Replaced with explicit `max-w-(--container)`.
- `font-display`, `text-text-default`, and `text-heading` are nonexistent classes;
  real tokens are `font-heading`/`font-sans` + `text-foreground`.
- Recurring violations fixed: `shadow-*` (none allowed), `border-border` on cards
  (use `border-card-border`), `rounded-2xl` on cards (use `rounded-lg`).

## Current state

- All existing UI surfaces conform to the design tokens at the 1120px width.
- Posts archive block refreshes on new-post publish (revalidation fix).
- Posts rich text has bullet + numbered lists.
- `ui-registry.md` and `progress-tracker.md` are up to date.

## Next session starts with

- Run `pnpm lint` / `pnpm build` (skipped this session) to confirm no
  regressions, then a visual pass of `/`, `/posts/[slug]`, and a 404 page.
- Resume `build-plan.md` Phase 1.2: remaining blocks (programs, testimonial,
  meet-michelle, faq) and the homepage assembly; then Phase 2.1 `/posts` index.

## Open questions

- `content-editor/compoent.tsx` still has a nonexistent `text-heading` class on
  its `h2` (flagged, not yet fixed) and a filename typo (`compoent` → `component`).
- Post-detail minor items deliberately left: dead `text-sm` on the categories
  wrapper; mobile title `text-4xl` (36px) off the type scale.
