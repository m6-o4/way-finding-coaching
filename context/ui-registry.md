# UI Registry

## Purpose
A living catalog of every UI component built in this project. Read this before
creating any new component to check for existing patterns to reuse or match.
Updated after every component is built (via the `/imprint` skill) so the
registry never drifts from the actual codebase.

## How to Use
- **Before building**: search this file for a similar existing component before
  creating a new one.
- **After building**: add an entry for the new component, following the format
  below.

## Component Entry Format

### `ComponentName`
- **Location**: `src/components/...`
- **Purpose**: what it's for
- **Props**: key props and their types
- **Visual pattern**: tokens/variants used, notable styling decisions
- **Used in**: pages/components that consume it

---

## Components

### `Button`
- **Location**: `src/components/ui/button.tsx`
- **Purpose**: the site's action/CTA primitive (Base UI-backed, shadcn).
- **Props**: `variant` (`default` | `outline` | `secondary` | `ghost` | `destructive` | `link`), `size` (`default` | `xs` | `sm` | `lg` | `icon` | `icon-xs` | `icon-sm` | `icon-lg`), plus Base UI `Button` props (`render` for polymorphic triggers, e.g. `render={<Link/>}` with `nativeButton={false}`).
- **Visual pattern**: fully rounded `rounded-full` (pill — bypasses the `--radius` scale); `text-sm font-semibold`; `default` size uses `px-4 py-2` (16/8). Filled variants (`default`/`secondary`/`destructive`) use `hover:saturate-[0.85]` — saturation, never brightness or shadow. No shadows anywhere.
- **Used in**: `src/app/(web)/not-found.tsx`, `src/components/admin/custom-signout-button.tsx` (`destructive`, `lg`), `src/payload/blocks/code/copy-button.tsx` (`secondary`), `src/components/ui/sheet.tsx` (close button, `ghost` + `icon-sm`), `src/payload/blocks/globals/header/component-client.tsx` (booking CTA, `default` rendered as `Link`).

### `HeaderClient`
- **Location**: `src/payload/blocks/globals/header/component-client.tsx`
- **Purpose**: the site's global marketing header — a floating pill nav with brand wordmark, scroll-anchor nav links, booking CTA, and a mobile dropdown.
- **Props**: `{ data: Header }` (the `header` global: `organizationName`, `organizationLogo`, `navigationItems`, `discovery`).
- **Visual pattern**: absolutely positioned floating pill (`absolute inset-x-0 top-0 z-20`, nav `rounded-full border border-border/70 bg-card/90 backdrop-blur`); serif wordmark via `font-heading text-lg text-primary` with the `|`-split accent word in `text-foreground`; nav links `text-muted-foreground` with `hover:text-primary`, no explicit size class; CTA is the `Button` primary variant rendered as a `Link` (`nativeButton={false}`); mobile toggle (`Menu`/`X` icons) reveals a `rounded-lg border border-border bg-card` dropdown. No shadows.
- **Used in**: `src/payload/blocks/globals/header/component.tsx` (server wrapper that fetches `getCachedGlobal("header")`).

### `FooterClient`
- **Location**: `src/payload/blocks/globals/footer/component-client.tsx`
- **Purpose**: the site's global footer — a full-width `bg-secondary` band with the serif brand wordmark (links home), slogan, CMS nav links, and a copyright line.
- **Props**: `{ data: Footer }` (the `footer` global: `organizationName`, `organizationLogo`, `organizationSlogan`, `navItems`, `copyright`).
- **Visual pattern**: full-width `bg-secondary` band wrapping an inner `container mx-auto px-6 py-8 text-center`; wordmark is `block font-heading text-2xl text-secondary-foreground` rendered as a `Link` to `/`; slogan `text-secondary-foreground`; nav links `mt-7 flex justify-center gap-6 text-secondary-foreground` (each a `Link` to `item.link.url || "#top"`, rendered only when `navItems` is non-empty); `<hr>` divider `border-secondary-foreground/20 my-6 md:my-10`; copyright `text-secondary-foreground mt-8` with dynamic year. All text on the `bg-secondary` surface uses `text-secondary-foreground` (its paired foreground) because `--secondary` stays light in dark mode — `text-primary`/`text-muted-foreground` collapse to ~1:1 contrast there. No shadows. Server component (no `"use client"`) despite the `-client` suffix.
- **Used in**: `src/payload/blocks/globals/footer/component.tsx` (server wrapper that fetches `getCachedGlobal("footer")`).

