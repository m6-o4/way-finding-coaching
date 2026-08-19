import type { Block } from "payload";

import { link } from "@/payload/fields/link";

const Hero: Block = {
	slug: "hero",
	interfaceName: "Hero",
	labels: { singular: "Hero Block", plural: "Hero Blocks" },
	fields: [
		{
			name: "heroType",
			type: "select",
			label: "Hero Type",
			defaultValue: "primary",
			options: [
				{ label: "Primary", value: "primary" },
				{ label: "Secondary", value: "secondary" },
			],
			required: true,
		},
		{
			name: "heroImage",
			type: "upload",
			label: "Hero Image",
			relationTo: "media",
		},
		// primary-only
		{
			name: "heroOverline",
			type: "text",
			label: "Hero Overline",
			admin: { condition: (_, siblingData) => siblingData.heroType === "primary" },
		},
		{
			name: "heroHeadline",
			type: "text",
			label: "Hero Headline",
			required: true,
		},
		{
			name: "heroDescription",
			type: "text",
			label: "Hero Description",
			required: true,
		},
		// primary-only
		{
			name: "ctaDiscovery",
			type: "group",
			label: "Book a Discovery Call",
			fields: [link({ appearances: false })],
			admin: { condition: (_, siblingData) => siblingData.heroType === "primary" },
		},
		// primary-only
		{
			name: "ctaFreeGuide",
			type: "group",
			label: "Free Journaling Guide",
			fields: [link({ appearances: false })],
			admin: { condition: (_, siblingData) => siblingData.heroType === "primary" },
		},
		{
			name: "backgroundVariant",
			type: "select",
			label: "Background Style",
			defaultValue: "background",
			options: [
				{ label: "Muted", value: "muted" },
				{ label: "Background", value: "background" },
			],
			required: true,
		},
	],
};

export { Hero };
