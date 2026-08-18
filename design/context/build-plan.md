# Build Plan

## Purpose

The ordered roadmap for the whole project. Read it before starting any
feature to understand what is next and how it fits. Update it when scope
changes.

This is the document you work from day to day. The rest of this project's
documentation describes the destination — what the product does, how it's
structured, how code is written. This one describes the route.

---

## How To Use

- **Before starting a task**: confirm it is the next one, and that
  everything it depends on is genuinely finished rather than nearly
  finished.
- **One task per session.** Each is sized to be built, reviewed, compiled
  and verified in a single sitting.
- **Never reorder within a phase without saying why.**
- **After finishing**: record the completed task in the project's progress
  log, register any new component in the project's component registry, and
  tell Michael what to verify.
- **When scope changes**: update this file in the same session, not later.

---

## Build Principles

**Vertical slices, not layers.** A task delivers schema, service (where one
exists), and UI for one capability, so that something is genuinely working
at the end of it.

**This is a small site. Resist inflating it.** There is no dashboard, no
state machine, no payment flow to build in isolation the way a SaaS product
would need. The one place that discipline still matters is the lead-capture
flow — get it right in isolation before wiring it into the live `/guide`
page.

**Nothing is done until Michael has verified it.** Every task ends with a
manual verification script: what to click, what should happen, what would
indicate breakage.

---

## Current State

The "Organic Wayfinder" palette, typography, and component rules are
already finalized and reflected in `globals.css`. Phase 0.2 below is a
confirmation step, not new design work.

This plan starts from an already-scaffolded Payload + Clerk template, not a
blank repository. Some files already exist as stubs — the Clerk auth
strategy, the Clerk sync hook, the admin-integration components — and need
real implementation, not creation from nothing. Everything else (the
collections, blocks, and routes this site actually needs) doesn't exist yet
and is built fresh across the phases below.

---

# Phase 0 — Foundation

### 0.1 — Dependencies

**Role**: installs what's missing, confirms what's already correctly absent.
**Builds**: adds `posthog-js`, `posthog-node`, `@hookform/resolvers`.
Confirms `@radix-ui/*`, `@payloadcms/plugin-form-builder`,
`@payloadcms/plugin-search`, `@payloadcms/payload-cloud`, and
`@microsoft/clarity` are absent from `package.json` — they already are, per
the current `package.json`; this step is a verification, not a removal.
**Done when**: `pnpm build` passes and the two new packages are installed.
**Verify**: `pnpm list posthog-js posthog-node @hookform/resolvers`.

### 0.2 — Design tokens (confirm, don't rebuild)

**Role**: confirm `globals.css` matches the finalized design tokens before
anything gets built on top of it.
**Done when**: every finalized design token resolves in the running app,
light and dark, and no hardcoded hex exists anywhere yet (there's nothing
else to check yet).
**Verify**: a blank page rendered with `bg-background text-foreground`
toggles correctly between light and dark.

### 0.3 — Clerk + admin identity

**Role**: turns the scaffolded stubs into a working auth model, so nothing
downstream is built against a guess.
**Why first**: every subsequent collection's access rules assume
`isAdminOrEditor` exists.
**Builds**: `payload/collections/users/schema.ts` (`role: admin | editor`,
field-level admin-only access, no exposed `password` field unless Payload's
version requires one — confirm this during the build, not before),
`payload/strategy/clerk-strategy.ts`, `payload/hooks/clerk-sync.ts`,
`app/(payload)/api/webhooks/clerk/route.ts`, `src/proxy.ts`,
`payload/access/access-control.ts`, `app/(auth)/sign-in/[[...sign-in]]/
page.tsx`, `app/(auth)/sign-out/page.tsx`.
**Done when**: `pnpm build` passes, `/admin` redirects an unauthenticated
visitor to `/sign-in`, and a Clerk account with `publicMetadata.role: admin`
created directly in the Clerk dashboard can sign in and reach `/admin`.
**Verify**: sign in as the bootstrap admin. Visit `/admin` signed out —
confirm redirect to `/sign-in`, not an error page. Visit `/sign-out` signed
in — confirm the session actually ends.

### 0.4 — PostHog

**Role**: analytics wired from the first real feature, not bolted on at the
end.
**Builds**: `lib/posthog-client.ts`, `lib/posthog-server.ts` (`flushAt: 1`,
`flushInterval: 0`), provider in the `(web)` layout, `identify` on
admin/editor sign-in and `reset` on sign-out.
**Done when**: a test pageview appears in PostHog carrying no PII.
**Verify**: load the homepage, inspect the event in PostHog for anything
identifying.

---

# Phase 1 — Marketing Foundation

### 1.1 — Collections and globals

**Role**: the content backbone every page and homepage section renders
from, including the programs collection — folded in here rather than given
its own phase, since it no longer has any routes of its own to justify one.
**Builds**: `pages`, `posts`, `categories`, `faqs`, `testimonials` (with
`featured`, picking the one shown on the homepage), `programs` (`name`,
`tagline`, `priceLabel` as free text, `outcomes` array, `icon` enum,
`ctaType` + `externalBookingUrl`, `featured`), `media` collections;
`branding`, `header` (with the two nav scroll-anchors and a
`defaultBookingUrl` field), `footer` (with an `ownerNotificationEmail`
field) globals.
**Done when**: every collection and global is reachable and editable in
`/admin` by an `editor` account.
**Verify**: create one entry in each collection as an `editor` account,
including one program with `ctaType: book-a-call` and one with
`ctaType: learn-more` — confirm `externalBookingUrl` is required only for
the first. Set `header.defaultBookingUrl`.

### 1.2 — Blocks and homepage

