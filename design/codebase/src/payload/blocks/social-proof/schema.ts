import type { Block } from "payload";

const SocialProof: Block = {
	slug: "socialProof",
	interfaceName: "SocialProof",
	labels: {
		singular: "Social Proof Block",
		plural: "Social Proof Blocks",
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

export { SocialProof };
