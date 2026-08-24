import type { Block } from "payload";

const LeadMagnet: Block = {
	slug: "leadMagnet",
	interfaceName: "LeadMagnet",
	labels: { singular: "Lead Magnet", plural: "Lead Magnets" },
	fields: [
		{
			name: "headline",
			type: "text",
			label: "Headline",
			required: true,
		},
		{
			name: "headlineDescription",
			type: "textarea",
			label: "Headline Description",
		},
		{
			name: "image",
			type: "upload",
			relationTo: "media",
			label: "Side Image",
			required: true,
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

export { LeadMagnet };
