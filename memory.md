# Memory — PostHog analytics complete (build-plan 0.4 + 4.2), work uncommitted

Last updated: 2026-09-27 19:05 +03:00

## What was built

- `src/instrumentation-client.ts` (new) — the single browser init: `posthog.init()` with
  `api_host: NEXT_PUBLIC_POSTHOG_HOST` and `defaults: "2026-05-30"`. Runs on every route
  group, before hydration.
- `src/components/providers/posthog-provider.tsx` — reduced to a context-only wrapper; it no
  longer initialises anything.
- `src/lib/posthog-server.ts` (new) — `getPostHogClient()`, a lazy `posthog-node` client with
  `flushAt: 1` / `flushInterval: 0`.
- `src/components/providers/posthog-identify.tsx` (new) — calls `posthog.identify(user.id)`
  once per Clerk user id; mounted in `(auth)/sign-in/[[...sign-in]]/page.tsx`.
  `posthog.reset()` added to `(auth)/sign-out/page.tsx`.
- `src/lib/posthog-events.ts` (new) — the only client capture path; `captureEvent` takes a
  closed union of the four browser-side events, so an unlisted event cannot compile.
- `src/components/posthog/booking-link.tsx` (new) — tracked booking anchor, passed through
  `Button`'s `render` prop so the `programs` and `call-to-action` blocks stay server components.
- `src/components/posthog/post-view-tracker.tsx` (new) — fires `post_viewed`; rendered by
  `src/app/(web)/posts/[slug]/page.tsx`.
- All five events wired: `lead_magnet_viewed` (lead-magnet block mount, `source: "guide-page"`),
  `lead_captured` (server-side, in `src/app/actions/submit-guide-lead.ts`), `booking_cta_clicked`
  (header / programs / call-to-action), `nav_link_clicked` (header), `post_viewed`.
- `next.config.ts` — `outputFileTracingIncludes` narrowed to
  `node_modules/.pnpm/@img*/node_modules/@img/*/lib/*`.
- Removed `@posthog/next` and added `posthog-node@^5.54.1`; deleted `.npmrc`; widened
  `engines.pnpm` to include 12; realigned `graphql` to `^16.8.1`.
- Docs updated: `context/library-docs.md`, `context/ui-registry.md`,
  `context/progress-tracker.md`.

## Decisions made

- **Committing, branching, pushing and tagging are the maintainer's job.** `context/code-standards.md:442`
  says the agent never does any of them. Do not act on "start the deploy pipeline" as an
  instruction to commit or push.
- **Browser init lives in `instrumentation-client.ts`, not the provider.** The provider only
  supplies React context. There is no `lib/posthog-client.ts`; build-plan 0.4's mention of one
  is superseded.
- **`lead_captured` is captured server-side, but the form forwards `posthog.get_distinct_id()`**
  so the event lands on the same person as the pageviews. Without it the viewed→captured funnel
  reads zero, because PostHog funnels match people. The action falls back to `randomUUID()` when
  the browser never had posthog.
- **`BookingLink` goes through `Button`'s `render` prop** rather than converting whole blocks to
  `"use client"` just to attach an onClick.
- **`nav_link_clicked` matches the `#programs`/`#blogs` fragment, or failing that the label**
  (`TRACKED_NAV_ANCHORS` in the header client).
- **`defaults: "2026-05-30"` is intentional.** It resolves `capture_pageview` to `history_change`
  (so App Router navigations count) and sets `internal_or_test_user_hostname` to
  localhost/127.0.0.1 — local pageviews are flagged internal/test and prove nothing about
  production.
- **`.npmrc` was deleted, not migrated.** pnpm 11+ reads only auth/registry keys from it, so
  `node-linker=hoisted`, `legacy-peer-deps` and `supported-architectures` were all inert, and
  the install has always been `isolated`. If those behaviours are ever wanted they belong in
  `pnpm-workspace.yaml` in camelCase.
- **`graphql` is pinned to Payload's declared peer range** (`^16.8.1`) instead of the `^17` that
  a plain `pnpm add` pulls in. `pnpm peers check` is clean.

## Problems solved

- **Turbopack build panic** — `TurbopackInternalError: reading file "…node_modules\.pnpm\node_modules\@img\colour"` /
  `Access is denied. (os error 5)`. It is a Next 16.3 regression (vercel/next.js#96626, #96255):
  `NftJsonAsset::content` hashes every output-tracing include, and the include-glob walker emits a
  symlink-to-directory match as if it were a file. The old globs matched pnpm's dependency
  symlinks. Fixed with a file-only glob — **do not re-broaden it to `**/*`**.
- **The narrowed include must stay.** Auto-tracing copies sharp's `.node` but **not**
  `libvips-42.dll` / `libvips-cpp-8.18.6.dll`, so `output: "standalone"` needs the include for
  the native libs.
- `package.json` `engines.pnpm` claimed `^9 || ^10 || ^11` while CI and Docker run pnpm 12.6.0
  (corepack in the Dockerfile, `pnpm/action-setup@v5` in the workflow), so it was widened.
- Payload regenerates `src/app/(payload)/admin/importMap.js` with the same entries in a
  different order on every build. It is cosmetic churn — restore the file rather than commit it.
- **Mistakenly committed and pushed to `development`** after being told 4.3/4.4 were closed. It
  was undone: `git reset HEAD~1` locally, and the remote rewound to `da88595` with
  `--force-with-lease`. Nothing reached `main`, so no workflow ran.

## Current state

- **The work is uncommitted.** `development` is at `737e063` (the maintainer's
  "tidy changelog and PostHog env token typing" commit), 1 ahead of `origin/development` at
  `da88595`. The analytics change sits in the working tree: 19 modified/deleted files plus 6 new
  ones. A force-push rewound `origin/development`, so any other clone that fetched during that
  window needs a reset.
- Verified: `pnpm build` passes, `eslint` is clean on every changed file, the app chunks served
  for `/guide`, `/` and a post page each contain the matching event string, and `posthog-node` is
  in 0 client chunks.
- **Not verified:** the live PostHog event stream, and build-plan 4.2's own journey (home → nav
  link → guide → submit → post). No browser is available in this environment.
- `nav_link_clicked` will not fire in practice yet — the header's `navigationItems` is empty in
  the CMS, so there are no Programs/Blogs anchors to click.
- 3.3 was implemented as a **CMS page** (slug `guide`, whose only block is `leadMagnet`),
  deliberately not the dedicated stripped-header route the build plan describes. 4.3 and 4.4 are
  closed through the GitHub CI/CD path.
- `pnpm lint` fails on the pre-existing `src/components/ui/carousel.tsx:98`
  (`react-hooks/set-state-in-effect`; 2 errors / 32 warnings total). Not caused by this work.
- Open in `next-sitemap.config.js` + the generated `public/robots.txt`: `/sign-in*` is not
  disallowed, and it advertises `pages-sitemap.xml` / `posts-sitemap.xml`, which the build never
  generates.
- Known gaps: `architecture.md:460` documents a `source` field on `leads` that the collection
  does not have (submission source lives in PostHog only), and nothing tracks an actual PDF
  download — only the request for it.

## Next session starts with

- Whatever arrives first: **bugs and errors reported by the client in production, or dependency
  updates.** Nothing analytics-specific is outstanding.

## Open questions

- None blocking.
