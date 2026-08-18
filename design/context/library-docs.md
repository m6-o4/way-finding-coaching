# Library Docs

## Purpose

Project-specific rules, traps and hard-won corrections for the third-party
libraries this project depends on. Read the relevant entry **before** writing
code against a library, not after something fails.

This file is not a substitute for documentation. It records what the
documentation does not say, what changed recently enough that training data
is wrong, and what already cost time once on this stack.

---

## Order of Consultation

1. **Is there a skill?** `/shadcn`, `/payload`, `/clerk` and the Clerk
   sub-skills carry current APIs and working patterns. Use them first.
2. **Is there an entry below?** Project-specific rules live here.
3. **Neither?** Research the library's current documentation before writing,
   then add an entry here recording what you learned.

Each entry below states the installed version as the source of truth. Never
assume an API from memory for anything in this file — several are recent
enough that training data is actively misleading.

---

## Entry Format

### `library-name`

- **Version**: as installed
- **Why we use it**: purpose in this project
- **Traps**: what goes wrong
- **Project rules**: how we use it here

---

# Clerk + Payload Integration

The single most failure-prone part of this codebase, even at this project's
small scale.

**The defining symptom: every auth failure looks identical.**
`disableLocalStrategy: true` leaves `/admin/login` with no form on it. A
missing publishable key, a rejected `authorizedParties`, a validation error
during provisioning, and an expired session all produce the same blank
Payload logo. **The server console is the only useful signal.** Check it
before theorizing.

### `createClerkClient` needs the publishable key

`authenticateRequest()` requires **both** keys. Passing only `secretKey`
throws "Publishable key is missing" from inside the strategy, which swallows
it and returns `user: null`. Silent, total auth failure.

### `authorizedParties` is not optional

Omitting it leaves the app open to session tokens issued for other origins.
Its value must match the browsing origin exactly. Push both the bare and
`www.` variants if Traefik routes both to the same app — if the domain
changes, change both.

When tunnelling through ngrok in dev, `NEXT_PUBLIC_SERVER_URL` must be the
ngrok host, not localhost, or every session is rejected. Free ngrok hosts
change on restart, and both the registered webhook endpoint and the env var
must be updated together.

### The password validator must exempt Clerk-originated creates, if a password field exists at all

