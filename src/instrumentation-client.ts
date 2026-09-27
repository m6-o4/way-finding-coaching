import posthog from "posthog-js";

// read the environment once, at module scope
const posthogProjectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN!;
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST!;

// initialises posthog once per page load, before react hydrates. running here
// rather than in the (web) provider means every route group has analytics,
// which identify/reset on the auth routes depends on
posthog.init(posthogProjectToken, {
	api_host: posthogHost,
	defaults: "2026-05-30",
});
