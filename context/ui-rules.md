# UI Rules

## Purpose

Concise, binding rules for building the project's user interface. These are the rules an
agent must follow when writing or modifying any UI code. Read this before building any new
UI component or page. Token values referenced below (colors, radius steps, spacing) are
defined in `ui-tokens.md` — this file covers how those tokens get applied, not the values
themselves.

## Rules

### Tokens

- Never use a hardcoded hex value or a raw Tailwind color class (e.g. `bg-teal-500`).
  Always reference a token from `ui-tokens.md` / `globals.css` (e.g. `bg-primary`,
  `text-muted-foreground`).
- Adding a new color anywhere in the UI means adding it to `ui-tokens.md` first, not
  inlining it at the call site.
- `iconLibrary` is `lucide` (`lucide-react`, already a project dependency) — no other icon
  set or hand-drawn SVG icons. Icons inherit `currentColor`, never a hardcoded fill.
  Default size 16–20px inline with text, 24px max for standalone/decorative use.

### Color contrast

- Every paired token (`--primary`/`--primary-foreground`,
  `--secondary`/`--secondary-foreground`, `--accent`/`--accent-foreground`,
  `--destructive`/`--destructive-foreground`, `--muted`/`--muted-foreground`) already
  clears WCAG AA at any weight or size, in both light and dark mode — see `ui-tokens.md`'s
  Contrast section. No color needs a semibold/14px+ carve-out or similar exception the way
  a fragile palette would.
- `--destructive-foreground` must always be referenced as a token, never hardcoded to
  white. `--destructive` itself flips from a dark red (light mode) to a light red (dark
  mode), so a hardcoded "white text on destructive" assumption breaks contrast outright in
  dark mode.
- `--border` and `--card-border` are intentionally low-contrast against their surfaces
  (non-text, part of the flat/earthy aesthetic) — never use either as a text color, and
  don't "fix" them to be more visible; the softness is deliberate.

### Typography

- `--font-sans` (Hanken Grotesk) is for body copy, labels, and UI chrome. `--font-heading`
  (Libre Caslon Text) is for headings, the hero display, and quotes/testimonials only —
  never body copy.
- Headings use `--foreground`, the same token as body text, not a distinct heading color —
  headings read as branded through typeface and weight, not color. Don't introduce a
  `--heading` color token without updating `ui-tokens.md` first.
- Heading and interactive-label weight is 600 (700 for the hero display only). Body copy
  is 400.
- The hero display (48px) is the one place letter-spacing pulls in (`-0.02em`) rather than
  sitting at default — reserve that tightened spacing for hero-scale headlines, not
  smaller headings.
- Small caps / section-marker labels are uppercase, 12px, weight 600, letter-spacing
  `0.1em`, colored `--muted-foreground`.
- Quotes and testimonials use the type scale's Quote role (24px Libre Caslon Text,
  italicized) — see Testimonials below for the full component pattern.

### Layout

- Page max-width: `1120px`, centered, on a 12-column grid at desktop.
- Container padding: 16px mobile, 24px tablet, 32px desktop.
- Vertical gap between page sections: 120px desktop, 64px mobile.
- Mobile-first. Multi-column grids (program cards, testimonial rows, etc.) collapse to a
  single column below the `md` breakpoint.
- Favor asymmetrical placement for imagery — let a photo sit slightly off-center rather
  than pinned to a perfectly centered grid cell. This is a deliberate brand trait
  (organic, not rigidly boxed-in), not a default to relax under time pressure.
- Use the `--radius` scale (`--radius-sm` through `--radius-4xl`) for corners. Never an
  arbitrary pixel/rem radius at the call site.

### Cards

- Neutral surface: `--card` background, `--card-border` (not the general `--border`) at
  1px, `--radius-lg` (16px) corners.
- Internal padding: 40px.
- No colored card backgrounds (`--primary`, `--secondary`, `--muted`, `--accent`) — color
  lives inside the card (badges, icons, buttons, text), never on the card surface itself.
- No shadows. A card's depth comes from `--card-border` plus the light/dark tonal shift
  `--card` already carries off `--background` — not elevation.

### Buttons