**Role**: the reusable page-building blocks, and the first real page — the
homepage itself is a single `pages` document assembled from these blocks in
the admin panel, not a hardcoded template.
**Builds**: `primary-hero`, `programs`, `testimonial`, `meet-michelle`,
`faq`, `archive`, `cta`, `content`, `banner`, `code`, `media` blocks; the
homepage document assembled from them in this order: hero, programs,
testimonial, meet-michelle, faq, archive (as the Latest Insights teaser,
limited to 3), cta (as the closing call to action, carrying the same two
links as the hero).
**Done when**: the homepage renders and matches the finalized design tokens
and component rules, and the header's "Programs"/"Blogs" nav links
correctly scroll-anchor to their sections.
**Verify**: publish the homepage in `/admin`, load `/`, check light and dark
mode. Click both header nav links from the top of the page and confirm each
scrolls to the right section.

### 1.3 — CMS pages

**Builds**: `/[slug]` route for free-form CMS pages (Privacy Policy, Terms
of Service, and any future flat page).
**Done when**: a Privacy Policy page created in `/admin` is reachable at its
slug.
**Verify**: create and publish a page titled "Privacy Policy", confirm it's
live at `/privacy-policy`.

---

# Phase 2 — Blog

### 2.1 — Blog index and post detail

**Builds**: `/posts` (flat list, no pagination, no category filter — title,
date, excerpt per entry), `/posts/[slug]` (category label, title, publish
date, full content).
**Done when**: every published post appears on `/posts`, and each links to
a working detail page.
**Verify**: publish three posts, confirm all three appear on `/posts` and
each detail page renders its category label and content correctly.

---

# Phase 3 — Lead Capture

The commercial point of the site. Built and verified in isolation before
being wired into the live `/guide` page — the one place in this build where
that discipline matters.

### 3.1 — Leads collection

**Builds**: `leads` collection, `create` access sealed (`isRestricted`),
`read`/`update`/`delete` admin-only.
**Done when**: a direct `POST /api/leads` is refused, and an `admin` can
read leads in `/admin` while an `editor` cannot.
**Verify**: attempt an unauthenticated `POST /api/leads` — confirm it's
refused. Sign in as `editor`, confirm the Leads collection is hidden or
read-refused.

### 3.2 — Lead capture service

**Role**: the one real piece of business logic in this codebase.
**Builds**: `services/lead.service.ts` — creates the lead record
(`overrideAccess: true`, the one named exemption), sends the visitor's
acknowledgement email via `payload.sendEmail()`, sends Michelle's
notification email to `header.ownerNotificationEmail`, `app/actions/lead.ts`
Server Action with Zod validation.
**No page wiring yet** — test the service directly, e.g. from a scratch
script or the Payload panel's API tab.
**Done when**: calling the service produces one lead record and two sent
emails, and a deliberately-broken email config (e.g. a bad `RESEND_FROM_EMAIL`)
still results in the lead being recorded.
**Verify**: call `captureLead` with valid data, confirm both emails arrive
and the lead appears in `/admin`. Then break the Resend config on purpose
and confirm the lead still gets recorded.

### 3.3 — `/guide` page

**Builds**: the `lead-capture` block (heading, benefit bullets, guide file
upload), the hand-built form component (`react-hook-form` +
`@hookform/resolvers` + the same Zod schema the Server Action uses),
submitting/success/error states, and the page's stripped header (logo only,
no nav, no booking button).
**Done when**: submitting the live form on `/guide` produces the same result
as 3.2's direct service test, and the UI shows the right state at each step.
**Verify**: submit with an invalid email — confirm the inline error. Submit
with a valid one — confirm the button shows a brief in-progress state, then
the form swaps for a success message, then check both inboxes and `/admin`.

---

# Phase 4 — SEO, Analytics, and Launch

### 4.1 — SEO sweep

**Builds**: `@payloadcms/plugin-seo` on `pages`/`posts`, `next-sitemap`
config, `@payloadcms/plugin-redirects`, `robots.txt` excluding `/admin/*`
and `/sign-in*`.
**Verify**: check generated sitemap includes published pages/posts and
excludes drafts. Check `robots.txt` disallows `/admin/*` and `/sign-in*`.

### 4.2 — PostHog event sweep

**Builds**: every event this project tracks — `lead_magnet_viewed`,
`lead_captured`, `booking_cta_clicked`, `nav_link_clicked`, `post_viewed`.
**Done when**: every event fires with correct properties and no PII.
**Verify**: run a full visitor journey (home → click a nav link → guide →
submit → a blog post), read the PostHog event stream for each expected
event.

### 4.3 — Security and content pass

- No hardcoded color, external URL, or secret anywhere — grep for raw hex
  and for the booking URL string.
- `leads.create` still refused via direct REST.
- `/admin` still unreachable by anyone without `admin`/`editor`.
- `.env` not committed. No `NEXT_PUBLIC_` secret.
- Grep for `console.log`/`console.error` carrying a captured lead's email or
  name.

### 4.4 — Production cutover

Storage switched to R2. Clerk production keys. Resend sending domain
verified in production. Webhook endpoint re-registered on the production
domain. Contabo/Traefik deploy.

---

## Descope Order

If the date is at risk, cut from the bottom.

1. **Homepage Programs section as an interactive carousel (1.2)** — ship as
   a static row of cards first; add the carousel/dot-pagination interaction
   later.
2. **FAQ accordion interactivity (1.2)** — ship every answer visible by
   default first; add the collapse/expand behavior later.

**Never cut**: the lead-capture flow (3.1–3.3) — it's the entire commercial
point of the site — Clerk admin gating (0.3), and the design-token
compliance rule.

---

## Progress

This file says what is planned. What actually happened is tracked
separately, entry by entry, as each task completes.
