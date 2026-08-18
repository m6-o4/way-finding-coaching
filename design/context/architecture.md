# Architecture

## Purpose

This file defines the technical shape of the project: the stack, how the
codebase is organized, where the system boundaries are, how data flows, the
data schema, and the rules an agent must never violate.

Read it before writing any code that touches structure, data, identity, or
external communication (email, analytics).

This file is the final word on **how the system is built** — stack,
structure, data flow, schema, and the Invariants at the end, which nothing
in this file or elsewhere overrides. It is not the final word on **what the
product does** — that's a different concern, covered elsewhere in this
project's documentation set.

---

## Tech Stack

Versions are pinned as installed. Do not upgrade a major version as part of a
feature task.

| Layer | Tool | Version | Purpose |
|---|---|---|---|
| Framework | Next.js (App Router) | 16.2.12 | Full-stack framework |
| Runtime | React | 19.2.8 | Server Components by default |
| Language | TypeScript | 6.0.3, strict | Throughout |
| CMS / backend | Payload CMS | 3.86.0 | Collections, admin panel, local API |
| Database | MongoDB | — | `@payloadcms/db-mongodb`, single `DATABASE_URI` |
| Identity | `@clerk/nextjs` / `@clerk/backend` | 7.6.3 / 3.14.0 | Auth, sessions, credentials — admin panel only |
| Styling | Tailwind CSS | 4.3.3 | With Shadcn/UI |
| UI primitives | `@base-ui/react` | 1.6.0 | Shadcn 4 sits on Base UI, **not Radix** |
| UI CLI | `shadcn` | 4.16.0 | Installs components into `components/ui/` |
| Icons | `lucide-react` | 1.28.x | The only icon set |
| Animation | `motion` | 12.43.x | Sparingly — simple opacity/transform transitions only, never layout-shifting animation on initial load |
| Forms | `react-hook-form` | 7.85.x | The one form on this site: lead capture |
| Validation | `zod` | 4.4.x | Every boundary where data enters the system |
| Theme | `next-themes` | 0.4.x | Light/dark toggle |
| Email | `@payloadcms/email-resend` | via Payload's `email` config | See Lead Capture below — no separate Resend SDK is installed |
| Storage | `@payloadcms/storage-s3` | 3.86.0 | MinIO in dev, Cloudflare R2 in production |
| SEO | `@payloadcms/plugin-seo`, `next-sitemap` | — | Metadata, canonical URLs, sitemaps |
| Redirects | `@payloadcms/plugin-redirects` | — | |
| Rich text | Lexical | via `@payloadcms/richtext-lexical` | Payload's editor |
| Images | `sharp` | 0.35.3 | Payload media processing |
| Releases | `semantic-release` | 25.x | Conventional Commits required |
| Infrastructure | Contabo VPS, Ubuntu 24.04, Docker, Traefik, Portainer | — | Self-hosted |

### To be installed

Confirmed absent from the current `package.json`. Install each one when the
feature that needs it is first built, not before.

| Package | Why |
|---|---|
| `posthog-js`, `posthog-node` | Analytics. Browser and server clients. |
| `@hookform/resolvers` | Wires the `zod` schema into `react-hook-form` for the lead-capture form. `react-hook-form` and `zod` are both already installed; the resolver package that connects them is not. |

---

## Folder Structure

This build starts from an already-scaffolded Payload + Clerk template.
Entries marked **new** don't exist yet and are created during this build;
everything else already exists in the scaffold.

