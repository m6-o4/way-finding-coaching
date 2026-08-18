# UI Tokens

## Purpose
This file is the canonical registry of design tokens for the project — colors,
typography, spacing, and component-level values. Never use hardcoded hex values
or raw Tailwind color classes; always reference a token defined here. Read this
before building any new UI component.

Both light and dark mode are finalized as of the values below.

## Colors

The brand name for this palette is "Organic Wayfinder": terracotta as the
primary/CTA color, moss-light as the secondary color, sand and charcoal as the
neutral backdrop, clay-muted reserved for card borders. Dark mode swaps each
role for its lighter/darker counterpart from the same family — terracotta
stays terracotta, sand-and-charcoal inverts to a warm near-black background
with warm near-white text, and so on — so the brand reads as the same system
in either mode, not a generic gray inversion.

| Token | Light | Dark | Usage |
|---|---|---|---|
| `--background` | `#F5F2ED` (sand) | `#211A19` | Page background |
| `--foreground` | `#2D2D2D` (charcoal) | `#FCEEEB` | Default text |
| `--card` | `#FFFFFF` | `#362F2D` | Card/panel surface — a light/dark tonal shift off `--background` |
| `--card-foreground` | `#2D2D2D` | `#FCEEEB` | Text on card surfaces |
| `--card-border` | `#A67B6B` (clay-muted) | `#927F7B` | Card border only — overrides the general `--border` for this one component |
| `--popover` / `--popover-foreground` | `#FFFFFF` / `#2D2D2D` | `#362F2D` / `#FCEEEB` | Popover/dropdown surface, mirrors `--card` |
| `--primary` | `#6F3429` (terracotta) | `#FFB4A5` | Primary actions, CTAs, focus ring. Distinct from the softer clay-muted tone used for card borders |
| `--primary-foreground` | `#FFFFFF` | `#390B04` | Text/icons on `--primary` |
| `--secondary` | `#B2D2C2` (moss-light) | `#BDCBB0` | Secondary buttons |
| `--secondary-foreground` | `#2D2D2D` (charcoal) | `#131E0D` | Text on `--secondary` |
| `--muted` | `#FFF1EE` | `#2A2322` | Subtle section fills |
| `--muted-foreground` | `#534340` | `#DDC9C4` | De-emphasized/secondary text |
| `--accent` | `#F3E5E2` | `#312A28` | Subtle hover/highlight surface (dropdown items, menu hover) — not a second CTA color. Terracotta primary is the only CTA color in this system |
| `--accent-foreground` | `#2D2D2D` | `#FCEEEB` | Text on `--accent` |
| `--destructive` | `#BA1A1A` | `#FFB4AB` | Errors/destructive actions only. Stays visually distinct from terracotta so an error never reads as a CTA |
| `--destructive-foreground` | `#FFFFFF` | `#390B04` | Text/icons on `--destructive`. A dedicated token, not a hardcoded white — destructive flips from a dark red (light mode) to a light red (dark mode), so the same "white text" assumption that works in light mode would fail contrast in dark mode if hardcoded at the component level |
| `--border` / `--input` | `#D8C2BD` | `#443937` | General hairline borders and input outlines. See `--card-border` above for the one component-level exception |
| `--ring` | `#6F3429` | `#FFB4A5` | Focus ring, matches `--primary` |
| `--chart-1` | `#6F3429` (terracotta) | `#FFB4A5` | Categorical chart color 1 |
| `--chart-2` | `#55624C` (deep olive) | `#8BD5BE` (mint teal) | Categorical chart color 2 |
| `--chart-3` | `#B2D2C2` (moss-light) | `#BDCBB0` | Categorical chart color 3 |
| `--chart-4` | `#005040` (deep teal) | `#FFCBC0` (peach) | Categorical chart color 4 |
| `--chart-5` | `#A67B6B` (clay-muted) | `#927F7B` | Categorical chart color 5 |

The chart set deliberately avoids using sand/near-black as a fill in either
mode — it sits too close to `--background` to read as a distinct color — and
pulls in earth tones not used elsewhere in the UI so all five stay visually
separable. The exact hues shift between modes (e.g. chart-2's deep olive
becomes a mint teal in dark mode) because the darker tones that work against
a light background lose separation against a near-black one; each set was
chosen independently for contrast against its own background, not mirrored
1:1.

Sidebar tokens (`--sidebar*`) alias the roles above (`--sidebar` → `--card`,
`--sidebar-primary` → `--primary`, etc.) via `var()` in both modes, so the
sidebar can't drift from the base palette.

### Contrast

Checked against WCAG AA (4.5:1 normal text, 3:1 non-text UI components).
Every foreground/background text pairing clears AA comfortably in both modes:

| Pairing | Light | Dark |
|---|---|---|
| primary-foreground on primary | 9.55:1 | 10.07:1 |
| secondary-foreground on secondary | 8.45:1 | 10.12:1 |
| accent-foreground on accent | 11.23:1 | 12.44:1 |
| destructive-foreground on destructive | 6.46:1 | 10.11:1 |
| foreground on background | 12.33:1 | 15.14:1 |
| foreground on card | 13.77:1 | 11.60:1 |
| muted-foreground on background | 8.38:1 | 10.78:1 |
| muted-foreground on card | 9.36:1 | 8.26:1 |
| primary (link text) on background | 8.55:1 | 10.05:1 |

