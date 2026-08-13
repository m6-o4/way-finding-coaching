import { getServerSideURL } from "@/payload/utilities/get-url";
import type { Metadata } from "next";

// default open graph metadata used across pages
const defaultOpenGraph: Metadata["openGraph"] = {
	type: "website",
	description:
		"We guide growth-minded individuals and teams from internal conflict to a clear, focused, and vibrant life. It's time to build the future you deserve.",
	images: [
		{
			url: `${getServerSideURL()}/way-finding-og.webp`,
		},
	],
	siteName: "Way Finding Coaching",
	title: "Way Finding Coaching",
};

// merges provided open graph data with defaults to ensure required fields exist
const mergeOpenGraph = (og?: Metadata["openGraph"]): Metadata["openGraph"] => {
	return {
		...defaultOpenGraph,
		...og,
		// keep custom images if provided, otherwise use default ones
		images: og?.images ? og.images : defaultOpenGraph.images,
	};
};

export { mergeOpenGraph };