```
/
├── src/
│   ├── payload.config.ts
│   ├── payload-types.ts                      → generated. the source of every type.
│   ├── proxy.ts                               → Clerk middleware (Next 16 renamed middleware.ts → proxy.ts)
│   ├── globals.css
│   ├── css-variables.js
│   ├── app/
│   │   ├── (web)/                            → public marketing. Own root layout.
│   │   │   ├── layout.tsx  page.tsx  template.tsx  not-found.tsx
│   │   │   │                                   page.tsx is the single-page homepage:
│   │   │   │                                   a `pages` document assembled from blocks.
│   │   │   ├── [slug]/                       → CMS pages (legal pages, any future flat page)
│   │   │   ├── posts/
│   │   │   │   ├── page.tsx                  → new: blog index, flat list, no pagination
│   │   │   │   └── [slug]/page.tsx           → new: post detail
│   │   │   ├── guide/                        → new: the lead-magnet page. Stripped header.
│   │   │   └── next/{preview,exit-preview}/
│   │   ├── (auth)/                           → own root layout
│   │   │   ├── layout.tsx
│   │   │   ├── sign-in/[[...sign-in]]/page.tsx   → Clerk's <SignIn/>, redirect_url-aware
│   │   │   └── sign-out/page.tsx
│   │   ├── (payload)/
│   │   │   ├── layout.tsx                    → Payload-generated; guarded. Commit it.
│   │   │   ├── custom.scss
│   │   │   ├── admin/[[...segments]]/
│   │   │   └── api/                          → THE api namespace. Everything lives here.
│   │   │       ├── [...slug]/route.ts        → Payload REST catch-all
│   │   │       ├── graphql/  graphql-playground/
│   │   │       └── webhooks/
│   │   │           └── clerk/route.ts        → inbound, no session, signature-verified
│   │   ├── (sitemaps)/
│   │   │   ├── pages-sitemap.xml/route.ts
│   │   │   └── posts-sitemap.xml/route.ts
│   │   └── actions/                          → Server Actions. `lead.ts` is the only one this build needs.
│   ├── payload/
│   │   ├── access/access-control.ts          → every access rule, one file
│   │   ├── collections/                      → categories, faqs (new), leads (new), media,
│   │   │                                       pages, posts, programs (new), testimonials (new), users
│   │   ├── blocks/                           → all new for this build:
│   │   │                                       primary-hero, programs, testimonial, meet-michelle,
│   │   │                                       faq, archive, cta, content, banner, code, media,
│   │   │                                       globals/{branding,header,footer}
│   │   ├── fields/                           → lexical, resend, slug
│   │   ├── hooks/                            → clerk-sync (new), populate-published-at, revalidate-redirects
│   │   ├── strategy/clerk-strategy.ts
│   │   ├── plugins/schema.ts
│   │   └── utilities/                        → deep-merge, format-authors, format-date,
│   │                                           generate-meta, generate-preview-path, get-document,
│   │                                           get-globals, get-media-url, get-redirects, get-url,
│   │                                           is-browser, merge-opengraph, request-context
│   ├── services/                             → new: lead.service.ts is the one service this build needs
│   ├── jobs/                                 → present in the scaffold, unused. No background-job
│   │                                           phase is in this build's scope; leave empty.
│   ├── components/
│   │   ├── ui/                               → Shadcn, Base UI-backed. Check what's already
│   │   │                                       installed before adding.
│   │   ├── admin/                            → clerk-admin-provider, custom-signout-button,
│   │   │                                       get-current-user.ts
│   │   ├── payload/                          → icon, media, payload-redirects, rich-text,
│   │   │                                       live-preview-listener
│   │   ├── providers/theme-provider.tsx
│   │   ├── container.tsx
│   │   └── web/                              → new: marketing components (header, footer,
│   │                                           program-card, testimonial-quote, faq-accordion,
│   │                                           lead-capture-form, etc.)
│   ├── types/                                → ambient module declarations only (e.g. CSS imports).
│   │                                           Real types come from payload-types.ts — see below.
│   └── lib/                                  → utils.ts, fonts.ts, posthog-client.ts (new),
│                                               posthog-server.ts (new)
└── public/
```

The scaffold also contains a `src/app/(saas)/dashboard/` route group left
over from the starter template. This project has no SaaS dashboard and no
non-staff authenticated user — ignore that route group entirely, don't
build against it, and don't reference it anywhere else in this codebase.

### There is no `src/types/DomainThing.ts`

Types come from `src/payload-types.ts`, which Payload generates. Derive from
it — `type Role = NonNullable<User["role"]>` — rather than declaring a
parallel type that will drift. Run `pnpm generate:types` after every schema
change. The one thing that legitimately lives in `src/types/` is an ambient
module declaration (e.g. for a non-`.ts` import Next needs a type for) — not
a redeclared domain shape.

