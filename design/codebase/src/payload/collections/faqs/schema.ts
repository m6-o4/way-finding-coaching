import { isAuthenticated, isPublic } from "@/payload/access/access-control";
import type { CollectionConfig } from "payload";

const FAQs: CollectionConfig = {
	slug: "faqs",
	access: {
		create: isAuthenticated,
		delete: isAuthenticated,
		read: isPublic,
		update: isAuthenticated,
	},
	admin: {
		defaultColumns: ["question", "answer", "createdAt", "updatedAt"],
		group: "Content",
		useAsTitle: "question",
	},
	labels: {
		singular: "FAQ",
		plural: "FAQs",
	},
	fields: [
		{
			type: "row",
			fields: [
				{
					name: "question",
					type: "text",
					label: "Question",
					required: true,
					admin: {
						width: "40%",
					},
				},
				{
					name: "answer",
					type: "textarea",
					label: "Answer",
					required: true,
					admin: {
						width: "60%",
					},
				},
			],
		},
	],
};

export { FAQs };
