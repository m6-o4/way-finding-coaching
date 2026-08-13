import type { Block } from "payload";

const Differentiation: Block = {
	slug: "differentiation",
	interfaceName: "Differentiation",
	labels: {
		singular: "Differentiation Block",
		plural: "Differentiation Blocks",
	},
	fields: [
		{
			name: "title",
			type: "text",
			label: "Title",
			required: true,
		},
		{
			name: "subtitle",
			type: "text",
			label: "Subtitle",
			required: true,
		},
		{
			name: "products",
			type: "array",
			label: "Products",
			required: true,
			maxRows: 3,
			fields: [
				{
					name: "name",
					type: "text",
					label: "Product Name",
					required: true,
				},
				{
					name: "features",
					type: "array",
					labels: {
						singular: "Feature",
						plural: "Features",
					},
					maxRows: 5,
					fields: [
						{
							name: "feature",
							type: "text",
							label: "Feature",
						},
					],
				},
			],
		},
	],
};

export { Differentiation };
