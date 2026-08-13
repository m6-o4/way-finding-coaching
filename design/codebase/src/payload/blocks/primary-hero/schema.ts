import { linkGroup } from "@/payload/fields/link-group";
import type { Block } from "payload";

const PrimaryHero: Block = {
	slug: "primaryHero",
	interfaceName: "PrimaryHero",
	labels: {
		singular: "Primary Hero Block",
		plural: "Primary Hero Blocks",
	},
	fields: [
		{
			name: "headline",
			type: "text",
			label: "Headline",
			required: true,
		},
		{
			name: "subHeadline",
			type: "textarea",
			label: "Subheadline",
			required: true,
		},
		linkGroup({
			overrides: {
				maxRows: 1,
			},
		}),
		{
			name: "media",
			type: "upload",
			label: "Media",
			relationTo: "media",
			required: true,
		},
	],
};

export { PrimaryHero };
