import type { Block } from "payload";

const Faq: Block = {
	slug: "faq",
	interfaceName: "Faq",
	labels: { singular: "FAQ Block", plural: "FAQ Blocks" },
	fields: [
		{ name: "headline", type: "text", label: "Headline", required: true },
		{ name: "headlineDescription", type: "textarea", label: "Headline Description" },
		{
			name: "faqs",
			type: "array",
			label: "FAQs",
			labels: { singular: "FAQ", plural: "FAQs" },
			fields: [
				{ name: "question", type: "text", label: "Question", required: true },
				{ name: "answer", type: "textarea", label: "Answer", required: true },
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

export { Faq };