### There is no `src/app/layout.tsx`

Payload's `RootLayout` renders `html` and `body` itself, so a shared root
layout would mount them twice. Each route group renders its own document.
`globals.css` is imported per group, never hoisted, or Tailwind's preflight
lands on the Payload admin panel and fights its stylesheet. Both `html` and
`body` carry `suppressHydrationWarning`; it does not cascade.

### There is no `components/dashboard/`

This project has no SaaS dashboard and no non-staff authenticated user. Every
authenticated surface is the Payload admin panel itself — don't invent a
parallel custom dashboard.

### The homepage is one CMS document, not a hardcoded template

`app/(web)/page.tsx` renders a single `pages` collection document (e.g. its
slug is `home`) through the same block-rendering path every other CMS page
uses. The sequence of sections a visitor sees — hero, programs, testimonial,
Meet Michelle, FAQ, latest insights, closing CTA — is assembled by an
`admin`/`editor` adding those blocks to that one document in the panel, in
that order. Nothing about section order or presence is hardcoded in the
route file itself.

### API namespacing — read before adding a route

Every HTTP endpoint lives under `src/app/(payload)/api/`. That directory
already contains Payload's own `[...slug]` catch-all, which serves
`/api/{collection-slug}` for **every** collection — including
`/api/leads`, since `leads` is a real collection slug in this build. Payload's
REST API and our route handlers therefore share one URL namespace.

This build currently needs exactly one custom route: `api/webhooks/clerk/`
(inbound, no session, signature-verified). It does not currently need an
`api/actions/*` namespace — the lead capture is a Server Action, not a route
handler, because the caller is always our own UI. If a future need requires a
third-party caller, a stream/file response, or a poll, add
`api/actions/{domain}/{verb}/` then, following the same pattern as the
webhook namespace — never a bare route that could collide with a collection
slug like `leads`, `pages`, or `posts`.

**Prefer a Server Action in `src/app/actions/` over a route handler.** Reach
for a route only when the caller is a third party, when the response is a
stream or file, or when something outside React needs to call it.

Layouts do not wrap route handlers, so the `(payload)` layout guard does not
protect anything under `api/`. Every route authorizes itself.

---

## Identity Architecture

Clerk owns identity, sessions and credentials. Payload owns the user record
and is the management surface. There is **one identity record per human**,
and there are only ever two: `admin` and `editor`.

### The moving parts

**1. Auth strategy** (`src/payload/strategy/clerk-strategy.ts`). A custom
Payload `AuthStrategy` verifies the Clerk session on every request and
resolves the matching Payload user by `clerkId`. If no record exists yet —
the webhook hasn't landed — it provisions one inline from Clerk's data.
`createClerkClient` must receive **both** the publishable key and the secret
key, and `authorizedParties` must match the browsing origin exactly, including
the bare and `www.` variants Traefik routes to the same app.

It **never invents a role**. If `publicMetadata.role` is absent or
unrecognized it logs and returns `{ user: null }` — there is no neutral role
to fall back to, and given there's no public-facing use of a session at all,
a user with no resolvable role simply cannot reach `/admin`.

**2. Webhook** (`src/app/(payload)/api/webhooks/clerk/route.ts`). Handles
`user.created`, `user.updated`, `user.deleted` for changes originating in
Clerk — i.e. when Michelle creates or edits a staff account directly in the
Clerk dashboard. Signature-verified with `verifyWebhook`.

**3. Sync hooks** (`src/payload/hooks/clerk-sync.ts`). Collection hooks on
`users` create, update and delete the Clerk identity when an admin acts in the
Payload panel instead.

**4. Loop guard.** A `fromClerkWebhook` flag on Payload's request context
distinguishes inbound webhook writes from admin-panel-originated ones, so the
two systems don't write to each other indefinitely.

**5. Sign-out** (`app/(auth)/sign-out/page.tsx`). A dedicated route that
triggers Clerk's sign-out and returns the visitor to `/`. Kept separate from
Payload's own admin-panel sign-out control, because that control clears a
`payload-token` cookie that was never issued for a Clerk-authenticated
session — see Route Protection below.

