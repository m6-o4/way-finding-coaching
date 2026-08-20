import type { Block } from "payload";

const ProblemAgitation: Block = {
	slug: "problemAgitation",
	interfaceName: "ProblemAgitation",
	labels: {
		singular: "Problem Agitation Block",
		plural: "Problem Agitation Blocks",
	},
	fields: [
		{
			name: "problem",
			type: "text",
			label: "Problem",
			required: true,
		},
		{
			name: "challenge",
			type: "textarea",
			label: "Subheadline",
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

export { ProblemAgitation };
