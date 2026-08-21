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

### [2026-08-21] — FAQ block built (schema + accordion component + registration)
- **What was built**: the `faq` Payload block end-to-end. Schema
  (`src/payload/blocks/faq/schema.ts`): `headline` (required) +
  `headlineDescription` (textarea), a `faqs` array of `question` (text,
  required) + `answer` (textarea, required), plus the standard
  `backgroundVariant` select. Component (`src/payload/blocks/faq/component.tsx`):
  centered header + the shadcn `Accordion` (Base UI, single-open/collapsible by
  default) constrained to `mx-auto max-w-3xl gap-4`, each `AccordionItem` a card
  (`border-card-border rounded-lg border bg-card`, no shadow) with the question
  (`text-foreground text-base font-semibold`) and answer
  (`text-muted-foreground leading-relaxed`). Registered in `pages/schema.ts` and
  `render-blocks.tsx` (`faq: FaqBlock`).
- **Files touched**: `src/payload/blocks/faq/schema.ts` (new),
  `src/payload/blocks/faq/component.tsx` (new),
  `src/payload/collections/pages/schema.ts`,
  `src/payload/blocks/render-blocks.tsx`.
- **Notes**: the `accordion` primitive was already installed (`components/ui/accordion.tsx`,
  Base UI). Base UI has no `type="single"`/`collapsible` props (those are Radix) —
  single-open/collapsible is the default. `answer` is a `textarea`, so multi-line
  answers render as one run of text (newlines collapse). `FaqBlock` registered in
  `ui-registry.md`. Cross-ref build-plan 1.2.

### [2026-08-21] — Program-benefits block built (originally "benefits", renamed)
- **What was built**: the `programBenefits` Payload block end-to-end. Schema
  (`src/payload/blocks/program-benefits/schema.ts`): `headline` (required) +
  `headlineDescription` (textarea), a `programs` array (`maxRows: 9`) of
  `programTitle` (required) + `benefits` array (`maxRows: 3`, each `title`
  required), plus `backgroundVariant`. Component
  (`src/payload/blocks/program-benefits/component.tsx`): centered header + a
  `grid gap-8 md:grid-cols-3` of shadcn `Card`s (`border-card-border rounded-lg
  border bg-card`, no shadow), `CardHeader`/`CardTitle` + a `Check`-icon list.
  Registered in `pages/schema.ts` and `render-blocks.tsx`
  (`programBenefits: ProgramBenefitsBlock`).
- **Files touched**: `src/payload/blocks/program-benefits/schema.ts` (new),
  `src/payload/blocks/program-benefits/component.tsx` (new),
  `src/payload/collections/pages/schema.ts`,
  `src/payload/blocks/render-blocks.tsx`.
- **Notes**: first built as `benefits`, then renamed to `programBenefits` by Michael
  (with `program` field → `programTitle`, and benefits `maxRows` 5→3); the old
  `benefits/` directory was removed. `generate:types` regenerated `ProgramBenefits`.
  `ProgramBenefitsBlock` registered in `ui-registry.md`. Cross-ref build-plan 1.2.

### [2026-08-21] — Programs + posts-archive cards conformed to shadcn Card
- **What was built**: converted the hand-rolled `<article>` cards in the `programs`
  and `posts-archive` blocks to the shadcn `Card` primitives, conformed to the
  theme (`group h-full gap-0 rounded-lg border border-card-border p-0 ring-0`,
  re-adding plain `group` since `Card` ships the named `group/card`; the
  posts-archive card keeps its `Link` wrapper + `cursor-pointer`). Also added
  `border border-card-border` to the `meet-michelle` photo wrapper so it matches
  the card border.
- **Files touched**: `src/payload/blocks/programs/component.tsx`,
  `src/payload/blocks/posts-archive/component.tsx`,
  `src/payload/blocks/meet-michelle/component.tsx`.
