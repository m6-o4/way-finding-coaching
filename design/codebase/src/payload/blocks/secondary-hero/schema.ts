import type { Block } from "payload";

const SecondaryHero: Block = {
	slug: "secondaryHero",
	interfaceName: "SecondaryHero",
	labels: {
		singular: "Secondary Hero Block",
		plural: "Secondary Hero Blocks",
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
		{
			name: "media",
			type: "upload",
			label: "Media",
			relationTo: "media",
			required: true,
		},
	],
};

export { SecondaryHero };
