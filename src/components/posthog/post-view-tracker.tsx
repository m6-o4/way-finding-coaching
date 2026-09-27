"use client";

import { useEffect } from "react";

import { captureEvent } from "@/lib/posthog-events";

type PostViewTrackerProps = {
	postSlug: string;
	category?: string;
};

// reports a blog post view once per mount. the post page itself stays a server
// component and just renders this
const PostViewTracker = ({ postSlug, category }: PostViewTrackerProps) => {
	useEffect(() => {
		captureEvent({ event: "post_viewed", properties: { postSlug, category } });
	}, [postSlug, category]);

	return null;
};

export { PostViewTracker };