### `HeroBlock`
- **Location**: `src/payload/blocks/hero/component.tsx`
- **Purpose**: the site's page header block, in two full-bleed variants — a primary hero for the homepage (image, overline, headline, description, two CTAs) and a secondary centered header for internal pages (blog, legal, etc.).
- **Props**: the `Hero` block (`heroType` `primary` | `secondary`, `heroImage` media, `heroOverline`, `heroHeadline`, `heroDescription`, `ctaDiscovery`/`ctaFreeGuide` link groups, `backgroundVariant` `background` | `muted` — only `ctaDiscovery`/`ctaFreeGuide` are primary-only in the admin panel).
- **Visual pattern**: both variants take their base from `backgroundVariant` (`background` → `bg-background`, `muted` → `bg-muted`). Primary hero is an `id="top"` section (`min-h-170 lg:min-h-190`, `items-end`, `isolate`) with the `heroImage` as a full-bleed `next/image` (`fill`, `priority`, `sizes="100vw"`, `object-cover object-center opacity-75 mix-blend-multiply`) and a `bg-linear-to-b` gradient overlay (`from-secondary/40 via-secondary/10 to-background`); overline is uppercase `text-primary`; headline `font-heading text-primary text-5xl sm:text-6xl lg:text-7xl leading-none font-bold`; description `text-muted-foreground`; two pill CTAs via the `Button` component (`default` primary + `secondary` variant), each `render`-ed as a `Link` with `nativeButton={false}`. Secondary hero is a centered `id="top"` section (`min-h-130`, `isolate`, `overflow-hidden`) with the image `opacity-45 mix-blend-multiply` under a `bg-primary/30` overlay; headline `text-primary`, description `text-foreground`. No shadows.
- **Used in**: `pages` documents via the `hero` block (the homepage hero and internal page headers).

### `CallToActionBlock`
- **Location**: `src/payload/blocks/call-to-action/component.tsx`
- **Purpose**: the site's closing call-to-action section — a full-bleed `bg-primary` band with a headline, supporting description, and two CTA buttons.
- **Props**: the `CallToAction` block (a single `calltoaction` relationship typed `string | Callstoactions`; renders only when the relationship arrives as the populated object).
- **Visual pattern**: `bg-primary` section (`py-16 lg:py-30`, `overflow-hidden`, no glow/shadow); content centered in a `Container` (`text-center`); headline `font-heading text-4xl sm:text-5xl font-semibold`; description `text-primary-foreground text-lg sm:text-xl`; two pill CTAs via the `Button` component rendered as `Link`s (`nativeButton={false}`) — `ctaDiscovery` uses `secondary`, `ctaFreeGuide` uses `outline` with dark-scoped overrides (`dark:bg-transparent dark:border-primary-foreground/40 dark:text-primary-foreground dark:hover:bg-primary-foreground/10`) since `--primary` flips light-peach in dark mode and the outline variant's default dark styles fail contrast on it. Both carry `w-full sm:w-auto` for responsive full-width.
- **Used in**: `pages` documents via the `callToAction` block, registered in `src/payload/blocks/render-blocks.tsx`.

### `Badge`
- **Location**: `src/components/ui/badge.tsx`
- **Purpose**: a small status/label pill for short, non-interactive text — used for the blog post's category labels.
- **Props**: `variant` (`default` | `secondary` | `destructive` | `outline` | `ghost` | `link`), plus Base UI `useRender` props (`render` for polymorphic rendering, e.g. wrapping the badge in a link).
- **Visual pattern**: `inline-flex h-5 w-fit shrink-0 items-center gap-1 px-2 py-0.5 text-xs font-medium whitespace-nowrap`; filled variants use paired tokens (`default` → `bg-primary text-primary-foreground`, `secondary` → `bg-secondary text-secondary-foreground`, `destructive` → `bg-destructive/10 text-destructive`); `outline` → `border-border text-foreground`. Pill shape via `rounded-full` (bypassing the `--radius` scale, per the ui-rules Badges rule — the stock shadcn `rounded-4xl` was conformed to this). No shadows.
- **Used in**: `src/app/(web)/posts/[slug]/page.tsx` (category labels, `variant="secondary"`).

### `Container`
- **Location**: `src/components/container.tsx`
- **Purpose**: the canonical page-width wrapper — centers content and constrains it to the design system's 1120px max-width.
- **Props**: `ComponentProps<"div">` (spreads any `div` props; `className` is merged via `cn`).
- **Visual pattern**: `mx-auto w-full max-w-(--container) px-4 sm:px-6 lg:px-8` — `--container: 1120px` (defined in `globals.css` `:root`), responsive gutter 16/24/32px. No vertical padding — section/block vertical rhythm is the caller's responsibility.
- **Used in**: `src/app/(web)/posts/[slug]/page.tsx`, `src/app/(web)/not-found.tsx`, `src/payload/blocks/posts-archive/component.tsx`, `src/payload/blocks/content-editor/compoent.tsx`, `src/payload/blocks/call-to-action/component.tsx`.

