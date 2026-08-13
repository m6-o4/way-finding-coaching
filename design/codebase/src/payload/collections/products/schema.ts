import { isAuthenticated } from "@/payload/access/access-control";
import type { CollectionConfig } from "payload";

const Products: CollectionConfig = {
	slug: "products",
	access: {
		admin: isAuthenticated,
		create: isAuthenticated,
		delete: isAuthenticated,
		read: isAuthenticated,
		update: isAuthenticated,
	},
	admin: {
		defaultColumns: ["name", "image", "description", "price", "createdAt", "updatedAt"],
		group: "Content",
		useAsTitle: "name",
	},
	labels: {
		singular: "Product",
		plural: "Products",
	},
	fields: [
		{
			type: "row",
			fields: [
				{
					name: "name",
					type: "text",
					label: "Product Name",
					required: true,
					admin: {
						width: "40%",
					},
				},
				{
					name: "description",
					type: "text",
					label: "Description",
					admin: {
						width: "60%",
					},
				},
			],
		},
		{
			name: "price",
			type: "number",
			label: "Price",
			required: true,
			min: 0,
			max: 999999,
		},
		{
			name: "features",
			type: "array",
			label: "Features",
			fields: [
				{
					name: "feature",
					type: "text",
					label: "Feature",
				},
			],
			minRows: 0,
			maxRows: 5,
		},
		{
			name: "image",
			type: "upload",
			relationTo: "media",
			label: "Product Image",
			required: true,
			admin: {
				position: "sidebar",
			},
		},
	],
};

export { Products };