### Role authority

**Payload is authoritative.** `users.role` is the source of truth. Clerk
`publicMetadata.role` is a mirror, maintained by the sync hook, used only as a
cheap client-side rendering hint. **It never authorizes anything.**

`role` carries field-level access (`create` and `update` restricted to
`admin`), because collection-level update permits a user to edit their own
record. Without the field-level lock, an editor could promote themselves to
admin.

### No self-registration, anywhere

Unlike a product with public accounts, this site has no sign-up route, no
`/registration` chooser, and no role-promotion flow. Every `admin`/`editor`
account is created directly — either by Michelle in the Payload panel (which
creates the Clerk account via the sync hook) or by Michelle in the Clerk
dashboard directly (which lands in Payload via the webhook). There is nothing
resembling `unsafeMetadata`-based intent to validate, because nothing a
browser sends ever produces a role.

### Route protection

`src/proxy.ts` runs `clerkMiddleware()` and nothing else; the matcher must
include `/__clerk/(.*)` or Clerk's frontend API requests are not handled.

`(payload)/layout.tsx` calls `auth.protect()`, then `getCurrentUser()`, then
requires `admin` or `editor`. Anyone else — which, on this site, means anyone
without a resolvable role at all — is redirected to `/`, never shown Payload's
unauthorized screen and never signed out of a session they didn't know they
had. (Payload's own unauthorized screen can't log a Clerk user out — its
logout button clears a `payload-token` cookie that was never issued; the
dedicated `/sign-out` route above is the correct way to end a session.)

Layouts do not wrap route handlers. The Payload REST API and the Clerk
webhook are unaffected by this guard, which is correct: the API is governed
by collection access, and the webhook must stay reachable without a session.

---

## System Boundaries

Four layers. No layer may bypass the one beneath it. This project is small
enough that most of its collections don't need a service — most reads are
direct, guarded Payload queries from a Server Component — but the one place
real business logic exists (lead capture: validate, persist, send two emails,
never fail loudly) still goes through a service, for the same reason every
other project on this stack does: so the pattern transfers directly the next
time this foundation gets reused for something bigger.

```
Client  →  Server Action  →  Domain Service  →  Payload  →  MongoDB
```

| Folder | Owns | Never does |
|---|---|---|
| `app/(web)` | Marketing and blog pages | Contain business logic |
| `app/(auth)` | Sign-in and sign-out | Anything beyond rendering Clerk's `<SignIn>` and triggering sign-out |
| `app/(payload)/api` | Request validation, signature verification, response shaping | Contain business logic |
| `app/actions` | Server Actions: validate, delegate, revalidate | Contain business logic |
| `services/` | The lead-capture flow's business logic | Import from `components/`; touch React |
| `payload/` | Schema, access rules, hooks | Contain workflow logic |
| `components/` | UI | Fetch data directly from Payload; call the database |
| `lib/` | Third-party clients, constants, pure functions | Hold state |

---

## Data Flow

### Rendering strategy

| Surface | Strategy |
|---|---|
| Homepage, CMS `[slug]` pages | Static with on-demand revalidation from Payload hooks on publish |
| Blog index and post detail | Static with on-demand revalidation, same as above |
| `/guide` | Static shell; the form itself is a client component |
| `/admin` | Dynamic, per request, uncached — Payload's own admin app |

Nothing on this site needs per-request dynamic rendering on the public side —
there is no per-visitor state to render around. If that ever changes (e.g. a
personalized recommendation), revisit this table before adding it.

### Mutations

There is exactly one mutation surface on the public site: the lead-capture
form, a **Server Action** in `src/app/actions/lead.ts`. It validates with
Zod, delegates to `services/lead.service.ts`, and revalidates nothing (the
`/guide` page has no cached list of leads to invalidate).

The Clerk webhook (`api/webhooks/clerk/route.ts`) is the only route handler
that mutates anything, and it's third-party-triggered by definition.

### Lead capture

