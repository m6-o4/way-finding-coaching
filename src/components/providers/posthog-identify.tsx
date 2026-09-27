"use client";

import posthog from "posthog-js";
import { useEffect, useRef } from "react";

import { useUser } from "@clerk/nextjs";

// links the browser session to the admin/editor who just signed in. mounted on
// the sign-in route only, so anonymous public visitors are never identified
const PostHogIdentify = () => {
	const { isLoaded, isSignedIn, user } = useUser();
	const identifiedId = useRef<string | null>(null);

	useEffect(() => {
		if (!isLoaded || !isSignedIn || !user) return;
		if (identifiedId.current === user.id) return;

		posthog.identify(user.id);
		identifiedId.current = user.id;
	}, [isLoaded, isSignedIn, user]);

	return null;
};

export { PostHogIdentify };
