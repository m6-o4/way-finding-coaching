# Code Standards

## Purpose

Implementation rules and conventions that apply across the whole project. They
exist to prevent pattern drift: the same kind of problem should always be
solved the same way, regardless of which session writes the code.

Read this before writing any code.

This file governs how code is written: conventions, patterns, and process
every task must follow. It does not decide the system's structure, data
shape, or the rules that structure can never violate — those stand on their
own and are not overridden by anything here.

---

## How the Agent Works

**The agent writes code. Michael verifies and commits.** That division is not
negotiable.

- **Never run `git commit`, `git push`, `git checkout`, or any command that
  changes repository state.** Produce the code and explain it. Committing
  follows verification, and verification is human.
- **Never run destructive commands.** No `rm -rf`, no dropping collections,
  no truncating data, no `pnpm install` of a package outside this project's
  permitted, deliberately fixed set.
- **One task at a time.** Finish it completely before touching the next. A
  task that is 90% done is not done.
- **Scope is sacred.** Build exactly what the current task requires. Do not
  refactor adjacent code, do not add helpful extras, do not fix unrelated
  things you noticed. Mention them instead. This project is small on
  purpose — resist the temptation to add a feature "while you're in there."
- **Read before assuming.** Confirm the real collection schema and check
  whether a component already exists before writing something new; check
  `payload-types.ts` for the real shape. Do not infer a field name.
- **Say when you are unsure.** A flagged uncertainty costs one message. A
  confident wrong answer costs a day.
- **If the same problem survives one corrective prompt, stop.** Do not try a
  third variation. Explain what you have tried and what you think is
  happening.

Clean and obvious beats clever. Someone reading this in six months, with no
context, should be able to follow it.

---

## TypeScript

- Strict mode. No exceptions, no `// @ts-ignore`, no `// @ts-expect-error`
  without a comment saying why and what would remove it.
- **Never `any`.** Use `unknown` and narrow it.
- **Never `as`** unless it is genuinely unavoidable, and then with a comment
  explaining why.
- **Types come from `payload-types.ts`.** Derive rather than redeclare:

  ```typescript
  import type { User, Program } from "@/payload-types";

  type Role = NonNullable<User["role"]>;
  type CtaType = NonNullable<Program["ctaType"]>;
  ```

  Run `pnpm generate:types` after every schema change. A hand-written
  parallel type will drift, and it will drift silently.
- `type` for object shapes and unions. `interface` only when something needs
  extending.
- Explicit return types on exported functions. Inference is fine internally.
- `const` by default. `let` only where reassignment is real.
- No floating promises. Every async call is awaited or explicitly handled.

---

## Naming and Files

**Every file is kebab-case.** Including components. The export inside is
PascalCase.

```
src/payload/access/access-control.ts          → isAdminOrEditor
src/payload/strategy/clerk-strategy.ts        → clerkStrategy
src/components/admin/clerk-admin-provider.tsx → ClerkAdminProvider
src/components/ui/button.tsx                  → Button
src/services/lead.service.ts                  → captureLead
```

Established shapes, follow them:

| Kind | Path |
|---|---|
| Collection | `payload/collections/{name}/schema.ts` |
| Collection hook | `payload/collections/{name}/hooks/{verb-noun}.ts` |
| Block | `payload/blocks/{name}/{schema.ts, component.tsx}` |
| Global | `payload/blocks/globals/{name}/schema.ts` |
| Utility | `payload/utilities/{verb-noun}.ts` |
| Service | `services/{domain}.service.ts` |
| Route handler | `app/(payload)/api/webhooks/{provider}/route.ts` |
| Server Action | `app/actions/{domain}.ts` |
| Component | `components/{area}/{name}.tsx` — one file per component, not a
  folder-with-`index.tsx` per component |

Rules:

- Collection slugs are kebab-case and plural: `leads`, `programs`, `faqs`.
- **Named exports only**, declared at the bottom of the file:
  `export { Programs };`. Pages are the sole exception:
  `export { Page as default };`.
- One component per file.
- Always the `@/` alias. Never a relative import climbing more than one
  level.

---

## Formatting

Prettier owns it. Tabs, double quotes, semicolons, 120-char print width, and
import ordering are all configured in `.prettierrc.json` with
`@ianvs/prettier-plugin-sort-imports` and `prettier-plugin-tailwindcss`.

**Do not hand-order imports and do not hand-align anything.** Run
`pnpm format`. If output disagrees with something written here, the
formatter wins and this file is wrong.

ESLint extends `next/core-web-vitals`, `next/typescript`, and `prettier`,
with `no-explicit-any`, `no-unused-vars`, and `ban-ts-comment` all set to
warn — treat a warning here as a real signal, not noise to ignore.

---

## Comments

- Comments explain **why**, never what. If the code needs a comment to say
  what it does, rename something instead.
- Lowercase, sentence-style, above the thing they describe. Match the
  existing files.
