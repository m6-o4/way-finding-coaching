import type { Block } from "payload";

const SocialProof: Block = {
	slug: "socialProof",
	interfaceName: "SocialProof",
	labels: { singular: "Social Proof Block", plural: "Social Proof Blocks" },
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
			name: "testimonials",
			type: "array",
			label: "Testimonials",
			required: true,
			minRows: 1,
			labels: { singular: "Testimonial", plural: "Testimonials" },
			fields: [
				{ name: "name", type: "text", label: "Name", required: true },
				{ name: "photo", type: "upload", label: "Photo", relationTo: "media" },
				{ name: "jobTitle", type: "text", label: "Job Title" },
				{ name: "testimony", type: "textarea", label: "Testimony", required: true },
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

export { SocialProof };
