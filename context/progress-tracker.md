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

### [2026-08-20] — Posts-archive block conformance (in progress)
- **What was built**: conformed the `posts-archive` block's headline + CTA to the
  design tokens — the `h2` swapped the nonexistent `text-heading` class for
  `text-foreground`, and the hand-rolled "View All Articles" `<Link>` was
  replaced with the `Button` component (`variant="secondary"`,
  `render={<Link href="/posts"/>}` + `nativeButton={false}`), arrow icon at
  `size-4` with a `group-hover/button` transition.
- **Files touched**: `src/payload/blocks/posts-archive/component.tsx`.
- **Notes**: block-by-block review of the archive block, in progress — Blocks
  1–3 done. Remaining findings (presented, awaiting approval): the article card
  uses `border-border` (→ `border-card-border`), `rounded-2xl` (→ `rounded-lg`),
  `hover:shadow-lg` (remove — no shadows), and `hover:border-primary/20`
  (remove); the category label is a hand-rolled `<span>` that should use the
  `Badge` component; the card body uses `space-x-2` (→ `gap-2`) and a second
  `text-heading` on the `h3` (→ `text-foreground`). `PostsArchiveBlock` registry
  entry deferred until the review completes. Cross-ref build-plan 1.2 (archive
  block).

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
