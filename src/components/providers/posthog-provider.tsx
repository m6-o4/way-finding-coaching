"use client";

import { ReactNode, useEffect } from "react";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";

const posthogProjectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN!;
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST!;

const PostHogProvider = ({ children }: { children: ReactNode }) => {
	useEffect(() => {
		posthog.init(posthogProjectToken as string, {
			api_host: posthogHost,
			defaults: "2026-05-30",
		});
	}, []);

	return <PHProvider client={posthog}>{children}</PHProvider>;
};

export { PostHogProvider };
