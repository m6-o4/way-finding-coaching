# Memory — Theme conformance sweep (badge, post detail, posts-archive)

Last updated: 2026-08-20 09:28 +03:00

## What was built

- Installed shadcn `badge` at `src/components/ui/badge.tsx`, then conformed its
  stock `rounded-4xl` to `rounded-full` (ui-rules Badges: pill, bypassing the
  `--radius` scale). Registered in `context/ui-registry.md` and logged in
  `context/progress-tracker.md`.
- Conformed `src/app/(web)/posts/[slug]/page.tsx` to the design tokens:
  `font-display text-text-default` → `font-heading text-foreground`,
  `font-bold` → `font-semibold`, removed `shadow-md`,
  `border-border` → `border-card-border`, `rounded-2xl` → `rounded-lg`.
- Started conforming `src/payload/blocks/posts-archive/component.tsx` (the
  "Latest Insights" archive block), block-by-block. Applied Block 3 (headline +
  "View All Articles" CTA): `text-heading` → `text-foreground` on the `h2`;
  replaced the hand-rolled `<Link>` button with the `Button` component
  (`variant="secondary"`, `render={<Link href="/posts"/>}` + `nativeButton={false}`),
  icon at `size-4` with `group-hover/button` transition; added the `Button` import.

## Decisions made

- "View All Articles" CTA is a `secondary` Button (matches the hero's guide CTA),
  not outline.
- Hand-rolled buttons/badges in existing blocks are replaced with the installed
  `Button`/`Badge` primitives rather than restyled in place.

## Problems solved

- `pnpm.ps1` is blocked by PowerShell execution policy on this machine — use the
  `.cmd` shim, e.g. `pnpm.cmd dlx shadcn@latest add <component>`.
- `font-display`, `text-text-default`, and `text-heading` are nonexistent
  classes; the real tokens are `font-heading`/`font-sans` and `text-foreground`.
- Recurring theme violations across files: `shadow-*` (no shadows allowed),
  `border-border` on cards (use `border-card-border`), `rounded-2xl` on cards
  (use `rounded-lg`), and hand-rolled buttons/badges (use `Button`/`Badge`).

## Current state

- Badge, post-detail page, and posts-archive headline/CTA all conform and are
  applied.
- **In progress:** posts-archive block review. Blocks 1–3 done. Block 4 findings
  presented, NOT yet approved/applied — the article card should drop
  `hover:shadow-lg`, drop `hover:border-primary/20`, and switch `border-border` →
  `border-card-border` and `rounded-2xl` → `rounded-lg`. Blocks 5–6 not yet
  presented (category badge is a hand-rolled `<span>` → `Badge`; card body has
  `space-x-2` → `gap-2` and a second `text-heading` on the `h3` →
  `text-foreground`).

## Next session starts with

- Resume the posts-archive review at Block 4 (article card): await approval on
  the four card corrections, apply them, then present Blocks 5 (image area +
  category badge) and 6 (card body).
- After the block fully conforms, register `PostsArchiveBlock` in
  `context/ui-registry.md` and add a completion note to `context/progress-tracker.md`.

## Open questions

- Block 4 hover treatment: remove `hover:border-primary/20` entirely
  (recommended) vs keep a subtle non-color affordance.
- Two "your call" items on the post-detail page, deliberately left: dead
  `text-sm` on the categories wrapper; mobile title `text-4xl` (36px) off-scale.