- Fully rounded (`rounded-full`, pill shape) — buttons bypass the `--radius` scale
  entirely. This is a deliberate exception: pill CTAs are meant to contrast against the
  more structured 16px-cornered content blocks around them, not match them.
- Padding: 16px horizontal / 8px vertical. Label: 14px, weight 600.
- Primary: `--primary` fill / `--primary-foreground` text. Secondary: `--secondary` fill /
  `--secondary-foreground` text. Destructive: `--destructive` fill /
  `--destructive-foreground` text (always the token — see Color contrast above).
- Outline/ghost buttons: transparent background, `--border` outline (or none for ghost),
  `--foreground` text.
- Hover state shifts saturation, not brightness — no lightening, no shadow. Proposed
  default: `filter: saturate(85%)` on hover for filled buttons, applied uniformly across
  primary/secondary/destructive rather than a per-color tweak.

### Form inputs

- Radius: `--radius-md`. Padding: 16px horizontal / 8px vertical.
- `--card` background, `--border` outline, `--foreground` text, `--muted-foreground`
  placeholder text.
- Focus state does not use a glow/ring by default — it replaces the border with a visibly
  thicker bottom edge in `--ring` (terracotta), read as an "underline" guiding attention
  to the active field. This is a deliberate departure from shadcn's default focus-ring
  treatment; don't fall back to a generic ring on this component.

### Badges & small labels

- Full radius (pill shape), not a step from the `--radius` scale.
- Any paired token combination is safe to use as a badge fill
  (`--secondary`/`--secondary-foreground`, `--muted`/`--muted-foreground`,
  `--accent`/`--accent-foreground`) — unlike a fragile palette, nothing here needs a
  light/outlined-only treatment to stay accessible at small sizes.

### Progress indicators

- This is a single-page landing site with no multi-step flow, so the "Path" motif is
  decorative, not a functional wizard/progress bar: a static, thin dashed line that
  visually threads the page's sections together, read as a metaphor for the coaching
  journey rather than tracking real progress through a process. No scroll animation, no
  step-completion state.
- If a genuine multi-step flow is ever added (e.g. a multi-page intake form), revisit this
  as a real stepped indicator at that point — don't build that complexity in now.

### Forms &amp; submission feedback

- The lead-generation email capture is the only interactive form on this site. Its states
  cover everything this project currently needs:
  - Submitting: the button disables and its label swaps to a brief in-progress state (e.g.
    "Sending…") — no full-page spinner.
  - Success: the form swaps in place for a short confirmation message. No separate "thank
    you" page or redirect needed at this scale.
  - Error (invalid email, failed submission): inline text below the field in
    `--destructive`, plain language (e.g. "Please enter a valid email" or "Something went
    wrong — try again").
- No skeleton screens anywhere else. The rest of the page is static, CMS-rendered content,
  not async-loaded data, so no other loading state is needed.

### Testimonials

- No card, no container. Centered, Libre Caslon Text at the Quote scale (24px,
  italicized), styled as a "floating" quote — a moment of reflection between informational
  sections, not another boxed content block.

### Imagery

- High-quality landscape/environmental photography is the primary visual device — treat it
  as a "window" into the brand's space, not decoration.
- Headshots (e.g. the coach's photo) use one shared organic "pebble"-shaped mask via CSS
  `clip-path`, reused everywhere a headshot appears, instead of a plain circle or square
  crop. One consistent shape, not a different one per instance — simpler to build and
  still reads as intentional.

### Animation & motion

- `motion` (the Framer Motion successor) is an installed dependency — this project does
  anticipate real animation, unlike a strictly motion-free system. Keep it restrained and
  purposeful: gentle, "flowing" transitions on section/page entrances and state changes,
  not decorative or attention-seeking motion. Favor Shadcn/UI's built-in interaction
  states (hover/focus/dropdown/dialog transitions) for small-scale UI feedback, and
  reserve `motion` for the larger section-level transitions the brand language calls for.

### Empty states

- Every list/section that can be empty needs an explicit empty state — never leave a blank
  gap where content would normally render.
- Minimal pattern: a `lucide-react` icon in `--muted-foreground`, one line of descriptive
  text in `--muted-foreground`, and a CTA button only if there's a genuine next action.