```
Visitor submits name + email on /guide
      ↓
app/actions/lead.ts (Server Action)   Zod validates the payload
      ↓
services/lead.service.ts              the one service this build has
      ↓                                1. payload.create() into `leads`,
      ↓                                   overrideAccess: true (the collection
      ↓                                   is sealed — see Access Control)
      ↓                                2. payload.sendEmail() to the visitor:
      ↓                                   acknowledgement + the guide's
      ↓                                   download link
      ↓                                3. payload.sendEmail() to the address
      ↓                                   configured in the `header` global's
      ↓                                   ownerNotificationEmail: new lead +
      ↓                                   a prompt to follow up
      ↓
Result<Lead> returned to the Server Action
      ↓
UI swaps the form for an inline success message
```

Both emails go through `payload.sendEmail()` — the Local API method exposed
by the already-configured `@payloadcms/email-resend` adapter. No separate
Resend SDK dependency is installed or needed.

**Email delivery failure never blocks the lead being recorded, and never
blocks the visitor's success state.** The lead is the thing that matters —
if an email bounces or Resend has a bad moment, log it and keep going. There
is no retry queue in this build's scope; a failed notification is a case for
Michelle to notice and follow up manually if it ever happens.

---

## Data Schema

Collection slugs are kebab-case and plural. Each collection owns exactly one
responsibility.

### Identity

**`users`** — the single identity record for `admin`/`editor`. Payload auth
with `disableLocalStrategy: true` and the Clerk strategy attached.

| Field | Type | Notes |
|---|---|---|
| `clerkId` | text | unique, indexed, never editable |
| `email` | email | required, immutable after creation |
| `firstName`, `lastName` | text | required |
| `name` | text | derived, read-only, for admin display |
| `role` | select | `admin \| editor`. Field-level access: admin only. |
| `photo` | upload → `media` | |

There is no `accountState`, no suspend/reinstate flow. With exactly two
internal roles and no self-registration, there's no external population to
moderate — an account that shouldn't exist anymore is deleted directly in
Clerk or the Payload panel.

**The password trap**: even with `disableLocalStrategy: true`, Payload's
Local API can still require a password value when a user document is created
programmatically (e.g. from the Clerk sync hook), depending on the installed
Payload version's auth internals. If that happens, pass a random, discarded
string — it is never used to authenticate, since the Clerk strategy is what
verifies every session. Confirm whether this build's Payload version needs
that workaround when `clerk-sync.ts` is actually built, rather than assuming
either way in advance.

### Content

**`pages`** — CMS-driven pages, including the homepage itself. `title`,
`layout` (blocks array), `meta` (SEO fields), `slug`, `publishedAt`.
Draft/publish versioning.

**`posts`** — blog posts. `title`, `heroImage`, `content` (Lexical, with
`Banner`/`Code`/`Media` block features), `categories`, `relatedPosts`,
`authors`, `meta`, `slug`, `publishedAt`. Draft/publish versioning.

**`categories`** — `title`, `description`, `slug`. Public read.

**`programs`** — Michelle's coaching offerings.

| Field | Type | Notes |
|---|---|---|
| `name` | text | e.g. "Way Finding for Leaders" |
| `tagline` | text | short, e.g. "Empower Your Team." |
| `priceLabel` | text | **free text, not a number.** Prices display as "$2,500 / person", "$2,000 / person", or "Cost available upon request" depending on the program — a strict numeric field can't represent the last case. Display text only; see the Money invariant below. |
| `outcomes` | array of text | the checkmarked outcome bullets shown on the card |
| `icon` | select | a fixed enum of `lucide-react` icon names — not an uploaded image, matching the finalized design's icon treatment |
| `ctaType` | select | `book-a-call` (links straight to `externalBookingUrl`) \| `learn-more` (links to `/guide` — there is no per-program detail page in this build, so "learn more" leads to the lead magnet rather than a dead end) |
| `externalBookingUrl` | text | required when `ctaType` is `book-a-call` |
| `featured` | checkbox | controls inclusion in the homepage's Programs section |

