import type { Block } from "payload";

const ProgramBenefits: Block = {
	slug: "programBenefits",
	interfaceName: "ProgramBenefits",
	labels: { singular: "Program Benefits Block", plural: "Program Benefits Blocks" },
	fields: [
		{ name: "headline", type: "text", label: "Headline", required: true },
		{ name: "headlineDescription", type: "textarea", label: "Headline Description" },
		{
			name: "programs",
			type: "array",
			label: "Programs",
			maxRows: 9,
			labels: { singular: "Program", plural: "Programs" },
			fields: [
				{ name: "programTitle", type: "text", label: "Program Title", required: true },
				{
					name: "benefits",
					type: "array",
					label: "Benefits",
					maxRows: 3,
					labels: { singular: "Benefit", plural: "Benefits" },
					fields: [{ name: "title", type: "text", label: "Benefit", required: true }],
				},
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

export { ProgramBenefits };
