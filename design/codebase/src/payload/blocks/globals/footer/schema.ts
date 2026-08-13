import { isPublic } from "@/payload/access/access-control";
import { revalidateFooter } from "@/payload/blocks/globals/footer/hooks/revalidate-footer";
import { link } from "@/payload/fields/link";
import type { GlobalConfig } from "payload";

const Footer: GlobalConfig = {
	slug: "footer",
	access: {
		read: isPublic,
	},
	fields: [
		{
			name: "title",
			type: "text",
			label: "Title",
			required: true,
		},
		{
			name: "navItems",
			type: "array",
			label: "Navigation Items",
			labels: {
				singular: "Navigation Item",
				plural: "Navigation Items",
			},
			fields: [
				link({
					appearances: false,
				}),
			],
			maxRows: 5,
			admin: {
				components: {
					RowLabel: "@/payload/blocks/globals/footer/row-label#RowLabel",
				},
				initCollapsed: true,
			},
		},
		{
			name: "contactItems",
			type: "array",
			label: "Contact Items",
			labels: {
				singular: "Contact Item",
				plural: "Contact Items",
			},
			maxRows: 3,
			fields: [
				{
					type: "row",
					fields: [
						{
							name: "link",
							type: "text",
							label: "URL",
							required: true,
						},
						{
							name: "title",
							type: "text",
							label: "Label",
						},
					],
				},
			],
		},
		{
			name: "copyright",
			type: "text",
			label: "Copyright Notice",
			required: true,
		},
	],
	hooks: {
		afterChange: [revalidateFooter],
	},
};

export { Footer };
