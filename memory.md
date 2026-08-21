# Memory — Social proof carousel + meet-michelle conformance

Last updated: 2026-08-21 08:46 +03:00

## What was built

- Built the `socialProof` Payload block end-to-end: `src/payload/blocks/social-proof/schema.ts` (`headline` required, `headlineDescription` optional, `testimonials` array required `minRows: 1` of `name`(req) / `photo`(upload → media) / `jobTitle` / `testimony`(req), plus `backgroundVariant`) + `src/payload/blocks/social-proof/component.tsx` (a shadcn Carousel testimonial carousel) + registration in `pages/schema.ts` and `render-blocks.tsx`.
- Michael installed the shadcn `carousel` component (`src/components/ui/carousel.tsx`, `embla-carousel-react`) and changed `meet-michelle/schema.ts` (`title` → `headline` required + `headlineDescription` optional); I updated `meet-michelle/component.tsx` to match.
- Added a decorative serif `“` quote mark above each testimonial (`font-heading text-primary text-6xl font-bold`, `aria-hidden`).

## Decisions made

- Social proof is an inline multi-item array carousel inside one block — NOT the build-plan's planned `testimonials` collection with a single `featured` quote. User's explicit choice.
- Carousel uses the shadcn `Carousel` (embla) with `loop: true`; the default `-ml-4`/`pl-4` slide gutter is dropped (`ml-0`/`pl-0`) to keep the centered quote symmetric. Navigation is a custom `SocialProofNav` child via `useCarousel()` (`scrollPrev`/`scrollNext`) — the stock `CarouselPrevious`/`CarouselNext` (absolute-positioned) were not used.
- Required fields render unconditionally; optional fields (`headlineDescription`, `photo`, `jobTitle`) render conditionally — applied consistently in both social-proof and meet-michelle.

## Problems solved

- A carousel needs many items but the original social-proof schema stored one → restructured into a `testimonials` array (user chose "array in block" over "relationship to a collection").
- `pnpm.ps1` blocked by PowerShell execution policy → use `pnpm.cmd`.
- embla's default slide gutter would off-center the centered quote → `ml-0`/`pl-0` overrides on `CarouselContent`/`CarouselItem`.

## Current state

- `socialProof` and `meetMichelle` are both registered in `pages/schema.ts` and `render-blocks.tsx` and render (carousel with headline + optional description, quote mark, headshot, name/jobTitle; meet-michelle headline + optional description, photo/bio required).
- `payload-types.ts` regenerated; `tsc --noEmit` and `eslint` pass (0 errors). Needs a visual pass in dev; `pnpm.cmd build` still never run across these sessions.

## Next session starts with

- Visual pass of the social-proof carousel and meet-michelle headline in dev (light/dark, mobile widths).
- Run `pnpm.cmd build`.
- Resume `build-plan.md` Phase 1.2: remaining blocks (faq, testimonial) + homepage assembly; then Phase 2.1 `/posts` index.

## Open questions

- None blocking — both new blocks need a real dev visual check before declaring done.