If the `users` collection keeps a `password` field for Payload's `auth: true`
typing to be happy, a validator keyed only on `operation === "create"`
rejects a Clerk-provisioned write (there's no password) and locks out login
at first touch. **Key on the absence of `clerkId` instead, if this field
exists.** Simpler still: confirm early in the build whether Payload's
`auth: true` + a fully custom `AuthStrategy` + `disableLocalStrategy`
actually requires a `password` field to be declared at all for this Payload
version — if not, don't declare one, and this whole trap doesn't apply.

### Never default a missing role

There is no neutral role in this project — only `admin` and `editor`, both
internal. `publicMetadata.role` absent means the account isn't fully set up,
not that it's a basic user. The strategy returns `{ user: null }`. Since
there's no public-facing use of a Clerk session at all, the only consequence
of an unresolved role is that `/admin` stays unreachable — there's no
`/post-auth` dispatcher to worry about getting this wrong.

### Payload's unauthorized page cannot log a Clerk user out

Its Log out button clears the `payload-token` cookie, which was never
issued. The Clerk session survives, so the user bounces back to the same
screen indefinitely. Redirect from the `(payload)` layout to `/` instead of
letting anyone reach it.

### Field-level access is the only thing preventing self-promotion

Collection-level `update` does not distinguish fields. The moment a user can
edit their own record, `role` needs its own `access.update`, admin-only.

### Local API calls bypass access control

`payload.create()` and `payload.find()` default to `overrideAccess: true`.
That is why the strategy and webhook work despite `create: isAdminOnly` on
`users`. It's also why `leads.create` being sealed at the access-control
level only matters if every call site remembers to pass `overrideAccess`
explicitly — the lead-capture service is the one place that does, by
design, and nowhere else should.

### Deleting a Payload user deletes their Clerk account

Test deletion on a disposable account. Deleting only in Payload is also not
enough: the strategy re-provisions the record on that user's next sign-in
attempt.

### Email cannot round-trip

Clerk's `updateUser` does not accept an email change. Changing a primary
email means creating a new address object, marking it primary, verifying,
then deleting the old one. Treat email as immutable after creation and avoid
the problem entirely.

### `AccessArgs<User>` types the document, not the user

Using it as shorthand for typing `req.user` leads to `user as any`
throughout. Once `payload-types.ts` is generated, `req.user` is already
typed.

### Collection `admin` access accepts only a boolean

It cannot return a `Where` filter, so an `Access`-typed function is not
assignable to it. Give it its own narrower type if `access-control.ts` needs
one.

### Webhook sequencing

`user.updated`/`user.created` can arrive with a role that isn't set yet if
Michelle is mid-edit in the Clerk dashboard. Skip with a 200 rather than
erroring, following the same authenticate/validate/delegate/respond order
every route handler in this project uses.

---

# Payload CMS

- **Version**: 3.86.0
- **Why**: collections, admin panel, local API, marketing CMS

### Traps

**Component paths resolve relative to `payload.config.ts`.** With the config
in `src/`, a `/src/components/...` prefix resolves to
`src/src/components/...`. The correct prefix is `/components/...`. The error
surfaces from the generated `importMap.js`, not from the config.

**Turbopack caches resolution failures.** After any change to component
paths or file deletions, restart cold. A hot reload keeps showing the stale
error.

**`(payload)/layout.tsx` is Payload-generated but modified here.** It
carries the auth guard. Commit it, and re-apply the guard after any scaffold
regeneration.

**Layouts do not wrap route handlers.** The REST API and the Clerk webhook
are unaffected by the `(payload)` layout guard. That is correct — the API is
governed by collection access and the webhook must stay reachable without a
session.

**Payload's REST API owns `/api/{collection-slug}`, including `/api/leads`.**
Check the existing namespace before adding any custom route — a bare route
can collide with a collection slug like `leads`, `pages`, or `posts`.

### Project rules

- Run `pnpm generate:types` after every schema change, and
  `pnpm generate:importmap` after any admin component change.
- Access rules live only in `access-control.ts`.
- Collection slugs kebab-case and plural.
- This project does not configure Payload's job queue. Nothing in current
  scope needs a scheduled task.

---

# `@payloadcms/storage-s3`

- **Version**: 3.86.0
- **Why**: MinIO in development, Cloudflare R2 in production

### Traps

- **`forcePathStyle: true` is required for MinIO.** Without it, requests go
  to a virtual-host style URL that MinIO does not serve.
- Endpoint and region differ between MinIO and R2. Only `S3_ENDPOINT`,
  `S3_REGION` and credentials change — the code does not.

### Project rules

Only one collection (`media`) is storage-backed in this build, and it's
public/CDN-served. There's no signed-download policy to configure — unlike a
project with a private document vault, nothing here needs
`signedDownloads`.

---

# `@payloadcms/email-resend`

- **Version**: bundled with Payload 3.86.0
- **Why**: Payload's own system email, and — in this project specifically —
  the only mechanism the lead-capture flow uses to send email.

### Traps

- The sending domain must be verified on Resend or delivery silently fails.
- `RESEND_FROM_EMAIL` must be on the verified domain.

### Project rules

**There is no standalone `resend` npm package installed, and none is
needed.** `services/lead.service.ts` sends both lead-capture emails via
`payload.sendEmail()` — the Local API method the configured adapter exposes,
callable from anywhere a `Payload` instance is available, not just from
inside a collection hook. Do not add the `resend` SDK as a dependency to
build this feature; it would duplicate a client that's already configured.

Email failure never blocks the lead being recorded or the visitor's success
state. Log it and continue.

---

# PostHog

- **Why**: product analytics. The only analytics tool used in this project.
- **Status**: not yet installed.

### Traps

- **Two clients, do not mix them.** `posthog-js` in the browser,
  `posthog-node` on the server. The server client needs `flushAt: 1` and
  `flushInterval: 0` in a serverless-shaped runtime or events are lost when
  the process ends.
- **`identify` after an admin/editor signs in, `reset` on sign-out.** There's
  no public-facing identity to worry about — the only session PostHog ever
  identifies is Michelle's or an editor's own admin-panel session.

### Project rules

**No personally identifying data. Ever.** No captured lead's name or email,
no free text a visitor typed. Every custom event fired must be deliberate
and pre-defined — never add an ad hoc `posthog.capture()` call without
first deciding its name and properties as part of the same task.

PostHog and the `leads` collection are two entirely separate systems.
PostHog answers "how many people reached `/guide`"; the `leads` collection
answers "who submitted it, so Michelle can follow up." Never merge them.

---

# Next.js 16

Recent enough that training data is wrong about several things.

### Traps

- **`middleware.ts` is now `proxy.ts`**, and runs on the Node runtime rather
  than Edge.
- **The matcher must include `/__clerk/(.*)`** or Clerk's frontend API
  requests are not handled.
- **There is no root `app/layout.tsx` in this project.** Payload's
  `RootLayout` renders `html` and `body`, so each route group renders its
  own document.
- **`styles/globals.css` is imported per route group**, never hoisted, or
  Tailwind preflight fights the Payload admin stylesheet.
- **`suppressHydrationWarning` does not cascade.** It is needed on both
  `html` and `body`.
- **Caching is uncached by default.** Dynamic code runs at request time
  unless explicitly cached — though this project's public pages are almost
  entirely static-with-revalidation. Confirm the intended rendering strategy
  for a surface before reaching for a dynamic route.

### Project rules

Before using any Next.js API not documented here, check for deprecation
notices rather than relying on recall.

---

# Shadcn / Base UI

- **Version**: `shadcn` 4.16.0 CLI, on `@base-ui/react` 1.6.0

### Traps

- **Shadcn 4 uses Base UI, not Radix.** Every pre-4 example, tutorial and
  answer online imports `@radix-ui/*`. Those imports will install a second
  primitives library alongside the first. **Never `pnpm add
  @radix-ui/anything`.**
- Base UI's component APIs differ from Radix. Use the `/shadcn` skill rather
  than adapting a Radix example.

### Project rules

Components arrive via `pnpm dlx shadcn@latest add {name}` and are customized
in place. Nothing is hand-authored into `components/ui/`. Check what's
already installed before adding.

---

# Zod

- **Version**: 4.4.x
- **Why**: validation at every boundary where data enters the system.

### Project rules

`safeParse`, never `parse`. Schemas live next to what they validate,
exported as `{Thing}Schema`. This project has exactly one form to validate —
lead capture — so there's no library of shared schemas yet; don't build one
preemptively.

---

# `react-hook-form`

- **Version**: 7.85.x
- **Why**: the lead-capture form.

### Traps

- Uncontrolled by default. Reading a value during render gives a stale one —
  use `watch` or `getValues`.
- **`@hookform/resolvers` is not currently installed**, even though both
  `react-hook-form` and `zod` are. Without it, `react-hook-form` has no
  built-in way to run a Zod schema as its resolver. Add
  `@hookform/resolvers` when building the lead-capture form — it's the
  standard, minimal way to connect the two — rather than hand-rolling
  validation glue or calling `schema.safeParse` manually inside the submit
  handler.

### Project rules

Client-side validation via the resolver is a courtesy; the Server Action's
own `safeParse` call is the actual control. Never skip server validation
because the client already checked.

---

# `motion`

- **Version**: 12.43.x
- **Why**: sparing section/page-entrance-level transitions — simple
  opacity/transform only, never layout-shifting animation on initial load.

### Project rules

Reserve `motion` for section/page-entrance-level transitions. Small-scale UI
feedback (hover, focus, dropdown, dialog) uses Shadcn/Base UI's own
interaction states, not `motion`.

---

# semantic-release

- **Why**: versioning and changelog, configured in `.releaserc.json`
  (`@semantic-release/commit-analyzer`, `release-notes-generator`,
  `changelog`, `git`, `github`).

Requires Conventional Commits. **This is Michael's workflow, not the
agent's** — the agent never commits, so this entry is context, not
instruction.

---

# Libraries With No Entry Yet

If you use something not listed here and not covered by a skill: research
its current documentation first, write the code, then add an entry
recording the traps you hit. The next session should not have to
rediscover them.

`jsdom` and `tsx` are present in `devDependencies` with no established use
in this project yet. If you introduce a script under a `scripts/` folder
that needs either (e.g. a one-off data script run via `tsx`), document what
it's for here when you add it.
