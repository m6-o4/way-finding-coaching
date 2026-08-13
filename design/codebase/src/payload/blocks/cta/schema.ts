import { linkGroup } from "@/payload/fields/link-group";
import type { Block } from "payload";

const CallToAction: Block = {
	slug: "cta",
	interfaceName: "CallToAction",
	labels: {
		singular: "Call to Action Block",
		plural: "Call to Action Blocks",
	},
	fields: [
		{
			name: "title",
			type: "text",
			label: "Title",
			required: true,
		},
		{
			name: "content",
			type: "textarea",
			label: "Content",
			required: true,
		},
		linkGroup({
			overrides: {
				maxRows: 1,
			},
		}),
	],
};

export { CallToAction };
