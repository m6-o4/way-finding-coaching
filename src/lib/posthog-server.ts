import { PostHog } from "posthog-node";

// read the environment once, at module scope. the project token is public —
// the same value the browser client uses
const posthogProjectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN!;
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST!;

let posthogClient: PostHog | null = null;

// lazily creates one server client per process. flushAt/flushInterval send each
// event immediately, so nothing is still buffered when a serverless process ends
const getPostHogClient = (): PostHog => {
	if (!posthogClient) {
		posthogClient = new PostHog(posthogProjectToken, {
			host: posthogHost,
			flushAt: 1,
			flushInterval: 0,
		});
	}

	return posthogClient;
};

export { getPostHogClient };
