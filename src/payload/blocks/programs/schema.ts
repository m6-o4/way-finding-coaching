import type { Block } from "payload";

import { link } from "@/payload/fields/link";

const Programs: Block = {
	slug: "programs",
	interfaceName: "Programs",
	labels: { singular: "Programs Block", plural: "Programs Blocks" },
	fields: [
		{ name: "headline", type: "text", label: "Headline", required: true },
		{ name: "headlineDescription", type: "text", label: "Headline Description" },
		{
			name: "bookingLink",
			type: "group",
			label: "Book a Discovery Call",
			fields: [link({ appearances: false })],
		},
		{
			name: "programs",
			type: "array",
			label: "Programs",
			maxRows: 9,
			labels: { singular: "Program", plural: "Programs" },
			fields: [
				{
					name: "programImage",
					type: "upload",
					relationTo: "media",
					label: "Program Image",
				},
				{ name: "programTitle", type: "text", label: "Program Title", required: true },
				{ name: "programDescription", type: "textarea", label: "Program Description" },
				{
					name: "programFeatures",
					type: "array",
					label: "Program Features",
					maxRows: 5,
					labels: { singular: "Feature", plural: "Features" },
					fields: [
						{ name: "title", type: "text", label: "Feature Title", required: true },
					],
				},
				{ name: "programPrice", type: "text", label: "Program Price" },
			],
		},
		{
			name: "backgroundVariant",
			type: "select",
			label: "Background Style",
			defaultValue: "background",
			options: [
				{ label: "Background", value: "background" },
				{ label: "Muted", value: "muted" },
			],
			required: true,
		},
	],
};

export { Programs };
