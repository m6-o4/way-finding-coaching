import type { GlobalConfig } from "payload";

import { isPublic } from "@/payload/access/access-control";
import { revalidateHeader } from "@/payload/blocks/globals/header/hooks/revalidate-header";
import { link } from "@/payload/fields/link";

const Header: GlobalConfig = {
	slug: "header",
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
			label: "Organization Logo",
			relationTo: "media",
			admin: { position: "sidebar" },
		},
		{
			name: "navigationItems",
			type: "array",
			label: "Navigation Items",
			labels: { singular: "Navigation Item", plural: "Navigation Items" },
			fields: [link({ appearances: false })],
			maxRows: 2,
			admin: {
				components: { RowLabel: "@/payload/blocks/globals/header/row-label#RowLabel" },
				initCollapsed: true,
			},
		},
		{
			name: "discovery",
			type: "group",
			label: "Discovery",
			fields: [link({ appearances: false })],
		},
	],
	hooks: { afterChange: [revalidateHeader] },
};

export { Header };