No `slug` field — with no `/programs/[slug]` route in this build, a program
record has nothing to be addressed by. No `image` field — the finalized
design uses the `icon` field, not a photo, on each program card. No
`sessionFormat` or `components` fields — those described a second
"what's included" section that isn't part of the current single-page
design; reintroduce them on the same collection if that section returns.

**`testimonials`** — `name`, `job`, `testimony`, `featured` (checkbox — the
homepage shows exactly one testimonial; whichever record has `featured`
checked is the one queried. If none is checked, none renders — an
editor must feature one, this doesn't fall back to showing an arbitrary
record).

**`faqs`** — `question`, `answer`. Rendered as an accordion, queried by the
homepage's FAQ block with no additional filtering — every FAQ record shows.

**`media`** — `alt` required, image size variants generated by `sharp`.
There is only one storage-backed collection in this build — no separate
signed-download policy is needed the way a document vault would need one.

### Leads

**`leads`** — the one piece of durable data this site's core job produces.

| Field | Type | Notes |
|---|---|---|
| `firstName` | text | required |
| `email` | email | required |
| `source` | text | which page/CTA the submission came from, e.g. `guide-homepage-hero` |
| `submittedAt` | date | set on create |
| `notificationSentAt` | date | set once Michelle's notification email succeeds; null if it failed |

No status/workflow field. This is a contact record for Michelle to work from
personally, not a pipeline with stages — don't add one unless a real need
shows up.

### Globals

**`branding`** — `organizationIcon`, `organizationLogo`.

**`header`** — the site's nav configuration: the two scroll-anchor nav
items (Programs, Blogs) and a `defaultBookingUrl` field — the external
scheduler link every generic "Book a Session" CTA reads from, so that URL is
never hardcoded at the component level.

**`footer`** — `navItems` (Home, Posts, Privacy Policy, Terms of Service),
a LinkedIn `contactItem`, `copyright`. Plus an `ownerNotificationEmail`
field: where the lead-capture flow sends its notification email. (Placed on
`footer` rather than a new global, since it's the one other piece of
site-wide contact configuration and doesn't warrant a standalone global for
a single field. If more owner-facing settings show up later, promote it to
its own `site-settings` global then.)

**`leadMagnetGuideFile`** lives on the `pages`-rendered lead-capture block
itself (a `media` upload relationship), not on a global — it's specific to
whichever page hosts the form, not a site-wide constant.

### Relationships

```
users ── no relationship to any domain collection; purely the admin identity

pages / posts ── layout blocks reference programs, a single featured
                  testimonial, faqs, media

programs ── standalone, referenced only by the homepage's Programs block

testimonials ── standalone, referenced only by the homepage's Testimonial
                 block, filtered to the one `featured` record

leads ── standalone. No relationship to users or programs; a lead is
         anonymous until Michelle follows up personally, off-platform.
```

---

## Access Control

Every rule lives in `src/payload/access/access-control.ts`. No access
function is declared inline in a collection.

| Helper | Grants |
|---|---|
| `isPublic` | everyone |
| `isRestricted` | nobody — collection sealed, written only via an explicit `overrideAccess: true` exemption named in this file |
| `isAdminOrEditor` | either internal role — the admin-panel gate |
| `isAdminOrEditorField` | field-level variant |
| `isAdminOnly` | `admin` — role field, staff management, leads |
| `isPublishedOrAdminOrEditor` | staff see drafts, everyone else sees published only |

### Why `isPublishedOrAdminOrEditor` is safe here

A comparable project with public user accounts would ban a rule like this,
because it would leak draft content to every signed-in user — not just staff.
That risk doesn't exist in this build: the **only** authenticated users are
`admin` and `editor`, and both are trusted content staff by definition. There
is no third population of signed-in-but-untrusted users this rule could leak
drafts to, so it's reused as-is rather than replaced with something more
restrictive.

### The `leads` collection

1. `create` access is `isRestricted` — sealed at the collection level. A
   direct `POST /api/leads` is refused.
2. The **one** exemption: `services/lead.service.ts` calls `payload.create()`
   with `overrideAccess: true`. This is named here and nowhere else may do
   the same for this collection.
3. `read`/`update`/`delete` are `isAdminOnly` — editors don't need to see
   captured leads to do their job; that's Michelle's follow-up list.

