import type { GlobalConfig } from "payload";

import { isPublic } from "@/payload/access/access-control";
import { revalidateFooter } from "@/payload/blocks/globals/footer/hooks/revalidate-footer";
import { link } from "@/payload/fields/link";

const Footer: GlobalConfig = {
	slug: "footer",
	access: { read: isPublic },
	fields: [
		{
			name: "organizationName",
			type: "text",
			label: "Organization Name",
		},
		{
			name: "organizationLogo",
			type: "upload",
			label: "Logo",
			relationTo: "media",
			admin: { position: "sidebar" },
		},
		{
			name: "organizationSlogan",
			type: "text",
			label: "Slogan",
		},
		{
			name: "navItems",
			type: "array",
			label: "Navigation Items",
			labels: { singular: "Navigation Item", plural: "Navigation Items" },
			fields: [link({ appearances: false })],
			maxRows: 5,
			admin: {
				components: { RowLabel: "@/payload/blocks/globals/footer/row-label#RowLabel" },
				initCollapsed: true,
			},
		},
		{
			name: "copyright",
			type: "text",
			label: "Copyright Notice",
			required: true,
		},
	],
	hooks: { afterChange: [revalidateFooter] },
};

export { Footer };
