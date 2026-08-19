import type { CollectionConfig } from "payload";

import { isAdminOrEditor, isPublic } from "@/payload/access/access-control";
import { link } from "@/payload/fields/link";

const CallsToAction: CollectionConfig = {
	slug: "callstoaction",
	labels: { singular: "Call to Action", plural: "Calls to Action" },
	admin: {
		defaultColumns: ["headline", "headlineDescription", "createdAt", "updatedAt"],
		group: "Content",
		useAsTitle: "headline",
	},
	access: {
		create: isAdminOrEditor,
		delete: isAdminOrEditor,
		read: isPublic,
		update: isAdminOrEditor,
	},
	fields: [
		{ name: "headline", type: "text", label: "Headline", required: true },
		{
			name: "headlineDescription",
			type: "text",
			label: "Headline Description",
			required: true,
		},
		{
			name: "ctaDiscovery",
			type: "group",
			label: "Book a Discovery Call",
			fields: [link({ appearances: false })],
		},
		{
			name: "ctaFreeGuide",
			type: "group",
			label: "Free Journaling Guide",
			fields: [link({ appearances: false })],
		},
	],
};

export { CallsToAction };