Every other Local API read that can reach `programs`, `pages`, or `posts`
passes `overrideAccess: false` and the authenticated `req`, so an anonymous
visitor only ever sees published content — even from a server component, even
though Payload's Local API defaults to `overrideAccess: true` if you don't
pass it explicitly.

---

## Environment

| Variable | Used by |
|---|---|
| `DATABASE_URI` | `payload.config.ts` |
| `PAYLOAD_SECRET`, `PREVIEW_SECRET`, `CRON_SECRET` | Payload, preview. `CRON_SECRET` is unused until a job queue task is ever added — kept in `.env.example` regardless, since Payload scaffolds it by default. |
| `NEXT_PUBLIC_SERVER_URL` | Clerk `authorizedParties`, canonical URLs, sitemaps |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY` | Clerk. **Both** required by `createClerkClient`. |
| `CLERK_WEBHOOK_SIGNING_SECRET` | webhook verification |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | `/sign-in` |
| `NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL` | `/admin` |
| `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `RESEND_FROM_NAME` | `@payloadcms/email-resend` adapter — powers both Payload's own system email and `payload.sendEmail()` calls from `lead.service.ts` |
| `S3_BUCKET`, `S3_ACCESS_KEY_ID`, `S3_ACCESS_KEY_SECRET`, `S3_REGION`, `S3_ENDPOINT` | storage. Endpoint switches MinIO (dev) ↔ R2 (production). |
| `NEXT_PUBLIC_META_ICON` | Payload admin meta icon |
| `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST` | analytics — not yet added; set these when PostHog is installed |

`NEXT_PUBLIC_CLARITY_ID` / `NEXT_PUBLIC_CLARITY_DEBUG` are **removed** —
Microsoft Clarity is superseded by PostHog and is not part of this stack.

`.env.example` must list every variable above. It is committed; `.env` never
is. `NEXT_PUBLIC_` means the browser sees it — never prefix a secret.

---

## Invariants

Rules an agent must never violate. If a task appears to require breaking one,
stop and ask.

### Identity
1. `role` is written only by an `admin` in the Payload panel, or by Michelle
   directly in the Clerk dashboard. There is no other path — no
   self-registration, no public sign-up, no role parameter anywhere.
2. Clerk `publicMetadata` is never the sole enforcement mechanism for
   anything.
3. `role` always carries field-level access. Collection-level update is not
   sufficient.
4. There is one identity collection: `users`. Never add a second one.

### Money
5. `programs.priceLabel` is display text only. It is never parsed, summed, or
   used in any calculation — this codebase processes no payments and has no
   checkout flow in its current scope.
6. No external booking/scheduler URL is ever hardcoded in a component. It
   comes from `header.defaultBookingUrl` or a program's own
   `externalBookingUrl`.

### Access
7. `leads.create` is sealed. The lead-capture Server Action, via
   `services/lead.service.ts`, is the one named exemption using
   `overrideAccess: true`.
8. Every other Local API read that can reach `programs`, `pages`, or `posts`
   passes `overrideAccess: false` and the authenticated `req`. Exemptions:
   the Clerk strategy, the Clerk webhook, and `services/lead.service.ts`
   (named above) — nothing else.
9. `leads` read/update/delete is `admin`-only.

### Structure
10. Business logic for the lead-capture flow lives in `services/`. The
    Server Action validates and delegates. Components render.
11. `services/` never imports from `components/` and never touches React.
12. No hardcoded hex value or raw Tailwind color class anywhere. Only the
    project's finalized design tokens.
13. No personally identifying data in PostHog — no captured lead's name or
    email, no free text a visitor typed, ever, in any event property. This
    matters more here than on a typical site, precisely because collecting
    email addresses is the site's core function; the two systems (leads
    collection, PostHog) must never cross.
14. There is no `/programs`, `/for-leaders`, `/meet-michelle`, or
    `/programs/[slug]` route. Programs, For Leaders, and Meet Michelle exist
    only as homepage sections. Adding a route for any of them is a scope
    change, not a bug fix — stop and ask before doing it.
