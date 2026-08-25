# Memory — PostHog browser provider (build-plan 0.4, delivered / partially deferred)

Last updated: 2026-08-25 12:53 +03:00

## What was built

- `src/components/providers/posthog-provider.tsx` — the browser analytics
  provider. `"use client"` component wrapping `PostHogProvider` from
  `posthog-js/react`; inits `posthog` in `useEffect` with
  `api_host: NEXT_PUBLIC_POSTHOG_HOST` and `defaults: "2026-05-30"`. Env vars
  are read once at module scope (`posthogProjectToken`, `posthogHost`), per
  code-standards.
- `src/app/(web)/layout.tsx` wraps the site body in `<PostHogProvider>`.

This session was a review, not a build — the provider file was authored by
Michael; the agent only reviewed it twice and answered a pnpm question.

## Decisions made

- `defaults: "2026-05-30"` is intentional and valid — in the installed
  `posthog-js` 1.418.11 it is the `ConfigDefaults` snapshot date (enables
  `persistence_save_debounce_ms: 250`, `split_storage: true`,
  `detect_google_search_app: true`, rageclick stepper/text-selection exclusions).
  Not a typo.
- Provider is a single `"use client"` component (init in `useEffect`), not the
  build-plan's planned `lib/posthog-client.ts` module. Deviation noted, not yet
  reconciled.

## Problems solved

- Confirmed `defaults` is a real `PostHogConfig` key (checked
  `@posthog/types` `posthog-config.d.ts`), so the `"2026-05-30"` value was not
  a bug.
- Confirmed env var names (`NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN`,
  `NEXT_PUBLIC_POSTHOG_HOST`) match `.env.example:38-39`.

## Current state

- **Browser install complete and verified.** PostHog's dashboard reports
  "install complete" — a pageview is being received, so the `posthog-js`
  provider in the `(web)` layout works end-to-end. This satisfies build-plan
  0.4's "Done when: a test pageview appears in PostHog carrying no PII."
- Import bug fixed: `src/app/(web)/layout.tsx:7` now imports from
  `@/components/providers/posthog-provider` (was the broken
  `@/payload/providers/...`).
- Minor cleanup: `as string` on `posthogProjectToken` (line 13) is redundant
  with the `!` assertion on line 8.

## Pending — deferred until after client delivery (not blockers)

1. `posthog-node` server client + `lib/posthog-server.ts` (`flushAt: 1`,
   `flushInterval: 0`) — needed for server-side events (e.g. `lead_captured`).
   `posthog-node` is not installed yet.
2. App Router pageview capture (`usePathname`/`useSearchParams`) so
   client-side route changes count as pageviews, not just full loads.
3. `identify` on admin/editor sign-in, `reset` on sign-out (Clerk).
4. Reconcile the inlined `useEffect` init vs build-plan's
   `lib/posthog-client.ts` module.
5. Update `context/library-docs.md` PostHog entry (still says "not yet
   installed" — `posthog-js` is installed; record traps).

## Next session starts with

- Product is being delivered to the client as-is; browser analytics is live
  and sufficient for delivery. When circling back, start with the deferred
  items above in order.

## Open questions

- None blocking.
