import { isAdminOrEditor } from "@/payload/access/access-control";
import type { CollectionConfig } from "payload";

const Leads: CollectionConfig = {
	slug: "leads",
	labels: { singular: "Lead", plural: "Leads" },
	admin: {
		defaultColumns: ["firstName", "email", "guide", "createdAt", "updatedAt"],
		group: "Marketing",
		useAsTitle: "email",
	},
	access: {
		create: isAdminOrEditor,
		delete: isAdminOrEditor,
		read: isAdminOrEditor,
		update: isAdminOrEditor,
	},
	fields: [
		{ name: "firstName", type: "text", label: "First Name", required: true },
		{ name: "email", type: "email", label: "Email Address", required: true },
		{
			name: "guide",
			type: "relationship",
			relationTo: "media",
			label: "Guide Downloaded",
			admin: {
				description: "Which lead magnet PDF this submission was for.",
			},
		},
	],
};

export { Leads };
