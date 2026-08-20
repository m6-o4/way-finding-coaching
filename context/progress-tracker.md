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

### [2026-08-20] — Container component refactor
- **What was built**: added a `--container: 1120px` token (`globals.css` `:root`)
  and rebuilt the shared `Container` (`src/components/container.tsx`) from the
  broken `container mx-auto px-6 py-8` (the `container` utility was removed in
  Tailwind v4, so it had no max-width and `mx-auto` was inert) to
  `mx-auto w-full max-w-(--container) px-4 sm:px-6 lg:px-8` — the token width
  plus the responsive 16/24/32 gutter, no vertical padding. Reviewed every
  `Container` usage and the one hand-rolled container surface:
  - `call-to-action`: replaced the hand-rolled `mx-auto px-4 ...` div with
    `Container`, section `py-24` → `py-16 lg:py-30`.
  - `posts-archive`: removed the triple horizontal padding (outer `px-4` +
    redundant Container `px-4 sm:px-6 lg:px-8` + inner `px-3`), section `py-20`
    → `py-16 lg:py-30`.
  - `posts/[slug]`: bare `Container`, no change needed.
  - `not-found`: removed the redundant inner `px-4`; headings `text-primary` →
    `text-foreground`.
  - `content-editor`: `py-10` preserved, no change needed.
- **Files touched**: `src/globals.css`, `src/components/container.tsx`,
  `src/payload/blocks/call-to-action/component.tsx`,
  `src/payload/blocks/posts-archive/component.tsx`, `src/app/(web)/not-found.tsx`.
- **Notes**: `--container` is consumed via Tailwind v4's `max-w-(--container)`
  variable shorthand. `Container` and `PostsArchiveBlock` registered in
  `ui-registry.md`. The header (`component-client.tsx`) and hero
  (`component.tsx`) were also reconciled from `max-w-6xl` (1152px) to
  `max-w-(--container)`, and the hero's `px-7 sm:px-12` → `px-4 sm:px-6 lg:px-8`.
  Cross-ref build-plan 1.2.

### [2026-08-20] — Posts Lexical editor: bullet + numbered lists
- **What was built**: added `OrderedListFeature()` and `UnorderedListFeature()` to
  the `posts` collection's Lexical editor, enabling numbered and bullet lists in
  the rich-text toolbar.
- **Files touched**: `src/payload/collections/posts/schema.ts`.
- **Notes**: change made by Michael, verified by the agent (imports + `features`
  array). No `generate:types` needed. Restart dev server to pick it up. Cross-ref
  build-plan 2.1.

### [2026-08-20] — Posts revalidation covers homepage + index
- **What was built**: extended the `posts` collection revalidation hooks so
  publish/unpublish/delete also call `revalidatePath("/")` (homepage's
  posts-archive "Latest Insights" block) and `revalidatePath("/posts")` (blog
  index), fixing the archive block showing stale posts after a new post is
  published.
- **Files touched**: `src/payload/collections/posts/hooks/revalidate-post.ts`.
- **Notes**: change made by Michael, verified by the agent. Cross-ref build-plan
  1.2 / 2.1.

### [2026-08-20] — Posts-archive block conformance
- **What was built**: conformed the `posts-archive` block to the design tokens —
  the `h2` swapped the nonexistent `text-heading` for `text-foreground`; the
  hand-rolled "View All Articles" `<Link>` became the `Button` component
  (`variant="secondary"`, `render={<Link href="/posts"/>}` + `nativeButton={false}`,
  `size-4` arrow); the article card dropped `hover:shadow-lg` and
  `hover:border-primary/20` and switched `border-border` → `border-card-border`
  and `rounded-2xl` → `rounded-lg`; the category label became a
  `Badge variant="secondary"`; the card body's `space-x-2` → `gap-2` and the `h3`
  `text-heading` → `text-foreground`.
- **Files touched**: `src/payload/blocks/posts-archive/component.tsx`.
- **Notes**: `PostsArchiveBlock` registered in `ui-registry.md`. Cross-ref
  build-plan 1.2 (archive block).

### [2026-08-20] — Badge component installed; post detail conformed to design tokens
- **What was built**: installed the shadcn `Badge` primitive
  (`pnpm dlx shadcn@latest add badge`) and corrected five theme violations on
  the blog post detail page: the `h1` swapped nonexistent
  `font-display text-text-default` for `font-heading text-foreground`, dropped
  `font-bold` (700) for `font-semibold` (600 — the heading weight), and the
  hero-image container lost its `shadow-md` (no shadows allowed), switched
  `border-border` → `border-card-border`, and `rounded-2xl` → `rounded-lg`.
- **Files touched**: `src/components/ui/badge.tsx` (new),
  `src/app/(web)/posts/[slug]/page.tsx`.
