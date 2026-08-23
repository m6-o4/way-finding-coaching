# Lead Magnet `/guide` Page — Implementation Plan

## Goal

Build the `/guide` lead-magnet flow end-to-end: a CMS-editable page that trades a
visitor's first name + email for a downloadable guide. Submitting the form records
a lead, emails the visitor a download link, and notifies Michelle — without the
email step ever blocking the lead.

Structured as three isolated tasks matching `build-plan.md` Phases 3.1 → 3.2 → 3.3,
with the service verified in isolation before the page is wired.

## Decisions (resolved)

- **Guide file storage**: extend the existing `media` collection to accept PDFs
  (`application/pdf`). Keeps the "one storage-backed collection" rule and the
  documented `leadMagnetGuideFile` = `media` relationship.
- **Notification address**: add `ownerNotificationEmail` to the **footer** global
  (architecture Globals section; confirmed by Michael).
- **Page structure**: content is a `lead-capture` block added to a `pages`
  document with slug `guide`, rendered at `/guide` by the existing `[slug]` route.
- **Stripped header**: make `HeaderClient` route-aware (`usePathname()` → logo-only
  on `/guide`). No new route or route group.

## Verified technical facts (do not re-derive)

- `payload.sendEmail(message)` exists on the Local API (`payload/dist/index.d.ts`),
  backed by the Resend adapter in `src/payload/fields/resend.ts`
  (`defaultFromAddress`/`defaultFromName`). No separate Resend SDK.
- `zodResolver` supports Zod 4: `import { zodResolver } from "@hookform/resolvers/zod"`
  (installed `@hookform/resolvers@5`, `zod@4.4`).
- Config import is `@/payload-config`; `getPayload` is `import { getPayload } from "payload"`.
- Collections register in `src/payload/collections/index.ts`; globals in
  `src/payload/blocks/globals/index.ts`; blocks in `pages/schema.ts` (layout array)
  and `render-blocks.tsx` (`blockComponents` map).
- `submittedAt` mirrors `posts.publishedAt`: an inline `beforeChange` field hook.
- The marketing header is a floating pill (`absolute inset-x-0 top-0 z-20`); pages
  normally clear it via a hero. The guide page has no hero, so the `lead-capture`
  block must supply its own top padding.

## Data flow

```
Visitor submits name + email on /guide
  → src/app/actions/lead.ts          (Server Action) safeParse LeadFormSchema
  → src/services/lead.service.ts     captureLead:
      1. resolve guide download URL   findByID "media" (guideFileId) → getMediaUrl()
      2. payload.create() "leads"     overrideAccess: true (named exemption)
      3. payload.sendEmail() visitor  acknowledgement + download link
      4. payload.sendEmail() owner    notification → footer.ownerNotificationEmail
      5. email failure → log + continue (never fail the lead)
      6. on owner-notification success, update leads.notificationSentAt
  → Result<Lead>
UI swaps form for inline success message
```

---

## Task 3.1 — `leads` collection

**Builds**
- New `src/payload/collections/leads/schema.ts`; register in
  `src/payload/collections/index.ts` (append `Leads` to the `collections` array).
- Fields: `firstName` (text, required), `email` (email, required), `source` (text),
  `submittedAt` (date), `notificationSentAt` (date).
  - `submittedAt`: inline `beforeChange` hook — on create, if unset, return
    `new Date()` (mirror `posts.publishedAt`).