- A comment earns its place when it records a decision, a constraint, or a
  trap: *"leads.create is sealed; this is the one named exemption."*
- **No TODO comments in delivered code.** If something is unfinished, say so
  in your message so it can be tracked, not buried.

---

## Components

Server Components by default. Add `"use client"` only for `useState`,
`useEffect`, event handlers, browser APIs, or a client-only library. The
lead-capture form is the main place this project needs one.

Never put `"use client"` on a layout unless there is no alternative.

```tsx
"use client"; // only if genuinely needed

import { useState } from "react";

import type { Program } from "@/payload-types";

import { Button } from "@/components/ui/button";

type Props = {
	program: Program;
};

const ProgramCard = ({ program }: Props) => {
	// state
	// derived values
	// handlers
	// return
};

export { ProgramCard };
```

- Props type declared directly above the component, named `Props`.
- Data fetching happens in Server Components. A Client Component receives
  data as props; it never queries.
- No inline styles. Only the project's finalized design tokens and
  component rules.
- Register every new component in the project's component registry when it
  is built.

### Shadcn components are installed, never hand-written

```bash
pnpm dlx shadcn@latest add dialog
```

`components.json` is configured (`style: base-nova`, `baseColor: neutral`,
Base UI-backed). Anything in `components/ui/` arrives through that command
and is then customized in place if needed. **Never hand-author a file into
`components/ui/`** — a hand-rolled component diverges from the real one in
accessibility, keyboard handling and Base UI wiring, and the divergence is
invisible until someone tries to use it properly.

Check `components/ui/` before adding — the one you want may already be
there.

---

## The Service Layer

**Business logic lives in `src/services/`.** This project has exactly one
non-trivial piece of business logic — the lead-capture flow — and it still
goes through a service rather than living inline in the Server Action. Same
convention as every other project on this stack, so it transfers directly
if this foundation gets reused for something bigger.

```typescript
type Result<T = void> =
	| { success: true; data: T }
	| { success: false; error: string; code?: string };
```

Every service function:

- returns `Result`, never throws to its caller
- is idempotent where it can be, and says so where it cannot

```typescript
// services/lead.service.ts

const captureLead = async (
	payload: Payload,
	data: { firstName: string; email: string; source: string },
): Promise<Result<Lead>> => {
	// create the lead record (overrideAccess: true — the one named exemption)
	// send the visitor's acknowledgement email
	// send Michelle's notification email
	// neither email failing should fail this function — log and continue
	// return
};

export { captureLead };
```

Services never import from `components/`, never touch React, never read
`headers()` or `auth()`. They are given what they need.

---

## Route Handlers

Under `app/(payload)/api/`. This project currently needs exactly one:
`webhooks/clerk/route.ts` — a third party (Clerk) is the caller.

```typescript
// app/(payload)/api/webhooks/clerk/route.ts

const POST = async (req: NextRequest) => {
	try {
		const event = await verifyWebhook(req);

		// handle user.created / user.updated / user.deleted
		// return 200 for conditions a retry cannot fix — e.g. an event
		// carrying no resolvable role, which resolves itself on the next event

		return json({ success: true }, 200);
	} catch (error) {
		console.error("[api/webhooks/clerk]", error);
		return json({ success: false, error: "Internal server error" }, 500);
	}
};

export { POST };
```

Every handler, in this order: **authenticate/verify, validate, delegate,
respond.**

- Always a try/catch.
- Always `{ success, data?, error? }`. Never raw data.
- Log with the route path as prefix: `[api/webhooks/clerk]`.
- Never return a raw error message to the client. Log the detail, return a
  generic string.

Do not add an `api/actions/*` namespace unless a real need shows up — a
third-party caller, a stream/file response, or something outside React that
needs to call it directly.

---

## Server Actions

The default for UI-triggered mutations. In `src/app/actions/`, never defined
inline in a component.

```typescript
"use server";

const submitLead = async (data: LeadFormData) => {
	try {
		const parsed = LeadFormSchema.safeParse(data);
		if (!parsed.success) return { success: false, error: "Please enter a valid name and email." };

		const payload = await getPayload({ config });
		const result = await captureLead(payload, { ...parsed.data, source: "guide-page" });

		return result;
	} catch (error) {
		console.error("[actions/lead.submitLead]", error);
		return { success: false, error: "Something went wrong — please try again." };
	}
};

export { submitLead };
```

- Never throw. Always return the error.
- Same shape and discipline as route handlers.
- This project's one Server Action doesn't need `revalidatePath` — `/guide`
  renders no cached list of leads. If a future mutation does invalidate
  rendered data, revalidate it there.

---

## Validation

Zod at every boundary where data enters the system: the lead-capture Server
Action's input, the Clerk webhook payload.

- Schemas live next to what they validate, exported as `{Thing}Schema`.
- `safeParse`, never `parse` — a validation failure is a friendly inline
  error, not a stack trace.
