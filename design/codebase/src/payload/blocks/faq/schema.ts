import type { Block } from "payload";

const FAQ: Block = {
	slug: "faq",
	interfaceName: "FAQS",
	labels: {
		singular: "FAQ Block",
		plural: "FAQ Blocks",
	},
	fields: [
		{
			name: "title",
			type: "text",
			label: "Title",
			required: true,
		},
	],
};

export { FAQ };