- Access: `create: isRestricted`, `read: isAdmin`, `update: isAdmin`,
  `delete: isAdmin` (helpers in `access-control.ts`; note the helper is `isAdmin`,
  not the doc's `isAdminOnly`).
- `admin.group: "Content"`, `useAsTitle: "email"`, `defaultColumns`
  `["firstName", "email", "source", "submittedAt"]`. No drafts/versions.
- `pnpm.cmd generate:types`.

**Done when** — `pnpm.cmd build` passes; a direct `POST /api/leads` is refused; an
`admin` can read leads in `/admin` while an `editor` cannot.

**Verify** — `POST /api/leads` unauthenticated → refused. Sign in as `editor` →
Leads collection hidden or read-refused; sign in as `admin` → leads visible.

---

## Task 3.2 — Lead-capture service + Server Action

**Builds** (no page wiring — the service is tested directly first)
- Add `ownerNotificationEmail` (type `email`) to
  `src/payload/blocks/globals/footer/schema.ts`.
- New `src/lib/lead-schema.ts`:
  `LeadFormSchema = z.object({ firstName: z.string().trim().min(1, …), email: z.string().trim().email(…) })`.
- New `src/services/lead.service.ts`:
  - `captureLead(payload, { firstName, email, source, guideFileId }): Promise<Result<Lead>>`.
  - Resolve download URL: if `guideFileId`, `payload.findByID({ collection: "media",
    id: guideFileId, overrideAccess: false })` → `getMediaUrl(media.url)`. Missing
    file → log and send the acknowledgement without a link (still record the lead).
  - Create the lead with `overrideAccess: true` (the named exemption).
  - `payload.sendEmail()` → visitor acknowledgement (download link in body).
  - `payload.findGlobal({ slug: "footer" })` → `ownerNotificationEmail`, then
    `payload.sendEmail()` → owner notification (lead name/email + follow-up prompt).
  - Both sends wrapped so a failure logs and continues. On owner-notification
    success, `payload.update({ collection: "leads", id, overrideAccess: true,
    data: { notificationSentAt: new Date() } })`.
  - Export `Result` type from this file (the action imports it). Never import
    `components/`, never touch React, never read `headers()`/`auth()`. Log the lead
    **id**, never the name/email.
- New `src/app/actions/lead.ts` (`"use server"`):
  - `submitLead(input)` → `LeadFormSchema.safeParse({ firstName, email })`; on
    failure return `{ success: false, error: "Please enter a valid name and email." }`.
  - `getPayload({ config })`, delegate to `captureLead(payload, { …parsed.data,
    source: input.source ?? "guide-page", guideFileId: input.guideFileId })`.
  - Return `Result`; never throw; try/catch with log prefix `[actions/lead]`. No
    `revalidatePath`.
- `pnpm.cmd generate:types`, `pnpm.cmd lint`, `pnpm.cmd build`.

**Done when** — calling `captureLead` produces one lead record + two sent emails,
and a deliberately-broken email config still records the lead.

**Verify** — invoke `captureLead` directly via a temporary `tsx` script (imports
`getPayload` + `captureLead`; `pnpm.cmd exec tsx <script>`), then delete the
script. Confirm the lead appears in `/admin` and both emails arrive. Then break
`RESEND_FROM_EMAIL` on purpose and confirm the lead is still recorded.

---

## Task 3.3 — `/guide` page

**Builds**
- Allow PDFs in `media`: add `"application/pdf"` to `mimeTypes` in
  `src/payload/collections/media/schema.ts`. Keep `alt` required for images only:
  set `required: false` and add a `validate` function that returns
  `"Alternative text is required for images."` when `data.mimeType` starts with
  `image/` and `value` is empty (mirror the `validatePassword` pattern in
  `src/payload/collections/users/schema.ts`). `required` is boolean-only in
  Payload 3.88, so `validate` is the supported conditional mechanism. Sharp skips
  non-image mime types; image sizes/thumbnail/focalPoint stay image-only.
- New `src/payload/blocks/lead-capture/schema.ts` (`slug: "leadCapture"`,
  `interfaceName: "LeadCapture"`, mirror `faq` shape): `headline` (text, required),
  `headlineDescription` (textarea), `benefits` (array of text), `guideFile`
  (upload → media, required), `source` (text, default `"guide-page"`),
  `backgroundVariant` (select, `background`|`muted`).
- New `src/components/web/lead-capture-form.tsx` (`"use client"`):
  - `useForm` + `zodResolver(LeadFormSchema)`; two fields (firstName, email) via the
    existing `input`/`label` primitives and the `Button` component.
  - States per `ui-rules.md`: submitting ("Sending…", button disabled), success
    (form swaps in place for a short confirmation), error (inline `--destructive`
    text below the field). Local `useState` for status; await `submitLead`.
  - Props `{ guideFileId?: string; source?: string }`; calls
    `submitLead({ firstName, email, source, guideFileId })`.
- New `src/payload/blocks/lead-capture/component.tsx` (server component, no
  `"use client"`): section (`bgMap` + `Container`, `py-16 lg:py-30`, **plus top
  padding to clear the floating pill header**, e.g. `pt-32`), centered headline +
  optional description, a `Check`-icon benefits list, and embeds
  `<LeadCaptureForm guideFileId={…} source={…} />`. Extract `guideFileId` via
  `typeof guideFile === "string" ? guideFile : guideFile?.id`.
- Register the block: add `LeadCapture` to the layout array in
  `src/payload/collections/pages/schema.ts` and `leadCapture: LeadCaptureBlock` in
  `src/payload/blocks/render-blocks.tsx`.
- Stripped header: in `src/payload/blocks/globals/header/component-client.tsx`, add
  `usePathname()`; when `pathname === "/guide"`, render logo-only (no nav links, no
  `discovery` CTA, no mobile toggle). Footer unchanged.
- `pnpm.cmd generate:types`, `pnpm.cmd lint`, `pnpm.cmd build`.

**Content step (Michael, in `/admin`)** — upload the guide PDF to Media, create a
`pages` document with slug `guide` containing one `lead-capture` block, set the
footer's `ownerNotificationEmail`.

**Done when** — submitting the live form on `/guide` produces the same result as the
3.2 test, and the UI shows the right state at each step.

**Verify** — submit an invalid email → inline error, no lead recorded. Submit a
valid one → button shows "Sending…", then the form swaps for the success message;
lead appears in `/admin`; two emails arrive (visitor email's link opens the PDF).
`/guide` header shows logo only (footer still present).

---

## Cross-cutting failure modes

- **Email fails**: `captureLead` logs and continues; the lead is recorded and the
  visitor still sees success. `notificationSentAt` stays null if the owner
  notification failed.
- **Direct `POST /api/leads`**: refused by `isRestricted` at the collection level.
- **Missing guide file**: service sends the acknowledgement without a link and
  logs; the lead is still recorded.
- **`notificationSentAt` write**: this is a second `overrideAccess: true` write in
  the service (the first is `create`). Sync architecture invariant 7's wording so
  the named exemption covers both.

## Open questions / notes

- **`media.alt` conditional requirement**: handled via a `validate` function
  (`required` is boolean-only in Payload 3.88). The implementer should confirm
  `data.mimeType` is populated when the `alt` field validates; fall back to
  checking `data.filename`'s extension if not.
- **Form input focus**: `ui-rules` specify an underline focus; the installed shadcn
  `input` uses a ring glow. Conform the input in place (this is the first form).
- **Download behavior**: a direct link to a public PDF opens in a browser tab
  rather than forcing a download. Acceptable for now; a
  `Content-Disposition: attachment` route is a possible follow-up.
- **PostHog** (`lead_magnet_viewed`, `lead_captured`): deferred to Phase 4.2 —
  `posthog-js`/`posthog-node` are not installed. `lead_captured` will be wired into
  `submitLead`/`captureLead` then.
- **`source` values**: the block's `source` field defaults to `"guide-page"`; the
  hero CTA can later append `?source=hero` (requires a Suspense-wrapped
  `useSearchParams` or a server-side `searchParams` read — out of scope now).

## Build-plan sync notes (for Michael, not the implementer)

The following `build-plan.md`/`architecture.md` wording is stale against the
resolved decisions; update when convenient:
- `build-plan` 3.2 says `header.ownerNotificationEmail` → **footer**
  `ownerNotificationEmail` (architecture's Globals section already says footer).
- `build-plan` 0.1 lists `@hookform/resolvers` as "to be installed" → already in
  `package.json`; `posthog-js`/`posthog-node` remain absent.
- `architecture` invariant 7 should cover the `notificationSentAt` update as part of
  the same `services/lead.service.ts` exemption.