- `@hookform/resolvers` wires the same Zod schema into `react-hook-form` on
  the client, so client and server validate against one shared schema. This
  package isn't installed yet — install it when the lead-capture form is
  actually built, not before.

---

## Payload Access

- **Every access rule lives in `payload/access/access-control.ts`.** Never
  declare one inline in a collection.
- Every Local API call that can reach `programs`, `pages`, or `posts` passes
  `overrideAccess: false` and the authenticated `req`. The named exemptions
  are the Clerk strategy, the Clerk webhook, and `services/lead.service.ts`
  — nothing else.
- `leads.create` is sealed at the collection level. The lead-capture
  service's `overrideAccess: true` call is the one named exemption.

---

## Errors

- Never an empty catch. Log or handle.
- Console output always carries a bracketed context prefix:
  `[services/lead]`, `[api/webhooks/clerk]`, `[actions/lead]`.
- User-facing messages are plain English and say what to do next. Never
  expose an internal error, a stack trace, an ID, or a database detail.
- **Never log a lead's email or full name.** Log the record id instead. This
  applies even though the whole point of this system is collecting that
  data — logs are not the place for it.

---

## Money

Program prices (`priceLabel`) are display text only, never parsed or
calculated, and no external booking/scheduler URL is ever hardcoded in a
component — it always comes from the header global's default booking URL or
a program's own external booking URL. This codebase has no payment path in
its current scope.

---

## Dates

- **Datetimes are stored UTC** and rendered in `Africa/Nairobi`. This
  project's only date-handling need is display formatting — no date-math
  library is warranted; `Intl.DateTimeFormat` is enough.
- `submittedAt` and `notificationSentAt` on `leads` are the only datetime
  fields this build's own schema introduces beyond Payload's standard
  `createdAt`/`updatedAt`.

---

## PostHog Events

This is the complete list. **Adding an event means adding it here first.**

| Event | Fires when | Properties |
|---|---|---|
| `lead_magnet_viewed` | `/guide` page rendered | `source` |
| `lead_captured` | lead-capture Server Action succeeds | `source` |
| `booking_cta_clicked` | any "Book a Session"/"Book a Call" outbound link clicked | `location`, `programName` (if applicable) |
| `nav_link_clicked` | the header's "Programs" or "Blogs" scroll-anchor is clicked | `link` |
| `post_viewed` | a blog post renders | `postSlug`, `category` |

**No personally identifying data, ever.** No captured lead's name or email,
no free text a visitor typed, in any event, ever. An event carries only
non-identifying properties like the ones listed above. Standard pageview
autocapture is fine; anything custom goes through the list above and nowhere
else.

---

## Environment Variables

- Every variable used must be in `.env.example`, with a comment. `.env` is
  never committed.
- `NEXT_PUBLIC_` means the browser sees it. **Never prefix a secret.**
- Read from `process.env` once, at module scope, into a named constant.
  Never scatter `process.env.X` through a function body.
- No key, URL, price, or scheduler link is ever hardcoded.

---

## Working With Libraries

Skills are installed for the three libraries this project leans on hardest:
`/shadcn`, `/payload` and `/clerk` (with its family of sub-skills). **Consult
the relevant skill before writing code against that library**, not after
something fails. They carry current APIs and project-shaped patterns;
training data does not.

---

## Dependencies

Before installing anything, check in order: does Shadcn have it, does
Payload have it, does Next have it, is there a five-line native solution.

This project runs on a small, deliberately fixed set of packages. **If a
task seems to need a new dependency, that's a signal to double-check scope
first** — installing anything outside the fixed set means updating this
project's technical documentation in the same task, with a stated reason,
not adding it quietly.

Never install Radix directly — Shadcn 4 uses Base UI.

---

## Git and Releases

Michael's workflow, documented so the agent understands the context it is
writing into — **not instructions for the agent to execute.**

- Conventional Commits, enforced by `semantic-release` via `.releaserc.json`.
  `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`.
- The agent never commits, never branches, never pushes, never tags.

---

## Definition of Done

A task is done when all of these are true. If any is false, say so rather
than declaring completion.

1. It does what the task said, and nothing the task did not say.
2. `pnpm lint` and `pnpm build` both pass.
3. `pnpm generate:types` has been run if the schema changed.
4. No `any`, no unexplained `as`, no TODO, no commented-out code.
5. If the task touched the lead-capture flow: both emails still send (or
   fail loudly in the logs without failing the visitor's success state), and
   the lead is still recorded.
6. Every relevant PostHog event fires, and carries no PII.
7. No hardcoded color, external URL, or secret.
8. New components are registered in the project's component registry.
9. The project's progress log has an entry for this task.
10. Michael has been told, in plain terms, what to verify manually and how.

Point 10 matters most. There are no automated tests on this project, so the
handover is the test. Say what to click, what should happen, and what would
indicate it is broken.
