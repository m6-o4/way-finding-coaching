# Project Overview

## Purpose

This file explains what the application is, what problem it solves, who it
is for, and what is explicitly in and out of scope. It is written to stand
on its own — read it first, before any other project documentation, to
understand *why* the project exists before dealing with *how* it is built.

On matters of what the product does, this file is the final word.

---

## About the Project

Way Finding Coaching is the public website and lead-generation front door
for Michelle's coaching practice. Michelle is a licensed psychologist and
psychological wellbeing practitioner who guides individuals and teams from
internal conflict and confusion to a clear, focused, purposeful life —
"Way Finding" is both the practice's name and its central metaphor: a
guided path through personal and professional transformation.

This is **a marketing and lead-capture site, not an application**. It
informs visitors about Michelle and her coaching programs, and converts
interested visitors into a lead — either by having them book a discovery
call directly with Michelle (off-platform, via an external scheduling link)
or by having them download a free guide in exchange for their name and
email. Every actual coaching engagement — the calls, the sessions, the
payment, the relationship — happens off-platform. The website's job ends at
the handoff.

The site itself is a single long-scrolling homepage that does almost all
of the work, a plain blog, and one external booking link — all under a new
visual identity. The one new capability this rebuild adds is the
free-guide lead magnet.

---

## The Problem It Solves

Someone feeling stuck, in conflict, or unclear on direction — personally or
as a team leader — doesn't know where to start, and cold-emailing a coach is
a high-commitment first step. The site removes that friction two ways: it
lays out exactly what working with Michelle looks like (the programs, the
outcomes, real testimonials, who Michelle is), and it offers a low-commitment
first step — a free guide — for visitors who aren't ready to book a call
yet. Michelle then follows up personally with everyone who downloads it.

---

## User Roles

Two roles, both internal. There are no public accounts of any kind — every
visitor to the marketing site is anonymous.

| Role | Who | Where they work |
|---|---|---|
| `admin` | Michelle, or whoever owns the platform. | The CMS admin panel. |
| `editor` | Any staff Michelle brings on to help with content (e.g. a VA managing the blog). | The CMS admin panel. |

Both roles sign in to the same admin panel and can create, edit and publish
content. `admin` additionally manages staff accounts and captured leads.
Accounts are never self-registered: Michelle creates every admin/editor
account directly, there is no sign-up flow anywhere on this site.

---

## Site Structure

One thing to get right before anything else: **this is a single-page
marketing site with a blog attached, not a multi-page brochure site.** The
homepage carries almost the entire pitch as one long sequence of sections.
There are no separate routes for Programs, For Leaders, or Meet Michelle;
all three live only as homepage sections, reached by scrolling.

The header carries a short nav: the logo, two scroll-anchor links, and the
booking button. "Programs" and "Blogs" are the only two nav links —
they were chosen because both land on a real homepage section and both
matter enough to jump to directly. "For Leaders" and "Meet Michelle" are
homepage sections too, but neither gets a nav entry.

### Navigation

| Nav item | Behavior |
|---|---|
| Logo | Links to the top of the homepage |
| Programs | Scroll-anchors to the homepage's Programs section |
| Blogs | Scroll-anchors to the homepage's Latest Insights section |
| Book a Session | An external link to Michelle's booking calendar. Opens in a new tab. Never an in-app scheduler. |

Every page carries this same header, with one exception: the `/guide`
lead-magnet page uses a stripped header — logo only, no nav links, no
booking button — to keep a visitor focused on the form rather than
inviting them back out.

The hero carries a second call to action beyond the nav's booking button —
see the Hero section below.

---

## Pages & User Flows

### `/` — Home

- **Purpose**: Carries the entire pitch. A visitor should be able to
  understand what Way Finding Coaching offers, see proof it works, and
  reach a next step without ever leaving this page.
