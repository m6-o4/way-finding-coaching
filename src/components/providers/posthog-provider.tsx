"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { ReactNode } from "react";

// supplies the react context for posthog hooks. the client itself is
// initialised once in src/instrumentation-client.ts, before hydration
const PostHogProvider = ({ children }: { children: ReactNode }) => (
	<PHProvider client={posthog}>{children}</PHProvider>
);

export { PostHogProvider };
