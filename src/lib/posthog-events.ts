"use client";

import posthog from "posthog-js";

// the browser-side events from the complete list in context/code-standards.md.
// `lead_captured` is captured on the server (see app/actions/submit-guide-lead),
// so it is deliberately absent here.
type PostHogEvent =
	| { event: "lead_magnet_viewed"; properties: { source: string } }
	| {
			event: "booking_cta_clicked";
			properties: { location: string; programName?: string };
	  }
	| { event: "nav_link_clicked"; properties: { link: string } }
	| { event: "post_viewed"; properties: { postSlug: string; category?: string } };

// the only way this project sends a custom event. the closed union above means
// an event that isn't on the list fails to compile rather than reaching posthog
const captureEvent = (payload: PostHogEvent): void => {
	posthog.capture(payload.event, payload.properties);
};

export { captureEvent, type PostHogEvent };