- **Sections, in order**:
  1. **Hero** — "Stop Feeling Stuck. Find Your Path." headline, a short
     supporting line, and two buttons: "Book a Session" (external, the
     existing booking link, primary) and a second button leading to the
     `/guide` lead magnet, offering the free guide as a lower-commitment
     first step for visitors not ready to book yet.
  2. **Programs** — "Your Path to Clarity." Each of Michelle's three
     coaching programs as a card: icon, name, tagline, a short list of
     outcome bullets, and a price, presented as a browsable set a visitor
     can page through rather than one long static list. This is the
     header's "Programs" nav link's scroll target.
  3. **Testimonial** — a single short quote, attributed by name and role,
     styled as standalone floating text rather than a boxed card.
  4. **Meet Michelle** — her photo and bio: credentials, experience,
     approach, a personal detail.
  5. **FAQ** — a handful of common objections, each collapsed by default
     and expandable on click (an accordion), not all shown open at once.
  6. **Latest Insights** — a small preview of the latest few blog entries,
     each linking to its full post, plus a link through to the full blog
     index. This is the header's "Blogs" nav link's scroll target.
  7. **Closing CTA** — "Ready to Start Your Journey?" and the same two
     calls to action as the hero: "Book a Session" (external) and the
     `/guide` lead-magnet button, so a visitor who scrolled the whole page
     without converting gets one more chance at either path.
  8. **Footer** — site name, a short nav (Home, blog index, Privacy
     Policy, Terms of Service), and a link to Michelle's LinkedIn.
- **User flow**: Visitor lands → scrolls through the sections above at
  their own pace, or uses the header's "Programs"/"Blogs" links to jump
  ahead → reaches the external booking link or the guide button at any of
  several points, or continues to the blog.

### The blog index

- **Purpose**: Thought-leadership content (personal growth, leadership,
  reflection) that builds trust and drives organic traffic. Reachable from
  the footer and from the homepage's Latest Insights section.
- **User flow**: Visitor sees every published post as a simple list —
  title, date, and a short excerpt for each. There is no pagination,
  category filter, or search; if the number of posts ever grows large
  enough that a flat list stops working well, that's a real future
  decision, not something to build ahead of need.
- **Post detail**: Visitor clicks a post → sees its category label, title,
  publish date, and full content. Clicking through leads back to the
  homepage's booking link or another post, not a dead end.

### Legal pages

- **Purpose**: Privacy Policy and Terms of Service — standalone,
  editor-authored pages, reachable only from the footer.
- **User flow**: Visitor clicks a footer link → reads the page → has no
  further action to take beyond leaving or going back.

### `/guide` — Lead magnet *(new)*

- **Purpose**: The one genuinely new capability this rebuild adds beyond
  what the site does today. Trades a downloadable guide for a visitor's
  first name and email, for visitors who click a "Get the Free Guide"-style
  CTA rather than the booking link.
- **User flow**: Visitor lands (from a CTA elsewhere on the site) → sees
  what's inside the guide → submits first name + email → sees an inline
  success state in place of the form → receives an email with the download
  link. Michelle is separately notified by email so she can follow up
  personally.

### Admin access

- **Purpose**: One place, not two. Signing in and the panel itself both live
  under the same admin area — there is no separate top-level sign-in page
  elsewhere on the site. `admin` and `editor` are the only roles that can
  reach it, and it's where they manage every piece of editable content: the
  homepage's sections, programs, testimonials, FAQ entries, blog posts, and
  (for `admin`) staff accounts and captured leads.
- **User flow**: A staff member visits the admin area → if not already
  signed in, signs in right there → lands in the panel. There is no sign-up
  route — accounts are never self-registered. A visitor without a valid
  `admin`/`editor` session who reaches the admin area some other way is
  redirected to the homepage, never shown an error and never stranded.

---

## In Scope

- The single-page homepage exactly as described above: hero, programs,
  testimonial, Meet Michelle, FAQ, latest insights, closing CTA — all
  editor-managed content, none of it hardcoded copy.
- The programs themselves — name, tagline, outcomes, price — editor-managed
  as structured content, even though they render as a homepage section
  rather than their own page.
- A header with two scroll-anchor nav links (Programs, Blogs) and a
  "Book a Session" button — plus a real blog index and post-detail page.