- **Notes**: `CardTitle` renders a `div` (no polymorphic `render`/`asChild` in this
  project's `Card`), so program/post titles lost `h3` heading semantics — visual
  output unchanged (serif `font-heading`, `text-xl font-semibold`). Entries updated
  in `ui-registry.md`. Cross-ref build-plan 1.2.

### [2026-08-21] — meet-michelle block: title → headline + headlineDescription
- **What was built**: conformed the `meet-michelle` block to Michael's schema
  change — `title` (text) was replaced by `headline` (required) + optional
  `headlineDescription` (textarea). Updated the component to render `headline`
  unconditionally, `headlineDescription` conditionally, and dropped the
  now-redundant `bio &&` guard (`bio` is required). `photo` stays required
  (`string | Media`), so the `typeof photo === "object"` populated-object guard
  is kept for the `Image`.
- **Files touched**: `src/payload/blocks/meet-michelle/component.tsx`.
- **Notes**: `tsc --noEmit` + `eslint` pass (0 errors). `meetMichelle` is
  registered in both `pages/schema.ts` and `render-blocks.tsx`. Cross-ref
  build-plan 1.2.

### [2026-08-21] — social-proof block: quote mark + required/optional conformance
- **What was built**: added a decorative serif opening quote mark (`&ldquo;`,
  `font-heading text-primary mb-2 text-6xl leading-none font-bold`, `aria-hidden`
  + `select-none`) above each testimonial; made `headline` render unconditionally
  (required) with `headlineDescription` conditional; hardened the headshot `alt`
  fallback to `photo.alt || item.name` (empty-string-safe).
- **Files touched**: `src/payload/blocks/social-proof/component.tsx`.
- **Notes**: `tsc --noEmit` passes; the file was formatted with
  `prettier --write`. Cross-ref build-plan 1.2.

### [2026-08-21] — Social proof block built (schema + carousel component + registration)
- **What was built**: the `socialProof` Payload block end-to-end. Schema
  (`src/payload/blocks/social-proof/schema.ts`): `headline` (required) +
  `headlineDescription` (textarea), a `testimonials` array (`required`, `minRows:
  1`) of `name` (required), `photo` (upload → media), `jobTitle`, and `testimony`
  (required), plus the standard `backgroundVariant` select. Component
  (`src/payload/blocks/social-proof/component.tsx`): a `"use client"` section
  rendering the optional centered header (`headline`/`headlineDescription`) and
  the shadcn `Carousel` (`opts={{ loop: true }}`) showing one testimonial at a
  time — optional `rounded-full` headshot, the testimony as a floating serif
  italic `blockquote` (no card), and `name`/`jobTitle` attribution. Navigation is
  a `SocialProofNav` child (two `Button variant="outline" size="icon"` controls
  driven by the carousel's `useCarousel()` `scrollPrev`/`scrollNext`), rendered
  only when more than one item exists. Registered the block in
  `src/payload/collections/pages/schema.ts` and
  `src/payload/blocks/render-blocks.tsx`.
- **Files touched**: `src/payload/blocks/social-proof/schema.ts`,
  `src/payload/blocks/social-proof/component.tsx`,
  `src/payload/collections/pages/schema.ts`,
  `src/payload/blocks/render-blocks.tsx`, `package.json` (+
  `embla-carousel-react`), `src/components/ui/carousel.tsx` (installed).
- **Notes**: `pnpm.cmd generate:types` regenerated `payload-types.ts` and
  `pnpm.cmd exec tsc --noEmit` + `eslint` both pass (0 errors). The shadcn
  `carousel` component was installed by Michael and is used for the slides; the
  default `-ml-4`/`pl-4` slide gutter is dropped (`ml-0`/`pl-0`) so the centered
  quote stays symmetric. This diverges from the build-plan's documented
  "Testimonial" section (a single featured floating quote from a `testimonials`
  collection) — the user chose an inline multi-item array carousel with photos,
  so the planned `testimonials` collection is not used here. Registered
  `SocialProofBlock` in `ui-registry.md`. Cross-ref build-plan 1.2.

### [2026-08-20] — meet-michelle block: token conformance + schema review
- **What was built**: reviewed and conformed the `meet-michelle` Payload block.
  Schema (`src/payload/blocks/meet-michelle/schema.ts`): `title` (required),
  `bio` richText (required), `photo` upload → media (required),
  `backgroundVariant` select. Added `OrderedListFeature`,
  `UnorderedListFeature`, and `AlignFeature` to the `bio` Lexical editor so it
  matches `content-editor`. Component
  (`src/payload/blocks/meet-michelle/component.tsx`): conformed to the design
  tokens — the manual `px-4 py-20` + `mx-auto max-w-6xl` wrapper became the
  shared `Container` + `py-16 lg:py-30`, `text-[#1A233D]` → `text-foreground`,
  `font-bold` → `font-semibold`, removed `shadow-xl` (no shadows), and added a
  `bg-muted` backdrop behind the photo. Removed the fallback image/alt
  (`/way-finding-og.webp` / "Michelle Mashonganyika") since `photo` is required —
  the `Image` now renders only when `photo` is a populated object (hero pattern).
- **Files touched**: `src/payload/blocks/meet-michelle/schema.ts`,
  `src/payload/blocks/meet-michelle/component.tsx`.
- **Notes**: `pnpm.cmd exec eslint` passes on both files. ⚠️ The block is NOT yet
  registered — `MeetMichelle` is missing from the `layout` blocks array in
  `src/payload/collections/pages/schema.ts` and from `blockComponents` in
  `src/payload/blocks/render-blocks.tsx`, so it will not appear in the admin
  builder or render on the frontend. `payload-types.ts` already lists
  `MeetMichelle` in the `layout` union (line 207) — stale relative to
  `pages/schema.ts`; regenerate types after registering. Cross-ref build-plan
  1.2 (meet-michelle block).

### [2026-08-20] — content-editor `text-heading` fix
- **What was built**: swapped the nonexistent `text-heading` class for
  `text-foreground` on the `content-editor` block's `h2`, matching the
  posts-archive heading pattern.
- **Files touched**: `src/payload/blocks/content-editor/component.tsx`.
- **Notes**: `font-heading` is applied to `h1`–`h6` via the base layer, so no
  explicit class is needed. Cross-ref build-plan 1.2.

### [2026-08-20] — problem-agitation block conformance
- **What was built**: conformed the `problem-agitation` block to the design
  tokens — replaced hardcoded `text-[#1A233D]`/`text-[#49536C]` with
  `text-foreground`/`text-muted-foreground`, `font-bold` → `font-semibold`
  (600 heading weight), `py-20` → `py-16 lg:py-30` (64px/120px section rhythm),
  and the manual `px-4` + `mx-auto max-w-4xl` wrapper → the shared `Container`
  primitive (keeping the inner `max-w-4xl text-center` measure).
- **Files touched**: `src/payload/blocks/problem-agitation/component.tsx`.
- **Notes**: the navy/slate hexes were from a foreign palette, not the
  "Organic Wayfinder" system. Cross-ref build-plan 1.2.

### [2026-08-20] — "Open in new tab" honored on all CMS links
- **What was built**: the `link` field's `newTab` checkbox was being ignored
  everywhere it was rendered. Added `{...(newTab ? { rel: "noopener noreferrer",
  target: "_blank" } : {})}` to every `Link`/`Button` that renders a `link`
  field, so checked links now open in a new tab (with `noopener noreferrer`).
- **Files touched**: `src/payload/blocks/programs/component.tsx` (booking CTA),
  `src/payload/blocks/globals/header/component-client.tsx` (desktop + mobile nav
  items and discovery CTA), `src/payload/blocks/globals/footer/component-client.tsx`
  (nav items), `src/payload/blocks/hero/component.tsx` (ctaDiscovery +
  ctaFreeGuide), `src/payload/blocks/call-to-action/component.tsx` (ctaDiscovery
  + ctaFreeGuide).
- **Notes**: matches the existing `CMSLink` pattern in
  `src/components/payload/link.tsx`. `pnpm.cmd lint` passes (0 errors). The
  `design/codebase/` scaffold copy is a reference only and was not touched.
  Cross-ref build-plan 1.1 / 1.2 (header, footer, hero, cta, programs blocks).

### [2026-08-20] — Programs block: booking CTA + dynamic booking link
- **What was built**: added a top-of-section booking button to the `programs`
  block, opposite the headline (the posts-archive header pattern), and made the
  booking link CMS-driven. Schema now includes a `bookingLink` group
  (`link({ appearances: false })` — internal/custom URL + label + new tab) so
  the meeting-booking URL is entered in the admin, not hardcoded. The component
  renders a `Button` (`secondary`, `render={<Link/>}` + `nativeButton={false}`,
  `size-4` arrow) on the right of the `mb-12 flex ... md:flex-row` header row
  only when `bookingLink.link.url` is set. Card images also gained the
  posts-archive hover (group scale-105 + `bg-primary/10` overlay fade), and the
  price now renders `$` + value + a smaller muted `/person` suffix.
- **Files touched**: `src/payload/blocks/programs/schema.ts`,
  `src/payload/blocks/programs/component.tsx`.
- **Notes**: `pnpm.cmd generate:types` regenerated the `Programs.bookingLink`
  group and `pnpm.cmd lint` passes (0 errors). The booking button is hidden
  below `md` (matching posts-archive's `hidden md:inline-flex`). It renders for
  "Custom URL" links (`link.url`); the "Internal link" (`reference`) path is
  ignored, same as the hero/header/footer/CTA blocks. Cross-ref build-plan 1.2
  (programs block).

### [2026-08-20] — Programs block built (schema + component + registration)
- **What was built**: added the `programs` Payload block end-to-end. Schema
  (`src/payload/blocks/programs/schema.ts`): `headline` (required) +
  `headlineDescription`, a `programs` array (`maxRows: 9`) of `programImage`
  (upload → media), `programTitle` (required), `programDescription` (textarea),
  `programFeatures` (array, `maxRows: 5`, each `title`), and `programPrice`, plus
  the standard `backgroundVariant` select. Component
  (`src/payload/blocks/programs/component.tsx`): a 3-column card grid
  (`md:grid-cols-2 lg:grid-cols-3`) matching the posts-archive card language —
  `border-card-border bg-card rounded-lg border` (no shadow), `aspect-16/10`
  image with `Compass` fallback, `Check`-icon feature list, and a bottom-anchored
  `mt-auto` price. Registered the block in
  `src/payload/collections/pages/schema.ts` and
  `src/payload/blocks/render-blocks.tsx`.
- **Files touched**: `src/payload/blocks/programs/schema.ts` (new),
  `src/payload/blocks/programs/component.tsx` (new),
  `src/payload/collections/pages/schema.ts`,
  `src/payload/blocks/render-blocks.tsx`.
- **Notes**: `pnpm.cmd generate:types` regenerated `payload-types.ts` (new
  `Programs` interface) and `pnpm.cmd lint` passes (0 errors). Michael edited the
  schema after the agent wrote it — array item fields renamed to the
  `program*`-prefixed names above, `headline` made required, labels changed to
  singular "Program Block". The design reference image
  (`context/designs/interface/programs-section.png`) could not be viewed (no
  image input) — the grid was built to the written 3×3 spec and the established
  card pattern. Cross-ref build-plan 1.2 (programs block).

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
