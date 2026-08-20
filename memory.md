# Memory — Badge install + post-detail theme conformance

Last updated: 2026-08-20 08:28 +03:00

## What was built

- Installed the shadcn `badge` component at `src/components/ui/badge.tsx` via
  `pnpm dlx shadcn@latest add badge`. Stock shadcn variants (`default`,
  `secondary`, `destructive`, `outline`, `ghost`, `link`) already map to the
  project's semantic tokens (`bg-primary text-primary-foreground`,
  `bg-secondary text-secondary-foreground`, `rounded-4xl`), so no design-system
  customization was needed. Base UI-backed, polymorphic via `render`.
- Reviewed `src/app/(web)/posts/[slug]/page.tsx` against `ui-tokens.md` /
  `ui-rules.md` and applied 5 corrections (user-approved):
  - `h1` (line ~98): `font-display text-text-default` → `font-heading text-foreground`
  - `h1`: `font-bold` (700) → `font-semibold` (600, per heading weight rule)
  - image container (line ~121): removed `shadow-md` (project has no shadows)
  - image container: `border-border` → `border-card-border`
  - image container: `rounded-2xl` → `rounded-lg`

## Decisions made

- `Badge` needs no local customization — stock variants already conform to the
  design tokens.

## Problems solved

- `pnpm.ps1` is blocked by PowerShell execution policy on this machine
  ("running scripts is disabled"). Use the `.cmd` shim instead:
  `pnpm.cmd dlx shadcn@latest add <component>` (and `pnpm.cmd` generally).
- `font-display` and `text-text-default` are nonexistent classes in this
  project — the tokens are `font-heading`/`font-sans` and `text-foreground`.

## Current state

- `badge` installed and importable as `@/components/ui/badge`; already consumed
  in the post-detail page for category labels (`<Badge variant="secondary">`).
- Post-detail page now conforms to the design tokens.
- **Not yet done:** Badge is not registered in `context/ui-registry.md`, and
  this session's work is not logged in `context/progress-tracker.md`. Both were
  offered to the user but not confirmed.
- Two "your call" minor items left untouched in the post page: a dead `text-sm`
  on the categories wrapper (line ~84, overridden by Badge's `text-xs`), and
  `text-4xl` (36px) mobile title size sitting off the type scale.

## Next session starts with

- Register `Badge` in `context/ui-registry.md` (Component Entry Format) and add
  a `progress-tracker.md` entry for this session's badge install + post-detail
  conformance work — if the user wants it.
- Run `pnpm lint` to confirm no regressions from the post-detail class changes.

## Open questions

- Whether to register the badge install in the registry/progress-tracker.
- Whether to address the two leftover minor items (dead `text-sm`, off-scale
  `text-4xl`) on the post-detail page.