No component-level exceptions needed — every token can carry its paired
foreground at any weight or size, in either mode.

Two pairings are deliberately low-contrast, not a failure: `--border` against
`--background` (1.52:1 light / 1.54:1 dark) and `--card-border` against
`--card` (3.71:1 light / 3.46:1 dark). Low-contrast, 1px borders are a
deliberate part of this system's flat, earthy aesthetic, and neither carries
text — `--card-border` still clears the 3:1 non-text UI-component threshold
in both modes.

## Typography

Two typefaces, both free Google Fonts, no licensing substitution needed.

| Role | Font | Notes |
|---|---|---|
| Headings, display, quotes | **Libre Caslon Text** | Serif, carries a sense of wisdom and care |
| Body, labels, UI chrome | **Hanken Grotesk** | Sans, paired for modern clarity |

Headings use `--foreground` (charcoal in light mode, warm off-white in dark),
the same as body text, and differentiate purely through typeface (serif vs.
sans) and weight — there is no separate heading color token in this project.

`--font-heading` and `--font-sans` are wired via `next/font/google` in
`src/lib/fonts.ts` (`heading` → Libre Caslon Text, `sans` → Hanken Grotesk),
exposed as CSS variables on each root layout's `<html>` element. The
`@theme` block maps `--font-heading` / `--font-sans` to those variables, and
`@layer base` applies `font-heading` to `h1`–`h6`.

### Type scale

Not yet validated against a built page — treat as a starting point.

| Role | Font | Size | Weight | Line height | Letter spacing | Color token |
|---|---|---|---|---|---|---|
| Display (hero) | Libre Caslon Text | 48px | 700 | 1.2 | -0.02em | `--foreground` |
| Headline lg (desktop) | Libre Caslon Text | 32px | 600 | 1.3 | — | `--foreground` |
| Headline lg (mobile) | Libre Caslon Text | 28px | 600 | 1.3 | — | `--foreground` |
| Body lead | Hanken Grotesk | 20px | 400 | 1.6 | — | `--foreground` |
| Body md | Hanken Grotesk | 16px | 400 | 1.6 | — | `--foreground` |
| Label / caps | Hanken Grotesk | 12px | 600 | 1.0 | 0.1em | `--muted-foreground` |
| Quote | Libre Caslon Text | 24px | 400 | 1.5 | — | `--foreground`, italicized |

## Spacing

Base spacing unit is 8px. Tailwind's utility classes still apply fine — even-
numbered spacing steps already land on multiples of 8.

| Token | Value | Notes |
|---|---|---|
| Base unit | `8px` | All layout values below are multiples of this |
| Container max-width | `1120px` | 12-column fixed grid, centered, on desktop |
| Gutter | `24px` | Grid column gutter |
| Margin (mobile) | `16px` | |
| Margin (tablet) | `24px` | Matches the gutter value at this breakpoint |
| Margin (desktop) | `32px` | Grows past the gutter value, in step with the 8px unit |
| Section gap (desktop) | `120px` | Vertical gap between major page sections |
| Section gap (mobile) | `64px` | Compressed section gap below the grid breakpoint |

These are the raw token values; how they get applied page-to-page (container
padding at each breakpoint, header height, etc.) belongs in `ui-rules.md`'s
Layout section once that file is written.

## Component Values

- `--radius`: `1rem` (16px) base, same in both modes. Chosen so `--radius-lg`
  (which aliases `--radius` directly) lands exactly on this system's card
  radius of 16px, the only radius value tied to a specific component.
- Radius scale is computed off that base via a multiply pattern in
  `globals.css` (no hardcoded steps):
  - `--radius-sm`: `--radius * 0.6` → 0.6rem (9.6px)
  - `--radius-md`: `--radius * 0.8` → 0.8rem (12.8px)
  - `--radius-lg`: `--radius` → 1rem (16px) — cards
  - `--radius-xl`: `--radius * 1.4` → 1.4rem (22.4px)
  - `--radius-2xl` / `-3xl` / `-4xl`: `--radius * 1.8 / 2.2 / 2.6` — extend the
    scale for larger surfaces
- Buttons and badges bypass the `--radius` scale entirely and use Tailwind's
  `rounded-full` (pill shape).
- Borders: `1px` hairline throughout. `--border` / `--input` for general use;
  `--card-border` as the one documented exception (see Colors above).
- Elevation: no shadows anywhere, in either mode. Depth comes from tonal
  layering, soft 1px outlines, and a subtle grain/paper texture on the base
  background layer.
- Grain texture: an inline SVG fractal-noise filter (`feTurbulence`, low
  opacity) set as `body`'s `background-image` and composited with
  `background-blend-mode: overlay` in `globals.css`. Not a raster image asset
  — resolution-independent, adds no image weight, and adapts brightness
  direction automatically between light and dark since overlay blending reads
  off whatever base color sits underneath it.
