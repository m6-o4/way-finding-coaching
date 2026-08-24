# Memory — Lead-magnet block + lead-capture flow

Last updated: 2026-08-24 15:42 +03:00

## What was built

- Lead-magnet guide section, end-to-end:
  - `src/payload/blocks/lead-magnet/component.tsx` (new, `"use client"`) — renders the `leadMagnet` block from schema fields (`headline` req, `headlineDescription`, `image` upload→media req, `backgroundVariant`), plus a hardcoded checklist ("Uncovering hidden conflicts" / "The purpose worksheet" / "Somatic grounding techniques"), the lead-capture form (idle/submitting/success/error), and a side image with a caption card.
  - `src/app/actions/lead.ts` (new) — `submitLead` Server Action: zod (`z.email()`) validates `{ firstName, email }`, delegates to the service.
  - `src/services/lead.service.ts` (new) — `captureLead`: `payload.create({ collection: "leads", overrideAccess: true })` + visitor ack email + owner notification email (both fail gracefully).
  - `src/payload/blocks/render-blocks.tsx` — registered `leadMagnet: LeadMagnetBlock`.
- Fixed TS warnings in `src/payload/collections/media/schema.ts` — the `validate` callback cast to `TextFieldSingleValidation` (`value`/`data` were implicit `any`).
- Generated final guide-page copy: meta title "Free Journaling Guide: Find Clarity and Direction in Life" (57 chars); meta description (130 chars); hero headline "Your Path to Clarity Starts Here"; description "Download the free guide and discover simple journaling prompts to quiet the noise and find your direction."
- First-name field icon is `User`; email field keeps `Mail`.

## Decisions made

- Block component is a single `"use client"` file (the social-proof pattern), not a server wrapper + `-client` child.
- Used a plain `<form onSubmit>` + native `required`/`type="email"` + server-side zod — NOT the build-plan's react-hook-form + `@hookform/resolvers`, because the provided reference markup was a plain form.
- Submit button uses the shared `Button` (`type="submit"`, `py-4` for height) rather than a raw `<button>`.
- Check pills use `bg-accent text-primary` (safe in both modes); the reference's `bg-secondary text-primary` fails dark-mode contrast.
- Removed the reference's `shadow-xl` + `blur-2xl` glow; `rounded-2xl`→`rounded-lg`, `border-border`→`border-card-border`, `font-serif`→`font-heading`.

## Problems solved

- Media `validate` warnings were TS7006/TS7031 (implicit `any`) — the `CollectionConfig` type doesn't carry field-specific generics, so `validate` params lose contextual typing; fixed by casting to `TextFieldSingleValidation` (pattern already used in `src/payload/fields/lexical.ts`).
- Zod v4 API: use `z.email()` — `z.string().email()` is deprecated.
- `pnpm.ps1` blocked by PowerShell execution policy → use `pnpm.cmd` (and `node_modules\.bin\*.cmd` for tsc/eslint/prettier).

## Current state

- All new files pass `tsc --noEmit`, `eslint`, and `prettier --write`.
- `progress-tracker.md` and `ui-registry.md` are updated with the lead-magnet entry.
- The block renders only inside an existing `pages` document — the `/guide` route and its stripped header DO NOT exist yet.

## Next session starts with

1. Build the `/guide` page: `app/(web)/guide/page.tsx` (a `pages` doc with slug `guide` carrying the `leadMagnet` block) + the stripped header (logo only, no nav/booking CTA).
2. Then close the flagged gaps: seal `leads.create` to `isRestricted`; add an `ownerNotificationEmail` global field and point the service's notification email at it; add a guide-file field so the ack email can carry a download link.

## Open questions

- None blocking. Follow-ups noted above are the remaining work to make `/guide` production-ready. The `/guide` route + stripped header approach (static shell vs CMS-driven) is not yet decided.