- **Notes**: `Badge` is consumed in the post page for category labels
  (`variant="secondary"`). The stock shadcn `rounded-4xl` was conformed to
  `rounded-full` per the ui-rules Badges rule (pill, bypassing the `--radius`
  scale). Two further minor items on the post page
  were flagged and deliberately left: a dead `text-sm` on the categories
  wrapper (overridden by the badge's `text-xs`) and the mobile title `text-4xl`
  (36px) sitting off the 28/48px type scale. `pnpm.ps1` is blocked by
  PowerShell execution policy on this machine — use `pnpm.cmd`. Cross-ref
  build-plan 2.1 (post detail).

### [2026-08-19] — Call-to-action block conformed to design system
- **What was built**: reworked the `call-to-action` block's front-end to the
  finalized design tokens — removed the scaffold's decorative `color-mix` glow
  blobs, switched both CTAs from hand-rolled classes to the `Button` component's
  built-in `secondary` and `outline` variants, added `font-heading` to the
  headline, and normalized the description to plain `text-primary-foreground`.
  Added a `why`-comment to the relationship null-guard.
- **Files touched**: `src/payload/blocks/call-to-action/component.tsx`.
- **Notes**: section stays `bg-primary` (Michael's choice), which flips to
  light-peach in dark mode. The `outline` CTA therefore carries dark-scoped
  overrides (`dark:bg-transparent dark:border-primary-foreground/40
  dark:text-primary-foreground dark:hover:bg-primary-foreground/10`) because its
  default dark styles (`dark:bg-input/30` + inherited `--foreground`) fall to
  ~2.4:1 on the peach band — the override restores ~10:1. `secondary` reads fine
  in both modes. Removed leftover scaffold copy ("No payment is required to
  browse profiles"). The `calltoaction` prop is a `string | Callstoactions`
  relationship, so the null-guard is correct, not a type-smell. Cross-ref
  build-plan 1.2 (cta block).

### [2026-08-19] — Hero block reworked to full-bleed designs
- **What was built**: reworked both `hero` block variants into full-bleed headers
  driven by the `backgroundVariant` field (`background` → `bg-background`, `muted`
  → `bg-muted`). Primary: a full-height hero with the `heroImage` media
  multiply-blended over a gradient fading to `--background`, an overline, serif
  headline, description, and two pill CTAs (`ctaDiscovery` primary + `ctaFreeGuide`
  secondary). Secondary: a centered internal-page header with a multiply-blended
  image under a `bg-primary/30` overlay, headline, and description. Added the
  `heroImage` upload field and made `heroOverline` available to both hero types in
  the schema.
- **Files touched**: `src/payload/blocks/hero/schema.ts`,
  `src/payload/blocks/hero/component.tsx`.
- **Notes**: dropped the scaffold's "Mjakazi"/Nairobi placeholder content,
  hardcoded Unsplash images, and shadows. Headline renders `heroHeadline` directly
  (removed the `|`-split accent used by the header wordmark). CTAs use the `Button`
  component's `default` and `secondary` variants — the provided snippet's
  `bg-accent` secondary was replaced because `--accent` is not a CTA color per the
  design system. The secondary hero's original `bg-primary` + `mix-blend-screen` +
  `text-primary-foreground` treatment was swapped for the `backgroundVariant` base,
  `mix-blend-multiply`, and `text-primary`/`text-foreground` text so it stays
  readable in both modes (`--primary-foreground` is white on light / near-black on
  dark, unreadable off `--primary`). `id="top"` on both sections matches the
  footer's `#top` home fallback. Known follow-up: the primary hero's gradient
  overlay still fades to an opaque `to-background`, which masks the `muted`
  variant at the bottom of the hero. Cross-ref build-plan 1.2 (hero block).

### [2026-08-19] — Footer built out (CMS-driven)
- **What was built**: populated the `footer` global schema and built its
  front-end — a full-width `bg-secondary` band with a serif wordmark that links
  home, slogan, CMS nav links, and a copyright line; added a custom `RowLabel`
  for the nav-items array.
- **Files touched**: `src/payload/blocks/globals/footer/schema.ts`,
  `src/payload/blocks/globals/footer/component.tsx`,
  `src/payload/blocks/globals/footer/component-client.tsx`,
  `src/payload/blocks/globals/footer/row-label.tsx`.
- **Notes**: all footer text uses `text-secondary-foreground` because
  `--secondary` stays light in both modes — `text-primary`/`text-muted-foreground`
  on it hit ~1:1 contrast in dark mode. `FooterClient` is a server component (no
  `"use client"`) despite the `-client` suffix. `row-label.tsx` references
  `Footer["navItems"]` (the header global uses `navigationItems`, so the scaffold
  copy pointed at the wrong type). Cross-ref build-plan 1.1: the `footer` global's
  planned `ownerNotificationEmail` field is not yet added; `navItems` is capped at
  5 via `maxRows`.

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