### `PostsArchiveBlock`
- **Location**: `src/payload/blocks/posts-archive/component.tsx`
- **Purpose**: the "Latest Insights" archive block — a headline + "View All Articles" CTA over a responsive grid of post cards.
- **Props**: the `PostsArchive` block (`backgroundVariant` `background` | `muted`, `headline`, `headlineDescription`, `populateBy` `collection` | `selection`, `categories`, `limit`, `selectedDocs`).
- **Visual pattern**: `bg-background`/`bg-muted` section (`py-16 lg:py-30`) wrapping a `Container`; headline `font-heading text-3xl md:text-4xl font-semibold text-foreground` with "View All Articles" as a `Button` `secondary` variant rendered as a `Link` (`nativeButton={false}`, hidden below `md`); cards in a `grid gap-8 md:grid-cols-3`, each a `Link`-wrapped `<article>` — `border-card-border bg-card rounded-lg border` (no shadow), a `bg-muted aspect-16/10` image area with a `Badge variant="secondary"` category label, and a body with `text-muted-foreground text-xs` date, `text-foreground text-xl font-semibold` title (`group-hover:text-primary`), and a `text-sm` line-clamped description. No shadows.
- **Used in**: `pages` documents via the `postsArchive` block, registered in `src/payload/blocks/render-blocks.tsx`.

### `ProgramsBlock`
- **Location**: `src/payload/blocks/programs/component.tsx`
- **Purpose**: the "Your Path to Clarity" paid-programs section — a headline + description + booking CTA over a responsive 3-column grid (max 9) of program cards.
- **Props**: the `Programs` block (`backgroundVariant` `background` | `muted`, `headline`, `headlineDescription`, `bookingLink` link group (`link.url`/`link.label`), `programs` array of `programImage` / `programTitle` / `programDescription` / `programFeatures[]` (each `title`) / `programPrice`).
- **Visual pattern**: `bg-background`/`bg-muted` section (`py-16 lg:py-30`) wrapping a `Container`; header is a `mb-12 flex flex-col items-end justify-between md:flex-row` row with the headline `text-foreground mb-4 text-3xl font-semibold md:text-4xl` + description `text-muted-foreground` on the left and, opposite it, a `Button` `secondary` rendered as a `Link` (`nativeButton={false}`, `bookingLink.link.url` + `bookingLink.link.label`, `size-4` arrow, `mt-6 hidden md:mt-0 md:inline-flex` — the posts-archive header pattern); cards in a `grid gap-8 md:grid-cols-2 lg:grid-cols-3`, each an `<article>` — `group border-card-border bg-card flex h-full flex-col overflow-hidden rounded-lg border` (no shadow, matching the posts-archive card). Image area `bg-muted relative aspect-16/10 overflow-hidden` with `next/image` (`fill`, `object-cover`, `sizes` `100vw/50vw/33vw`, `transition-transform duration-500 group-hover:scale-105`) under a `bg-primary/10` overlay that fades `group-hover:bg-transparent` (posts-archive hover) and a `Compass` fallback icon `text-muted-foreground/30 size-12`; body `flex flex-1 flex-col p-6` with title `text-foreground text-xl font-semibold` (`h3`), description `text-muted-foreground text-sm leading-relaxed`, a feature list of `Check` icons `text-primary size-4` + `text-foreground text-sm` (`space-y-2`), and price `text-foreground text-2xl font-semibold` with a `text-muted-foreground text-base font-normal` `/person` suffix, anchored `mt-auto pt-4` so prices align across cards. No shadows, no hardcoded hex.
- **Used in**: `pages` documents via the `programs` block, registered in `src/payload/blocks/render-blocks.tsx`.

### `ProblemAgitationBlock`
- **Location**: `src/payload/blocks/problem-agitation/component.tsx`
- **Purpose**: a single-headline + supporting-paragraph section (the "problem" / "challenge" beat), centered in a narrow text measure.
- **Props**: the `ProblemAgitation` block (`backgroundVariant` `background` | `muted`, `problem` headline, `challenge` body).
- **Visual pattern**: `bg-background`/`bg-muted` section (`py-16 lg:py-30`) wrapping a `Container` with `max-w-4xl text-center`; headline `text-foreground mb-8 text-3xl font-semibold md:text-4xl` (`h2`), body `text-muted-foreground text-lg leading-relaxed text-pretty md:text-xl`. No shadows, no hardcoded hex.
- **Used in**: `pages` documents via the `problemAgitation` block, registered in `src/payload/blocks/render-blocks.tsx`.

### `MeetMichelleBlock`
- **Location**: `src/payload/blocks/meet-michelle/component.tsx`
- **Purpose**: the "Meet Michelle" section — a centered serif headline over a two-column layout: Michelle's portrait photo on the left, her rich-text biography on the right.
- **Props**: the `MeetMichelle` block (`backgroundVariant` `background` | `muted`, `title`, `bio` richText, `photo` upload → media — required).
- **Visual pattern**: `bg-background`/`bg-muted` section (`py-16 lg:py-30`) wrapping a `Container`; headline `text-foreground mb-12 text-center text-3xl font-semibold md:text-4xl` (`h2`); `grid items-start gap-12 lg:grid-cols-3` with the photo in `lg:col-span-1` (a `bg-muted relative aspect-4/5 w-full overflow-hidden rounded-lg` wrapper holding `next/image` `fill` `object-cover`, rendered only when `photo` is a populated object) and the bio in `lg:col-span-2` via `RichText` (`enableGutter={false}`). No shadows, no hardcoded hex.
- **Used in**: `pages` documents via the `meetMichelle` block — ⚠️ not yet registered in `src/payload/blocks/render-blocks.tsx`.
