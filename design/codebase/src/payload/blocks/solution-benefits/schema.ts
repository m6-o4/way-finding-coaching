import type { Block } from "payload";

const SolutionBenefits: Block = {
	slug: "solutionBenefits",
	interfaceName: "SolutionBenefits",
	labels: {
		singular: "Solution Benefits Block",
		plural: "Solution Benefits Blocks",
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

export { SolutionBenefits };
