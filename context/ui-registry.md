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