- A single lead-magnet flow: capture first name + email, send the visitor
  an acknowledgement email with the download link, notify Michelle by
  email with a follow-up prompt, and keep a durable record of the lead.
- Legal pages (Privacy Policy, Terms of Service), editor-authored.
- Staff-only authentication gating the admin panel, with exactly two
  internal roles (`admin`, `editor`) and no self-registration.
- Light/dark theme toggle.
- Product analytics, with no personally identifying data ever captured in
  an event.

## Out of Scope

- **User accounts of any kind for site visitors.** No sign-up, no login,
  no profile, no saved state. Every visitor is anonymous.
- **In-app scheduling or calendar booking.** The booking CTA is an outbound
  link to Michelle's external scheduler. This platform never manages
  availability or calendar state.
- **A separate route for Programs, For Leaders, or Meet Michelle.** All
  three live only as homepage sections. Programs gets a nav scroll-anchor
  (see Site Structure); For Leaders and Meet Michelle don't get a nav entry
  at all. None of the three gets its own page or URL.
- **A standalone Programs page, or a paginated blog-listing page.** Neither
  becomes a real route in this build. The blog stays a flat, unpaginated
  `/posts` index.
- **Payment processing.** Program prices are informational display text
  only. No checkout, no payment collection, no invoicing happens on this
  site.
- **In-app messaging.** All follow-up after a lead is captured happens by
  email or off-platform, initiated by Michelle personally.
- **On-site search, blog pagination, or category filtering.** The blog is
  a flat list. Revisit only if post volume genuinely demands it.
- **A visual/no-code form builder.** The one form on this site (the lead
  magnet) is hand-built, not assembled through a drag-and-drop form tool.
- **Multi-step or wizard-style UI.** This is a single-conversion-point
  site; there is no multi-page intake flow.
- **Any dashboard for a non-staff user.** There is no such user.
- **Multi-language support.** English only.

---

## Success Criteria

The rebuild is done when all of the following are true.

- A stranger can land on the homepage, scroll through the full pitch, and
  reach either the external booking link or the free guide from several
  points on the page.
- The header's "Programs" and "Blogs" links scroll-anchor to the right
  homepage section from anywhere on the site, and "Book a Session" opens
  Michelle's external calendar. The hero's two buttons both work too —
  "Book a Session" and a second leading to `/guide`.
- Submitting the lead-magnet form reliably records the lead once, sends
  the visitor their acknowledgement and download link, and notifies
  Michelle — even if one of the two emails fails, the lead is still
  recorded and the visitor still sees a success state.
- The admin panel is reachable only by `admin` and `editor`; anyone else
  is redirected to the homepage, never shown an error, never signed out
  of a session they didn't know they had.
- Every editable piece of the site — homepage sections, programs,
  testimonials, FAQ, blog posts, legal pages — is editable by Michelle or
  an editor without a deploy.
- The interface consistently uses the project's finalized design tokens —
  no hardcoded colors anywhere.
- Analytics events never carry a captured lead's name, email, or any other
  identifying detail.

## Metrics

**North Star — Lead Conversion Rate.** The percentage of unique visitors
who either submit the lead-magnet form or click through to the external
booking link. This is the one number that tells Michelle whether the site
is doing its job.

**Operational**
- Guide downloads per week.
- Booking-link click-through rate, by placement (hero, closing CTA, guide
  page).
- Hero button click-through rate, broken out by "Book a Session" versus
  the guide button, to see which first step visitors prefer.
- Header nav click-through rate, by link ("Programs" vs. "Blogs"), to see
  whether visitors use the nav to jump ahead rather than scrolling.

---

## Target Users

**The Stuck Professional.** An individual or team leader who senses
something is wrong — burnout, conflict, a lack of direction — but hasn't
yet taken action on it. Landing on the site for the first time via search,
referral, or social content, not yet ready to commit to a paid engagement.

**The Warm Lead.** Someone already somewhat familiar with Michelle's work
(a referral, a past attendee of a talk) who arrives ready to book a call
directly.
